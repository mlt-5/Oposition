import { useState, useRef, useEffect } from 'react';
import { T } from '@/lib/tokens';
import { NAV } from '@/lib/helpers';
import SidebarNav from '@/components/layout/SidebarNav';
import ViewBar from '@/components/layout/ViewBar';
import HomeView from '@/components/views/HomeView';
import BudgetView from '@/components/views/BudgetView';
import SpendingView from '@/components/views/SpendingView';
import FraudView from '@/components/views/FraudView';
import PromisesView from '@/components/views/PromisesView';
import RankingsView from '@/components/views/RankingsView';
import StatementsView from '@/components/views/StatementsView';
import PartiesView from '@/components/views/PartiesView';
import PoliciesView from '@/components/views/PoliciesView';
import AlertsView from '@/components/views/AlertsView';
import { LIVE_STATS } from '@/data/static';

type ViewId = 'home' | 'budget' | 'spending' | 'parties' | 'policies' | 'fraud' | 'promises' | 'statements' | 'rankings' | 'alerts';

export default function App() {
  const [view, setView] = useState<ViewId>('home');
  const [drawer, setDrawer] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [view]);

  const go = (id: string) => { setView(id as ViewId); setDrawer(false); };

  const views: Record<ViewId, React.ReactNode> = {
    home:       <HomeView onNav={go} />,
    budget:     <BudgetView />,
    spending:   <SpendingView />,
    parties:    <PartiesView />,
    policies:   <PoliciesView />,
    fraud:      <FraudView />,
    promises:   <PromisesView />,
    statements: <StatementsView />,
    rankings:   <RankingsView />,
    alerts:     <AlertsView />,
  };

  return (
    <div className="app">

      {/* Edition Strip */}
      <div className="edition-strip">
        <span>THE OPPOSITION · VOL. I · ISSUE 47 · CIVIC ACCOUNTABILITY PLATFORM</span>
        <span>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} · ALL DATA SOURCE-CITED</span>
      </div>

      {/* Masthead */}
      <header className="masthead">
        <div className="masthead-left">
          <div className="mark">◉</div>
          <div>
            <div className="brand-name">THE <span className="brand-hi">OPPOSITION</span></div>
            <div className="brand-sub">YE DESH KA HISAAB HAI · विपक्ष</div>
          </div>
        </div>
        <div className="masthead-center">
          <div className="ticker-strip">
            <span className="ticker-inner">
              {[...LIVE_STATS, ...LIVE_STATS].map((s, i) => (
                <span key={i} className="tick-item">
                  {s.label}: <span className={`val${s.bad ? ' bad' : ''}`}>{s.value}</span> &nbsp;·&nbsp; {s.sub}
                </span>
              ))}
            </span>
          </div>
        </div>
        <div className="masthead-right">
          <div className="live-pill"><span className="live-dot-pulse" /><span>LIVE</span></div>
          <button className="hbtn" onClick={() => setDrawer(true)}>☰ Menu</button>
          <span className="alert-badge">⚠ 47 CASES</span>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`drawer-overlay${drawer ? ' open' : ''}`} onClick={() => setDrawer(false)}>
        <nav className="drawer-panel" onClick={e => e.stopPropagation()}>
          <div className="drawer-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="mark" style={{ width: 30, height: 30, fontSize: 15 }}>◉</div>
              <span style={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, fontSize: 15, color: '#fff' }}>THE OPPOSITION</span>
            </div>
            <button className="drawer-close-btn" onClick={() => setDrawer(false)}>×</button>
          </div>
          <div className="drawer-inner">
            <SidebarNav active={view} onSelect={go} />
          </div>
        </nav>
      </div>

      {/* Layout */}
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-head">
            <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 8, fontWeight: 700, letterSpacing: 2.5, color: T.muted, textTransform: 'uppercase', marginBottom: 8 }}>Live Indicators</div>
            <div className="sidebar-kv">
              {LIVE_STATS.slice(0, 4).map(s => (
                <div key={s.label} className="sidebar-stat">
                  <span className="sidebar-stat-label">{s.label}</span>
                  <span className="sidebar-stat-val" style={{ color: s.bad ? T.red : T.green }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="sidebar-scroll">
            <SidebarNav active={view} onSelect={id => setView(id as ViewId)} />
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ViewBar id={view} />
          <div
            ref={scrollRef}
            style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            {views[view] ?? views.home}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {NAV.slice(0, 8).map(n => (
          <button key={n.id} className={`bnav-btn${view === n.id ? ' on' : ''}`} onClick={() => setView(n.id as ViewId)}>
            <span className="bnav-icon">{n.icon}</span>
            <span className="bnav-label">{n.short}</span>
          </button>
        ))}
      </nav>

      {/* Desktop Footer */}
      <footer className="footer">
        <span className="footer-brand">◉ THE OPPOSITION</span>
        <span className="footer-rule">|</span>
        <span className="footer-text">All data source-cited · Every figure traceable to primary source · We do not editorialize</span>
        <div className="footer-right">
          {['Methodology', 'Our Funding', 'Corrections', 'API Access'].map(l => (
            <span key={l} className="flink">{l}</span>
          ))}
          <span className="footer-text" style={{ color: 'rgba(255,255,255,.15)' }}>
            Broadsheet Ed. · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </footer>

    </div>
  );
}
