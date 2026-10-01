# GAME-SPEC ｜ GYOZA WOOD 經營遊戲 開發規格書 v0.2

> **教師用文件，只放在 `solution` 分支。** 本檔寫出每個洞的掉漆樣子與答案，不可放進學生拿到的 `main`。

> 這份是寫給 **AI 開發者**看的規格，用來把舊版 `ai-course-vibe_coding-class` 翻新成新的半成品專案。
> 寫給人看的規則以兩份規則書為準：「GYOZA WOOD 經營遊戲 規則書（老師版）v0.2」與「（學生版）」；學生版的內容也放在 repo 的 `docs/RULES.md`。
> **規則書和本規格衝突時，以規則書為準**，並回頭修正本規格。

---

## 0. 不可違反的原則

| # | 原則 | 對開發的意思 |
|---|---|---|
| P1 | 學生不是來學做遊戲的；學習重點是 Skill、MCP、AI Agent | 遊戲規則維持小而可驗證；任何讓規則交互變多的功能都不做 |
| P2 | 課堂一開始、學生沒填任何空缺時，遊戲就要能從第 1 天玩到第 5 天結算，只是很掉漆 | 每個洞都有「能跑但很爛」的預設實作，不能白畫面、不能丟例外 |
| P3 | 遊戲執行時只讀檔案、不寫檔案，也不在瀏覽器裡存任何東西 | 禁用 `localStorage`、`sessionStorage`、`IndexedDB`、cookie；沒有伺服端狀態；沒有 API 端點 |
| P4 | 同樣的輸入一定得到同樣的結果 | 遊戲邏輯不使用 `Math.random`、`Date`；數值計算用整數百分比避免浮點誤差 |
| P5 | 全班拿同一份程式碼 | 只有一個 `main` 起始版；換關用的起始版用分支發布（這個環境不允許推送 tag） |
| P6 | 不新增套件 | 只用現有的 React 18 + Vite 5；可以**移除**用不到的套件 |
| P7 | 舊 repo 不動 | 所有工作在新 repo 進行 |

---

## 1. Repo 翻新範圍

新 repo 從舊 repo 的 `main` 複製過來（保留 Git 歷史，方便回溯），再做以下調整。

### 1.1 保留不動

| 路徑 | 理由 |
|---|---|
| `web-lab/` 資料夾名稱、`npm install`、`npm run dev`、port 5180 | 「VSCode 教學 - 2」的實作依賴這些 |
| `web-lab/src/data.js` 的 `brand.name`、`brand.heroImage` | 「VSCode 教學 - 2」改店名、換首頁圖的實作 |
| `web-lab/public/images/` | 同上 |
| `web-lab/src/artwork.jsx`、`web-lab/src/uiEffects.jsx` | 首頁視覺 |
| `U0/`、`U1/` | 簡報已引用；內容過時的地方等課程流程定案後再改（見 §10） |
| `start-m11.bat`、`start-m11.command` | 一鍵啟動 |

### 1.2 修改

| 路徑 | 改成 |
|---|---|
| `web-lab/src/App.jsx` | 導覽只剩「首頁」「開店」兩頁；首頁文案改成新課程 |
| `web-lab/src/data.js` | `courseModules`、`stats`、`workflow`、`tabs`、`checkpoints` 改寫成新課程內容；`brand` 物件的欄位名稱不變 |
| `web-lab/vite.config.js` | 移除所有中介程式與 `orderSim` 引用，只留 React plugin 與 port 5180 |
| `web-lab/package.json` | 移除 `three`（只有舊訂單看板用）；新增 script `"check": "node scripts/check-rules.mjs"` |
| `web-lab/src/styles.css` | 刪除已移除頁面的樣式；遊戲樣式另放 `web-lab/src/game/game.css` |
| `README.md`、`START-HERE.md`、`AGENTS.md`、`CLAUDE.md` | 改寫成新專案（見 §8） |
| `.mcp.json` | 只留 `chrome-devtools`（見 §7.2） |
| `.gitignore` | 拿掉 `.claude` 這一行，讓 `.claude/skills/`、`.claude/agents/` 能進 Git |

### 1.3 刪除

