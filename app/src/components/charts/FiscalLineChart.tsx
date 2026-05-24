import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

interface LineDef { key: string; label: string; color: string }

interface Props {
  title: string;
  data: Record<string, string | number>[];
  lines: LineDef[];
  xKey?: string;
  height?: number;
  referenceValue?: number;
  referenceLabel?: string;
}

export default function FiscalLineChart({ title, data, lines, xKey = 'yr', height = 240, referenceValue, referenceLabel }: Props) {
  return (
    <div className="chart-wrap">
      <div className="chart-head">{title}</div>
      <div className="chart-body">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#C8BBA8" />
            <XAxis
              dataKey={xKey}
              tick={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, fill: '#7A6349' }}
              axisLine={{ stroke: '#C8BBA8' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fill: '#9B8E7D' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ fontFamily: "'Lora',serif", fontSize: 11, background: '#F4EFE2', border: '1px solid #C8BBA8', borderRadius: 0 }}
              labelStyle={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, fontSize: 11 }}
            />
            <Legend wrapperStyle={{ fontFamily: "'Lora',serif", fontSize: 10, paddingTop: 8 }} />
            {referenceValue !== undefined && (
              <ReferenceLine y={referenceValue} stroke="#C9830A" strokeDasharray="4 4" label={{ value: referenceLabel ?? '', position: 'right', fill: '#C9830A', fontSize: 9, fontFamily: "'Lora',serif" }} />
            )}
            {lines.map(l => (
              <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={l.color} strokeWidth={2} dot={{ r: 3, fill: l.color }} activeDot={{ r: 5 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
