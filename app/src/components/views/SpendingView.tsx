import { T } from '@/lib/tokens';
import Rule from '@/components/layout/Rule';

export default function SpendingView() {
  return (
    <div className="scroll-area fu">
      <Rule title="Q3 FY26 Expenditure Summary" />
      <div className="stat-grid" style={{ marginBottom: 22 }}>
        {[
          { val: '₹34.1L Cr', lbl: 'Actuals Q3 FY26',      bad: false },
          { val: '₹50.65L Cr',lbl: 'BE FY26',               bad: false },
          { val: '68%',        lbl: 'Utilisation Rate',      bad: true  },
          { val: '₹4.8L Cr',  lbl: 'DBT Transfers',         bad: false },
          { val: '23',         lbl: 'CAG Red Flags',         bad: true  },
          { val: '~28%',       lbl: 'Q4 March Rush (Est.)',  bad: true  },
        ].map(k => (
          <div key={k.lbl} className="stat-cell">
            <div className="stat-val" style={{ '--sc': k.bad ? T.red : T.green, fontSize: 20 }}>{k.val}</div>
            <div className="stat-label">{k.lbl}</div>
          </div>
        ))}
      </div>

      <Rule title="Monthly Expenditure FY26 (₹ Lakh Crore)" />
      <div style={{ border: `2px solid ${T.ink}`, padding: '18px 20px', marginBottom: 22, background: T.paper }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {[['Apr','3.2'],['May','3.8'],['Jun','4.1'],['Jul','3.9'],['Aug','4.3'],['Sep','4.0'],['Oct','4.5'],['Nov','3.8'],['Dec','4.2'],['Jan','4.1'],['Feb','3.9'],['Mar','?']].map(([m, v], i) => (
            <div key={m} style={{ padding: '12px 8px', textAlign: 'center', borderRight: i % 4 !== 3 ? `1px solid ${T.rule}` : 'none', borderBottom: i < 8 ? `1px solid ${T.rule}` : 'none' }}>
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 22, fontWeight: 700, color: v === '?' ? T.ghost : T.ink }}>{v}</div>
              <div style={{ fontFamily: "'Lora',serif", fontSize: 9, color: T.muted, marginTop: 3, letterSpacing: 1, textTransform: 'uppercase' }}>{m}</div>
            </div>
          ))}
        </div>
      </div>

      <Rule title="CAG Audit Findings — Report No. 14 of 2024" />
      {[
        'Rural Development: ₹2,340 Cr parked in savings accounts instead of disbursed as MGNREGS wages — opportunity cost and delay to rural workers',
        'PM Awas Yojana Urban: ₹8,900 Cr released to states but not passed to beneficiaries — 6 states flagged for non-compliance',
        'Jal Jeevan Mission: Connections reported as "functional" — field audit shows only 54% actually operational and supplying water',
      ].map((f, i) => (
        <div key={i} className="warn-box fu" style={{ '--wb': T.red, '--wbg': 'rgba(185,28,28,.04)', marginBottom: 8, animationDelay: `${i * 50}ms` }}>
          <div className="warn-box-body">{f}</div>
        </div>
      ))}
      <p className="src-note">Source: CAG Report No. 14/2024 · PFMS (pfms.nic.in) · CGA Monthly Accounts</p>
    </div>
  );
}
