# Skill 使用指南（講師與助教用）

> 列出專案 `.claude/skills/` 裡的 10 個 Skill：**什麼時候用、學生怎麼呼叫、哪些檔案會自己呼叫它**。
> 只放在 `solution` 分支，學生版沒有這份。
> 最後更新：2026-10-02

---

## 一、先搞懂：Skill 在 Claude Code 裡怎麼被叫起來

| 方式 | 學生怎麼做 | 什麼時候適合 |
|---|---|---|
| **① 斜線指令** | 在 Claude Code 對話框打 `/` 加 Skill 名稱，例如 `/change-feature 修收支規則` | 最穩定。課堂示範、學生第一次用時建議用這個 |
| **② 指名道姓** | 用一般句子提到 Skill 名稱，例如「請用 change-feature 修收支規則」 | 簡報上的寫法。效果跟 ① 差不多 |
| **③ 自動觸發** | 不提名稱，只描述要做的事，例如「幫我修收支規則」 | Claude 會比對每個 Skill 檔開頭的 `description`，覺得符合就自己載入。**不保證一定會觸發** |
| **④ 由 Agent 呼叫** | 學生叫 Agent，例如「請用 tester agent 測試遊戲」 | Agent 的說明檔寫了要用哪個 Skill，Agent 執行時會自己去載入，學生不用另外叫 |

**助教常見判斷**：學生說「AI 沒照 Skill 做」，十之八九是用了 ③、Claude 沒觸發。請學生改用 ① 或 ② 再試一次。

**怎麼確認 Skill 有被載入**：Claude Code 的回覆裡會出現讀取該 Skill 的紀錄；或看它的回報格式有沒有照 Skill 寫的格式（例如 `change-feature` 的 A～F 計畫）。

---

## 二、總覽

| Skill | 一句話用途 | 類型 | 會改檔案嗎 | 第一次用的時間 | 誰會自己呼叫它 |
|---|---|---|---|---|---|
| `change-feature` | 讓 AI 修改遊戲規則或功能 | 完整版 | 會 | 第 1 天下午 | `write-spec`（寫完規格交給它）、`tester` Agent 的選項（是陷阱，不該勾）、`ai-manager` Agent 的選項 |
| `git-verify` | 改完要存檔（commit） | 完整版 | 會（只做 git） | 簡報尚未安排，建議第 1 天下午 | 沒有 |
| `review-diff` | 檢查 AI 這次改了什麼 | 完整版 | 不會 | 簡報尚未安排，建議第 1 天下午 | 沒有 |
| `new-customers` | 產生自己的客人包 | ★模板 | 會（只寫 `my-customers.json`） | 第 2 天上午 | `question-setter` Agent、`tester` Agent 的選項（是陷阱，不該勾） |
| `reorder-check` | 讀倉庫盤點，算明天每樣菜備幾份 | ★模板 | 不會 | 第 2 天（簡報頁尚未補） | `ai-manager` Agent |
| `playtest` | 照測試案例驗證遊戲 | ★模板（部分） | 不會 | 第 3 天上午 | `tester` Agent |
| `pricing-rules` | 決定每樣菜的定價 | ★模板 | 不會 | 第 3 天下午 | `ai-manager` Agent |
| `result-review` | 讀試算結果，提出下一版策略 | ★模板 | 會（只寫 `plans/` 的新策略檔） | 第 3 天下午 | `ai-manager` Agent、`reorder-check`（交接：要改策略交給它） |
| `write-spec` | 一句話需求先寫成規格書 | 完整版 | 會（只寫 `docs/specs/`） | 回家作業 | 沒有（寫完會交給 `change-feature`） |
| `new-events` | 設計新的營業事件草案 | 完整版 | 會（只寫 `docs/drafts/`） | 課後延伸 | 沒有 |

**類型說明**

- **完整版**：老師已經寫好，學生直接用，重點是看懂它的結構。
- **★模板**：挖空的模板，學生要先填完標 ★ 的欄位才能用。填好的參考答案在 `teacher/examples/`。

---

## 三、時間軸：三天裡每個 Skill 出現在哪