| 路徑 | 理由 |
|---|---|
| `web-lab/orderSim.js` | 即時模擬引擎，新遊戲是回合制 |
| `web-lab/src/ShopConsole.jsx`、`OrderBoard.jsx`、`OrderBoardCanvas.jsx`、`Dashboard.jsx` | 舊頁面 |
| `web-lab/src/shopData.js`、`shopLogic.js`、`reportContract.js` | 舊頁面的資料與邏輯 |
| `blog-lab/`、`data-lab/`、`line-lab/`、`ops-agent-lab/` | 新課程用不到 |
| `.github/workflows/` | 同上 |
| `.agents/`、`skill/` | 舊 Codex skill 鏡像與舊 skill 草稿；新課程以 Claude Code 為主 |
| `.claude/commands/` 全部 | 舊指令引用已刪除的檔案；新指令改用 skill |
| `.claude/skills/` 裡的 `data-check-fixed-output`、`debug-react`、`beginner-ai-project-workflow` | 舊課程專用；最後一個由 `change-feature` 取代 |
| `prompts/` | 舊提示卡引用 U2～U4；新提示卡等課程流程定案後再寫 |
| `U2/`、`U3/`、`U4/` | 舊講義；新講義等課程流程定案後再寫 |

---

## 2. 目標檔案結構

```text
（repo 根目錄）
  README.md  START-HERE.md  AGENTS.md  CLAUDE.md
  .mcp.json  .gitignore
  start-m11.bat  start-m11.command
  docs/
    RULES.md                    ← 學生版規則書
    GAME-SPEC.md                ← 本檔（只在 solution 分支）
  U0/  U1/                      ← 保留
  .claude/
    skills/                     ← §7.1
    agents/                     ← §7.3
  web-lab/
    index.html  package.json  vite.config.js
    public/images/
    scripts/
      check-rules.mjs           ← §6 自動驗收
    src/
      main.jsx  App.jsx  data.js  styles.css
      artwork.jsx  uiEffects.jsx
      game/
        GameShop.jsx            ← 開店頁（老師檔）
        game.css
        config.js               ← 固定數值（老師檔）
        menu.js                 ← 菜單（老師檔）
        days.js                 ← 五天的事件、預告、任務文字（老師檔）
        engine.js               ← 一天的流程，呼叫下面的規則檔（老師檔）
        validateCustomers.js    ← 客人包格式檢查（老師檔）
        validatePlan.js         ← 玩家輸入檢查（老師檔）
        packs.js                ← 客人包清單（老師檔）
        rules/                  ← ★ 學生補洞的地方，一個洞一個檔
          sales.js              ← 洞 1：成交條件
          money.js              ← 洞 2：收支計算
          reputation.js         ← 洞 3：口碑星等
          tasks.js              ← 洞 4：每日任務
          speech.js             ← 洞 6：說話泡泡
        customers/
          default.json          ← 預設路人（掉漆版）
          official.json         ← 官方客人包（標準關）
          my-customers.json     ← 學生自己的客人包（開課時是空陣列 []）
```

設計理由：**一個洞一個檔**，讓 `git diff`、允許修改清單、助教除錯都只需要看一個檔案。

---

## 3. 資料格式

### 3.1 `config.js`

```js
export const START_CASH = 2000;
export const DAYS = 5;
export const START_STARS = 3;          // 以 0.5 為單位，範圍 1～5
export const MAX_SLOTS = 4;            // 每天最多上架幾樣
export const DAILY_CAPACITY = 80;      // 每天所有菜合計最多備幾份
export const PROMO_OPTIONS = [         // pct 是整數百分比
  { cost: 0,   pct: 0 },
  { cost: 200, pct: 20 },
  { cost: 500, pct: 45 },
];
export const JUMP_START = { cash: 1000, stars: 3 };  // 跳關起始狀態，不列入排行榜
export const CUSTOMER_PACK_LIMITS = { minCount: 1, maxCount: 12, maxDailyTotal: 50,
  minBudget: 30, maxBudget: 150, maxWants: 2, maxHates: 1, maxLineLength: 20, maxIntroLength: 20 };
// 星等倍率（整數百分比）：1★=60 … 5★=140，每半顆 +10
export const starPct = (stars) => 60 + Math.round((stars - 1) * 20);
// 廚餘清潔費
export const WASTE_FEE = { freeUpTo: 5, perUnit: 3, bigThreshold: 15, bigFee: 50 };
```

### 3.2 `menu.js`

