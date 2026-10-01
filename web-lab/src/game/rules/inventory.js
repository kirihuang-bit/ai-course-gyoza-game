// 倉庫盤點規則：打烊後每種原料的狀態、明天要補多少
// 對應規則書：「倉庫盤點」；原料資料在 ingredients.js
// 驗收：npm run check 的「倉庫盤點規則」

// 輸入：
//   stock    打烊後這種原料還剩幾份（最少是 0）
//   safety   這種原料的安全量
//   rushBuy  今天倉庫不夠、臨時加購了幾份（沒有就是 0）
// 回傳：'ok'（正常）| 'low'（需要補貨）| 'out'（缺貨）
export function checkIngredient({ stock, safety, rushBuy }) {
  return 'ok';
}

// 輸入：打烊後剩幾份、安全量
// 回傳：建議追加叫貨幾份
export function reorderAmount({ stock, safety }) {
  return 0;
}
