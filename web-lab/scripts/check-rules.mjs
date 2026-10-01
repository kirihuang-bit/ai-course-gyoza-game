// 自動驗收（老師檔）：npm run check
// 用固定的案例檢查遊戲規則有沒有照規則書運作，逐條印出 PASS / FAIL。
// 這個檔只讀檔案、不改任何東西。AI 不可以修改這個檔案來「讓測試通過」。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const gameDir = path.resolve(here, '../src/game');
const srcDir = path.resolve(here, '../src');
const load = (rel) => import(path.join(gameDir, rel)).then((m) => m);
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(gameDir, rel), 'utf8'));

const { newGame, simulateDay, countArrivals, buildQueue } = await load('engine.js');
const { validateCustomers } = await load('validateCustomers.js');
const { tryBuy } = await load('rules/sales.js');
const { wasteFee, dailyProfit } = await load('rules/money.js');
const { updateStars } = await load('rules/reputation.js');
const { checkTask } = await load('rules/tasks.js');
const { pickLine } = await load('rules/speech.js');
const { DAYS_DATA } = await load('days.js');

const defaultPack = readJson('customers/default.json');
const officialPack = readJson('customers/official.json');

const sections = [];
let current = null;
function section(name, owner) {
  current = { name, owner, pass: 0, fail: 0 };
  sections.push(current);
  console.log(`\n■ ${name}${owner ? `（${owner}）` : ''}`);
}
function check(label, actual, expected) {
  let ok;
  try {
    ok = JSON.stringify(actual) === JSON.stringify(expected);
  } catch {
    ok = false;
  }
  if (ok) {
    current.pass += 1;
    console.log(`  PASS  ${label}`);
  } else {
    current.fail += 1;
    console.log(`  FAIL  ${label}`);
    console.log(`        預期：${JSON.stringify(expected)}`);
    console.log(`        實際：${JSON.stringify(actual)}`);
  }
}
function safe(fn) {
  try {
    return fn();
  } catch (err) {
    return `發生錯誤：${err.message}`;
  }
}

const lines = (tag) => ({
  bought: `${tag}-買到`,
  hated_on_menu: `${tag}-討厭`,
  not_on_menu: `${tag}-沒上架`,
  sold_out: `${tag}-賣完`,
  too_expensive: `${tag}-太貴`,
});
const customer = (over) => ({
  name: '測試客',
  intro: '測試用',
  budget: 100,
  wants: ['招牌鍋貼'],
  hates: null,
  days: [1],
  count: 1,
  lines: lines('測試客'),
  ...over,
});
const plan = (items, promoCost = 0) => ({ items, promoCost });

// ─────────────────────────────────────────────
section('引擎', '老師檔，開課時就該全部 PASS');
{
  const p = plan([
    { id: 'signature', qty: 20, price: 70 },
    { id: 'chive', qty: 10, price: 70 },
    { id: 'tea', qty: 10, price: 25 },
    { id: 'soymilk', qty: 10, price: 25 },
  ]);
  const a = simulateDay(newGame(), p, defaultPack).report;
  const b = simulateDay(newGame(), p, defaultPack).report;
  check('同一組輸入跑兩次，結果完全相同', JSON.stringify(a) === JSON.stringify(b), true);
  check(
    '預設路人第 1 天、3 顆星、不宣傳：三位路人各來 10 位',
    countArrivals(defaultPack, 1, 3, 0).map((x) => x.count),
    [10, 10, 10],
  );
  check(
    '來客數：10 位 × 4 顆星（120%）× 第 5 天（120%）× 宣傳 200（+20%）= 17 位',
    countArrivals([customer({ days: [5], count: 10 })], 5, 4, 200)[0].count,
    17,
  );
  const queue = buildQueue([
    { customer: { name: '甲' }, count: 2 },
    { customer: { name: '乙' }, count: 1 },
    { customer: { name: '丙' }, count: 2 },
  ]).map((c) => c.name);
  check('進店順序是輪流：甲乙丙甲丙', queue, ['甲', '乙', '丙', '甲', '丙']);
  const hater = simulateDay(
    newGame(),
    plan([{ id: 'chive', qty: 5, price: 70 }]),
    [customer({ name: '怕韭菜', wants: ['招牌鍋貼'], hates: '韭菜鍋貼' })],
  ).report.visits[0];
  check('討厭的菜有上架：客人不進門', [hater.entered, hater.outcome], [false, 'hated_on_menu']);
  const nobody = simulateDay(newGame(), plan([{ id: 'tea', qty: 1, price: 25 }]), [customer({ days: [2] })]).report;
  check('沒有客人的日子：畫面也能正常結束', nobody.visits.length, 0);
}