| 天 | 段落 | Skill | 學生在做什麼 |
|---|---|---|---|
| 第 1 天下午 | 第一次用 Skill | `change-feature` | 打開 SKILL.md 看五個區塊，再用它修收支規則：看計畫 → 核准 → check → diff → commit |
| 第 1 天下午 | 存檔 | `git-verify`、`review-diff`（建議加入） | 修完先用 `review-diff` 檢查 AI 有沒有越界，再用 `git-verify` commit |
| 第 2 天上午 | 連修三條規則 | `change-feature` | 一句話修一條：口碑、任務、說話 |
| 第 2 天 | 倉庫盤點 | `change-feature` → `reorder-check` | 先修倉庫盤點規則，再填 `reorder-check` 的 ★ 欄位，第一次寫「只讀不寫」的 Skill |
| 第 2 天上午 | 寫自己的 Skill | `new-customers` | 填 ★ 欄位 → 「請用 new-customers 幫我做一批客人」→ 看 3 位草案 → 確認後寫入 |
| 第 3 天上午 | 測試員 Agent | `playtest` | 看老師寫好的 T1～T7、補自己的測試案例；`tester` Agent 會自己呼叫它 |
| 第 3 天下午 | AI 店長 | `pricing-rules`、`result-review`（＋第 2 天寫好的 `reorder-check`） | 填 ★ 欄位；`ai-manager` Agent 會自己呼叫這三個 |
| 回家作業 | 升級商店 | `write-spec` → `change-feature` → `git-verify` | 一句話需求 → 規格書 → 實作 → 存檔、開 PR |
| 課後延伸 | 出題關 | `new-customers`（由 `question-setter` 呼叫） | 叫 Agent 出一包刁鑽的客人 |
| 課後延伸 | 新營業事件 | `new-events` | 產生五天事件草案 |

> **兩個待補的地方**：`git-verify`、`review-diff` 目前沒有出現在簡報腳本裡；`reorder-check` 第 2 天的約 5 頁簡報也還沒補。

---

## 四、逐一說明

### 1. `change-feature`：修改功能流程

| 項目 | 內容 |
|---|---|
| 檔案 | `.claude/skills/change-feature/SKILL.md` |
| 用途 | AI 修改遊戲規則的固定流程：先讀 → 先寫計畫（A～F）→ **等人核准** → 最小範圍修改 → 跑 `npm run check` → 用固定格式回報（A～E） |
| 時機 | 第 1 天下午第一次用（修收支規則）；第 2 天修其他四條規則；回家作業實作升級商店 |
| 學生怎麼呼叫 | `/change-feature 修收支規則`，或「請用 change-feature 修收支規則」 |
| 誰會自己呼叫 | `write-spec` 寫完規格書、使用者確認後，會交給它實作；`tester`、`ai-manager` Agent 模板裡有它的勾選項 |
| 會改的檔案 | `web-lab/src/game/rules/*.js`（回家作業分支可改規格書列出的檔案） |
| 驗收 | 回報裡有修改前後的 `npm run check` 數字；沒有原本 PASS 變 FAIL |
| 常見狀況 | AI 跳過計畫直接改 → 請學生回覆「請先照 change-feature 的計畫格式回報，等我核准」 |

### 2. `git-verify`：驗收與存檔

| 項目 | 內容 |
|---|---|
| 檔案 | `.claude/skills/git-verify/SKILL.md` |
| 用途 | 帶學生走 `git status` → `git diff` → 確認範圍 → `git add` → `git commit`，並產生清楚的 commit 訊息 |
| 時機 | 每次修改完成要存檔時。建議第 1 天第一次修好規則後介紹 |
| 學生怎麼呼叫 | `/git-verify`，或「請用 git-verify 幫我存檔」 |
| 誰會自己呼叫 | 沒有 |
| 安全規則 | 不會主動執行 `reset --hard`、`checkout .`、`clean` 這類會丟改動的指令 |
| 常見狀況 | 第一次 commit 要求身分 → 照提示設定 `user.name`、`user.email` |

### 3. `review-diff`：檢查 AI 改了什麼

| 項目 | 內容 |
|---|---|
| 檔案 | `.claude/skills/review-diff/SKILL.md` |
| 用途 | 只檢視、不修改。逐檔說明改了什麼，抓出越界修改（例如改到 `check-rules.mjs`、加了存檔功能），最後給「能不能放心 commit」的結論 |
| 時機 | AI 改完、commit 之前。建議跟 `git-verify` 一起在第 1 天介紹 |
| 學生怎麼呼叫 | `/review-diff`，或「請用 review-diff 檢查這次的修改」 |
| 誰會自己呼叫 | 沒有 |
| 常見狀況 | 助教看到學生的 diff 動到 `rules/` 以外的檔案，就請學生跑這個 Skill，讓 AI 自己指出該還原哪個檔 |

### 4. `new-customers`：客人資料製作（★模板）