```js
export const MENU = [
  { id: 'signature', name: '招牌鍋貼', cost: 35, refPrice: 70, minPrice: 50, maxPrice: 90 },
  { id: 'chive',     name: '韭菜鍋貼', cost: 35, refPrice: 70, minPrice: 50, maxPrice: 90 },
  { id: 'corn',      name: '玉米鍋貼', cost: 45, refPrice: 80, minPrice: 60, maxPrice: 100 },
  { id: 'soup',      name: '酸辣湯',   cost: 15, refPrice: 35, minPrice: 25, maxPrice: 45 },
  { id: 'soymilk',   name: '豆漿',     cost: 8,  refPrice: 25, minPrice: 15, maxPrice: 35 },
  { id: 'tea',       name: '紅茶',     cost: 8,  refPrice: 25, minPrice: 15, maxPrice: 35 },
];
// 鍋貼類（每日任務「賣出 30 份鍋貼」用）
export const GYOZA_IDS = ['signature', 'chive', 'corn'];
```

客人包裡的 `wants`、`hates` 寫**中文菜名**（學生看得懂）；`validateCustomers.js` 負責把中文菜名對應到 `id`。

### 3.3 `days.js`

```js
export const DAYS_DATA = [
  { day: 1, event: '晴天・開幕日', eventPct: 100, forecast: '開幕第一天，附近的上班族和學生會來探探。',
    task: { id: 'zero-waste', text: '零報廢', bonus: 100 } },
  { day: 2, event: '下雨', eventPct: 80, forecast: '明天下雨，客人變少，但外送員會來躲雨，想喝點熱的。',
    task: { id: 'no-soldout-leave', text: '沒有任何客人因為賣完而什麼都沒買', bonus: 150 } },
  { day: 3, event: '晴天・團購', eventPct: 100, forecast: '校園排球隊訂了團購，他們最愛招牌鍋貼。',
    task: { id: 'gyoza-30', text: '單日賣出 30 份以上鍋貼（三種合計）', bonus: 150 } },
  { day: 4, event: '期中考週', eventPct: 110, forecast: '期中考週，熬夜的學生變多了，吃素的學妹也會來。',
    task: { id: 'stars-4', text: '打烊後星等達到 4 顆以上', bonus: 150 } },
  { day: 5, event: '發薪日', eventPct: 120, forecast: '發薪日！大家都比較捨得花錢。',
    task: { id: 'profit-800', text: '單日淨利 800 元以上（不含獎金）', bonus: 200 } },
];
```

### 3.4 客人包（`customers/*.json`）

```json
[
  {
    "name": "上班族",
    "intro": "午休只有一小時",
    "budget": 100,
    "wants": ["招牌鍋貼", "紅茶"],
    "hates": null,
    "days": [1, 2, 3, 4, 5],
    "count": 10,
    "lines": {
      "bought": "…",
      "hated_on_menu": "…",
      "not_on_menu": "…",
      "sold_out": "…",
      "too_expensive": "…"
    }
  }
]
```

| 檔案 | 內容 |
|---|---|
| `default.json` | 三位路人，台詞全部是 `"……"`。路人甲：預算 100、想吃招牌鍋貼；路人乙：預算 80、想吃韭菜鍋貼和紅茶；路人丙：預算 60、想吃豆漿。三位都是第 1～5 天、每天 10 人、沒有討厭的東西 |
| `official.json` | 老師版規則書「官方客人包」的八種客人，**排列順序不可變**；台詞與介紹在開發時補上，每句 ≤ 20 字 |
| `my-customers.json` | 開課時是 `[]`。學生用 Skill 產生後寫入這裡 |

### 3.5 遊戲狀態（只存在 React state，不持久化）

```js
{
  mode: 'normal' | 'jump',     // jump = 跳關練習，不列入排行榜
  day: 1,                      // 1～5；6 代表已結算
  cash: 2000,
  stars: 3,
  history: [ /* 每天的 DayReport */ ],
  packId: 'default' | 'official' | 'mine' | 'imported',
  importedPack: null           // 匯入的客人包，只在這一場有效
}
```

### 3.6 玩家每天的決定 `Plan`

```js
{
  items: [ { id: 'signature', qty: 20, price: 70 }, … ],  // 1～4 筆，id 不可重複
  promoCost: 0 | 200 | 500
}
```

### 3.7 一天的結果 `DayReport`

