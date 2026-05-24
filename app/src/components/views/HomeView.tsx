import { T } from '@/lib/tokens';
import Rule from '@/components/layout/Rule';
import { LIVE_STATS, ALERTS } from '@/data/static';

interface Props { onNav: (id: string) => void }

export default function HomeView({ onNav }: Props) {
  return (
    <div className="scroll-area fu">
      <div style={{ marginBottom: 22 }}>
        <h1 className="display" style={{ fontSize: 'clamp(22px,4vw,34px)' }}>India Accountability Dashboard</h1>
        <p style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', fontSize: 11, color: T.muted, letterSpacing: .3, marginTop: 6 }}>
          Ye Desh Ka Hisaab Hai — This is the nation's account. Every figure is source-cited. We do not editorialize.
        </p>
      </div>

      <Rule title="Live Economic Indicators" />
      <div className="stat-grid">
        {LIVE_STATS.map((s, i) => (
          <div key={s.label} className={`stat-cell fu fu${i + 1}`}>
            <span className={`stat-flag ${s.bad ? 'sf-bad' : 'sf-good'}`}>{s.bad ? '▲' : '▼'}</span>
            <div className="stat-val" style={{ '--sc': s.bad ? T.red : T.green }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <Rule title="Accountability Tracker" />
      <div className="acct-grid" style={{ marginBottom: 22 }}>
        {[
          { ap: T.red,   eye: 'BUDGET UTILISATION Q3 FY26',  num: '~68%',      desc: 'Education 61%, Health 58%, Women & Child Dev 54%, Rural Dev 63% — all below 65% with one quarter remaining. Source: CGA Monthly Accounts FY26; PRS', nav: 'budget' },
          { ap: T.amber, eye: 'BJP MANIFESTO PROMISES',       num: '1 of 10',   desc: 'Only 1 of 10 tracked BJP promises Fulfilled: ₹12L income tax rebate. 4 Partial, 2 Delayed, 3 Not Met. Source: BJP Sankalp Patra 2014-2024; PIB; CAG', nav: 'promises' },
          { ap: T.red,   eye: 'ACTIVE FRAUD INVESTIGATIONS',  num: '₹7,000+Cr', desc: 'Reliance ADA bank fraud alone: ₹1,400 Cr attached (Nov 2025, ED). PNB–Nirav Modi: ₹14,357 Cr, trial ongoing since 2018. Source: ED, CBI official press releases', nav: 'fraud' },
          { ap: T.red,   eye: 'PRESS FREEDOM 2025 (RSF)',     num: '151st',     desc: 'India 151st/180 RSF 2025. HDI: 134th/193 UNDP 2024. Hunger: 105th/127 GHI 2024. Happiness: 118th/147 UN 2025. Freedom House: Partly Free 63/100', nav: 'rankings' },
        ].map((c, i) => (
          <div key={i} className={`acct-panel fu fu${i + 1}`} style={{ '--ap': c.ap }}>
            <div className="acct-eyebrow">{c.eye}</div>
            <div className="acct-number">{c.num}</div>
            <div className="acct-desc">{c.desc}</div>
            <button className="acct-cta" onClick={() => onNav(c.nav)}>View full tracker →</button>
          </div>
        ))}
      </div>

      <Rule title="Recent Alerts" />
      <div className="alert-list">
        {ALERTS.slice(0, 5).map(a => (
          <div key={a.id} className="alert-row" style={{ '--as': a.sev === 'critical' ? T.red : a.sev === 'positive' ? T.green : T.amber }}>
            <div className="alert-sev" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="alert-meta">
                <span className="alert-tag" style={{ color: a.sev === 'critical' ? T.red : a.sev === 'positive' ? T.green : T.amber }}>{a.tag}</span>
                <span className="alert-agency">{a.agency}</span>
                <span className="alert-time">{a.time}</span>
              </div>
              <div className="alert-body-text">{a.body}</div>
            </div>
          </div>
        ))}
      </div>

      <Rule title="Positive Record — Verified Achievements" />
      <div className="positive-strip">
        <div className="positive-head">✅ India's Verified Gains — Data-Backed, Source-Cited</div>
        {[
          'Fastest-growing major economy: Real GDP grew 8.2% Q2 FY26 — IMF projects India to sustain ~7% through FY27 · IMF Article IV Nov 2025',
          'Extreme poverty: Share of population in extreme poverty fell markedly to 5.3% (FY2022-23) from 12.3% (FY2015-16) · IMF/World Bank',
          "World's largest remittance recipient: $129 billion received in FY 2024 — 14.3% of global remittances · World Bank 2024",
          'Global Innovation Index: Rose to 39th (2024) from 81st in 2015 — patent filings, IT services, startup ecosystem · WIPO 2024',
          'Climate Change Performance Index: Ranked 10th/63 — driven by low per-capita emissions and renewable energy expansion · Germanwatch 2025',
          'Digital infrastructure: UPI processed 19.78 billion transactions in Jan 2026 (~$24B/month). India leads global real-time payments · NPCI 2026',
          'Polio-free since January 2014 — WHO certified. No wild poliovirus case in 11 years · WHO',
        ].map((t, i) => (
          <div key={i} className="positive-item"><span className="pos-check">✓</span><span>{t}</span></div>
        ))}
      </div>
      <p className="src-note">All data sourced from official government portals, international bodies, and verified civil society organisations. OPPOSITION does not editorialize — the data speaks.</p>
    </div>
  );
}
