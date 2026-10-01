// 成交規則：客人想買的這一樣，買不買得到？
// 對應規則書：「客人怎麼決定買不買」
// 驗收：npm run check 的「成交規則」
//
// 輸入：
//   onMenu     這樣菜今天有沒有上架（true / false）
//   stockLeft  這樣菜現在還剩幾份
//   price      這樣菜的定價
//   budgetLeft 客人剩下的預算
// 回傳：
//   買得到 → { ok: true, reason: null }
//   買不到 → { ok: false, reason: 'not_on_menu' | 'sold_out' | 'too_expensive' }

export function tryBuy({ onMenu, stockLeft, price, budgetLeft }) {
  if (!onMenu) {
    return { ok: false, reason: 'not_on_menu' };
  }
  if (stockLeft <= 0) {
    return { ok: false, reason: 'sold_out' };
  }
  if (price > budgetLeft) {
    return { ok: false, reason: 'too_expensive' };
  }
  return { ok: true, reason: null };
}
