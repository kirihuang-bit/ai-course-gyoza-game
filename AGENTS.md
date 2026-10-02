# AGENTS.md ｜ AI 工作守則（所有 coding agent 都要遵守）

這個專案是教學用的「GYOZA WOOD 鍋貼店經營遊戲」半成品。
你（AI）是助理，人是店長。違反任何一條都要先停下來回報。

## 工作順序（固定）

1. **先讀**：修改前先讀本守則、`docs/RULES.md`（規則書）和要改的檔案，不要邊讀邊改
2. **先計畫**：用 `change-feature` skill 的計畫格式回報，等人核准
3. **最小範圍改**：只改允許修改的檔案
4. **驗收**：在 `web-lab` 執行 `npm run check`，修改前後各跑一次
5. **固定回報**：用 `change-feature` skill 的回報格式；人驗收過才算完成

## 規則書最大

`docs/RULES.md` 是遊戲規則的唯一標準。程式和規則書不一樣，就是程式錯，要改程式，不是改規則書。

## 允許修改的檔案

| 路徑 | 什麼時候改 |
|---|---|
| `web-lab/src/game/rules/*.js` | 修正遊戲規則（一個檔一條規則） |
| `web-lab/src/game/customers/my-customers.json` | 用 `new-customers` skill 產生自己的客人 |
| `web-lab/src/data.js`、`web-lab/public/images/` | 改首頁店名、換首頁照片 |
| `web-lab/plans/*.json` | AI 店長的經營策略檔（給試算工具用） |
| `.claude/skills/`、`.claude/agents/` 裡標 ★ 的欄位 | 填 Skill 與 Agent 模板 |
| `docs/specs/`、`docs/drafts/` | 寫規格書、草案 |

**沒列到的檔案一律不可改**；真的需要改，先停下來說明理由，等人決定。

**回家作業的例外**：在學生自己的作業分支（例如 `homework/upgrade-shop`）上，可以修改已確認的規格書（`docs/specs/*.md`）「要新增或修改的檔案」裡列出的檔案，包括老師檔。`web-lab/scripts/check-rules.mjs`、`web-lab/scripts/simulate.mjs` 仍然不可改，`npm run check` 原本的檢查必須全部通過。詳見 `docs/HOMEWORK.md`。

## 永遠禁止

- 修改老師檔：`config.js`、`menu.js`、`days.js`、`engine.js`、`validatePlan.js`、`validateCustomers.js`、`packs.js`、`GameShop.jsx`、`InventoryPage.jsx`、`web-lab/src/App.jsx`、`web-lab/scripts/check-rules.mjs`、`web-lab/scripts/simulate.mjs`
- 為了讓 `npm run check` 通過而修改測試、或把答案寫死
- 新增 npm 套件；修改 `package.json`、`package-lock.json`
- 加任何存檔或連網功能（`localStorage`、`sessionStorage`、`indexedDB`、`fetch` 等）；遊戲必須每次打開都回到初始狀態
- 重構、「順便」整理程式碼、加沒被要求的功能
- 執行 `git reset --hard`、`git checkout -- .`、`git clean` 等會丟掉改動的指令

## 完成的定義

> AI 做出來不算完成。通過驗收才算完成。
> 驗收包含：**遊戲畫面 ／ `npm run check` ／ `git diff` ／ 人的確認**。
