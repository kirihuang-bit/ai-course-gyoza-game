---
name: review-diff
description: 檢視一次 AI 修改的 git diff 時使用。逐檔說明改了什麼、抓出越界修改與可疑變更，只檢視不修改，給出「可否放心 commit」的結論。
---

當使用者要你檢視這次修改時,**只做檢視、不要改任何檔**。

先跑 `git status` 和 `git diff`,然後逐檔回報:

1. 這次動到**哪些檔案**
2. 每個檔「**加了什麼、刪了什麼**」(用白話,不要貼整段程式)
3. 有沒有**越界修改** —— 改到跟本次任務無關的檔案或區塊?對照 `AGENTS.md` 的允許修改清單:原則上只能動 `web-lab/src/game/rules/` 與 `web-lab/src/game/customers/my-customers.json`
4. 有沒有**可疑變更** —— 刪掉看起來重要的東西、偷加套件、動了設定檔或 `.env`、改了 `scripts/check-rules.mjs`(改測試讓它通過)、把答案寫死、加了 localStorage 之類的存檔功能?
5. **結論**:可不可以放心 commit?
   - 可以 → 建議 commit 訊息一句
   - 不行 → 指出該還原哪個檔(`git restore <檔>`)、原因是什麼

這支 skill 是「AI 改完的第一道關」:先看清楚它動了什麼,再決定要不要收下。

**保底**:diff 太長看不完 → 先聚焦「這次任務**應該**動的檔」,其餘檔案只要出現就標為可疑、請使用者確認。
