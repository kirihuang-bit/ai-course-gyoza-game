// 五天的事件、預告與每日任務（老師檔）。AI 不可以修改這個檔案。
// eventPct：事件對客人人數的影響（整數百分比，100 = 不變）

export const DAYS_DATA = [
  {
    day: 1,
    event: '晴天・開幕日',
    eventPct: 100,
    forecast: '開幕第一天，附近的上班族和學生會來探探。',
    task: { id: 'zero-waste', text: '零報廢', bonus: 100 },
  },
  {
    day: 2,
    event: '下雨',
    eventPct: 80,
    forecast: '明天下雨，客人變少，但外送員會來躲雨，想喝點熱的。',
    task: { id: 'no-soldout-leave', text: '沒有任何客人因為賣完而什麼都沒買', bonus: 150 },
  },
  {
    day: 3,
    event: '晴天・團購',
    eventPct: 100,
    forecast: '校園排球隊訂了團購，他們最愛招牌鍋貼。',
    task: { id: 'gyoza-30', text: '單日賣出 30 份以上鍋貼（三種合計）', bonus: 150 },
  },
  {
    day: 4,
    event: '期中考週',
    eventPct: 110,
    forecast: '期中考週，熬夜的學生變多了，吃素的學妹也會來。',
    task: { id: 'stars-4', text: '打烊後星等達到 4 顆以上', bonus: 150 },
  },
  {
    day: 5,
    event: '發薪日',
    eventPct: 120,
    forecast: '發薪日！大家都比較捨得花錢。',
    task: { id: 'profit-800', text: '單日淨利 800 元以上（不含獎金）', bonus: 200 },
  },
];

export function getDayData(day) {
  return DAYS_DATA.find((d) => d.day === day);
}
