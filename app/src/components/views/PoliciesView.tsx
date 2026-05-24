import { T } from '@/lib/tokens';
import { statusChip } from '@/lib/helpers';
import Rule from '@/components/layout/Rule';
import { POLICIES } from '@/data/static';

export default function PoliciesView() {
  return (
    <div className="scroll-area fu">
      <Rule title="Central Government Policy Status" />
      <div className="card-grid">
        {POLICIES.map(p => {
          const utilPct = Math.round(p.spent / p.alloc * 100);
          return (
            <div key={p.name} className="card">
              <div className="card-head">
                <div>
                  <div className="card-title">{p.name}</div>
                  <div className="card-meta">{p.ministry}</div>
                </div>
                {statusChip(p.status)}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                <span className="chip ch-s">₹{p.alloc.toLocaleString('en-IN')} Cr</span>
                <span className="chip ch-n">{p.ben}</span>
              </div>
              <div style={{ marginBottom: p.issues.length ? 12 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Lora',serif", fontSize: 10, color: T.muted, marginBottom: 5 }}>
                  <span style={{ letterSpacing: .5, textTransform: 'uppercase', fontWeight: 600 }}>Budget Utilisation</span>
                  <span className="mono" style={{ color: utilPct >= 85 ? T.green : utilPct >= 70 ? T.amber : T.red }}>{utilPct}%</span>
                </div>
                <div className="pbar">
                  <div className="pfill" style={{ width: `${utilPct}%`, background: utilPct >= 85 ? T.green : utilPct >= 70 ? T.amber : T.red }} />
                </div>
              </div>
              {p.issues.length > 0 && (
                <div style={{ borderTop: `1px solid ${T.rule}`, paddingTop: 10 }}>
                  <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, fontWeight: 700, color: T.red, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5 }}>⚠ Flagged Issues</div>
                  {p.issues.map((iss, i) => (
                    <div key={i} style={{ fontFamily: "'Lora',serif", fontSize: 11, color: T.ink3, lineHeight: 1.5, marginBottom: 3 }}>· {iss}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="src-note">Sources: PIB (pib.gov.in) · CAG Audit Reports · Ministry Annual Reports · MyScheme Portal</p>
    </div>
  );
}
