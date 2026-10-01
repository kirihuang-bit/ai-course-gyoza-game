// 開店頁（老師檔）：遊戲畫面。
// 這個檔只負責「顯示」和「收集玩家的決定」，遊戲規則都在 engine.js 和 rules/ 裡。
// 遊戲進度只存在這個畫面的記憶裡：重新整理就回到第 1 天，也不會寫任何檔案。

import { useEffect, useMemo, useState } from 'react';
import { MENU, findDish } from './menu.js';
import { DAYS, DAILY_CAPACITY, MAX_SLOTS, PROMO_OPTIONS } from './config.js';
import { getDayData } from './days.js';
import { newGame, simulateDay, summarize, isFinished } from './engine.js';
import { validatePlan, planCost, formatMoney } from './validatePlan.js';
import { validateCustomers } from './validateCustomers.js';
import { PACKS } from './packs.js';
import './game.css';

const VISIT_INTERVAL_MS = 250;

const OUTCOME_LABEL = {
  bought: '買到了',
  hated_on_menu: '沒進門',
  not_on_menu: '沒上架',
  sold_out: '賣完了',
  too_expensive: '太貴了',
};

const TASK_LABEL = { done: '達成', failed: '未達成', wip: '施工中' };

const STOCK_LABEL = { ok: '正常', low: '需要補貨', out: '缺貨' };

