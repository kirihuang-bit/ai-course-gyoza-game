// 口碑規則：打烊時星等怎麼變
// 對應規則書：「來客數與口碑星等」
// 驗收：npm run check 的「口碑規則」

import { MIN_STARS, MAX_STARS } from '../config.js';

// 輸入：
//   stars        今天開店時的星等
//   satisfied    滿意的客人數
//   neutral      普通的客人數
//   unsatisfied  不滿的客人數
// 回傳：打烊後的新星等
export function updateStars({ stars, satisfied, neutral, unsatisfied }) {
  const entered = satisfied + neutral + unsatisfied;
  if (entered === 0) return stars;

  // 用「× 100」比較百分比，避免小數誤差
  const satPct = (satisfied * 100) / entered;
  const unsatPct = (unsatisfied * 100) / entered;

  let change = 0;
  if (satPct >= 75) change = 1;
  else if (satPct >= 60) change = 0.5;
  else if (satPct < 15 || unsatPct >= 40) change = -1;
  else if (satPct < 30 || unsatPct >= 25) change = -0.5;

  return Math.min(MAX_STARS, Math.max(MIN_STARS, stars + change));
}
