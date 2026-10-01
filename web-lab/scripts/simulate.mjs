// 試算工具（老師檔）：npm run simulate -- <策略檔或資料夾>
// 把「五天的經營決定」寫成一份策略檔，一次算出五天的結果，不用在畫面上一格一格點。
// 它直接呼叫遊戲引擎，所以結果跟畫面上玩出來的一模一樣。
// 這個工具只讀檔案、不寫任何檔案。AI 不可以修改這個檔案。
//
// 用法：
//   npm run simulate -- plans/example-even.json        跑一份策略
//   npm run simulate -- plans/                          跑資料夾裡所有策略，最後排名
//   npm run simulate -- plans/example-even.json --json  輸出 JSON（給 AI 讀）

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const webLab = path.resolve(here, '..');
const gameDir = path.join(webLab, 'src/game');
const load = (rel) => import(path.join(gameDir, rel));

const { newGame, simulateDay } = await load('engine.js');
const { validatePlan, formatMoney } = await load('validatePlan.js');
const { validateCustomers } = await load('validateCustomers.js');
const { MENU, dishIdByName } = await load('menu.js');
const { DAYS } = await load('config.js');

const PACK_FILES = {
  default: 'customers/default.json',
  official: 'customers/official.json',
  mine: 'customers/my-customers.json',
};

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const targets = args.filter((a) => a !== '--json');

function usage(message) {
  if (message) console.log(`\n⚠ ${message}`);
  console.log('\n用法：npm run simulate -- plans/你的策略.json');
  console.log('     npm run simulate -- plans/            （跑整個資料夾並排名）');
  console.log('策略檔格式請看 plans/example-even.json\n');
}

function resolveTarget(t) {
  const candidates = [path.resolve(process.cwd(), t), path.resolve(webLab, t)];
  return candidates.find((p) => fs.existsSync(p));
}

function collectFiles() {
  if (targets.length === 0) return [];
  const files = [];
  for (const t of targets) {
    const p = resolveTarget(t);
    if (!p) {
      usage(`找不到「${t}」`);
      continue;
    }
    if (fs.statSync(p).isDirectory()) {
      for (const f of fs.readdirSync(p).sort()) if (f.endsWith('.json')) files.push(path.join(p, f));
    } else {
      files.push(p);
    }
  }
  return files;
}

// 把策略檔裡的一天轉成遊戲的 plan 格式；菜可以寫 id（signature）或中文菜名（招牌鍋貼）
function toPlan(day) {
  const items = (day.items ?? []).map((item) => {
    const id = item.id ?? dishIdByName(item.name ?? item.dish);
    return { id: id ?? String(item.name ?? item.dish ?? item.id), qty: item.qty, price: item.price };
  });
  return { items, promoCost: day.promoCost ?? 0 };
}