function Inventory({ rows }) {
  if (!rows) return null;
  return (
    <div className="gs-inventory" data-testid="inventory">
      <h4>倉庫盤點</h4>
      <p className="gs-inventory-note">只是報表，不影響現金和分數。今晚供應商會送來固定進貨，明早庫存＝打烊剩餘＋固定進貨。</p>
      <div className="gs-table-wrap">
        <table>
          <thead>
            <tr>
              <th>代號</th>
              <th>原料</th>
              <th>早上庫存</th>
              <th>備料用掉</th>
              <th>臨時加購</th>
              <th>打烊剩餘</th>
              <th>安全量</th>
              <th>狀態</th>
              <th>建議追加叫貨</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.sku} className={`gs-stock-${row.status}`} data-testid={`inventory-${row.sku}`}>
                <td>{row.sku}</td>
                <td>{row.name}</td>
                <td>{row.before}</td>
                <td>{row.used}</td>
                <td data-testid={`inventory-${row.sku}-rush`}>{row.rushBuy}</td>
                <td data-testid={`inventory-${row.sku}-left`}>{row.left}</td>
                <td>{row.safety}</td>
                <td data-testid={`inventory-${row.sku}-status`}>
                  <span className="gs-stock-tag">{STOCK_LABEL[row.status] ?? row.status}</span>
                </td>
                <td data-testid={`inventory-${row.sku}-reorder`}>{row.reorder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function emptyDraft() {
  const draft = {};
  for (const dish of MENU) draft[dish.id] = { on: false, qty: 10, price: dish.refPrice };
  return draft;
}

function draftToPlan(draft, promoCost) {
  const items = MENU.filter((d) => draft[d.id].on).map((d) => ({
    id: d.id,
    qty: Number(draft[d.id].qty),
    price: Number(draft[d.id].price),
  }));
  return { items, promoCost };
}

function Stars({ value }) {
  const pct = ((value - 0) / 5) * 100;
  return (
    <span className="gs-stars" aria-label={`${value} 顆星`}>
      <span className="gs-stars-track">★★★★★</span>
      <span className="gs-stars-fill" style={{ width: `${pct}%` }}>
        ★★★★★
      </span>
    </span>
  );
}

function StatusBar({ game }) {
  const dayText = isFinished(game) ? '已結算' : `第 ${game.day} 天／${DAYS}`;
  return (
    <section className="gs-status" aria-label="目前狀態">
      <div>
        <span>天數</span>
        <strong data-testid="status-day">{dayText}</strong>
      </div>
      <div>
        <span>資金</span>
        <strong data-testid="status-cash">{formatMoney(game.cash)} 元</strong>
      </div>
      <div>
        <span>星等</span>
        <strong>
          <Stars value={game.stars} /> <em data-testid="status-stars">{game.stars}</em>
        </strong>
      </div>
      <div>
        <span>模式</span>
        <strong data-testid="status-mode">{game.mode === 'jump' ? '練習模式・不列入排行' : '正式'}</strong>
      </div>
      <p className="gs-reset-note">進度會在重新整理後重置</p>
    </section>
  );
}

function PackPicker({ packId, setPackId, locked, importedPack, onImport, packErrors }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [errors, setErrors] = useState([]);

  function submit() {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      setErrors(['看不懂這段文字：請確認是完整的 JSON（從 [ 開始、] 結束）']);
      return;
    }
    const result = validateCustomers(parsed);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors([]);
    setOpen(false);
    onImport(parsed);
  }

  return (
    <section className="gs-card gs-pack">
      <div className="gs-pack-row">
        <label htmlFor="pack-select">客人包</label>
        <select
          id="pack-select"
          data-testid="pack-select"
          value={packId}
          disabled={locked}
          onChange={(e) => setPackId(e.target.value)}
        >
          {PACKS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
          {importedPack && <option value="imported">匯入的客人包（只在這一場有效）</option>}
        </select>
        <button
          type="button"
          className="gs-ghost"
          data-testid="pack-import-open"
          disabled={locked}
          onClick={() => setOpen((v) => !v)}
        >
          匯入客人包
        </button>
        {locked && <small>開店後就不能換客人包，要換請按「重新開始」</small>}
      </div>
      {packErrors.length > 0 && (
        <ul className="gs-errors" data-testid="pack-errors">
          {packErrors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      {open && (
        <div className="gs-import">
          <p>把同學給你的客人包（JSON 文字）整段貼在這裡。貼上的客人只在這一場有效，重新整理就會消失。</p>
          <textarea
            data-testid="pack-import-text"
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='[ { "name": "…", … } ]'
          />
          <button type="button" data-testid="pack-import-submit" onClick={submit}>
            檢查並匯入
          </button>
          {errors.length > 0 && (
            <ul className="gs-errors" data-testid="pack-import-errors">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function PlanForm({ draft, setDraft, promoCost, setPromoCost, cash }) {
  const plan = draftToPlan(draft, promoCost);
  const { stockCost, total } = planCost(plan);
  const totalQty = plan.items.reduce((s, i) => s + (Number.isFinite(i.qty) ? i.qty : 0), 0);

  function update(id, field, value) {
    setDraft((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  return (
    <section className="gs-card">
      <h3>今日決定</h3>
      <p className="gs-hint">
        最多上架 {MAX_SLOTS} 樣（已選 {plan.items.length} 樣）・合計份數 {totalQty}／{DAILY_CAPACITY}
      </p>
      <div className="gs-dishes">
        {MENU.map((dish) => {
          const d = draft[dish.id];
          return (
            <article key={dish.id} className={`gs-dish ${d.on ? 'on' : ''}`}>
              <label className="gs-dish-head">
                <input
                  type="checkbox"
                  data-testid={`dish-${dish.id}-toggle`}
                  checked={d.on}
                  onChange={(e) => update(dish.id, 'on', e.target.checked)}
                />
                <strong>{dish.name}</strong>
              </label>
              <small>
                成本 {dish.cost} 元・建議售價 {dish.refPrice} 元
              </small>
              <div className="gs-dish-inputs">
                <label>
                  份數
                  <input
                    type="number"
                    min="0"
                    step="1"
                    data-testid={`dish-${dish.id}-qty`}
                    value={d.qty}
                    disabled={!d.on}
                    onChange={(e) => update(dish.id, 'qty', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </label>
                <label>
                  定價（{dish.minPrice}～{dish.maxPrice}）
                  <input
                    type="number"
                    min={dish.minPrice}
                    max={dish.maxPrice}
                    step="1"
                    data-testid={`dish-${dish.id}-price`}
                    value={d.price}
                    disabled={!d.on}
                    onChange={(e) => update(dish.id, 'price', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </label>
              </div>
            </article>
          );
        })}
      </div>
      <div className="gs-promo" role="radiogroup" aria-label="宣傳費">
        <span>宣傳費</span>
        {PROMO_OPTIONS.map((p) => (
          <label key={p.cost} className={promoCost === p.cost ? 'on' : ''}>
            <input
              type="radio"
              name="promo"
              data-testid={`promo-${p.cost}`}
              checked={promoCost === p.cost}
              onChange={() => setPromoCost(p.cost)}
            />
            {p.cost} 元（客人 +{p.pct}%）
          </label>
        ))}
      </div>
      <p className="gs-cost">
        備貨 {formatMoney(stockCost)} 元＋宣傳 {formatMoney(promoCost)} 元＝<strong>{formatMoney(total)} 元</strong>
        （現有資金 {formatMoney(cash)} 元）
      </p>
    </section>
  );
}

function VisitCard({ visit, index }) {
  const boughtText = visit.bought.length
    ? visit.bought.map((b) => `${findDish(b.id).name} ${b.price} 元`).join('、')
    : OUTCOME_LABEL[visit.outcome] ?? '沒買';
  return (
    <article
      className={`gs-visit ${visit.entered ? '' : 'out'} ${visit.satisfaction ?? ''}`}
      data-testid={`visit-${index + 1}`}
    >
      <strong>{visit.name}</strong>
      <span>{boughtText}</span>
      {visit.line && (
        <p className="gs-bubble" data-testid={`visit-${index + 1}-line`}>
          {visit.line}
        </p>
      )}
    </article>
  );
}

function Report({ report, onNext, isLast }) {
  const task = report.task;
  const starsDiff = report.starsAfter - report.starsBefore;
  const taskText =
    task.status === 'done' ? `達成，獎金 +${task.bonusPaid} 元` : TASK_LABEL[task.status] ?? task.status;
  return (
    <section className="gs-card gs-report" data-testid="report">
      <h3>第 {report.day} 天打烊報表</h3>
      <dl>
        <div>
          <dt>營業收入</dt>
          <dd data-testid="report-revenue">{formatMoney(report.revenue)} 元</dd>
        </div>
        <div>
          <dt>備貨成本</dt>
          <dd data-testid="report-stock-cost">{formatMoney(report.stockCost)} 元</dd>
        </div>
        <div>
          <dt>宣傳費</dt>
          <dd data-testid="report-promo">{formatMoney(report.promoCost)} 元</dd>
        </div>
        <div>
          <dt>報廢</dt>
          <dd data-testid="report-waste">{report.wasteTotal} 份</dd>
        </div>
        <div>
          <dt>廚餘清潔費</dt>
          <dd data-testid="report-waste-fee">{formatMoney(report.wasteFee)} 元</dd>
        </div>
        <div>
          <dt>當日淨利（不含獎金）</dt>
          <dd data-testid="report-profit">{formatMoney(report.profit)} 元</dd>
        </div>
        <div>
          <dt>任務：{task.text}</dt>
          <dd data-testid="report-task">{taskText}</dd>
        </div>
        <div>
          <dt>星等</dt>
          <dd data-testid="report-stars">
            {report.starsBefore} → {report.starsAfter}
            {starsDiff !== 0 && `（${starsDiff > 0 ? '+' : ''}${starsDiff}）`}
          </dd>
        </div>
        <div>
          <dt>客人</dt>
          <dd>
            進店 {report.entered} 位：滿意 {report.satisfied}・普通 {report.neutral}・不滿 {report.unsatisfied}
          </dd>
        </div>
      </dl>
      <Inventory rows={report.inventory} />
      <button type="button" className="gs-primary" data-testid="next-day" onClick={onNext}>
        {isLast ? '看結算' : '進入下一天'}
      </button>
    </section>
  );
}

function Final({ game, onAgain }) {
  const s = summarize(game);
  return (
    <section className="gs-card gs-final" data-testid="final">
      <h3>五天結算{game.mode === 'jump' ? '（練習模式，不列入排行）' : ''}</h3>
      <dl>
        <div>
          <dt>最終資金</dt>
          <dd data-testid="final-cash">{formatMoney(s.finalCash)} 元</dd>
        </div>
        <div>
          <dt>總報廢</dt>
          <dd data-testid="final-waste">{s.totalWaste} 份</dd>
        </div>
        <div>
          <dt>最終星等</dt>
          <dd data-testid="final-stars">{s.finalStars}</dd>
        </div>
        <div>
          <dt>任務達成</dt>
          <dd data-testid="final-tasks">
            {s.tasksDone}／{s.daysPlayed}
          </dd>
        </div>
      </dl>
      <button type="button" className="gs-primary" data-testid="play-again" onClick={onAgain}>
        再玩一次
      </button>
    </section>
  );
}

export default function GameShop() {
  const [game, setGame] = useState(() => newGame());
  const [packId, setPackId] = useState('default');
  const [importedPack, setImportedPack] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [promoCost, setPromoCost] = useState(0);
  const [phase, setPhase] = useState('plan'); // plan | playing | report | final
  const [report, setReport] = useState(null);
  const [shown, setShown] = useState(0);
  const [jumpDay, setJumpDay] = useState(1);
  const [notice, setNotice] = useState('');

  const pack = packId === 'imported' ? importedPack : PACKS.find((p) => p.id === packId)?.data;
  const packCheck = useMemo(() => validateCustomers(pack ?? []), [pack]);
  const packErrors = packCheck.ok
    ? []
    : packId === 'mine' && Array.isArray(pack) && pack.length === 0
      ? ['my-customers.json 還是空的。請先讓 AI 用 /new-customers 產生你的客人。']
      : packCheck.errors;

  const plan = draftToPlan(draft, promoCost);
  const planErrors = validatePlan(plan, game.cash);
  const locked = game.history.length > 0 || phase !== 'plan';
  const dayData = isFinished(game) ? null : getDayData(game.day);

  // 營業過程：客人一位一位出現
  useEffect(() => {
    if (phase !== 'playing' || !report) return undefined;
    if (shown >= report.visits.length) {
      setPhase('report');
      return undefined;
    }
    const timer = setTimeout(() => setShown((n) => n + 1), VISIT_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [phase, shown, report]);

  function openShop() {
    if (planErrors.length || !packCheck.ok) return;
    const result = simulateDay(game, plan, pack);
    setGame(result.state);
    setReport(result.report);
    setShown(0);
    setPhase('playing');
    setNotice('');
  }

  function nextDay() {
    setPhase(isFinished(game) ? 'final' : 'plan');
    setReport(null);
  }

  function restart(options) {
    setGame(newGame(options));
    setPhase('plan');
    setReport(null);
    setShown(0);
    setNotice('');
  }

  function handleImport(parsed) {
    setImportedPack(parsed);
    setPackId('imported');
  }

  return (
    <div className="gs-page">
      <header className="gs-head">
        <p className="eyebrow solid">GYOZA WOOD・開店</p>
        <h2>經營五天，第五天打烊時資金越多越好</h2>
      </header>

      <StatusBar game={game} />

      <section className="gs-toolbar" aria-label="工具列">
        <button type="button" className="gs-ghost" data-testid="restart" onClick={() => restart()}>
          重新開始
        </button>
        <label>
          跳關到
          <select data-testid="jump-select" value={jumpDay} onChange={(e) => setJumpDay(Number(e.target.value))}>
            {Array.from({ length: DAYS }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                第 {d} 天
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="gs-ghost"
          data-testid="jump-start"
          onClick={() => restart({ mode: 'jump', startDay: jumpDay })}
        >
          開始練習（1,000 元、3 顆星）
        </button>
        <button
          type="button"
          className="gs-ghost"
          data-testid="upgrade-shop"
          onClick={() => setNotice('升級商店尚未開放')}
        >
          升級商店
        </button>
        {notice && (
          <span className="gs-notice" role="status">
            {notice}
          </span>
        )}
      </section>

      <PackPicker
        packId={packId}
        setPackId={setPackId}
        locked={locked}
        importedPack={importedPack}
        onImport={handleImport}
        packErrors={packErrors}
      />

      {phase === 'plan' && dayData && (
        <>
          <section className="gs-card gs-forecast" data-testid="forecast">
            <span>第 {dayData.day} 天預告・{dayData.event}</span>
            <p>{dayData.forecast}</p>
            <small>今日任務：{dayData.task.text}（獎金 {dayData.task.bonus} 元）</small>
          </section>

          <PlanForm
            draft={draft}
            setDraft={setDraft}
            promoCost={promoCost}
            setPromoCost={setPromoCost}
            cash={game.cash}
          />

          {planErrors.length > 0 && (
            <ul className="gs-errors" data-testid="plan-errors">
              {planErrors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}

          <button
            type="button"
            className="gs-primary gs-open"
            data-testid="open-shop"
            disabled={planErrors.length > 0 || !packCheck.ok}
            onClick={openShop}
          >
            開始營業
          </button>
        </>
      )}

      {(phase === 'playing' || phase === 'report') && report && (
        <section className="gs-card">
          <div className="gs-visits-head">
            <h3>
              第 {report.day} 天營業中・客人 {Math.min(shown, report.visits.length)}／{report.visits.length}
            </h3>
            {phase === 'playing' && (
              <button
                type="button"
                className="gs-ghost"
                data-testid="skip-animation"
                onClick={() => setShown(report.visits.length)}
              >
                略過動畫
              </button>
            )}
          </div>
          <div className="gs-visits">
            {report.visits.slice(0, shown).map((visit, i) => (
              <VisitCard key={i} visit={visit} index={i} />
            ))}
          </div>
        </section>
      )}

      {phase === 'report' && report && <Report report={report} onNext={nextDay} isLast={isFinished(game)} />}

      {phase === 'final' && <Final game={game} onAgain={() => restart()} />}
    </div>
  );
}
