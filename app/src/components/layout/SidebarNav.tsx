import { T } from '@/lib/tokens';
import { NAV } from '@/lib/helpers';

interface Props { active: string; onSelect: (id: string) => void }

export default function SidebarNav({ active, onSelect }: Props) {
  return (
    <>
      <div className="nav-section-label">Main</div>
      {NAV.map(n => (
        <button
          key={n.id}
          className={`nav-item${active === n.id ? ' on' : ''}`}
          style={{ '--ni': n.color === T.ink ? T.ghost : n.color }}
          onClick={() => onSelect(n.id)}
        >
          <span className="nav-icon">{n.icon}</span>
          <span className="nav-label">{n.label}</span>
          {n.badge && <span className={`nav-chip ${n.badge.c}`}>{n.badge.t}</span>}
        </button>
      ))}
      <div style={{ margin: '10px 16px', borderTop: `1px solid ${T.rule}` }} />
      <div className="nav-section-label">About</div>
      {['Methodology', 'Our Funding', 'Editorial Team', 'Corrections'].map(l => (
        <button key={l} className="nav-item" style={{ '--ni': T.rule }}>
          <span className="nav-icon" style={{ fontSize: 10 }}>›</span>
          <span className="nav-label" style={{ fontSize: 11 }}>{l}</span>
        </button>
      ))}
    </>
  );
}
