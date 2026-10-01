// 檢查客人包合不合格式（老師檔）。AI 不可以修改這個檔案。
// 遊戲載入或匯入客人包時都會先跑這個檢查，不合格就不能用。
// 回傳 { ok, errors }。

import { CUSTOMER_PACK_LIMITS as L, LINE_KEYS, DAYS } from './config.js';
import { MENU } from './menu.js';

const MENU_NAMES = MENU.map((d) => d.name);
const isInt = (v) => Number.isInteger(v);

export function validateCustomers(pack) {
  const errors = [];
  if (!Array.isArray(pack)) {
    return { ok: false, errors: ['客人包必須是一個陣列（用 [ ] 包起來）'] };
  }
  if (pack.length === 0) {
    return { ok: false, errors: ['客人包是空的，至少要有 1 種客人'] };
  }

  const names = new Set();
  const dailyTotal = {};

  pack.forEach((c, i) => {
    const who = c && typeof c.name === 'string' && c.name.trim() ? `第 ${i + 1} 位「${c.name}」` : `第 ${i + 1} 位`;
    if (!c || typeof c !== 'object') {
      errors.push(`${who}：格式不對，每位客人要用 { } 包起來`);
      return;
    }

    if (typeof c.name !== 'string' || !c.name.trim()) errors.push(`${who}：缺少名字 name`);
    else if (names.has(c.name)) errors.push(`${who}：名字和別的客人重複`);
    else names.add(c.name);

    if (typeof c.intro !== 'string' || !c.intro.trim()) errors.push(`${who}：缺少介紹 intro`);
    else if (c.intro.length > L.maxIntroLength) errors.push(`${who}：介紹超過 ${L.maxIntroLength} 個字`);

    if (!isInt(c.budget) || c.budget < L.minBudget || c.budget > L.maxBudget) {
      errors.push(`${who}：預算 budget 要是 ${L.minBudget}～${L.maxBudget} 的整數`);
    }

    if (!Array.isArray(c.wants) || c.wants.length < L.minWants || c.wants.length > L.maxWants) {
      errors.push(`${who}：想吃的東西 wants 要有 ${L.minWants}～${L.maxWants} 樣`);
    } else {
      c.wants.forEach((w) => {
        if (!MENU_NAMES.includes(w)) errors.push(`${who}：菜單上沒有「${w}」`);
      });
      if (new Set(c.wants).size !== c.wants.length) errors.push(`${who}：wants 裡有重複的菜`);
    }

    if (c.hates !== null && c.hates !== undefined) {
      if (typeof c.hates !== 'string' || !MENU_NAMES.includes(c.hates)) {
        errors.push(`${who}：討厭的東西 hates 只能是菜單上的 1 樣菜，或 null`);
      }
    }

    const validDays = Array.isArray(c.days) && c.days.length > 0 && c.days.every((d) => isInt(d) && d >= 1 && d <= DAYS);
    if (!validDays) errors.push(`${who}：出現日 days 要是 1～${DAYS} 的整數陣列，例如 [1, 3]`);
    else if (new Set(c.days).size !== c.days.length) errors.push(`${who}：days 裡有重複的日子`);

    if (!isInt(c.count) || c.count < L.minCount || c.count > L.maxCount) {
      errors.push(`${who}：人數 count 要是 ${L.minCount}～${L.maxCount} 的整數`);
    }

    if (!c.lines || typeof c.lines !== 'object') {
      errors.push(`${who}：缺少台詞 lines`);
    } else {
      LINE_KEYS.forEach((key) => {
        const line = c.lines[key];
        if (typeof line !== 'string' || !line.trim()) errors.push(`${who}：缺少台詞 lines.${key}`);
        else if (line.length > L.maxLineLength) errors.push(`${who}：台詞 lines.${key} 超過 ${L.maxLineLength} 個字`);
      });
    }

    if (validDays && isInt(c.count)) {
      c.days.forEach((d) => {
        dailyTotal[d] = (dailyTotal[d] ?? 0) + c.count;
      });
    }
  });

  Object.keys(dailyTotal)
    .sort()
    .forEach((d) => {
      if (dailyTotal[d] > L.maxDailyTotal) {
        errors.push(`第 ${d} 天的客人合計 ${dailyTotal[d]} 人，超過上限 ${L.maxDailyTotal} 人`);
      }
    });

  return { ok: errors.length === 0, errors };
}