```js
{
  day, startCash, startStars, plan,
  arrivals: [ { name, count } ],           // 每種客人實際來幾位
  visits: [ {                              // 依進店順序，一位客人一筆
    name, entered: true|false,
    bought: [ { id, price } ],
    outcome: 'bought' | 'hated_on_menu' | 'not_on_menu' | 'sold_out' | 'too_expensive',
    satisfaction: 'satisfied' | 'neutral' | 'unsatisfied' | null,   // 沒進門是 null
    line: string | null                    // 說話泡泡；洞 6 沒填時是 null
  } ],
  sold: { [id]: number }, waste: { [id]: number }, wasteTotal,
  revenue, stockCost, promoCost, wasteFee,
  satisfied, neutral, unsatisfied, entered,
  starsBefore, starsAfter,
  task: { id, text, bonus, status: 'done' | 'failed' | 'wip' },
  profit,                                  // 不含獎金
  endCash
}
```

---

## 4. 遊戲邏輯（`engine.js` 與 `rules/*.js`）

### 4.1 共通要求

- 全部是**純函式**：不讀寫檔案、不碰 DOM、不用 `Math.random`、不用 `Date`
- 可以被 Node 直接 `import`（給 `check-rules.mjs` 用），所以不 import React、不 import CSS
- 客人包由呼叫端傳入，不在邏輯檔裡 `import` JSON

### 4.2 `engine.js`：`simulateDay(state, plan, pack)` 的固定順序

1. **開店**：`stockCost = Σ(cost × qty)`。開店時只檢查付不付得起，資金在打烊時才結算：`endCash = startCash + profit + 獎金`
2. **來客數**：對 `pack` 裡 `days` 含今天的每種客人，
   `實際人數 = Math.round(count × starPct(stars) × eventPct × (100 + promoPct) / 1,000,000)`
   （全部用整數百分比；`Math.round` 對正數是四捨五入）
3. **進店順序**：輪流排隊（第 1 種第 1 位、第 2 種第 1 位、…、第 1 種第 2 位…），種類順序 = 客人包裡的順序
4. **每位客人**：
   1. `hates` 有上架 → `entered: false`、`outcome: 'hated_on_menu'`，不計滿意度
   2. 依序看 `wants`：呼叫 **`rules/sales.js` 的 `tryBuy()`** 判斷能不能買；能買就扣庫存、扣剩餘預算、加營收
   3. 依結果決定 `outcome`（有買到 → `bought`；否則 = 第一個失敗原因）
   4. 滿意度：買到第一順位且價格 ≤ 建議售價 → `satisfied`；有買到其他 → `neutral`；都沒買 → `unsatisfied`
   5. 呼叫 **`rules/speech.js` 的 `pickLine()`** 決定台詞
5. **打烊**：剩貨全部報廢；呼叫 **`rules/money.js`** 算清潔費與當日淨利
6. **口碑**：呼叫 **`rules/reputation.js` 的 `updateStars()`**
7. **任務**：呼叫 **`rules/tasks.js` 的 `checkTask()`**；達成就把獎金加進資金
8. 回傳新狀態與 `DayReport`

### 4.3 五個洞（`rules/*.js`）

每個檔案的開頭有一段註解，**只寫「這個檔案負責什麼、對應規則書哪一節、怎麼驗收」，不寫哪裡有洞**，讓學生自己玩出 bug：

```js
// 成交規則：客人想買的這一樣，買不買得到？
// 對應規則書：「客人怎麼決定買不買」
// 驗收：npm run check 的「成交規則」
```

`npm run check` 的分區也用規則名稱（成交規則、收支規則…），不用「洞 N」。