function run(file) {
  let strategy;
  try {
    strategy = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return { file, ok: false, errors: [`看不懂這份策略檔（不是合法的 JSON）：${err.message}`] };
  }
  const packId = strategy.pack ?? 'official';
  if (!PACK_FILES[packId]) return { file, ok: false, errors: [`pack 只能是 default、official 或 mine，你寫的是「${packId}」`] };
  const pack = JSON.parse(fs.readFileSync(path.join(gameDir, PACK_FILES[packId]), 'utf8'));
  const packCheck = validateCustomers(pack);
  if (!packCheck.ok) return { file, ok: false, errors: ['客人包不合格：', ...packCheck.errors] };
  if (!Array.isArray(strategy.days) || strategy.days.length !== DAYS) {
    return { file, ok: false, errors: [`days 要剛好寫 ${DAYS} 天，你寫了 ${strategy.days?.length ?? 0} 天`] };
  }

  let state = newGame();
  const reports = [];
  for (let i = 0; i < DAYS; i += 1) {
    const plan = toPlan(strategy.days[i]);
    const errors = validatePlan(plan, state.cash);
    if (errors.length) {
      return { file, ok: false, failedDay: i + 1, errors: errors.map((e) => `第 ${i + 1} 天：${e}`), reports };
    }
    const result = simulateDay(state, plan, pack);
    state = result.state;
    reports.push(result.report);
  }
  return {
    file,
    ok: true,
    pack: packId,
    name: strategy.name ?? path.basename(file, '.json'),
    finalCash: state.cash,
    finalStars: state.stars,
    totalWaste: reports.reduce((s, r) => s + r.wasteTotal, 0),
    tasksDone: reports.filter((r) => r.task.status === 'done').length,
    days: reports.map((r) => ({
      day: r.day,
      revenue: r.revenue,
      stockCost: r.stockCost,
      promoCost: r.promoCost,
      waste: r.wasteTotal,
      wasteFee: r.wasteFee,
      profit: r.profit,
      task: r.task.status,
      bonus: r.task.bonusPaid,
      stars: `${r.starsBefore}→${r.starsAfter}`,
      endCash: r.endCash,
      customers: r.visits.length,
      satisfied: r.satisfied,
      neutral: r.neutral,
      unsatisfied: r.unsatisfied,
      soldOut: r.visits.filter((v) => v.outcome === 'sold_out').length,
      tooExpensive: r.visits.filter((v) => v.outcome === 'too_expensive').length,
      notOnMenu: r.visits.filter((v) => v.outcome === 'not_on_menu').length,
      hatedOnMenu: r.visits.filter((v) => v.outcome === 'hated_on_menu').length,
      sold: r.sold,
    })),
  };
}

function printResult(r) {
  const rel = path.relative(webLab, r.file);
  console.log(`\n■ ${rel}`);
  if (!r.ok) {
    r.errors.forEach((e) => console.log(`  ✗ ${e}`));
    return;
  }
  console.log(`  客人包：${r.pack}`);
  console.log('  天 | 客人 | 收入 | 備貨 | 宣傳 | 報廢(清潔費) | 淨利 | 任務 | 星等 | 資金');
  for (const d of r.days) {
    const task = d.task === 'done' ? `達成+${d.bonus}` : d.task === 'failed' ? '未達成' : '施工中';
    console.log(
      `  ${d.day}  | ${d.customers} | ${formatMoney(d.revenue)} | ${formatMoney(d.stockCost)} | ${d.promoCost} | ${d.waste}(${d.wasteFee}) | ${formatMoney(d.profit)} | ${task} | ${d.stars} | ${formatMoney(d.endCash)}`,
    );
    const lost = [];
    if (d.soldOut) lost.push(`賣完買不到 ${d.soldOut}`);
    if (d.tooExpensive) lost.push(`嫌太貴 ${d.tooExpensive}`);
    if (d.notOnMenu) lost.push(`想吃的沒上架 ${d.notOnMenu}`);
    if (d.hatedOnMenu) lost.push(`因為討厭的菜不進門 ${d.hatedOnMenu}`);
    if (lost.length) console.log(`       沒買到的客人：${lost.join('、')}`);
  }
  console.log(`  ➜ 最終資金 ${formatMoney(r.finalCash)} 元・星等 ${r.finalStars}・總報廢 ${r.totalWaste} 份・任務 ${r.tasksDone}／${DAYS}`);
}

const files = collectFiles();
if (files.length === 0) {
  usage(targets.length ? '沒有可以跑的策略檔' : '請指定策略檔');
} else {
  const results = files.map(run);
  if (asJson) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    results.forEach(printResult);
    const ranked = results.filter((r) => r.ok).sort((a, b) => b.finalCash - a.finalCash);
    if (ranked.length > 1) {
      console.log('\n════════ 排名 ════════');
      ranked.forEach((r, i) =>
        console.log(`  ${i + 1}. ${formatMoney(r.finalCash)} 元  ${path.relative(webLab, r.file)}（星等 ${r.finalStars}、報廢 ${r.totalWaste}）`),
      );
    }
  }
}
