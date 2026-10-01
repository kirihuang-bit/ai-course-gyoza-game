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
  return stars;
}
