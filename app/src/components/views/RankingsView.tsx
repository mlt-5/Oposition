import { useState } from 'react';
import { T } from '@/lib/tokens';
import Rule from '@/components/layout/Rule';
import { RANKINGS } from '@/data/static';

const CATS = ['all', 'economic', 'human', 'governance', 'environment'] as const;

export default function RankingsView() {
  const [cat, setCat] = useState<string>('all');
  const shown = cat === 'all' ? RANKINGS : RANKINGS.filter(r => r.cat === cat);

  return (
    <div className="scroll-area fu">
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
          Rankings sourced directly from publishing organisations. This page presents data without editorial comment. The <strong>delta</strong> column shows year-on-year change. Citizens draw their own conclusions.
        </p>
      </div>

      <Rule title="Summary" />
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {[
          { val: String(RANKINGS.filter(r => r.dir === 'good').length), lbl: 'Positive (Top 50)',   bad: false },
          { val: String(RANKINGS.filter(r => r.dir === 'bad').length),  lbl: 'Negative (Bottom 50%)', bad: true  },
          { val: '25+',                                                  lbl: 'Indices Tracked',     bad: false },
          { val: '2025',                                                 lbl: 'Reference Year',      bad: false },
        ].map(k => (
          <div key={k.lbl} className="stat-cell">
            <div className="stat-val" style={{ '--sc': k.bad ? T.red : T.green, fontSize: 26 }}>{k.val}</div>
            <div className="stat-label">{k.lbl}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        {CATS.map(c => (
          <button key={c} className={`tab${cat === c ? ' on' : ''}`} onClick={() => setCat(c)}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ border: `2px solid ${T.ink}`, background: T.paper }}>
        {shown.map((r, i) => (
          <div key={i} className="rank-row" style={{ padding: '12px 16px', borderBottom: i < shown.length - 1 ? `1px solid ${T.rule}` : 'none', animationDelay: `${i * 25}ms`, flexWrap: 'wrap', gap: 8, '--rc': r.dir === 'bad' ? T.red : T.green }}>
            <div className="rank-number">{r.rank}</div>
            <div className="rank-info" style={{ flex: 1, minWidth: 120 }}>
              <div className="rank-name">{r.index}</div>
              <div className="rank-pub">{r.pub} · 2024-25</div>
              <div className="rank-score">Score: {r.score}</div>
              {r.note && <div style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', fontSize: 10, color: T.faint, marginTop: 3, lineHeight: 1.4 }}>{r.note}</div>}
            </div>
            <div className="rank-delta" style={{ color: r.delta > 0 ? T.green : r.delta < 0 ? T.red : T.muted }}>
              {r.delta > 0 ? `▲${r.delta}` : r.delta < 0 ? `▼${Math.abs(r.delta)}` : '—'}
              <div style={{ fontFamily: "'Lora',serif", fontSize: 8, color: T.ghost, marginTop: 2 }}>vs prev yr</div>
            </div>
          </div>
        ))}
      </div>
      <p className="src-note" style={{ marginTop: 12 }}>All rankings sourced from respective publishing organisations. Rankings presented as published — no adjustments made.</p>
    </div>
  );
}
