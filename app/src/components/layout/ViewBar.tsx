import { T } from '@/lib/tokens';
import { NAV } from '@/lib/helpers';

interface Props { id: string }

const SUBS: Record<string, string> = {
  home:       'All data from official government & international sources · Updated daily',
  budget:     'Union Budget FY 2025-26 · Allocation vs Actual · Source: indiabudget.gov.in, CGA',
  spending:   'Real expenditure vs budget · Source: CGA Monthly Accounts, PFMS, CAG Reports',
  parties:    'ECI Annual Returns · ADR Analysis · FY 2024-25 · Electoral Bond SC verdict context',
  policies:   'Central Government schemes · Source: PIB, CAG, Ministry Annual Reports',
  fraud:      'CBI, ED, CAG press releases & court orders only · Accused ≠ Convicted until judgment',
  promises:   'BJP Manifesto 2014/2019/2024 · Major Projects · Source: Manifestos, PIB, CAG',
  statements: 'Verdicts aggregated from AFWA, Boom, AltNews, FactChecker.in, PRS',
  rankings:   '25+ global indices · Change vs 2014 shown for context, not editorial comment',
  alerts:     'Alerts fire only after primary source confirmation · No media-report-only alerts',
};

export default function ViewBar({ id }: Props) {
  const n = NAV.find(x => x.id === id) ?? NAV[0];
  return (
    <div className="view-bar" style={{ '--vc': n.color === T.ink ? T.saffron : n.color }}>
      <div className="view-bar-icon">{n.icon}</div>
      <div>
        <div className="view-bar-title">{n.label}</div>
        <div className="view-bar-sub">{SUBS[id] ?? ''}</div>
      </div>
      <div className="view-bar-right">
        <span className="view-date">
          {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
}
