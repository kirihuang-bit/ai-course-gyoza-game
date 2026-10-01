// 這個檔案放「首頁要顯示的資料」。
// C1 初學者只改這裡，就能看到畫面熱更新，不需要碰 React 元件與動畫背景。

export const brand = {
  name: 'GYOZA WOOD',
  badge: 'GYOZA SHOP GAME',
  tagline: '接手一家鍋貼店遊戲，用 AI 補完它，再做出自己的 Skill、MCP 與 AI Agent。',
  description:
    '這是一個做到一半的鍋貼店經營遊戲：開局就能玩，但到處都怪怪的。你的任務不是學做遊戲，而是學會讓 AI 照你的規則修好它、幫你測試它，最後替你經營它。',
  cta: '看看課程主線',
  // 首頁主圖。把你的鍋貼照片放進 web-lab/public/images/，再把路徑填在這裡，
  // 例如 '/images/my-gyoza.jpg'。留空字串就顯示預設插畫——不填也不會壞。
  // 路徑要以 / 開頭，檔名建議用英文小寫。
  heroImage: '',
};

export const courseModules = [
  {
    code: 'C1',
    title: '接手專案',
    desc: '用 VS Code 打開專案、讓它跑起來、看懂檔案結構，用 Git 為每一次修改留下存檔點。',
    output: '跑得起來的遊戲 + 第一筆 commit',
  },
  {
    code: 'C2',
    title: 'Skill：把規則交給 AI',
    desc: '把「客人該長什麼樣子」「怎麼測試遊戲」寫成 Skill，讓 AI 每次都照同一套規矩做事。',
    output: '自己的客人包 + 遊戲驗證 Skill',
  },
  {
    code: 'C3',
    title: 'MCP：讓 AI 看得到遊戲',
    desc: '幫 AI 接上瀏覽器，讓它自己打開遊戲、輸入數字、按按鈕、讀結果，而不是只能猜。',
    output: 'AI 實際操作遊戲的紀錄',
  },
  {
    code: 'C4',
    title: 'Agent：交給 AI 一份工作',
    desc: '把 Skill 和 MCP 組成一個測試員 Agent，讓它照案例測試、回報可以重現的證據。',
    output: '測試員 Agent + 驗收報告',
  },
];

export const stats = [
  { value: '5 天', label: '一場經營' },
  { value: '6 道菜', label: '每天上架 4 道' },
  { value: '2,000 元', label: '開店資金' },
];

export const workflow = ['玩一次', '找出怪的地方', '對照規則書', '寫給 AI 的規則', '讓 AI 動手', '跑驗收', '看 diff', 'commit'];

export const tabs = [
  {
    id: 'rulebook',
    label: '規則書',
    title: '規則書說了算，遊戲說了不算',
    body: '遊戲的表現和規則書不一樣，就是遊戲有 bug。先玩、再對照規則書，你就知道要叫 AI 修什麼。',
  },
  {
    id: 'skill',
    label: 'Skill',
    title: 'Skill 是寫給 AI 的工作守則',
    body: 'AI 不知道你的規矩。把規則、步驟、檢查方式寫成 Skill，它每次都會照做，你也不用每次重講。',
  },
  {
    id: 'mcp',
    label: 'MCP',
    title: 'MCP 是幫 AI 多裝一隻手',
    body: '原本 AI 只能讀檔案。接上瀏覽器 MCP 之後，它能自己打開遊戲、操作、截圖，用證據回報。',
  },
  {
    id: 'agent',
    label: 'Agent',
    title: 'Agent 是交代一整份工作的 AI 夥伴',
    body: '給它職責、可用的工具、禁止事項和回報格式，它就能獨立完成一件事，例如把整份測試案例跑完。',
  },
];

export const checkpoints = [
  '遊戲從第 1 天玩到第 5 天結算，畫面沒有壞掉',
  'npm run check 的結果比修改前更好，而且沒有變壞的項目',
  'git diff 只動到這一關允許修改的檔案',
];
