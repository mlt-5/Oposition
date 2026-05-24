import { useState, useEffect } from 'react';
import { T } from '@/lib/tokens';
import Rule from '@/components/layout/Rule';
import YoYBarChart from '@/components/charts/YoYBarChart';
import FiscalLineChart from '@/components/charts/FiscalLineChart';
import { api } from '@/lib/api';
import type { MinistryRow, RevenueRow, ExpenditureRow, CapexRow, GdpCompRow, FiscalRow } from '@/lib/api';

interface BudgetData {
  min25: MinistryRow[]; min26be: MinistryRow[]; min26re: MinistryRow[]; min27: MinistryRow[];
  rev26: RevenueRow[];  rev27: RevenueRow[];
  exp26: ExpenditureRow[]; exp27: ExpenditureRow[];
  cap26: CapexRow[];   cap27: CapexRow[];
  gdpComp: GdpCompRow[];
  fiscal: FiscalRow[];
}

function BudgetDonut({ data, size = 140 }: { data: Array<{ pct: number; color: string }>; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38, stroke = size * 0.14;
  let angle = -90;
  const arcs = data.map(d => { const sweep = (d.pct / 100) * 360; const start = angle; angle += sweep; return { ...d, start, sweep }; });
  const polar = (rad: number) => [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  const arcPath = (start: number, sweep: number) => {
    if (sweep >= 360) sweep = 359.99;
    const [sx, sy] = polar((start * Math.PI) / 180);
    const [ex, ey] = polar(((start + sweep) * Math.PI) / 180);
    const large = sweep > 180 ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
  };
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      {arcs.map((a, i) => <path key={i} d={arcPath(a.start, a.sweep)} fill="none" stroke={a.color} strokeWidth={stroke} strokeLinecap="butt" />)}
      <circle cx={cx} cy={cy} r={r - stroke / 2 - 1} fill="#F4EFE2" />
    </svg>
  );
}

function HBar({ pct, color, max = 100 }: { pct: number; color: string; max?: number }) {
  return (
    <div style={{ flex: 1, height: 10, background: T.paper3, border: `1px solid ${T.rule}` }}>
      <div style={{ width: `${(pct / max) * 100}%`, height: '100%', background: color, transition: 'width .5s ease' }} />
    </div>
  );
}

const TABS = [
  { id: 'overview',    label: 'Overview' },
  { id: 'revenue',     label: 'Revenue Sources' },
  { id: 'expenditure', label: 'Where Money Goes' },
  { id: 'capex',       label: 'Capital Spending' },
  { id: 'ministry',    label: 'Ministry Tracker' },
  { id: 'fiscal',      label: 'Fiscal Health' },
];

const abbr = (name: string) => name
  .replace('Ministry of Finance (incl. Interest ₹12.74L Cr)', 'Finance')
  .replace('Ministry of Finance (incl. Interest ₹12.76L Cr)', 'Finance')
  .replace('Ministry of Finance (incl. Interest ₹11.16L Cr)', 'Finance')
  .replace('Ministry of Finance (incl. Interest ₹14.04L Cr)', 'Finance')
  .replace('Ministry of Defence', 'Defence')
  .replace('Road Transport & Highways', 'Roads')
  .replace('Consumer Affairs, Food & Public Distribution', 'Food')
  .replace('Railways (Gross Budgetary Support)', 'Railways')
  .replace('Home Affairs', 'Home')
  .replace('Rural Development', 'Rural Dev')
  .replace('Agriculture & Farmers Welfare', 'Agriculture')
  .replace('Jal Shakti (incl. Jal Jeevan Mission)', 'Jal Shakti')
  .replace('Education (School + Higher)', 'Education')
  .replace('Health & Family Welfare', 'Health')
  .replace('Women & Child Development', 'WCD');

const lakh = (n: number) => Math.round(n / 100000 * 100) / 100;

export default function BudgetView() {
  const [tab, setTab] = useState('overview');
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [loadErr, setLoadErr] = useState(false);

  useEffect(() => {
    Promise.all([
      api.ministry('FY25', 'Actuals'), api.ministry('FY26', 'BE'), api.ministry('FY26', 'RE'), api.ministry('FY27', 'BE'),
      api.revenue('FY26', 'RE'),   api.revenue('FY27', 'BE'),
      api.expenditure('FY26', 'RE'), api.expenditure('FY27', 'BE'),
      api.capex('FY26', 'RE'),     api.capex('FY27', 'BE'),
      api.gdpComparison('FY26', 'RE'),
      api.fiscalTrend(true),
    ]).then(([min25, min26be, min26re, min27, rev26, rev27, exp26, exp27, cap26, cap27, gdpComp, fiscal]) => {
      setBudgetData({ min25, min26be, min26re, min27, rev26, rev27, exp26, exp27, cap26, cap27, gdpComp, fiscal });
    }).catch(() => setLoadErr(true));
  }, []);

  if (!budgetData && !loadErr) return (
    <div className="scroll-area fu" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
      <span style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', color: T.muted, fontSize: 14 }}>Loading budget data from API…</span>
    </div>
  );
  if (loadErr) return (
    <div className="scroll-area fu" style={{ padding: 32 }}>
      <div className="warn-box" style={{ '--wb': T.red, '--wbg': 'rgba(185,28,28,.04)' }}>
        <div className="warn-box-head">API Connection Failed</div>
        <div className="warn-box-body">Cannot reach the budget API at <code>http://localhost:3001</code>. Start the server: <code>cd backend &amp;&amp; node server.js</code></div>
      </div>
    </div>
  );

  const { min25, min26be, min26re, min27, rev26, rev27, exp26, exp27, cap26, cap27, gdpComp: SECTOR_SPEND_GDPCOMP, fiscal: FISCAL_TREND } = budgetData!;
  const BUDGET_DATA = min26be;
  const REVENUE_SOURCES = rev26;
  const EXPENDITURE_SECTORS = exp26;
  const CAPEX_BREAKDOWN = cap26;
  const fmt2 = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(2)}L Cr` : `₹${(n / 1000).toFixed(0)}K Cr`;

  // ─── Chart data ───────────────────────────────────────────────────────────

  const overviewChartData = (['FY25', 'FY26', 'FY27'] as const).map(yr => {
    const f = FISCAL_TREND.find(x => x.yr === yr);
    if (!f) return null;
    return { yr, Revenue: lakh(f.revenue), Expenditure: lakh(f.exp), Deficit: lakh(f.deficit_abs) };
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  const revChartData = rev26.slice(0, 5).map(r => {
    const r27 = rev27.find(x => x.name === r.name);
    return { name: r.name.replace(' (Personal)', '').replace(' (CGST + Comp. Cess)', '').replace(' (Deficit Financing)', '').replace('Capital Receipts ', 'Capital\n'), 'FY26 RE': lakh(r.amt), 'FY27': r27 ? lakh(r27.amt) : 0 };
  });

  const expChartData = exp26.slice(0, 5).map(e => {
    const e27 = exp27.find(x => x.sector === e.sector);
    return { name: e.sector.replace(' (Food+Fert+LPG)', '').replace(' (Direct)', ''), 'FY26 RE': lakh(e.amt), 'FY27': e27 ? lakh(e27.amt) : 0 };
  });

  const capChartData = cap26.slice(0, 6).map(c => {
    const c27 = cap27.find(x => x.name === c.name);
    const shortName = c.name.replace('Road & Highways (MoRTH + NHAI)', 'Roads').replace('Railways (Gross Budgetary Support)', 'Railways').replace('Defence Capital Outlay', 'Defence Cap').replace("50-Yr Interest-Free Loans to States", '50yr Loans').replace('Jal Shakti (Jal Jeevan Mission)', 'Jal Jeevan').replace('Urban (Smart Cities + Metro + AMRUT)', 'Urban').replace('Housing PMAY (Urban + Rural)', 'Housing').replace('Digital (BharatNet + Semicon + AI)', 'Digital');
    return { name: shortName, 'FY26 RE': lakh(c.amt), 'FY27': c27 ? lakh(c27.amt) : 0 };
  });

  const minChartData = min26re.slice(0, 8).map(m => {
    const m25 = min25.find(x => x.name === m.name);
    const m27 = min27.find(x => x.name === m.name);
    return { name: abbr(m.name), 'FY25': m25 ? lakh(m25.alloc) : 0, 'FY26 RE': lakh(m.alloc), 'FY27': m27 ? lakh(m27.alloc) : 0 };
  });

  const fiscalChartData = FISCAL_TREND.map(f => ({ yr: f.yr, 'Deficit %': f.deficit, 'Debt % (÷10)': Math.round(f.debt / 10 * 10) / 10 }));

  return (
    <div className="scroll-area fu">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="tabs" style={{ marginBottom: 0, flex: 1, minWidth: 0 }}>
          {TABS.map(t => <button key={t.id} className={`tab${tab === t.id ? ' on' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
        </div>
        <div style={{ background: T.saffron, color: '#fff', fontSize: 10, fontFamily: "'Libre Baskerville',serif", fontWeight: 700, padding: '5px 12px', letterSpacing: .5, flexShrink: 0 }}>FY 2025-26</div>
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && <>
        <YoYBarChart
          title="Revenue vs Expenditure — FY25 Actuals / FY26 RE / FY27 BE"
          data={overviewChartData}
          xKey="yr"
          bars={[
            { key: 'Revenue',     label: 'Revenue',     color: T.green  },
            { key: 'Expenditure', label: 'Expenditure', color: T.red    },
            { key: 'Deficit',     label: 'Fiscal Gap',  color: T.amber  },
          ]}
        />
        <Rule title="Budget at a Glance — FY 2025-26 (Revised Estimates)" />
        <div className="stat-grid" style={{ marginBottom: 20 }}>
          {[
            { val: '₹33.42L Cr', lbl: 'Total Revenue Receipts', sub: 'Non-debt (FY26 RE)',       bad: false },
            { val: '₹49.65L Cr', lbl: 'Total Expenditure (RE)', sub: 'Revised Estimates',         bad: false },
            { val: '₹15.58L Cr', lbl: 'Fiscal Deficit',         sub: 'Financed via borrowing',    bad: true  },
            { val: '4.4% GDP',   lbl: 'Deficit as % of GDP',    sub: 'RE: Target maintained',     bad: true  },
            { val: '₹10.96L Cr', lbl: 'Capital Expenditure',    sub: 'RE; 2.9% of GDP',           bad: false },
            { val: '₹12.74L Cr', lbl: 'Interest Payments',      sub: '25.7% of all expenditure',  bad: true  },
          ].map(k => (
            <div key={k.lbl} className="stat-cell">
              <div className="stat-val" style={{ '--sc': k.bad ? T.red : T.green, fontSize: 20 }}>{k.val}</div>
              <div className="stat-label">{k.lbl}</div>
              <div className="stat-sub">{k.sub}</div>
            </div>
          ))}
        </div>
        <Rule title="Money Flow — Revenue In vs Expenditure Out" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ border: `2px solid ${T.ink}`, background: T.paper }}>
            <div style={{ background: T.green, color: '#fff', padding: '8px 14px', fontFamily: "'Libre Baskerville',serif", fontSize: 9, fontWeight: 700, letterSpacing: 2 }}>₹49.65L CRORE IN ▼ (FY26 RE)</div>
            {REVENUE_SOURCES.map((r, i) => {
              const color = r.type === 'Borrowings' ? T.red : r.type === 'Direct Tax' ? T.green : r.type === 'Indirect Tax' ? T.amber : r.type === 'Capital' ? T.ink : T.muted;
              return (
                <div key={i} style={{ padding: '10px 14px', borderBottom: `1px solid ${T.rule}`, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: "'Lora',serif", fontSize: 12, fontWeight: 600, color: T.ink }}>{r.name.replace(' (Personal)', '').replace(' (CGST + Comp. Cess)', '').replace(' (Non-Debt)', '').replace(' (Deficit Financing)', '')}</span>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700, color }}>{fmt2(r.amt)}</span>
                  </div>
                  <div className="pbar"><div className="pfill" style={{ width: `${Math.min(r.pct, 100)}%`, background: color }} /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', fontSize: 10, color: T.muted }}>{r.type}</span>
                    <span className="mono" style={{ fontSize: 9, color: T.muted }}>{r.pct}% of budget</span>
                  </div>
                </div>
              );
            })}
            <div style={{ padding: '8px 14px', background: T.paper2, borderTop: `1px solid ${T.rule}` }}>
              <span style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', fontSize: 10, color: T.muted }}>* Gross tax receipts ₹40.6L Cr; ₹13.9L Cr devolved to States (shown in OUT as Tax Devolution)</span>
            </div>
          </div>
          <div style={{ border: `2px solid ${T.ink}`, background: T.paper }}>
            <div style={{ background: T.red, color: '#fff', padding: '8px 14px', fontFamily: "'Libre Baskerville',serif", fontSize: 9, fontWeight: 700, letterSpacing: 2 }}>₹49.65L CRORE OUT ▲ (FY26 RE)</div>
            {EXPENDITURE_SECTORS.map((e, i) => (
              <div key={i} style={{ padding: '10px 14px', borderBottom: `1px solid ${T.rule}`, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: "'Lora',serif", fontSize: 12, fontWeight: 600, color: T.ink }}>{e.sector.replace(' (Food+Fert+LPG)', '').replace(' (Direct)', '')}</span>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: e.color }}>{fmt2(e.amt)}</span>
                </div>
                <div className="pbar"><div className="pfill" style={{ width: `${e.pct}%`, background: e.color }} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', fontSize: 10, color: T.muted }}>{e.type}</span>
                  <span className="mono" style={{ fontSize: 9, color: T.muted }}>{e.pct}% of budget</span>
                </div>
              </div>
            ))}
            <div style={{ padding: '8px 14px', background: T.paper2, borderTop: `1px solid ${T.rule}` }}>
              <span style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', fontSize: 10, color: T.muted }}>* Capital Expenditure ₹10.96L Cr is government-wide and overlaps with Defence capital outlay</span>
            </div>
          </div>
        </div>
        <div className="warn-box" style={{ '--wb': T.red, '--wbg': 'rgba(185,28,28,.04)', marginBottom: 16 }}>
          <div className="warn-box-head">⚠ Borrowings: ₹31 of Every ₹100 Received — FY26 RE</div>
          <div className="warn-box-body">The government raises ₹49.65L Cr total: ₹33.42L Cr in revenue and ₹15.58L Cr by <strong>borrowing (G-Secs, small savings, T-Bills)</strong> — 31.4% of the entire budget. On the spending side, <strong>interest payments alone consume 25.7 paise of every rupee spent</strong> (₹12.74L Cr), exceeding defence, education, and health combined. India's total outstanding debt stands at ~₹185L Cr (56.1% of GDP). Every year's borrowing adds to a compounding debt burden borne by future taxpayers.</div>
        </div>
        <p className="src-note">Source: Union Budget 2025-26 · Budget Speech · Annual Financial Statement · Receipt Budget · indiabudget.gov.in</p>
      </>}

      {/* ── REVENUE SOURCES ── */}
      {tab === 'revenue' && <>
        <YoYBarChart
          title="Revenue Sources — FY26 RE vs FY27 BE"
          data={revChartData}
          bars={[
            { key: 'FY26 RE', label: 'FY26 RE', color: T.amber  },
            { key: 'FY27',    label: 'FY27 BE', color: T.saffron },
          ]}
        />
        <Rule title="Where Does Government Money Come From?" />
        <div style={{ border: `2px solid ${T.ink}`, background: T.paper, marginBottom: 20 }}>
          <div style={{ background: T.ink, color: T.paper, padding: '8px 16px', fontFamily: "'Libre Baskerville',serif", fontSize: 9, fontWeight: 700, letterSpacing: 2 }}>TOTAL RECEIPTS — ₹33.42 LAKH CRORE (FY 2025-26 RE)</div>
          <div style={{ padding: 20, display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <BudgetDonut data={REVENUE_SOURCES} size={160} />
            <div style={{ flex: 1, minWidth: 200 }}>
              {REVENUE_SOURCES.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, background: r.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: "'Lora',serif", fontSize: 12, fontWeight: 600, color: T.ink }}>{r.name}</span>
                      <span className="mono" style={{ fontSize: 11, color: T.muted }}>{r.pct}%</span>
                    </div>
                    <div style={{ fontFamily: "'Lora',serif", fontSize: 10, color: T.muted }}>{fmt2(r.amt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Rule title="Revenue Source Detail" />
        <div className="tbl-wrap">
          <table className="dtbl">
            <thead><tr><th>Revenue Source</th><th>Type</th><th>Amount (₹ Cr)</th><th>% of Total</th><th style={{ minWidth: 120 }}>Share Bar</th><th>YoY Growth</th></tr></thead>
            <tbody>
              {REVENUE_SOURCES.map(r => (
                <tr key={r.name}>
                  <td className="tw" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, background: r.color, flexShrink: 0 }} />{r.name}
                  </td>
                  <td><span className="chip ch-n" style={{ fontSize: 8 }}>{r.type}</span></td>
                  <td className="mono">{r.amt.toLocaleString('en-IN')}</td>
                  <td className="mono" style={{ fontWeight: 700 }}>{r.pct}%</td>
                  <td><HBar pct={r.pct} color={r.color} max={30} /></td>
                  <td className="mono" style={{ color: r.yoy > 0 ? T.green : T.red, fontWeight: 700 }}>{r.yoy > 0 ? `▲ +${r.yoy}%` : `▼ ${r.yoy}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Rule title="Tax Structure Analysis" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 16 }}>
          {[
            { head: 'Direct Taxes',    val: '₹24.0L Cr', pct: '47%', note: 'Income Tax + Corporate Tax. Direct taxes are paid by those who earn — progressive in principle. Only 7.4% of Indians file returns.',     flag: 'ch-a' },
            { head: 'Indirect Taxes',  val: '₹16.5L Cr', pct: '33%', note: 'GST + Customs + Excise. Indirect taxes are regressive — the poor pay the same GST rate as the rich on essentials.',                     flag: 'ch-r' },
            { head: 'Non-Tax Revenue', val: '₹5.7L Cr',  pct: '11%', note: 'RBI surplus, PSU dividends, spectrum fees, external grants. Highly variable year to year.',                                             flag: 'ch-n' },
            { head: 'Capital Receipts',val: '₹3.5L Cr',  pct: '7%',  note: 'Disinvestment proceeds + loan repayments. FY26 disinvestment target ₹47,000 Cr. Historical underachievement pattern.',              flag: 'ch-a' },
          ].map((b, i) => (
            <div key={i} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: "'Lora',serif", fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: 1, textTransform: 'uppercase' }}>{b.head}</span>
                <span className={`chip ${b.flag}`}>{b.pct}</span>
              </div>
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 22, fontWeight: 700, color: T.ink, marginBottom: 8 }}>{b.val}</div>
              <div style={{ fontFamily: "'Lora',serif", fontSize: 11, color: T.ink3, lineHeight: 1.6 }}>{b.note}</div>
            </div>
          ))}
        </div>
        <p className="src-note">Source: Receipt Budget 2025-26 · Revenue Budget Statement · CGA Monthly Accounts · indiabudget.gov.in</p>
      </>}

      {/* ── EXPENDITURE ── */}
      {tab === 'expenditure' && <>
        <YoYBarChart
          title="Expenditure Sectors — FY26 RE vs FY27 BE"
          data={expChartData}
          bars={[
            { key: 'FY26 RE', label: 'FY26 RE', color: T.red    },
            { key: 'FY27',    label: 'FY27 BE', color: T.amber  },
          ]}
        />
        <Rule title="Where Does Government Money Go?" />
        <div style={{ border: `2px solid ${T.ink}`, background: T.paper, marginBottom: 20 }}>
          <div style={{ background: T.ink, color: T.paper, padding: '8px 16px', fontFamily: "'Libre Baskerville',serif", fontSize: 9, fontWeight: 700, letterSpacing: 2 }}>TOTAL EXPENDITURE — ₹49.65 LAKH CRORE (FY 2025-26 RE)</div>
          <div style={{ padding: 20, display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <BudgetDonut data={EXPENDITURE_SECTORS.map(e => ({ pct: e.pct, color: e.color }))} size={160} />
            <div style={{ flex: 1, minWidth: 200 }}>
              {EXPENDITURE_SECTORS.map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, background: e.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: "'Lora',serif", fontSize: 11, fontWeight: 600, color: T.ink, lineHeight: 1.3 }}>{e.sector}</span>
                    <span className="mono" style={{ fontSize: 10, color: T.muted, flexShrink: 0, marginLeft: 6 }}>{e.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Rule title="Expenditure Breakdown" />
        <div className="tbl-wrap">
          <table className="dtbl">
            <thead><tr><th>Expenditure Head</th><th>Type</th><th>Amount (₹ Cr)</th><th>% of Budget</th><th style={{ minWidth: 130 }}>Share</th><th>Note</th></tr></thead>
            <tbody>
              {EXPENDITURE_SECTORS.map(e => (
                <tr key={e.sector}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 8, height: 8, background: e.color, flexShrink: 0 }} /><span className="tw">{e.sector}</span></td>
                  <td><span className="chip ch-n" style={{ fontSize: 8 }}>{e.type}</span></td>
                  <td className="mono">{e.amt.toLocaleString('en-IN')}</td>
                  <td className="mono" style={{ fontWeight: 700, color: e.pct >= 20 ? T.red : e.pct >= 10 ? T.amber : T.ink }}>{e.pct}%</td>
                  <td><HBar pct={e.pct} color={e.color} max={25} /></td>
                  <td style={{ fontFamily: "'Lora',serif", fontSize: 11, color: T.muted, maxWidth: 220 }}>{e.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Rule title="India's Social Spending vs Global Benchmarks (% of GDP)" />
        <div style={{ border: `2px solid ${T.ink}`, background: T.paper, marginBottom: 16 }}>
          <div style={{ background: T.ink, color: T.paper, padding: '8px 16px', fontFamily: "'Libre Baskerville',serif", fontSize: 9, fontWeight: 700, letterSpacing: 2 }}>HOW INDIA'S SOCIAL INVESTMENT COMPARES</div>
          {SECTOR_SPEND_GDPCOMP.map((s, i) => (
            <div key={i} style={{ padding: '14px 16px', borderBottom: `1px solid ${T.rule}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 12, fontWeight: 700, color: T.ink }}>{s.sector}</span>
                <div style={{ display: 'flex', gap: 12, fontSize: 10, fontFamily: "'Lora',serif" }}>
                  <span style={{ color: T.red, fontWeight: 700 }}>India: {s.india}%</span>
                  <span style={{ color: T.muted }}>Avg: {s.world_avg}%</span>
                  <span style={{ color: T.green }}>Rec: {s.recommended}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { label: `India (${s.india}%)`,         val: s.india,         color: T.red    },
                  { label: `World Avg (${s.world_avg}%)`, val: s.world_avg,     color: T.amber  },
                  { label: `Developed (${s.developed}%)`, val: s.developed,     color: T.green  },
                  { label: `Rec. (${s.recommended}%)`,    val: s.recommended,   color: '#2563EB' },
                ].map(b => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: "'Lora',serif", fontSize: 10, color: T.muted, minWidth: 140 }}>{b.label}</span>
                    <div style={{ flex: 1, height: 8, background: T.paper3, border: `1px solid ${T.rule}` }}>
                      <div style={{ width: `${(b.val / 10) * 100}%`, height: '100%', background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="warn-box" style={{ '--wb': T.red, '--wbg': 'rgba(185,28,28,.04)' }}>
          <div className="warn-box-head">Critical Finding — Social Spend Below Global Floor</div>
          <div className="warn-box-body">India spends <strong>1.4% of GDP on Education</strong> — less than half the UNESCO-recommended 6%. On Health it is <strong>0.9% of GDP</strong> — among the lowest in G20. Meanwhile, <strong>Interest Payments at 24% of expenditure exceed the combined spend on Education, Health, Agriculture, and Women & Child Development</strong>.</div>
        </div>
      </>}

      {/* ── CAPEX ── */}
      {tab === 'capex' && <>
        <YoYBarChart
          title="Capital Expenditure — FY26 RE vs FY27 BE"
          data={capChartData}
          bars={[
            { key: 'FY26 RE', label: 'FY26 RE', color: T.green  },
            { key: 'FY27',    label: 'FY27 BE', color: T.saffron },
          ]}
        />
        <Rule title="Capital Expenditure — Building Assets for the Future" />
        <div className="stat-grid" style={{ marginBottom: 20 }}>
          {[
            { val: '₹10.96L Cr', lbl: 'Total CapEx FY26 RE',  sub: '2.7% of GDP (RE)',            bad: false },
            { val: '22.1%',       lbl: 'of Total Expenditure', sub: 'RE; up from 12% in FY20',     bad: false },
            { val: '2.7% GDP',    lbl: 'CapEx as % of GDP',   sub: 'RE (vs 3.1% BE target)',       bad: false },
            { val: '₹2.77L Cr',  lbl: 'Roads & Highways',    sub: 'RE; -3.6% vs BE',              bad: false },
            { val: '₹2.65L Cr',  lbl: 'Railways',            sub: 'RE; +5.1% vs BE',              bad: false },
            { val: '₹1.44L Cr',  lbl: 'State CapEx Loans',   sub: '50-yr interest-free (RE)',     bad: false },
          ].map(k => (
            <div key={k.lbl} className="stat-cell">
              <div className="stat-val" style={{ '--sc': T.green, fontSize: 18 }}>{k.val}</div>
              <div className="stat-label">{k.lbl}</div>
              <div className="stat-sub">{k.sub}</div>
            </div>
          ))}
        </div>
        <Rule title="CapEx Sector Breakdown" />
        <div style={{ border: `2px solid ${T.ink}`, background: T.paper, marginBottom: 20 }}>
          <div style={{ background: T.ink, color: T.paper, padding: '8px 16px', fontFamily: "'Libre Baskerville',serif", fontSize: 9, fontWeight: 700, letterSpacing: 2 }}>TOTAL CAPITAL SPENDING — ₹10.96 LAKH CRORE (FY26 RE)</div>
          {CAPEX_BREAKDOWN.map((c, i) => (
            <div key={i} style={{ padding: '13px 16px', borderBottom: i < CAPEX_BREAKDOWN.length - 1 ? `1px solid ${T.rule}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 12, fontWeight: 700, color: T.ink }}>{c.name}</div>
                  <div style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', fontSize: 10, color: T.muted, marginTop: 2 }}>{c.note}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{fmt2(c.amt)}</div>
                  <div className="mono" style={{ fontSize: 10, color: c.yoy > 0 ? T.green : T.red, marginTop: 2 }}>{c.yoy > 0 ? `▲ +${c.yoy}%` : `▼ ${c.yoy}%`} YoY</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 10, background: T.paper3, border: `1px solid ${T.rule}` }}>
                  <div style={{ width: `${(c.amt / 287300) * 100}%`, height: '100%', background: c.yoy >= 0 ? T.green : T.red, transition: 'width .5s' }} />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: T.muted, minWidth: 60, textAlign: 'right' }}>{c.pct_gdp}% GDP</span>
              </div>
            </div>
          ))}
        </div>
        <div className="warn-box" style={{ '--wb': T.amber, '--wbg': 'rgba(146,82,10,.04)', marginBottom: 12 }}>
          <div className="warn-box-head">⚠ CapEx Quality Concerns — RE Reveals Under-execution</div>
          <div className="warn-box-body">The FY26 Revised Estimates reveal stark under-execution: <strong>Jal Jeevan Mission slashed 75.8%</strong> (₹70,163 Cr BE → ₹17,000 Cr RE) despite 21% rural coverage gap. <strong>Urban CapEx down 46%</strong> and <strong>Housing down 55%</strong> vs BE. Only Railways exceeded budget (+5.1%). Total CapEx came in ₹25,335 Cr below the BE target.</div>
        </div>
        <p className="src-note">Source: Expenditure Budget 2025-26 · Capital Budget Statement · CAG Performance Audit Reports</p>
      </>}

      {/* ── MINISTRY ── */}
      {tab === 'ministry' && <>
        <YoYBarChart
          title="Ministry Allocations — FY25 Actuals / FY26 RE / FY27 BE"
          data={minChartData}
          bars={[
            { key: 'FY25',    label: 'FY25 Actuals', color: T.muted   },
            { key: 'FY26 RE', label: 'FY26 RE',      color: T.amber   },
            { key: 'FY27',    label: 'FY27 BE',      color: T.saffron },
          ]}
          height={280}
        />
        <Rule title="Ministry-wise Budget Allocation vs Actual Utilisation — Q3 FY26" />
        <div className="tbl-wrap">
          <table className="dtbl">
            <thead><tr><th>Ministry</th><th>Allocation (₹ Cr)</th><th>Spent (₹ Cr)</th><th style={{ minWidth: 150 }}>Utilisation</th><th>Status</th></tr></thead>
            <tbody>
              {BUDGET_DATA.map(m => (
                <tr key={m.name}>
                  <td className="tw">{m.name}</td>
                  <td className="mono">{m.alloc.toLocaleString('en-IN')}</td>
                  <td className="mono">{m.spent.toLocaleString('en-IN')}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="pbar" style={{ flex: 1 }}>
                        <div className="pfill" style={{ width: `${m.pct}%`, background: m.pct >= 85 ? T.green : m.pct >= 70 ? T.amber : T.red }} />
                      </div>
                      <span className="mono" style={{ fontSize: 11, color: m.pct >= 85 ? T.green : m.pct >= 70 ? T.amber : T.red, minWidth: 34 }}>{m.pct}%</span>
                    </div>
                  </td>
                  <td><span className={`chip ${m.pct >= 85 ? 'ch-g' : m.pct >= 70 ? 'ch-a' : 'ch-r'}`}>{m.pct >= 85 ? 'On Track' : m.pct >= 70 ? 'Watch' : 'Under-utilized'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="warn-box" style={{ '--wb': T.red, '--wbg': 'rgba(185,28,28,.04)' }}>
          <div className="warn-box-head">Q3 Alert — Critical Under-utilisation</div>
          <div className="warn-box-body">Women & Child Development (54%), Health (58%), Education (61%), and Rural Development (63%) are all below 65% with one quarter remaining. CAG has flagged Q4 "March rush" spending in 6 of the last 8 years. Source: CGA Monthly Accounts</div>
        </div>
        <p className="src-note">Source: Controller General of Accounts (cga.nic.in) · Ministry Annual Reports · PFMS real-time data</p>
      </>}

      {/* ── FISCAL HEALTH ── */}
      {tab === 'fiscal' && <>
        <FiscalLineChart
          title="FISCAL DEFICIT & DEBT AS % OF GDP — FY20 TO FY27"
          data={fiscalChartData}
          xKey="yr"
          lines={[
            { key: 'Deficit %',    label: 'Fiscal Deficit %', color: T.red   },
            { key: 'Debt % (÷10)', label: 'Debt % (÷10)',     color: T.amber },
          ]}
          referenceValue={4.5}
          referenceLabel="4.5% target"
        />
        <Rule title="Fiscal Health — Deficit & Debt Trends (FY 2019-20 to FY 2025-26)" />
        <div className="stat-grid" style={{ marginBottom: 20 }}>
          {[
            { val: '₹185L Cr',  lbl: 'Total Outstanding Debt',    sub: '~76.8% of GDP',      bad: true  },
            { val: '₹12.0L Cr', lbl: 'Annual Interest Bill',      sub: '24% of exp.',         bad: true  },
            { val: '₹47Cr/min', lbl: 'Interest Paid Every Minute', sub: '₹22,831 Cr/day',    bad: true  },
            { val: '4.4%',      lbl: 'Fiscal Deficit FY26',       sub: 'Down from 9.2% (FY21)', bad: false },
          ].map(k => (
            <div key={k.lbl} className="stat-cell">
              <div className="stat-val" style={{ '--sc': k.bad ? T.red : T.green, fontSize: 18 }}>{k.val}</div>
              <div className="stat-label">{k.lbl}</div>
              <div className="stat-sub">{k.sub}</div>
            </div>
          ))}
        </div>
        <Rule title="Fiscal Deficit % of GDP — Year-on-Year Trend" />
        <div style={{ border: `2px solid ${T.ink}`, background: T.paper, marginBottom: 20 }}>
          <div style={{ background: T.ink, color: T.paper, padding: '8px 16px', fontFamily: "'Libre Baskerville',serif", fontSize: 9, fontWeight: 700, letterSpacing: 2 }}>FISCAL DEFICIT AS % OF GDP — FY20 TO FY27</div>
          {FISCAL_TREND.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < FISCAL_TREND.length - 1 ? `1px solid ${T.rule}` : 'none' }}>
              <span style={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, fontSize: 14, color: T.ink, minWidth: 42 }}>{f.yr}</span>
              <div style={{ flex: 1 }}>
                <div style={{ height: 16, background: T.paper3, border: `1px solid ${T.rule}`, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(f.deficit / 10) * 100}%`, background: f.deficit > 6 ? T.red : f.deficit > 4.5 ? T.amber : T.green, display: 'flex', alignItems: 'center', paddingLeft: 6 }}>
                    <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{f.deficit}%</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 80 }}>
                <div className="mono" style={{ fontSize: 10, color: T.muted }}>Debt: {f.debt}%</div>
              </div>
            </div>
          ))}
          <div style={{ padding: '10px 16px', background: T.paper2, borderTop: `1px solid ${T.rule}` }}>
            <div style={{ display: 'flex', gap: 16, fontFamily: "'Lora',serif", fontSize: 10 }}>
              <span style={{ color: T.green }}>■ Below 4.5% (Target)</span>
              <span style={{ color: T.amber }}>■ 4.5%–6% (Elevated)</span>
              <span style={{ color: T.red   }}>■ Above 6% (Critical)</span>
            </div>
          </div>
        </div>
        <div className="tbl-wrap" style={{ marginBottom: 16 }}>
          <table className="dtbl">
            <thead><tr><th>Year</th><th>Revenue (₹ Cr)</th><th>Expenditure (₹ Cr)</th><th>Deficit (₹ Cr)</th><th>Deficit % GDP</th><th>Debt % GDP</th></tr></thead>
            <tbody>
              {FISCAL_TREND.map(f => {
                const def = f.deficit_abs;
                return (
                  <tr key={f.yr}>
                    <td style={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, color: T.ink }}>{f.yr}</td>
                    <td className="mono text-green">{f.revenue.toLocaleString('en-IN')}</td>
                    <td className="mono" style={{ color: T.red }}>{f.exp.toLocaleString('en-IN')}</td>
                    <td className="mono" style={{ color: T.red }}>-{def.toLocaleString('en-IN')}</td>
                    <td className="mono" style={{ fontWeight: 700, color: f.deficit > 6 ? T.red : f.deficit > 4.5 ? T.amber : T.green }}>{f.deficit}%</td>
                    <td className="mono" style={{ color: f.debt > 80 ? T.red : T.amber }}>{f.debt}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="warn-box" style={{ '--wb': T.amber, '--wbg': 'rgba(146,82,10,.04)' }}>
          <div className="warn-box-head">Fiscal Context</div>
          <div className="warn-box-body">India's fiscal deficit spiked to 9.2% of GDP in FY21 due to COVID-19 stimulus. Consolidation has been steady since, targeting 4.5% by FY26 and 4.0% by FY28 (MTFP). However, total debt at ~76.8% of GDP remains elevated. The IMF recommends emerging economies target below 60% debt/GDP. <strong>Every 1% rise in global interest rates adds ~₹1.8L Cr to India's annual borrowing cost.</strong></div>
        </div>
        <p className="src-note">Source: Union Budget 2025-26 · Medium Term Fiscal Policy Statement · RBI State of the Economy · IMF Article IV</p>
      </>}
    </div>
  );
}