| 洞 | 檔案與函式 | 掉漆版的行為（`main` 起始版） | 完成版的行為 |
|---|---|---|---|
| 1 成交條件 | `sales.js` → `tryBuy({ item, stockLeft, price, budgetLeft })` 回傳 `{ ok, reason }` | 只檢查有沒有上架和預算，**不檢查庫存**，庫存可以變成負數（超賣） | 庫存 ≤ 0 時回傳 `{ ok: false, reason: 'sold_out' }` |
| 2 收支計算 | `money.js` → `wasteFee(wasteTotal)`、`dailyProfit({ revenue, stockCost, promoCost, wasteFee })` | `wasteFee` 永遠回傳 0；`dailyProfit` 只回傳 `revenue`。資金只靠 `dailyProfit` 變動（開店時不另外扣錢），所以人人都很有錢 | 依規則書階梯計費；淨利 = 收入 − 備貨 − 宣傳 − 清潔費 |
| 3 口碑星等 | `reputation.js` → `updateStars({ stars, satisfied, neutral, unsatisfied })` | 永遠回傳原本的 `stars` | 依規則書的五條判定，以 0.5 為單位，夾在 1～5 |
| 4 每日任務 | `tasks.js` → `checkTask(task, report)` 回傳 `'done' \| 'failed' \| 'wip'` | 永遠回傳 `'wip'`，畫面顯示「施工中」 | 依 `days.js` 的任務判定 |
| 6 說話泡泡 | `speech.js` → `pickLine(customer, outcome)` | 永遠回傳 `null`，客人默默進出 | 回傳 `customer.lines[outcome]` |

洞 5（客人資料）是資料，不是程式：`my-customers.json` 開課時是 `[]`，由學生用 Skill 產生。
洞 7（升級商店）只做按鈕：點了顯示「尚未開放」，由學生最後自己寫規格。

**掉漆版的安全要求**：庫存變負數時，報廢量以 0 計；任何洞沒填都不能讓畫面壞掉。

---

## 5. 畫面（`GameShop.jsx`）

### 5.1 版面（由上到下）

| 區塊 | 內容 |
|---|---|
| 狀態列 | 第 N 天／5、資金、星等（顯示半顆星）、模式標籤（跳關時顯示「練習模式・不列入排行」）、常駐小字「進度會在重新整理後重置」 |
| 客人包選擇 | 下拉選單：預設路人／官方標準關／我的客人包／匯入的客人包；「匯入客人包」按鈕打開貼上框，貼上後先跑 `validateCustomers`，不合格列出原因、不載入。**選擇只能在第 1 天開店前改** |
| 預告卡 | 當天的事件名稱與預告文字 |
| 今日決定 | 六樣菜的卡片，每張有「上架」勾選、份數、定價（顯示可定價範圍與建議售價）；宣傳費三選一；即時顯示「備貨成本＋宣傳費」與「合計份數／80」 |
| 檢查訊息 | `validatePlan` 的錯誤，全部列出（中文） |
| 開始營業 | 有錯誤時不能按 |
| 營業過程 | 客人卡片一位一位出現（每位約 250 毫秒），顯示名字、買了什麼，有台詞就冒泡泡；「略過動畫」按鈕 |
| 打烊報表 | 收入、備貨成本、宣傳費、報廢份數與清潔費、任務結果（施工中／達成／未達成）、星等變化、當日淨利；「進入下一天」按鈕 |
| 結算畫面 | 第 5 天之後顯示：最終資金、五天總報廢、最終星等、任務達成數；「再玩一次」按鈕 |
| 工具列 | 「重新開始」、「跳關」（選第 1～5 天，以 1,000 元、3 顆星開始）、「升級商店」（點了顯示「尚未開放」） |

### 5.2 `validatePlan` 的檢查（錯誤訊息用中文）

| 檢查 | 訊息範例 |
|---|---|
| 上架 1～4 樣 | 「最多只能上架 4 樣，你選了 5 樣」 |
| 份數是 0 以上整數 | 「招牌鍋貼的份數要是 0 以上的整數」 |
| 合計 ≤ 80 份 | 「今天合計 92 份，超過每日產能 80 份」 |
| 定價是範圍內整數 | 「玉米鍋貼的定價要在 60～100 元之間」 |
| 宣傳費是 0／200／500 | 「宣傳費只能選 0、200、500 元」 |
| 備貨成本＋宣傳費 ≤ 資金 | 「備貨 1,850 元＋宣傳 500 元＝2,350 元，超過現有資金 2,000 元」 |

### 5.3 給瀏覽器 MCP 與測試員 Agent 用的標記

所有可操作與要驗收的元素都加 `data-testid`，名稱固定：

