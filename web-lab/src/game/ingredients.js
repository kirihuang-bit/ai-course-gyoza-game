// 倉庫原料（老師檔）：品項代號沿用「AI Excel 課程」的物料主檔（M001～M008）。
// 倉庫只用來做打烊盤點，不影響現金、星等和分數：原料的錢已經算在每道菜的成本裡。
// AI 不可以修改這個檔案。
//
// 欄位：
//   sku       品項代號
//   name      原料名稱
//   dishes    哪些菜會用到它（菜的 id，見 menu.js）；每備 1 份菜扣 1 份原料
//   start     開店那天倉庫裡有幾份
//   delivery  每晚供應商固定送來幾份
//   safety    安全量：庫存低於或等於這個數字，就該補貨了

export const INGREDIENTS = [
  { sku: 'M001', name: '麵皮', dishes: ['signature', 'chive', 'corn'], start: 60, delivery: 35, safety: 20 },
  { sku: 'M002', name: '豬絞肉', dishes: ['signature', 'chive'], start: 40, delivery: 25, safety: 12 },
  { sku: 'M003', name: '高麗菜', dishes: ['signature', 'corn'], start: 40, delivery: 25, safety: 12 },
  { sku: 'M004', name: '韭菜', dishes: ['chive'], start: 15, delivery: 8, safety: 4 },
  { sku: 'M005', name: '玉米粒', dishes: ['corn'], start: 15, delivery: 8, safety: 4 },
  { sku: 'M006', name: '酸辣湯料', dishes: ['soup'], start: 15, delivery: 8, safety: 4 },
  { sku: 'M007', name: '豆漿原料', dishes: ['soymilk'], start: 15, delivery: 8, safety: 4 },
  { sku: 'M008', name: '紅茶茶包', dishes: ['tea'], start: 15, delivery: 8, safety: 4 },
];

// 開店那天的倉庫，例如 { M001: 60, M002: 40, … }
export function startWarehouse() {
  const warehouse = {};
  for (const ing of INGREDIENTS) warehouse[ing.sku] = ing.start;
  return warehouse;
}

// 盤點狀態的三種結果
export const STOCK_STATUS = ['ok', 'low', 'out'];
