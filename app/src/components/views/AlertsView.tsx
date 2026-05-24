import { T } from '@/lib/tokens';
import Rule from '@/components/layout/Rule';
import { ALERTS } from '@/data/static';

export default function AlertsView() {
  return (
    <div className="scroll-area fu">
      <Rule title="Live Alert Feed" />
      <div style={{ border: `2px solid ${T.ink}`, marginBottom: 20, background: T.paper }}>
        {ALERTS.map((a, i) => (
          <div
            key={a.id}
            className="alert-row"
            style={{ padding: '14px 18px', '--as': a.sev === 'critical' ? T.red : a.sev === 'positive' ? T.green : T.amber, borderBottom: i < ALERTS.length - 1 ? `1px solid ${T.rule}` : 'none', margin: 0 }}
          >
            <div className="alert-sev" />
            <div style={{ flex: 1 }}>
              <div className="alert-meta">
                <span className="alert-tag" style={{ color: a.sev === 'critical' ? T.red : a.sev === 'positive' ? T.green : T.amber }}>{a.tag}</span>
                <span className="alert-agency">{a.agency}</span>
                <span className="alert-time">{a.time}</span>
              </div>
              <div style={{ fontFamily: "'Lora',serif", fontSize: 13, color: T.ink, fontWeight: 500, lineHeight: 1.55, marginTop: 4 }}>{a.body}</div>
              <div style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', fontSize: 9, color: T.ghost, marginTop: 5 }}>Source: Official press release · Source document available</div>
            </div>
          </div>
        ))}
      </div>

      <div className="warn-box" style={{ '--wb': T.green, '--wbg': 'rgba(22,101,52,.04)' }}>
        <div className="warn-box-head">Subscribe to Alerts</div>
        <div className="warn-box-body" style={{ marginBottom: 12 }}>Alerts fire only after primary source confirmation. Choose your delivery channel:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Email Digest (Daily)', 'Email Digest (Weekly)', 'RSS Feed (Open)', 'API Webhook (Premium)'].map(opt => (
            <button
              key={opt}
              style={{ background: T.ink, color: T.paper, border: `2px solid ${T.ink}`, padding: '7px 14px', fontFamily: "'Libre Baskerville',serif", fontSize: 10, fontWeight: 700, letterSpacing: .5, cursor: 'pointer', transition: 'all .15s' }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = T.saffron; (e.target as HTMLButtonElement).style.borderColor = T.saffron; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = T.ink; (e.target as HTMLButtonElement).style.borderColor = T.ink; }}
            >{opt}</button>
          ))}
        </div>
      </div>

      <Rule title="Alert Categories" />
      {[
        ['ED/CBI Action Alerts', 'Arrests, raids, asset attachments — source: agency press releases'],
        ['CAG Report Drop', 'New audit report tabled in Parliament'],
        ['Budget Variance Alert', 'Monthly CGA data deviates significantly from projection'],
        ['International Ranking Change', 'Any Indian ranking change >5 positions'],
        ['Promise Milestone', 'Promise moved to Fulfilled or Abandoned'],
        ['Statement Fact-Check', 'New verdict published by AFWA, Boom, AltNews, FactChecker.in'],
      ].map(([t, d], i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: `1px solid ${T.rule}` }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.saffron, marginTop: 4, flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, fontSize: 12, color: T.ink }}>{t}</div>
            <div style={{ fontFamily: "'Lora',serif", fontSize: 11, color: T.muted, marginTop: 2 }}>{d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
