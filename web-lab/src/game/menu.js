// 菜單（老師檔）。六樣菜固定，AI 不可以修改這個檔案。
// cost：備一份的成本；refPrice：建議售價；minPrice～maxPrice：可定價範圍

export const MENU = [
  { id: 'signature', name: '招牌鍋貼', cost: 35, refPrice: 70, minPrice: 50, maxPrice: 90 },
  { id: 'chive', name: '韭菜鍋貼', cost: 35, refPrice: 70, minPrice: 50, maxPrice: 90 },
  { id: 'corn', name: '玉米鍋貼', cost: 45, refPrice: 80, minPrice: 60, maxPrice: 100 },
  { id: 'soup', name: '酸辣湯', cost: 15, refPrice: 35, minPrice: 25, maxPrice: 45 },
  { id: 'soymilk', name: '豆漿', cost: 8, refPrice: 25, minPrice: 15, maxPrice: 35 },
  { id: 'tea', name: '紅茶', cost: 8, refPrice: 25, minPrice: 15, maxPrice: 35 },
];

// 鍋貼類（每日任務「賣出 30 份鍋貼」用）
export const GYOZA_IDS = ['signature', 'chive', 'corn'];

export function findDish(id) {
  return MENU.find((dish) => dish.id === id);
}

// 客人包裡寫的是中文菜名，這裡把中文菜名換成 id
export function dishIdByName(name) {
  const dish = MENU.find((d) => d.name === name);
  return dish ? dish.id : null;
}