```text
status-day  status-cash  status-stars  status-mode
pack-select  pack-import-open  pack-import-text  pack-import-submit  pack-import-errors
forecast
dish-<id>-toggle  dish-<id>-qty  dish-<id>-price      （<id> 是 menu.js 的 id）
promo-0  promo-200  promo-500
plan-errors  open-shop
skip-animation  visit-<n>  visit-<n>-line
report  report-revenue  report-stock-cost  report-promo  report-waste  report-waste-fee
report-task  report-stars  report-profit  next-day
final  final-cash  final-waste  final-stars  final-tasks  play-again
restart  jump-select  jump-start  upgrade-shop
```

### 5.4 首頁

- 保留 `HomePage` 結構與 `brand.name`、`brand.heroImage`
- `data.js` 其他文案改成新課程：主題是「用 AI 接手一家鍋貼店遊戲」，課程模組列出 Skill、MCP、Agent
- 導覽列：「首頁」「開店」

---

## 6. 自動驗收 `npm run check`

`web-lab/scripts/check-rules.mjs`：只用 Node 內建功能，直接 import `src/game/` 的純函式，跑固定案例，逐條印出 PASS／FAIL，最後印出各洞摘要。

| 區塊 | 案例 |
|---|---|
| 引擎（老師檔） | 同一組輸入跑兩次結果完全相同；三位路人、第 1 天各來 10 位；進店順序是輪流；`hates` 有上架的客人不進門 |
| 洞 1 成交 | 招牌鍋貼備 10 份、12 位想吃招牌的客人 → 賣出 10 份、2 位 `sold_out` |
| 洞 2 收支 | 報廢 0、5、6、15、16、20 份 → 清潔費 0、0、3、30、83、95 元；收入 1,000、備貨 600、宣傳 200、清潔費 95 → 淨利 105 |
| 洞 3 口碑 | 滿意 8／10 → +1；6.5／10 → +0.5；5／10 且不滿 1／10 → 不變；2／10 → −0.5；1／10 → −1；不滿 4／10 → −1；5 顆 +1 仍是 5；1 顆 −1 仍是 1；沒人進店 → 不變 |
| 洞 4 任務 | 五天各一組達成、一組未達成的報表 |
| 洞 6 泡泡 | 五種 `outcome` 各回傳對應台詞 |
| 客人包檢查 | 官方包通過；預算 200、菜單外的「咖哩鍋貼」、同名客人、單日合計 51 人各被擋下 |
| 硬規則 | 掃描 `src/`：不得出現 `localStorage`、`sessionStorage`、`indexedDB`、`document.cookie`、`fetch(`、`XMLHttpRequest`、`Math.random`；`src/game/` 不得用 `Date` |

`main` 起始版跑 `npm run check`：引擎 6／6、客人包檢查 7／7、硬規則 8／8 全部 PASS；成交 3／6、收支 2／8、口碑 4／11、每日任務 0／10、說話 0／5。完成版 61／61 全部 PASS。腳本一律以結束碼 0 結束，避免 npm 印出嚇人的錯誤訊息。

---

## 7. Skill、MCP、Agent

### 7.1 Skill（`.claude/skills/<名稱>/SKILL.md`）

| # | 名稱 | 給學生的版本 | 安排 |
|---|---|---|---|
| S1 | `new-customers` 客人資料製作 | 挖空模板：主題、預算範圍理由、自訂檢查規則、多一條禁止事項標 ★ | 必做 |
| S2 | `playtest` 遊戲驗證 | 老師版完整可用；學生在「測試案例」區加入自己的案例 | 必做 |
| S3 | `change-feature` 功能修改流程 | 先讀 → 計畫 → 最小範圍修改 → 跑 `npm run check` → 固定格式回報 | 老師提供 |
| S4 | `git-verify` | 沿用舊版，路徑改成新專案 | 老師提供 |
| S5 | `review-diff` | 沿用舊版，允許修改清單改成 `rules/` | 老師提供 |
| S6 | `write-spec` 規格撰寫 | 把一句話需求整理成規格書（升級商店用） | 延伸 |
| S7 | `new-events` 營業事件製作 | 產生事件資料（延伸玩法） | 延伸 |

### 7.2 MCP

- 只設定 `chrome-devtools`（舊版 `.mcp.json` 已有），讓 AI 打開 `http://localhost:5180`、操作、讀 console、截圖
- 移除 `context7`，減少學生要裝的東西
- 保底：MCP 裝不起來時，學生手動照測試案例操作並截圖；MCP 學習項目由老師示範補做

### 7.3 Agent（`.claude/agents/<名稱>.md`，Claude Code subagent）