| 項目 | 內容 |
|---|---|
| 檔案 | `.claude/skills/new-customers/SKILL.md` |
| 用途 | 依固定格式產生客人包：先給人看草案、確認後才寫入 `my-customers.json`，寫完跑格式檢查 |
| 學生要填的 ★ | 共 8 處：主題、預算範圍、自己加的檢查規則、自己加的禁止事項，每一項都要寫理由。參考答案：`teacher/examples/new-customers.filled.md` |
| 時機 | 第 2 天上午，學生第一個自己填的 Skill |
| 學生怎麼呼叫 | `/new-customers`，或「請用 new-customers 幫我做一批客人」 |
| 誰會自己呼叫 | `question-setter` Agent（出題關）；`tester` Agent 模板有它的勾選項，但測試員**不該勾**它 |
| 會改的檔案 | 只有 `web-lab/src/game/customers/my-customers.json` |
| 常見狀況 | AI 沒給草案就直接寫檔 → 這是好的教學時刻：Skill 裡寫了「先給人確認」，看 AI 有沒有照做 |

### 5. `reorder-check`：補貨檢查（★模板）

| 項目 | 內容 |
|---|---|
| 檔案 | `.claude/skills/reorder-check/SKILL.md` |
| 用途 | 讀倉庫盤點（`npm run simulate -- 策略檔 --json` 的 `inventory`，或瀏覽器的「倉庫盤點」頁），**先驗算**「報廢＝備貨−賣出」，再挑出缺貨與報廢過多的菜，算出建議備貨量 |
| 學生要填的 ★ | 共 6 處：建議量怎麼依明天的預告調整、連續缺貨或報廢怎麼提醒、多看的欄位、多加的檢查與禁止事項。參考答案：`teacher/examples/reorder-check.filled.md` |
| 時機 | 第 2 天，修好倉庫盤點規則之後；第 3 天 AI 店長再用一次 |
| 學生怎麼呼叫 | `/reorder-check plans/example-even.json`，或「請用 reorder-check 看範例策略的盤點」 |
| 誰會自己呼叫 | `ai-manager` Agent（決定下一版每樣菜備幾份） |
| 會改的檔案 | 不會改任何檔案 |
| 常見狀況 | ① 倉庫盤點規則還沒修：全部「正常」、建議 0，Skill 回報「沒有要補的」→ 資料錯了，不是 AI 錯。② 成交規則還沒修：出現「備 5 賣 10」，驗算步驟會抓到 |
| 備註 | 原本選做的 `demand-estimate` 已移除，由這個 Skill 取代 |

### 6. `playtest`：遊戲驗證（部分★模板）

| 項目 | 內容 |
|---|---|
| 檔案 | `.claude/skills/playtest/SKILL.md` |
| 用途 | 照固定測試案例操作遊戲（可用瀏覽器 MCP），逐案回報步驟、預期、實際、PASS／FAIL。只測試，不改檔 |
| 老師寫好的案例 | T1 不能超賣、T2 清潔費、T3 淨利有扣成本、T4 星等會變、T5 任務會判定、T6 客人會說話、T7 倉庫盤點會亮警示 |
| 學生要填的 ★ | 2 處：「我的測試案例」。參考答案：`teacher/examples/playtest-my-case.md` |
| 時機 | 第 3 天上午，做測試員 Agent 之前（簡報稱它為測試員的「食譜卡」） |
| 學生怎麼呼叫 | `/playtest`，或「請用 playtest 測試 T1 到 T7」。通常不直接叫，而是透過測試員 Agent |
| 誰會自己呼叫 | `tester` Agent |
| 會改的檔案 | 不會 |

### 7. `pricing-rules`：定價心法（★模板）

| 項目 | 內容 |
|---|---|
| 檔案 | `.claude/skills/pricing-rules/SKILL.md` |
| 用途 | 依店長寫下的定價心法，替每天每樣菜定價並說明理由 |
| 學生要填的 ★ | 共 7 處，至少 3 條「什麼情況 → 怎麼做」的心法，來自學生自己玩五天的經驗。參考答案：`teacher/examples/pricing-rules.filled.md` |
| 時機 | 第 3 天下午，AI 店長段 |
| 學生怎麼呼叫 | 通常不直接叫，由 AI 店長呼叫；要單獨試可以打 `/pricing-rules` |
| 誰會自己呼叫 | `ai-manager` Agent |
| 會改的檔案 | 不會 |

### 8. `result-review`：結果檢討（★模板）

