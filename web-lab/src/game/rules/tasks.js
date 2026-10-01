// 每日任務規則：今天的任務有沒有達成
// 對應規則書：「每日任務與結算」；任務內容在 days.js
// 驗收：npm run check 的「每日任務規則」

import { GYOZA_IDS } from '../menu.js';

// 輸入：
//   task    今天的任務（days.js 裡的 { id, text, bonus }）
//   report  今天的營業結果，會用到的欄位：
//             report.wasteTotal  今天報廢的總份數
//             report.visits      每位客人的結果陣列，每筆有 outcome（'bought'、'sold_out'…）
//             report.sold        每樣菜賣出幾份，例如 { signature: 20, tea: 5 }
//             report.starsAfter  打烊後的星等
//             report.profit      今天的淨利（不含獎金）
// 回傳：'done'（達成）| 'failed'（沒達成）| 'wip'（施工中）
export function checkTask(task, report) {
  let done = false;
  if (task.id === 'zero-waste') {
    done = report.wasteTotal === 0;
  } else if (task.id === 'no-soldout-leave') {
    done = report.visits.every((visit) => visit.outcome !== 'sold_out');
  } else if (task.id === 'gyoza-30') {
    const gyozaSold = GYOZA_IDS.reduce((sum, id) => sum + (report.sold[id] ?? 0), 0);
    done = gyozaSold >= 30;
  } else if (task.id === 'stars-4') {
    done = report.starsAfter >= 4;
  } else if (task.id === 'profit-800') {
    done = report.profit >= 800;
  } else {
    return 'wip';
  }
  return done ? 'done' : 'failed';
}