設定檔只用 `name`、`description` 兩個欄位，**不設定 `tools` 欄位**，讓 Agent 繼承所有工具（包含瀏覽器 MCP）。「不准改檔」寫在 Agent 的指示裡，由學生在驗收時用 `git status` 確認 Agent 真的沒改檔。理由：限制工具清單需要寫出 MCP 工具的完整名稱，學生電腦上的版本不同可能對不上，Agent 就會用不到瀏覽器。

| # | 名稱 | 職責 | 可用工具 | 安排 |
|---|---|---|---|---|
| A1 | `tester` 測試員 | 用 S2 和瀏覽器 MCP 照測試案例操作遊戲，回報步驟／預期／實際／是否通過；**不准修改任何檔案** | 讀檔、瀏覽器 MCP | 必做（挖空模板：職責、可用工具、多一條禁止事項、多一個回報欄位） |
| A2 | `question-setter` 出題 | 用 S1 產生刁鑽客人包，先用 `npm run check` 確認格式合格，再試玩確認不是無解題 | 讀寫 `my-customers.json`、瀏覽器 MCP | 延伸 |
| A3 | `ai-manager` AI 店長 | 用瀏覽器 MCP 自己玩五天，嘗試不同策略，回報最好的一組 | 瀏覽器 MCP | 延伸／老師示範 |

### 7.4 老師與助教材料（不放進學生拿到的版本）

- 各 Skill／Agent 模板的填好範例
- 助教手冊：檢查規則四種類型範例、MCP 與 Agent 提示，分三層給提示
- 存放位置見 §9 的待決定事項

---

## 8. 根目錄文件

| 檔案 | 內容重點 |
|---|---|
| `README.md` | 這是什麼專案、怎麼啟動、資料夾地圖 |
| `START-HERE.md` | 學生入口：啟動步驟、遊戲規則書連結、各關入口（課程流程定案後補） |
| `AGENTS.md` | AI 守則：先讀、先計畫、最小範圍改、固定回報；允許修改 `src/game/rules/`、`customers/my-customers.json`、`data.js` 與首頁圖片、`docs/specs/`、`docs/drafts/`（各關再細分）；永遠禁止：新增套件、改老師檔、改驗收腳本、加任何存檔或連網功能 |
| `CLAUDE.md` | 先讀 AGENTS.md；可用 skills／agents 清單；驗收指令 `npm run check`；規則書在 `docs/RULES.md` |

---

## 9. 版本與交付方式

| 項目 | 做法 |
|---|---|
| `main` | 學生起始版（第 0 關，全部的洞都是掉漆版） |
| `legacy-original` | 翻新前的舊版，回溯用 |
| 換關用的起始版 | 課程流程定案後，在「解完第 N 個洞」的狀態開分支 `checkpoint-N`。GitHub 的分支頁面可以直接下載 zip，卡關的學生下載下一關的 zip |
| 教師完成版 | `solution` 分支：所有洞都填好、範例客人包、本規格書、`teacher/` 底下的助教手冊與填好的模板 |
| 待決定 | repo 若要公開給學生下載，`solution` 分支學生也看得到；正式上課前建議把 `solution` 分支搬到另一個私有 repo |

---

## 10. 已知要回頭修的舊教材

| 位置 | 問題 |
|---|---|
| 「VSCode 教學 - 2」資料夾猜謎 | 答案提到「U1 到 U4 是四堂課的講義資料夾」 |
| `U0/STEP-03-this-project.md` | 資料夾地圖列出已刪除的 lab 資料夾與 U2～U4 |
| `U1/STEP-01.md`、`U1/README.md` | 提到四個頁面（備料控制台、訂單看板、LINE 推播中心） |

---

## 11. 完成的定義

1. `npm install`、`npm run dev` 正常，開店頁從第 1 天玩到結算，console 沒有錯誤
2. `npm run build` 通過
3. `main` 的 `npm run check`：引擎、客人包檢查、硬規則 PASS，五個洞 FAIL
4. `solution` 分支的 `npm run check` 全部 PASS
5. 用瀏覽器實際操作 `main` 和 `solution` 各一輪，截圖確認掉漆版與完成版的差異
6. 用官方客人包重跑平衡測試，數字與老師版規則書一致（不一致就更新規則書）
7. 舊 repo 沒有任何改動
