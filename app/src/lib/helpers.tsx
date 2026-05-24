import { T } from './tokens';

export const INR = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L Cr` : `₹${n?.toLocaleString('en-IN')} Cr`;

const STATUS_MAP: Record<string, [string, string]> = {
  TRIAL:         ['ch-r', 'Trial'],
  CHARGESHEET:   ['ch-r', 'Chargesheet'],
  INVESTIGATION: ['ch-a', 'Investigation'],
  CONVICTED:     ['ch-g', 'Convicted'],
  ACQUITTED:     ['ch-n', 'Acquitted'],
  STAYED:        ['ch-n', 'SC Stayed'],
  ACTIVE:        ['ch-g', 'Active'],
  STALLED:       ['ch-r', 'Stalled'],
  PARTIAL:       ['ch-a', 'Partial'],
  DELAYED:       ['ch-r', 'Delayed'],
  ON_TRACK:      ['ch-g', 'On Track'],
  FULFILLED:     ['ch-g', 'Fulfilled'],
  NOT_MET:       ['ch-r', 'Not Met'],
};

export function statusChip(s: string) {
  const [c, l] = STATUS_MAP[s] ?? (['ch-n', s] as [string, string]);
  return <span className={`chip ${c}`}>{l}</span>;
}

export const vLabel: Record<string, string> = {
  TRUE:          '✓ True',
  MOSTLY_TRUE:   '≈ Mostly True',
  MISLEADING:    '⚠ Misleading',
  FALSE:         '✗ False',
  UNVERIFIABLE:  '? Unverifiable',
};

export interface NavItem {
  id: string;
  icon: string;
  label: string;
  short: string;
  color: string;
  badge?: { t: string; c: string };
}

export const NAV: NavItem[] = [
  { id:'home',       icon:'⌂', label:'Home',           short:'Home',    color:T.saffron },
  { id:'budget',     icon:'₹', label:'Budget Tracker',  short:'Budget',  color:T.amber,   badge:{t:'Live',c:'nc-amber'} },
  { id:'spending',   icon:'⇌', label:'Spending',        short:'Spend',   color:T.ink },
  { id:'parties',    icon:'⚑', label:'Party Finance',   short:'Parties', color:T.saffron },
  { id:'policies',   icon:'◎', label:'Policies',        short:'Policy',  color:T.ink },
  { id:'fraud',      icon:'⚠', label:'Fraud & Scams',   short:'Fraud',   color:T.red,     badge:{t:'47',c:'nc-red'} },
  { id:'promises',   icon:'✓', label:'Promises',        short:'Promise', color:T.amber },
  { id:'statements', icon:'◉', label:'Fact-Check',      short:'Facts',   color:T.ink },
  { id:'rankings',   icon:'↕', label:'India Rankings',  short:'Ranks',   color:T.ink },
  { id:'alerts',     icon:'!', label:'Live Alerts',      short:'Alerts',  color:T.red,     badge:{t:'New',c:'nc-red'} },
];
