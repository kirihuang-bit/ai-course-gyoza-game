import { useCallback, useState } from 'react';
import { brand, courseModules, stats, workflow, tabs, checkpoints } from './data.js';
import { Aurora, GradientText } from './uiEffects.jsx';
import { GyozaPan, StageIcon } from './artwork.jsx';
import GameShop from './game/GameShop.jsx';
import InventoryPage from './game/InventoryPage.jsx';

// 四個課程模組配四個製作階段:麵皮 → 包餡 → 煎製 → 出餐。
const moduleStage = { C1: 'wrapper', C2: 'fill', C3: 'sear', C4: 'serve' };

function ModuleCard({ code, title, desc, output }) {
  return (
    <article className="module-card">
      <div className="module-card-head">
        <span className="module-code">{code}</span>
        <StageIcon stage={moduleStage[code]} />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <strong>{output}</strong>
    </article>
  );
}

function HomePage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="site-page">
      <header className="site-hero">
        <Aurora className="site-hero-aurora" />
        <div className="hero-overlay" />
        {/* 首頁主圖。data.js 的 heroImage 有填就用你的照片,沒填就用預設插畫。
            這是 U1 的第二個練習(見 U1/STEP-02.md),照片放在 web-lab/public/images/。 */}
        {brand.heroImage ? (
          <img className="hero-art" src={brand.heroImage} alt="" aria-hidden="true" />
        ) : (
          <GyozaPan />
        )}
        <div className="site-hero-inner">
          <p className="eyebrow solid">AI Coding Game Kit</p>
          <p className="brand-kicker">{brand.badge}</p>
          <h1>
            <GradientText colors={['#f97316', '#2dd4bf', '#facc15', '#f97316']} speed={7}>
              {brand.name}
            </GradientText>
          </h1>
          <p className="hero-copy">{brand.tagline}</p>
          <a className="primary-link" href="#course-map">
            {brand.cta}
          </a>
        </div>
        <section className="hero-metrics" aria-label="課程與系統數字">
          {stats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>
      </header>

      <main className="site-main">
        <section className="mission-band">
          <p>{brand.description}</p>
        </section>

        <section className="module-grid" id="course-map" aria-label="課程主線">
          {courseModules.map((module) => (
            <ModuleCard key={module.code} {...module} />
          ))}
        </section>

        <section className="flow-band">
          <div>
            <p className="eyebrow solid">delivery loop</p>
            <h2>每一次讓 AI 動手，都走同一條流程</h2>
          </div>
          <div className="flow-steps">
            {workflow.map((step, index) => (
              <span key={step}>
                {String(index + 1).padStart(2, '0')} / {step}
              </span>
            ))}
          </div>
        </section>

        <section className="insight-section">
          <div className="side-tabs" role="tablist" aria-label="技術主軸">
            {tabs.map((tab) => (
              <button
                className={tab.id === activeTab ? 'active' : ''}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          <article className="insight-panel">
            <span>{currentTab.label}</span>
            <h2>{currentTab.title}</h2>
            <p>{currentTab.body}</p>
          </article>
        </section>

        <section className="acceptance-band">
          <p className="eyebrow solid">acceptance</p>
          <h2>AI 說做完了不算，證據過關才算</h2>
          <ul>
            {checkpoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

const VIEWS = [
  { key: 'home', label: '首頁' },
  { key: 'shop', label: '開店' },
  { key: 'inventory', label: '倉庫盤點' },
];

export default function App() {
  const [view, setView] = useState('home');
  // 遊戲進度只放在記憶體裡，給「倉庫盤點」頁讀；重新整理就消失（不存檔）
  const [progress, setProgress] = useState(null);
  const handleProgress = useCallback((p) => setProgress(p), []);

  return (
    <>
      <nav className="topnav" aria-label="頁面切換">
        {VIEWS.map((item) => (
          <button
            className={view === item.key ? 'active' : ''}
            key={item.key}
            data-testid={`nav-${item.key}`}
            onClick={() => setView(item.key)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
      {/* 三個頁面都一直掛著、只切換顯示，所以換頁不會讓遊戲重來 */}
      <div hidden={view !== 'home'}>
        <HomePage />
      </div>
      <div hidden={view !== 'shop'}>
        <GameShop onProgress={handleProgress} />
      </div>
      <div hidden={view !== 'inventory'}>
        <InventoryPage progress={progress} />
      </div>
    </>
  );
}
