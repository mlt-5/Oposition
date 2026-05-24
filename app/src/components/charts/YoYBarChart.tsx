import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface BarDef { key: string; label: string; color: string }

interface Props {
  title: string;
  data: Record<string, string | number>[];
  bars: BarDef[];
  xKey?: string;
  height?: number;
  unit?: string;
}

const fmt = (v: number) => v >= 10 ? `₹${v.toFixed(0)}L` : `₹${v.toFixed(1)}L`;

export default function YoYBarChart({ title, data, bars, xKey = 'name', height = 260, unit = '₹ Lakh Cr' }: Props) {
  return (
    <div className="chart-wrap">
      <div className="chart-head">{title} — {unit}</div>
      <div className="chart-body">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }} barGap={2} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="#C8BBA8" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, fill: '#7A6349' }}
              axisLine={{ stroke: '#C8BBA8' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fill: '#9B8E7D' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) => [`₹${(v as number).toFixed(2)}L Cr`, '']}
              contentStyle={{ fontFamily: "'Lora',serif", fontSize: 11, background: '#F4EFE2', border: '1px solid #C8BBA8', borderRadius: 0 }}
              labelStyle={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, fontSize: 11 }}
            />
            <Legend
              wrapperStyle={{ fontFamily: "'Lora',serif", fontSize: 10, paddingTop: 8 }}
            />
            {bars.map(b => (
              <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color} radius={0} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
