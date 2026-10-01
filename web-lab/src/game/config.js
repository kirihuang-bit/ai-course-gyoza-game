// 遊戲的固定數值（老師檔）。
// 這些數字來自「規則書」，改了就跟全班不一樣，分數也不能比了。
// AI 不可以修改這個檔案。

export const START_CASH = 2000; // 起始資金
export const DAYS = 5; // 遊戲天數
export const START_STARS = 3; // 起始星等（以 0.5 顆為單位，範圍 1～5）
export const MIN_STARS = 1;
export const MAX_STARS = 5;
export const MAX_SLOTS = 4; // 每天最多上架幾樣菜
export const DAILY_CAPACITY = 80; // 每天所有菜合計最多備幾份

// 宣傳費：cost 是花多少錢，pct 是客人人數增加幾 %
export const PROMO_OPTIONS = [
  { cost: 0, pct: 0 },
  { cost: 200, pct: 20 },
  { cost: 500, pct: 45 },
];

// 跳關練習：不論跳到哪一天，都從這個狀態開始，成績不列入排行榜
export const JUMP_START = { cash: 1000, stars: 3 };

// 客人包的限制（給 validateCustomers.js 用）
export const CUSTOMER_PACK_LIMITS = {
  minBudget: 30,
  maxBudget: 150,
  minWants: 1,
  maxWants: 2,
  minCount: 1,
  maxCount: 12,
  maxDailyTotal: 50,
  maxIntroLength: 20,
  maxLineLength: 20,
};

// 台詞的五種情況
export const LINE_KEYS = ['bought', 'hated_on_menu', 'not_on_menu', 'sold_out', 'too_expensive'];

// 星等倍率（整數百分比）：1 顆 = 60%，每多半顆 +10%，5 顆 = 140%
export function starPct(stars) {
  return 60 + Math.round((stars - 1) * 20);
}

// 廚餘清潔費的參數（給 rules/money.js 用）
export const WASTE_FEE = {
  freeUpTo: 5, // 0～5 份免費
  perUnit: 3, // 超過 5 份的部分，每份 3 元
  bigThreshold: 15, // 超過 15 份……
  bigFee: 50, // ……另加 50 元大型廚餘清運費
};
