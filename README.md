# ai-course-gyoza-game

AI coding 課的練習專案：**GYOZA WOOD 鍋貼店經營遊戲**（半成品）。

這不是一堂遊戲設計課。遊戲只是練習場：你要學的是讓 AI 照你的規則修好它（Skill）、讓 AI 看得到它（MCP）、交給 AI 一份完整的工作（Agent）。

**從這裡開始：[`START-HERE.md`](./START-HERE.md)**

## 快速啟動

```bash
cd web-lab
npm install
npm run dev      # 打開 http://localhost:5180
npm run check    # 自動驗收：看看哪些規則已經照規則書運作
```

Windows 也可以雙擊 `start-m11.bat`，macOS 雙擊 `start-m11.command`。

## 資料夾地圖

```text
ai-course-gyoza-game/
  START-HERE.md        學生入口
  AGENTS.md            給所有 AI 的工作守則
  CLAUDE.md            給 Claude Code 的補充
  .mcp.json            MCP 設定（chrome-devtools）
  .claude/skills/      Skill：寫給 AI 的工作守則
  .claude/agents/      Agent：交給 AI 的整份工作
  docs/
    RULES.md           遊戲規則書（以這份為準）
  U0/ U1/              先修講義：看懂檔案結構、Git 與 VS Code
  web-lab/             遊戲本體（React + Vite）
    src/game/rules/    ← 遊戲規則，一個檔一條規則
    src/game/customers/← 客人包
    scripts/           自動驗收腳本
```

## 需要的工具

- Node.js 18 以上
- VS Code
- Git / GitHub
- Claude Code
