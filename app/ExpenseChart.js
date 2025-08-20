'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function ExpenseChart({ expenses }) {
  const categories = Array.from(new Set(expenses.map(e => e.category)));
  const data = Object.values(
    expenses.reduce((acc, exp) => {
      const date = new Date(exp.date).toLocaleDateString();
      if (!acc[date]) acc[date] = { date };
      acc[date][exp.category] = (acc[date][exp.category] || 0) + exp.amount;
      return acc;
    }, {})
  );

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {categories.map((cat, idx) => (
            <Bar key={cat} dataKey={cat} stackId="a" fill={colors[idx % colors.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
