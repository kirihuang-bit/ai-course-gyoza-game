# START HERE ｜ GYOZA WOOD 鍋貼店經營遊戲

你接手了一家鍋貼店遊戲。它**開局就能玩，但玩起來怪怪的**。

你的任務不是學做遊戲，而是學會用 AI 把它修好、幫你測試它、最後替你經營它。

## 第一步：讓遊戲跑起來

```bash
cd web-lab
npm install
npm run dev
```

看到 `Local: http://localhost:5180/`，用瀏覽器打開，點上方的「開店」。

## 第二步：玩一次

1. 讀 [`docs/RULES.md`](./docs/RULES.md)（規則書）
2. 從第 1 天玩到第 5 天結算
3. 一邊玩一邊想：**有哪些地方跟規則書寫的不一樣？**

> 遊戲的表現和規則書不一樣時，以規則書為準。

## 第三步：自動驗收

```bash
cd web-lab
npm run check
```

它會用固定的案例檢查每一條規則，告訴你哪些已經照規則書運作、哪些還沒有。

## 接下來

各關的講義會陸續放進這個資料夾。在那之前，先熟悉三件事：

| 你會用到的 | 在哪裡 |
|---|---|
| 給 AI 的工作守則 | `AGENTS.md` |
| Skill（寫給 AI 的 SOP） | `.claude/skills/` |
| Agent（交給 AI 的整份工作） | `.claude/agents/` |

## 安全三句

1. 遊戲不會存檔，重新整理就回到第 1 天，這是設計好的
2. AI 只能改 `AGENTS.md` 允許的檔案；它想改別的，先停下來想一想
3. AI 說做完了不算：看畫面、跑 `npm run check`、看 `git diff`，你確認過才算
