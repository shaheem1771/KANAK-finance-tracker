import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Slice {
  name: string;
  value: number;
}

interface RingChartProps {
  data: Slice[];
  className?: string;
}

const COLORS = ['#38bdf8', '#60a5fa', '#7c3aed', '#ef4444', '#f97316', '#f59e0b', '#10b981'];

export default function RingChart({ data, className }: RingChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  const chartData = data.map((d) => ({ name: d.name, value: Math.abs(d.value) }));

  return (
    <div className={className}>
      <div className="h-56 rounded-2xl bg-slate-950/80 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={2}
              stroke="transparent"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-sm text-slate-400">
        <div className="mb-2 text-xs text-slate-500">Category colors</div>
        <div className="flex flex-wrap gap-2">
          {chartData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-slate-300">{d.name}</span>
              <span className="ml-2 text-slate-400">₹{d.value.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-slate-500">Total: <strong className="ml-1 text-white">₹{total.toLocaleString('en-IN')}</strong></div>
      </div>
    </div>
  );
}
