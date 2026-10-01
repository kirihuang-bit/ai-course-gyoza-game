---
name: change-feature
description: 要讓 AI 修改鍋貼店遊戲的規則或功能時使用。先讀、先計畫、等人核准、最小範圍修改、跑 npm run check、用固定格式回報。
---

# 功能修改流程

## 固定順序

1. **先讀**：讀 `AGENTS.md`、要改的 `rules/` 檔案、規則書相關段落。不要邊讀邊改
2. **先計畫**：用下面的「計畫格式」回報，**等使用者說可以才動手**
3. **最小範圍修改**：只改計畫裡列出的檔案；不重構、不順便整理、不加沒被要求的功能
4. **驗收**：在 `web-lab` 執行 `npm run check`，修改前後各跑一次，比較結果
5. **回報**：用下面的「回報格式」

## 計畫格式

```text
A. 我理解的需求：
B. 規則書怎麼說（引用原文）：
C. 要改的檔案（只能是 AGENTS.md 允許的檔案）：
D. 打算怎麼改（用白話說）：
E. 怎麼驗收（npm run check 的哪幾條會從 FAIL 變 PASS）：
F. 風險（可能影響到什麼）：
```

## 回報格式

```text
A. 改了哪些檔案：
B. 改了什麼（白話）：
C. npm run check 修改前 → 修改後：
D. 有沒有原本 PASS 變成 FAIL 的項目：
E. 下一步建議：
```

## 絕對不准

- 改 `config.js`、`menu.js`、`days.js`、`engine.js`、`validatePlan.js`、`validateCustomers.js`、`packs.js`、`GameShop.jsx`、`scripts/check-rules.mjs`、`scripts/simulate.mjs`
- 為了讓測試通過而修改測試、或把答案寫死
- 新增套件、修改 `package.json`
- 加任何存檔功能（localStorage 等）
