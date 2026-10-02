// 倉庫盤點頁（老師檔）：顯示這一場從第 1 天到現在，每天每樣菜的盤點。
// 資料來自「開店」頁的遊戲進度，切換頁面不會重來；但跟遊戲一樣不存檔，重新整理就回到第 1 天。
// 盤點的判斷規則在 rules/inventory.js。

import './game.css';

const STATUS_LABEL = { ok: '正常', out: '缺貨', over: '報廢過多' };

function DayTable({ report, latest }) {
  return (
    <section className={`gs-card inv-day${latest ? ' latest' : ''}`} data-testid={`inv-day-${report.day}`}>
      <h3>
        第 {report.day} 天{latest && <span className="inv-latest-tag">最新</span>}
      </h3>
      <div className="gs-table-wrap">
        <table className="inv-table">
          <thead>
            <tr>
              <th>菜</th>
              <th>備貨</th>
              <th>賣出</th>
              <th>報廢</th>
              <th>賣完後沒買到</th>
              <th>狀態</th>
              <th>明天建議備貨</th>
            </tr>
          </thead>
          <tbody>
            {report.inventory.map((row) => (
              <tr key={row.id} className={`inv-${row.status}`} data-testid={`inv-${report.day}-${row.id}`}>
                <td>{row.name}</td>
                <td>{row.stocked}</td>
                <td data-testid={`inv-${report.day}-${row.id}-sold`}>{row.sold}</td>
                <td data-testid={`inv-${report.day}-${row.id}-waste`}>{row.waste}</td>
                <td data-testid={`inv-${report.day}-${row.id}-missed`}>{row.missed}</td>
                <td data-testid={`inv-${report.day}-${row.id}-status`}>
                  <span className="inv-tag">{STATUS_LABEL[row.status] ?? row.status}</span>
                </td>
                <td data-testid={`inv-${report.day}-${row.id}-suggest`}>{row.suggest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function InventoryPage({ progress }) {
  const history = progress?.history ?? [];
  const pendingDay = progress?.pendingDay ?? null;
  const done = history.filter((r) => r.day !== pendingDay);
  return (
    <div className="gs-page" data-testid="inventory-page">
      <header className="gs-head">
        <p className="eyebrow solid">inventory</p>
        <h2>倉庫盤點</h2>
        <p className="gs-hint">每天打烊後盤點一次。所有數字都可以對照「開店」頁的打烊報表和客人卡片驗算。盤點只是報表，不影響現金和分數。</p>
      </header>
      {pendingDay && (
        <p className="inv-pending" data-testid="inv-pending">第 {pendingDay} 天營業中，打烊後才會盤點。</p>
      )}
      {done.length === 0 ? (
        <p className="gs-card inv-empty" data-testid="inv-empty">還沒有盤點資料。到「開店」頁營業一天，打烊後就會出現在這裡。</p>
      ) : (
        [...done].reverse().map((report, i) => <DayTable key={report.day} report={report} latest={i === 0} />)
      )}
    </div>
  );
}
