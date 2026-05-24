import { T } from '@/lib/tokens';
import Rule from '@/components/layout/Rule';
import { PARTY_DATA } from '@/data/static';

export default function PartiesView() {
  const max = Math.max(...PARTY_DATA.map(p => p.income));

  return (
    <div className="scroll-area fu">
      <div className="warn-box" style={{ '--wb': T.red, '--wbg': 'rgba(185,28,28,.04)', marginBottom: 20 }}>
        <div className="warn-box-head">⚖ Supreme Court, 15 Feb 2024</div>
        <div className="warn-box-body">Electoral Bond Scheme declared unconstitutional. Funding reverts to Electoral Trusts and direct donations above ₹20,000 — both require ECI disclosure. All data from ECI annual filings and ADR analysis.</div>
      </div>

      <Rule title="Party Donations FY 2024-25 (₹ Crore)" />
      <div style={{ border: `2px solid ${T.ink}`, padding: '20px', marginBottom: 20, background: T.paper }}>
        {PARTY_DATA.map(p => (
          <div key={p.party} className="party-row">
            <div className="party-meta">
              <span className="party-name-lbl" style={{ color: p.color }}>{p.party}</span>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <span style={{ fontFamily: "'Lora',serif", fontSize: 10, color: T.muted }}>Corporate: {p.corp}%</span>
                <span className="party-amt-lbl">₹{p.income.toLocaleString('en-IN')} Cr</span>
              </div>
            </div>
            <div className="party-bar-wrap">
              <div className="party-bar-fill" style={{ width: `${(p.income / max) * 100}%`, background: p.color, opacity: .8 }} />
            </div>
          </div>
        ))}
        <p className="src-note" style={{ marginTop: 12 }}>Source: ADR Report FY 2024-25 · ECI Form 24A/24B · BJP received ₹6,074 Cr (+171% YoY) per ADR analysis</p>
      </div>

      <Rule title="Party-wise Breakdown (FY 2024-25)" />
      <div className="tbl-wrap">
        <table className="dtbl">
          <thead>
            <tr><th>Party</th><th>Total Income (₹ Cr)</th><th>Electoral Trust %</th><th>Source Notes</th></tr>
          </thead>
          <tbody>
            {PARTY_DATA.map(p => (
              <tr key={p.party}>
                <td style={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, color: p.color }}>{p.party}</td>
                <td className="mono tw">{p.income.toLocaleString('en-IN')}</td>
                <td className="mono" style={{ color: p.trust > 60 ? T.red : T.muted }}>{p.trust}%</td>
                <td style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', fontSize: 11, color: T.muted, maxWidth: 260, lineHeight: 1.4 }}>{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="src-note" style={{ marginTop: 8 }}>Sources: ADR (adrindia.org) FY 2024-25 report · ECI contribution statements · All data from publicly available ECI annual returns</p>
    </div>
  );
}
