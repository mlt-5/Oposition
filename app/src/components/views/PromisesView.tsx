import { useState } from 'react';
import { T } from '@/lib/tokens';
import { INR, statusChip } from '@/lib/helpers';
import Rule from '@/components/layout/Rule';
import { PROMISES, PROJECTS } from '@/data/static';

const STATUSES = ['ALL', 'FULFILLED', 'PARTIAL', 'DELAYED', 'NOT_MET'] as const;

export default function PromisesView() {
  const [filter, setFilter] = useState<string>('ALL');
  const shown = filter === 'ALL' ? PROMISES : PROMISES.filter(p => p.status === filter);
  const counts = {
    F: PROMISES.filter(p => p.status === 'FULFILLED').length,
    P: PROMISES.filter(p => p.status === 'PARTIAL').length,
    D: PROMISES.filter(p => p.status === 'DELAYED').length,
    N: PROMISES.filter(p => p.status === 'NOT_MET').length,
  };

  return (
    <div className="scroll-area fu">
      <Rule title="Manifesto Promise Tracker" />
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {[
          { val: String(PROMISES.length),                                lbl: 'Promises Tracked', bad: false },
          { val: String(counts.F),                                       lbl: 'Fulfilled',         bad: false },
          { val: String(counts.P),                                       lbl: 'Partial',           bad: true  },
          { val: String(counts.D),                                       lbl: 'Delayed',           bad: true  },
          { val: String(counts.N),                                       lbl: 'Not Met',           bad: true  },
          { val: `${Math.round(counts.F / PROMISES.length * 100)}%`,    lbl: 'Fulfilment Rate',   bad: true  },
        ].map(k => (
          <div key={k.lbl} className="stat-cell">
            <div className="stat-val" style={{ '--sc': k.bad ? T.red : T.green, fontSize: 22 }}>{k.val}</div>
            <div className="stat-label">{k.lbl}</div>
          </div>
        ))}
      </div>

      <div className="fchips">
        {STATUSES.map(s => (
          <button key={s} className={`fchip${filter === s ? ' on' : ''}`} onClick={() => setFilter(s)}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {shown.map(p => (
          <div key={p.id} className="card fu" style={{ borderLeftWidth: 4, borderLeftColor: p.status === 'FULFILLED' ? T.green : p.status === 'NOT_MET' ? T.red : T.amber }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
              {statusChip(p.status)}
              <span style={{ fontFamily: "'Lora',serif", fontSize: 10, color: T.muted, flexShrink: 0 }}>{p.party} · {p.year}</span>
            </div>
            <div style={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.4, marginBottom: 10 }}>{p.text}</div>
            <div style={{ fontFamily: "'Lora',serif", fontSize: 12, color: T.ink3, lineHeight: 1.6, borderLeft: `3px solid ${p.status === 'FULFILLED' ? T.green : p.status === 'NOT_MET' ? T.red : T.amber}`, paddingLeft: 10 }}>{p.evidence}</div>
            <p className="card-source">Source: {p.src}</p>
          </div>
        ))}
      </div>

      <Rule title="Infrastructure Project Tracker" />
      <div className="tbl-wrap">
        <table className="dtbl">
          <thead>
            <tr>
              <th>Project</th><th>Orig. Budget</th><th>Curr. Budget</th>
              <th>Orig. Deadline</th><th>Curr. Deadline</th>
              <th style={{ minWidth: 100 }}>Progress</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map(p => (
              <tr key={p.name}>
                <td className="tw" style={{ fontSize: 12 }}>{p.name}</td>
                <td className="mono" style={{ color: T.muted }}>{INR(p.bOrig)}</td>
                <td className="mono" style={{ color: p.bCurr > p.bOrig ? T.red : T.green }}>{INR(p.bCurr)}</td>
                <td style={{ fontFamily: "'Lora',serif", fontSize: 11, color: T.muted }}>{p.dOrig}</td>
                <td style={{ fontFamily: "'Lora',serif", fontSize: 11, color: p.dCurr > p.dOrig ? T.red : T.muted }}>{p.dCurr}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className="pbar" style={{ flex: 1 }}>
                      <div className="pfill" style={{ width: `${p.pct}%`, background: p.pct >= 75 ? T.green : p.pct >= 50 ? T.amber : T.red }} />
                    </div>
                    <span className="mono" style={{ fontSize: 10, minWidth: 28 }}>{p.pct}%</span>
                  </div>
                </td>
                <td>{statusChip(p.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="src-note">Sources: PIB, Ministry Annual Reports, CAG Audit Reports, PRS Legislative Research</p>
    </div>
  );
}
