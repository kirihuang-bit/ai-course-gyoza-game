// 客人包清單（老師檔）。遊戲畫面從這裡拿客人包。
import defaultPack from './customers/default.json';
import officialPack from './customers/official.json';
import myPack from './customers/my-customers.json';

export const PACKS = [
  { id: 'default', label: '預設路人', data: defaultPack },
  { id: 'official', label: '官方標準關', data: officialPack },
  { id: 'mine', label: '我的客人包（my-customers.json）', data: myPack },
];
