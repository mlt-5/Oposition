import { T } from '@/lib/tokens';
import { vLabel } from '@/lib/helpers';
import Rule from '@/components/layout/Rule';
import { STATEMENTS } from '@/data/static';

export default function StatementsView() {
  return (
    <div className="scroll-area fu">
      <Rule title="Statement Database" />
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {[
          { val: '248', lbl: 'Statements Tracked',  bad: false },
          { val: '89',  lbl: 'False / Misleading',  bad: true  },
          { val: '92',  lbl: 'True / Mostly True',  bad: false },
          { val: '67',  lbl: 'Unverifiable',         bad: false },
        ].map(k => (
          <div key={k.lbl} className="stat-cell">
            <div className="stat-val" style={{ '--sc': k.bad ? T.red : T.green, fontSize: 26 }}>{k.val}</div>
            <div className="stat-label">{k.lbl}</div>
          </div>
        ))}
      </div>

      <div className="warn-box" style={{ '--wb': T.amber, '--wbg': 'rgba(146,82,10,.05)', marginBottom: 20 }}>
        <div className="warn-box-head">⚖ Editorial Protocol</div>
        <div className="warn-box-body">OPPOSITION aggregates verdicts from established fact-checking organisations (AFWA, Boom, AltNews, FactChecker.in, PRS). Where we publish our own analysis, we use language like "Data shows X, Government claims Y" — never "Government lied." All original fact-check source links preserved.</div>
      </div>

      {STATEMENTS.map(s => (
        <div key={s.id} className="card fu" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, fontSize: 13, color: T.ink }}>{s.speaker}</div>
              <div style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', fontSize: 10, color: T.muted, marginTop: 2 }}>{s.platform} · {s.date}</div>
            </div>
            <span className={`vd-${s.verdict}`}>{vLabel[s.verdict] ?? s.verdict}</span>
          </div>
          <div style={{ background: T.paper2, borderLeft: `4px solid ${T.saffron}`, padding: '10px 14px', marginBottom: 10 }}>
            <div style={{ fontFamily: "'Libre Baskerville',serif", fontStyle: 'italic', fontSize: 13, color: T.ink, lineHeight: 1.6 }}>"{s.claim}"</div>
          </div>
          <div style={{ fontFamily: "'Lora',serif", fontSize: 12, color: T.ink3, lineHeight: 1.6 }}>{s.note}</div>
          <p className="card-source">Fact-Checker: {s.checker}</p>
        </div>
      ))}
    </div>
  );
}
