// 遊戲引擎（老師檔）：一天從開店到打烊的固定流程。
// 真正的規則寫在 rules/ 資料夾裡，這個檔案只負責「照順序呼叫規則」。
// AI 不可以修改這個檔案。
//
// 這裡全部是純函式：不讀寫檔案、不存檔、不用亂數，
// 所以同樣的輸入一定得到同樣的結果，全班可以一起核對。

import { START_CASH, START_STARS, DAYS, JUMP_START, PROMO_OPTIONS, starPct } from './config.js';
import { findDish, dishIdByName } from './menu.js';
import { getDayData } from './days.js';
import { tryBuy } from './rules/sales.js';
import { wasteFee as calcWasteFee, dailyProfit } from './rules/money.js';
import { updateStars } from './rules/reputation.js';
import { checkTask } from './rules/tasks.js';
import { pickLine } from './rules/speech.js';

// 開新的一場。mode = 'normal'（正式）或 'jump'（跳關練習，不列入排行榜）
export function newGame({ mode = 'normal', startDay = 1 } = {}) {
  if (mode === 'jump') {
    return { mode, day: startDay, cash: JUMP_START.cash, stars: JUMP_START.stars, history: [] };
  }
  return { mode: 'normal', day: 1, cash: START_CASH, stars: START_STARS, history: [] };
}

export function isFinished(state) {
  return state.day > DAYS;
}

// 第一步：算出今天每種客人實際來幾位
export function countArrivals(pack, day, stars, promoCost) {
  const dayData = getDayData(day);
  const promo = PROMO_OPTIONS.find((p) => p.cost === promoCost) ?? PROMO_OPTIONS[0];
  return pack
    .filter((customer) => customer.days.includes(day))
    .map((customer) => {
      // 全部用整數百分比相乘，最後才除，避免小數誤差；Math.round 對正數是四捨五入
      const raw = customer.count * starPct(stars) * dayData.eventPct * (100 + promo.pct);
      return { customer, count: Math.round(raw / 1000000) };
    });
}

// 第二步：排隊。各種客人輪流進店：甲1、乙1、丙1、甲2、乙2……
export function buildQueue(arrivals) {
  const queue = [];
  const longest = Math.max(0, ...arrivals.map((a) => a.count));
  for (let i = 0; i < longest; i += 1) {
    for (const a of arrivals) {
      if (i < a.count) queue.push(a.customer);
    }
  }
  return queue;
}

// 安全措施：規則檔回傳奇怪的值時，畫面也不能壞掉
function safeNumber(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

// 跑完一天。回傳 { state: 隔天的狀態, report: 今天的結果 }
export function simulateDay(state, plan, pack) {
  const day = state.day;
  const dayData = getDayData(day);
  const startCash = state.cash;
  const startStars = state.stars;

  // 開店：備貨
  const planById = {};
  for (const item of plan.items) planById[item.id] = item;
  const stock = {};
  let stockCost = 0;
  for (const item of plan.items) {
    stock[item.id] = item.qty;
    stockCost += findDish(item.id).cost * item.qty;
  }
  const promoCost = plan.promoCost;

  // 客人進店
  const arrivals = countArrivals(pack, day, startStars, promoCost);
  const queue = buildQueue(arrivals);

  const sold = {};
  let revenue = 0;
  let satisfied = 0;
  let neutral = 0;
  let unsatisfied = 0;
  const visits = [];

  for (const customer of queue) {
    const hateId = customer.hates ? dishIdByName(customer.hates) : null;

    // 討厭的東西有上架：不進門
    if (hateId && planById[hateId]) {
      visits.push({
        name: customer.name,
        entered: false,
        bought: [],
        outcome: 'hated_on_menu',
        satisfaction: null,
        line: pickLine(customer, 'hated_on_menu'),
      });
      continue;
    }

    let budgetLeft = customer.budget;
    const bought = [];
    let firstReason = null;
    let firstWantSatisfied = false;

    customer.wants.forEach((wantName, index) => {
      const id = dishIdByName(wantName);
      const item = planById[id];
      const result = tryBuy({
        onMenu: Boolean(item),
        stockLeft: item ? stock[id] : 0,
        price: item ? item.price : 0,
        budgetLeft,
      });
      if (result.ok) {
        stock[id] -= 1;
        budgetLeft -= item.price;
        revenue += item.price;
        sold[id] = (sold[id] ?? 0) + 1;
        bought.push({ id, price: item.price });
        if (index === 0 && item.price <= findDish(id).refPrice) firstWantSatisfied = true;
      } else if (!firstReason) {
        firstReason = result.reason;
      }
    });

    const outcome = bought.length > 0 ? 'bought' : firstReason;
    let satisfaction;
    if (firstWantSatisfied) {
      satisfaction = 'satisfied';
      satisfied += 1;
    } else if (bought.length > 0) {
      satisfaction = 'neutral';
      neutral += 1;
    } else {
      satisfaction = 'unsatisfied';
      unsatisfied += 1;
    }

    visits.push({
      name: customer.name,
      entered: true,
      bought,
      outcome,
      satisfaction,
      line: pickLine(customer, outcome),
    });
  }

  // 打烊：剩下的全部報廢（庫存如果變成負數，報廢量以 0 計）
  const waste = {};
  let wasteTotal = 0;
  for (const item of plan.items) {
    waste[item.id] = Math.max(0, stock[item.id]);
    wasteTotal += waste[item.id];
  }
  const wasteFee = safeNumber(calcWasteFee(wasteTotal), 0);
  const profit = safeNumber(dailyProfit({ revenue, stockCost, promoCost, wasteFee }), revenue);

  // 口碑
  const starsAfter = safeNumber(updateStars({ stars: startStars, satisfied, neutral, unsatisfied }), startStars);

  const report = {
    day,
    startCash,
    startStars,
    plan,
    arrivals: arrivals.map((a) => ({ name: a.customer.name, count: a.count })),
    visits,
    sold,
    waste,
    wasteTotal,
    revenue,
    stockCost,
    promoCost,
    wasteFee,
    satisfied,
    neutral,
    unsatisfied,
    entered: satisfied + neutral + unsatisfied,
    starsBefore: startStars,
    starsAfter,
    profit,
  };

  // 每日任務
  const status = checkTask(dayData.task, report);
  const taskStatus = ['done', 'failed', 'wip'].includes(status) ? status : 'wip';
  const bonus = taskStatus === 'done' ? dayData.task.bonus : 0;
  report.task = { ...dayData.task, status: taskStatus, bonusPaid: bonus };
  report.endCash = startCash + profit + bonus;

  const nextState = {
    ...state,
    day: day + 1,
    cash: report.endCash,
    stars: starsAfter,
    history: [...state.history, report],
  };
  return { state: nextState, report };
}

// 結算畫面要顯示的數字
export function summarize(state) {
  const history = state.history;
  return {
    finalCash: state.cash,
    totalWaste: history.reduce((sum, r) => sum + r.wasteTotal, 0),
    finalStars: state.stars,
    tasksDone: history.filter((r) => r.task.status === 'done').length,
    daysPlayed: history.length,
  };
}