| 項目 | 內容 |
|---|---|
| 檔案 | `.claude/skills/result-review/SKILL.md` |
| 用途 | 讀 `npm run simulate` 的結果，照「對症下藥表」找出問題，一次最多改 3 個地方，存成新的策略檔 |
| 學生要填的 ★ | 共 7 處，對症下藥表至少 4 組「症狀 → 處方」，症狀要用試算結果看得到的數字。參考答案：`teacher/examples/result-review.filled.md` |
| 時機 | 第 3 天下午，AI 店長段 |
| 學生怎麼呼叫 | 通常由 AI 店長呼叫；要單獨試可以打 `/result-review plans/v1.json` |
| 誰會自己呼叫 | `ai-manager` Agent；`reorder-check` 寫明「要改策略交給 result-review」 |
| 會改的檔案 | 只會在 `web-lab/plans/` 新增策略檔（例如 `v2.json`），不覆蓋舊的 |

### 9. `write-spec`：規格撰寫

| 項目 | 內容 |
|---|---|
| 檔案 | `.claude/skills/write-spec/SKILL.md` |
| 用途 | 只有一句話的需求時，先問清楚（一次最多 3 個問題），再寫成規格書，存到 `docs/specs/<功能名稱>.md` |
| 時機 | 回家作業：升級商店（第 3 天結尾介紹） |
| 學生怎麼呼叫 | `/write-spec 店裡要有升級商店`，或「請用 write-spec 幫我把升級商店寫成規格書」 |
| 誰會自己呼叫 | 沒有；它寫完、使用者確認後，會交給 `change-feature` 實作 |
| 會改的檔案 | 只寫 `docs/specs/` |
| 備註 | 作業的三個方向、繳交方式見 `docs/HOMEWORK.md` |

### 10. `new-events`：營業事件製作（延伸）

| 項目 | 內容 |
|---|---|
| 檔案 | `.claude/skills/new-events/SKILL.md` |
| 用途 | 產生另一組五天的營業事件草案（事件名稱、人數倍率 70～130、預告、任務），存成文件給老師審核 |
| 時機 | 課後延伸（選做、不計分） |
| 學生怎麼呼叫 | `/new-events`，或「請用 new-events 設計一組颱風週的事件」 |
| 誰會自己呼叫 | 沒有 |
| 會改的檔案 | 只寫 `docs/drafts/events-<主題>.md`，**不准改 `days.js`** |

---

## 五、Agent 與 Skill 的呼叫關係

| Agent | 學生怎麼叫 | 會自己呼叫的 Skill | 其他工具 |
|---|---|---|---|
| `tester`（測試員） | 「請用 tester agent 測試遊戲」 | `playtest` | 瀏覽器 MCP、`npm run check` |
| `ai-manager`（AI 店長） | 「請用 ai-manager agent 經營官方標準關」 | `pricing-rules`、`result-review`、`reorder-check` | 試算工具 `npm run simulate`、瀏覽器 MCP |
| `question-setter`（出題者，延伸） | 「請用 question-setter agent 出一包客人」 | `new-customers` | 瀏覽器 MCP、`npm run check` |

**Agent 模板的勾選陷阱**：`tester` 模板列了 `change-feature` 和 `new-customers` 讓學生勾，正確答案是**不勾**（測試員不改程式，產生客人也跟測試無關）。簡報第 3 天有一頁「小試身手」專門考這題。

**Skill 之間的交接**

```text
write-spec ──(規格書確認後)──> change-feature ──(改完)──> review-diff ──> git-verify
reorder-check ──(要改策略)──> result-review ──(存新策略檔)──> 試算
```

---

## 六、助教快速排錯

| 學生說 | 先檢查 | 處理 |
|---|---|---|
| 「AI 沒照 Skill 做」 | 是不是只描述了需求、沒提 Skill 名稱 | 改用 `/skill名稱` 再叫一次 |
| 「打 `/` 找不到我的 Skill」 | 是否在專案根目錄打開 VS Code；資料夾名稱和 `name:` 是否一致 | 重新從專案根目錄開啟，或重啟 Claude Code |
| 「Skill 沒照我填的 ★ 做」 | ★ 欄位是不是還空著、或只寫了「好」「適量」這種模糊字 | 請學生把 ★ 寫成「什麼情況 → 怎麼做」，有數字 |
| 「AI 改了很多檔」 | `git status` | 跑 `review-diff`，照建議 `git restore` 越界的檔 |
| 「npm run check 全過了但遊戲怪怪的」 | 是不是改了 `check-rules.mjs` | 這是最常見的作弊；`review-diff` 會標成可疑變更 |
| 「Agent 沒有用我的 Skill」 | Agent 模板裡有沒有勾選該 Skill、寫出它負責哪一步 | 補上勾選與說明再叫一次 |
