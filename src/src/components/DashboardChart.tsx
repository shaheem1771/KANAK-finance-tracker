import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, CartesianGrid, Legend, Brush } from 'recharts';

interface ChartPoint {
  period: string;
  label?: string;
  income?: number;
  expense?: number;
}

interface DashboardChartProps {
  data: ChartPoint[];
}

export default function DashboardChart({ data }: DashboardChartProps) {
  const chartData = data.length > 0 ? data : [{ period: 'No data', label: 'No data', income: 0, expense: 0 }];

  return (
    <div className="h-80 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.06)" />
          <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
          <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 8 }} />
          <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          <Brush dataKey="label" height={24} stroke="#334155" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