// ─────────────────────────────────────────────
section('客人包檢查', '老師檔，開課時就該全部 PASS');
{
  check('官方客人包合格', validateCustomers(officialPack).ok, true);
  check('預設路人合格', validateCustomers(defaultPack).ok, true);
  check('預算 200 元會被擋下', validateCustomers([customer({ budget: 200 })]).ok, false);
  check('菜單外的「咖哩鍋貼」會被擋下', validateCustomers([customer({ wants: ['咖哩鍋貼'] })]).ok, false);
  check('同名客人會被擋下', validateCustomers([customer(), customer()]).ok, false);
  check(
    '單日合計 51 人會被擋下',
    validateCustomers([
      customer({ name: 'A', count: 12 }),
      customer({ name: 'B', count: 12 }),
      customer({ name: 'C', count: 12 }),
      customer({ name: 'D', count: 12 }),
      customer({ name: 'E', count: 3 }),
    ]).ok,
    false,
  );
  check('台詞缺一句會被擋下', validateCustomers([customer({ lines: { bought: '好' } })]).ok, false);
}

// ─────────────────────────────────────────────
section('硬規則', '遊戲不能存檔、不能連網、不能用亂數');
{
  const forbidden = [
    ['localStorage', /localStorage/],
    ['sessionStorage', /sessionStorage/],
    ['indexedDB', /indexedDB/],
    ['document.cookie', /document\.cookie/],
    ['fetch(', /\bfetch\s*\(/],
    ['XMLHttpRequest', /XMLHttpRequest/],
    ['Math.random', /Math\.random/],
  ];
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(js|jsx)$/.test(entry.name)) files.push(full);
    }
  };
  walk(srcDir);
  for (const [label, re] of forbidden) {
    const hits = files.filter((f) => re.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(srcDir, f));
    check(`src/ 裡沒有 ${label}`, hits, []);
  }
  const gameFiles = files.filter((f) => f.startsWith(gameDir));
  const dateHits = gameFiles
    .filter((f) => /\bDate\.now\s*\(|new\s+Date\s*\(/.test(fs.readFileSync(f, 'utf8')))
    .map((f) => path.relative(srcDir, f));
  check('src/game/ 裡沒有用到時間（Date）', dateHits, []);
}

// ─────────────────────────────────────────────
section('成交規則', 'rules/sales.js');
{
  check('沒上架 → not_on_menu', safe(() => tryBuy({ onMenu: false, stockLeft: 5, price: 70, budgetLeft: 100 })), {
    ok: false,
    reason: 'not_on_menu',
  });
  check('有上架、有貨、買得起 → 買得到', safe(() => tryBuy({ onMenu: true, stockLeft: 5, price: 70, budgetLeft: 100 })), {
    ok: true,
    reason: null,
  });
  check('賣完了（剩 0 份）→ sold_out', safe(() => tryBuy({ onMenu: true, stockLeft: 0, price: 70, budgetLeft: 100 })), {
    ok: false,
    reason: 'sold_out',
  });
  check('太貴（70 元 > 剩下預算 60 元）→ too_expensive', safe(() => tryBuy({ onMenu: true, stockLeft: 5, price: 70, budgetLeft: 60 })), {
    ok: false,
    reason: 'too_expensive',
  });
  const r = simulateDay(newGame(), plan([{ id: 'signature', qty: 10, price: 70 }]), [customer({ count: 12 })]).report;
  check('招牌鍋貼備 10 份、來 12 位客人：最多賣出 10 份', r.sold.signature ?? 0, 10);
  check('同上：有 2 位客人因為賣完沒買到', r.visits.filter((v) => v.outcome === 'sold_out').length, 2);
}

// ─────────────────────────────────────────────
section('收支規則', 'rules/money.js');
{
  for (const [waste, fee] of [
    [0, 0],
    [5, 0],
    [6, 3],
    [15, 30],
    [16, 83],
    [20, 95],
  ]) {
    check(`報廢 ${waste} 份 → 清潔費 ${fee} 元`, safe(() => wasteFee(waste)), fee);
  }
  check(
    '收入 1,000、備貨 600、宣傳 200、清潔費 95 → 淨利 105',
    safe(() => dailyProfit({ revenue: 1000, stockCost: 600, promoCost: 200, wasteFee: 95 })),
    105,
  );
  const r = simulateDay(newGame(), plan([{ id: 'tea', qty: 26, price: 25 }], 200), [customer({ wants: ['紅茶'], count: 5 })])
    .report;
  // 第 1 天、3 顆星、宣傳 200（+20%）→ 6 位客人，賣 6 杯 = 150 元；備貨 26 × 8 = 208；報廢 20 份 → 95 元
  check('整天跑一次：收支與資金都算對', [r.revenue, r.stockCost, r.wasteFee, r.profit, r.endCash], [150, 208, 95, -353, 1647]);
}

// ─────────────────────────────────────────────
section('口碑規則', 'rules/reputation.js');
{
  const cases = [
    ['滿意 80% → +1 顆', 3, [8, 2, 0], 4],
    ['滿意 65% → +0.5 顆', 3, [13, 7, 0], 3.5],
    ['滿意剛好 60% → +0.5 顆', 3, [6, 2, 2], 3.5],
    ['滿意 50%、不滿 10% → 不變', 3, [5, 4, 1], 3],
    ['滿意 20% → −0.5 顆', 3, [2, 8, 0], 2.5],
    ['滿意 30%、不滿剛好 30% → −0.5 顆', 3, [3, 4, 3], 2.5],
    ['滿意 10% → −1 顆', 3, [1, 9, 0], 2],
    ['滿意 30%、不滿 40% → −1 顆', 3, [3, 3, 4], 2],
    ['已經 5 顆再 +1 → 還是 5 顆', 5, [8, 2, 0], 5],
    ['已經 1 顆再 −1 → 還是 1 顆', 1, [1, 9, 0], 1],
    ['沒有客人進店 → 不變', 3, [0, 0, 0], 3],
  ];
  for (const [label, stars, [satisfied, neutral, unsatisfied], expected] of cases) {
    check(label, safe(() => updateStars({ stars, satisfied, neutral, unsatisfied })), expected);
  }
}

// ─────────────────────────────────────────────
section('每日任務規則', 'rules/tasks.js');
{
  const task = (day) => DAYS_DATA.find((d) => d.day === day).task;
  const base = { wasteTotal: 3, visits: [], sold: {}, starsAfter: 3, profit: 0 };
  const cases = [
    ['第 1 天零報廢：報廢 0 份 → 達成', 1, { wasteTotal: 0 }, 'done'],
    ['第 1 天零報廢：報廢 3 份 → 未達成', 1, { wasteTotal: 3 }, 'failed'],
    ['第 2 天：沒人因為賣完離開 → 達成', 2, { visits: [{ outcome: 'bought' }, { outcome: 'too_expensive' }] }, 'done'],
    ['第 2 天：有人因為賣完離開 → 未達成', 2, { visits: [{ outcome: 'bought' }, { outcome: 'sold_out' }] }, 'failed'],
    ['第 3 天：鍋貼合計 30 份 → 達成', 3, { sold: { signature: 20, chive: 5, corn: 5, tea: 9 } }, 'done'],
    ['第 3 天：鍋貼合計 29 份 → 未達成', 3, { sold: { signature: 20, corn: 9, tea: 30 } }, 'failed'],
    ['第 4 天：打烊後 4 顆 → 達成', 4, { starsAfter: 4 }, 'done'],
    ['第 4 天：打烊後 3.5 顆 → 未達成', 4, { starsAfter: 3.5 }, 'failed'],
    ['第 5 天：淨利剛好 800 → 達成', 5, { profit: 800 }, 'done'],
    ['第 5 天：淨利 799 → 未達成', 5, { profit: 799 }, 'failed'],
  ];
  for (const [label, day, over, expected] of cases) {
    check(label, safe(() => checkTask(task(day), { ...base, ...over })), expected);
  }
}

// ─────────────────────────────────────────────
section('說話規則', 'rules/speech.js');
{
  const c = customer({ name: '小明', lines: lines('小明') });
  for (const outcome of ['bought', 'hated_on_menu', 'not_on_menu', 'sold_out', 'too_expensive']) {
    check(`${outcome} → 說「${c.lines[outcome]}」`, safe(() => pickLine(c, outcome)), c.lines[outcome]);
  }
}

// ─────────────────────────────────────────────
console.log('\n════════ 總結 ════════');
for (const s of sections) {
  const total = s.pass + s.fail;
  const mark = s.fail === 0 ? '✅' : '❌';
  console.log(`${mark} ${s.name.padEnd(8, '　')} ${s.pass}／${total} PASS`);
}
const failTotal = sections.reduce((n, s) => n + s.fail, 0);
console.log(failTotal === 0 ? '\n全部通過。' : `\n還有 ${failTotal} 條沒通過。對照規則書，看看是哪一條規則沒照做。`);
