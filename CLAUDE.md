# CLAUDE.md ｜ Claude Code 專用補充

**先讀 `AGENTS.md`**（AI 工作守則），本檔只補充 Claude Code 特有事項。

## 這個專案

教學用的「GYOZA WOOD 鍋貼店經營遊戲」半成品。遊戲開局就能玩，但有些規則還沒照規則書運作。

- 啟動：`cd web-lab && npm run dev`（http://localhost:5180）
- 驗收：`cd web-lab && npm run check`
- 建置：`cd web-lab && npm run build`
- 試算：`cd web-lab && npm run simulate -- plans/example-even.json`（一次算完五天，給 AI 店長用）
- 規則書：`docs/RULES.md`（遊戲規則以這份為準）

遊戲完全在瀏覽器裡跑，沒有後端、不存檔、不寫檔案。遊戲規則集中在 `web-lab/src/game/rules/`，一個檔一條規則。

## 可用的 skills（`.claude/skills/`）

| Skill | 什麼時候用 |
|---|---|
| `change-feature` | 修改遊戲規則或功能 |
| `new-customers` | 產生自己的客人包 |
| `playtest` | 照測試案例驗證遊戲 |
| `git-verify` | 改完要存檔（commit） |
| `review-diff` | 檢查 AI 這次改了什麼 |
| `pricing-rules` | 決定每樣菜的定價（AI 店長用） |
| `result-review` | 讀試算結果、提出下一版策略（AI 店長用） |
| `demand-estimate` | （選做）估計每樣菜要備幾份（AI 店長用） |
| `reorder-check` | 讀試算結果的倉庫盤點，列出補貨清單 |
| `write-spec` | 只有一句話的需求，先寫成規格書 |
| `new-events` | （延伸）設計新的營業事件草案 |

## 可用的 agents（`.claude/agents/`）

| Agent | 職責 |
|---|---|
| `tester` | 測試員：照 `playtest` 案例操作遊戲並回報，不改檔案 |
| `question-setter` | （延伸）出題關：設計刁鑽但合規的客人包 |
| `ai-manager` | AI 店長：用 Skill 規劃策略、用試算工具找最佳解、用瀏覽器驗證 |

## MCP

`.mcp.json` 設定了 `chrome-devtools`，讓 Claude 能打開 http://localhost:5180、操作遊戲、讀 console、截圖。第一次打開專案時 Claude Code 會詢問是否啟用。
