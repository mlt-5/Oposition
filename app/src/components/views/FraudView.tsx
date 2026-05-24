import { useState } from 'react';
import { T } from '@/lib/tokens';
import { INR, statusChip } from '@/lib/helpers';
import Rule from '@/components/layout/Rule';
import { FRAUD_CASES } from '@/data/static';

const CATS = ['ALL', 'BANK', 'EXAM', 'POLITICAL', 'CORPORATE'] as const;

export default function FraudView() {
  const [filter, setFilter] = useState<string>('ALL');
  const shown = filter === 'ALL' ? FRAUD_CASES : FRAUD_CASES.filter(c => c.cat === filter);

  return (
    <div className="scroll-area fu">
      <div className="warn-box" style={{ '--wb': T.amber, '--wbg': 'rgba(146,82,10,.05)', marginBottom: 20 }}>
        <div className="warn-box-head">⚖ Legal Disclaimer</div>
        <div className="warn-box-body">All individuals and entities listed are <strong>accused, not convicted</strong> unless explicitly stated. All entries are based solely on official FIR, chargesheet, CAG report, or court order. Acquittals updated within 24 hours of judgment.</div>
      </div>

      <Rule title="Summary" />
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {[
          { val: '47',          lbl: 'Total Cases Tracked',  bad: true  },
          { val: '~₹1.18L Cr', lbl: 'Amount Involved',      bad: true  },
          { val: '~₹22,600 Cr',lbl: 'Assets Attached',      bad: false },
          { val: '~26%',        lbl: 'Avg Recovery Rate',    bad: true  },
          { val: '12',          lbl: 'Exam Leaks (2017-25)', bad: true  },
          { val: '3',           lbl: 'Convictions to Date',  bad: false },
        ].map(k => (
          <div key={k.lbl} className="stat-cell">
            <div className="stat-val" style={{ '--sc': k.bad ? T.red : T.green, fontSize: 22 }}>{k.val}</div>
            <div className="stat-label">{k.lbl}</div>
          </div>
        ))}
      </div>

      <Rule title="Case Database" />
      <div className="fchips">
        {CATS.map(c => (
          <button key={c} className={`fchip${filter === c ? ' on' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="card-grid">
        {shown.map(c => (
          <div key={c.id} className="card fu">
            <div className="card-head">
              <div>
                <div className="card-title">{c.name}</div>
                <div className="card-meta">{c.year} · {c.agency} · {c.cat}</div>
              </div>
              {statusChip(c.status)}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              <span className="chip ch-r">{c.amt > 0 ? INR(c.amt) + ' alleged' : 'Amt under eval'}</span>
              {c.attached > 0 && <span className="chip ch-a">{INR(c.attached)} attached</span>}
              {c.recovery > 0 && <span className="chip ch-n">{c.recovery}% recovered</span>}
            </div>
            <div className="card-body">
              <span style={{ fontFamily: "'Libre Baskerville',serif", color: T.muted, fontSize: 10, fontWeight: 700, letterSpacing: .5 }}>ACCUSED (PER FIR): </span>{c.accused}
            </div>
            <p className="card-source">Source: {c.agency} press release · Court records · Status: May 2026</p>
          </div>
        ))}
      </div>
    </div>
  );
}
