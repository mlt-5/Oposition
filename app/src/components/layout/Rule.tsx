interface Props { title: string }

export default function Rule({ title }: Props) {
  return (
    <div className="section-rule">
      <span className="section-rule-text">{title}</span>
      <span className="section-rule-line" />
    </div>
  );
}
