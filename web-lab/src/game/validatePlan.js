// 檢查玩家今天的決定合不合規則（老師檔）。AI 不可以修改這個檔案。
// 回傳錯誤訊息的陣列；空陣列代表可以開店。

import { MAX_SLOTS, DAILY_CAPACITY, PROMO_OPTIONS } from './config.js';
import { findDish } from './menu.js';

export function formatMoney(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function planCost(plan) {
  let stockCost = 0;
  for (const item of plan.items) {
    const dish = findDish(item.id);
    if (dish && Number.isInteger(item.qty) && item.qty > 0) stockCost += dish.cost * item.qty;
  }
  return { stockCost, total: stockCost + (plan.promoCost || 0) };
}

export function validatePlan(plan, cash) {
  const errors = [];
  const items = plan.items;

  if (items.length === 0) errors.push('至少要上架 1 樣菜');
  if (items.length > MAX_SLOTS) errors.push(`最多只能上架 ${MAX_SLOTS} 樣，你選了 ${items.length} 樣`);

  const seen = new Set();
  let totalQty = 0;
  for (const item of items) {
    const dish = findDish(item.id);
    if (!dish) {
      errors.push(`菜單上沒有「${item.id}」`);
      continue;
    }
    if (seen.has(item.id)) errors.push(`「${dish.name}」重複上架`);
    seen.add(item.id);

    if (!Number.isInteger(item.qty) || item.qty < 0) {
      errors.push(`${dish.name}的份數要是 0 以上的整數`);
    } else {
      totalQty += item.qty;
    }
    if (!Number.isInteger(item.price) || item.price < dish.minPrice || item.price > dish.maxPrice) {
      errors.push(`${dish.name}的定價要是 ${dish.minPrice}～${dish.maxPrice} 元之間的整數`);
    }
  }

  if (totalQty > DAILY_CAPACITY) {
    errors.push(`今天合計 ${totalQty} 份，超過每日產能 ${DAILY_CAPACITY} 份`);
  }

  const promoOk = PROMO_OPTIONS.some((p) => p.cost === plan.promoCost);
  if (!promoOk) errors.push(`宣傳費只能選 ${PROMO_OPTIONS.map((p) => p.cost).join('、')} 元`);

  const { stockCost, total } = planCost(plan);
  if (total > cash) {
    errors.push(
      `備貨 ${formatMoney(stockCost)} 元＋宣傳 ${formatMoney(plan.promoCost || 0)} 元＝${formatMoney(total)} 元，超過現有資金 ${formatMoney(cash)} 元`,
    );
  }
  return errors;
}
