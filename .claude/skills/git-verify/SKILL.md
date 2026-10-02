---
name: git-verify
description: 一次修改完成、要驗收與存檔時使用。引導 git status → git diff → 確認範圍 → add → commit，並產生清楚的 commit 訊息。不主動執行會丟改動的指令。
---

當一次修改完成、要驗收存檔時,照這個順序帶使用者走:

1. `git status` —— 看**動了哪些檔**(最好只有預期的那幾個)
2. `git diff` —— 看**每一行怎麼變**(綠加紅刪);逐檔用白話說明
3. 判斷範圍:有沒有動到不相關的檔?有沒有新增套件、動設定檔?
   - 若有越界 → 建議 `git restore <檔>` 還原該檔,不要 commit
4. 範圍 OK → `git add .`
5. 產生一句清楚的 commit 訊息(動詞開頭、講改了什麼),例如
   `git commit -m "修正成交規則：賣完就買不到"`
6. `commit` 前請使用者最後確認一次 diff

**安全規則**:不要主動執行 `reset --hard`、`checkout .`、`clean` 這類會丟掉改動的指令;要用時先說明後果、等使用者同意。

**保底**:不是 Git 專案(`not a git repository`)→ 先 `git init`;第一次 commit 要求身分 → 照提示設定 `user.name` / `user.email` 後重 commit。
