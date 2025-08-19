'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

export default function ExpenseChart({ expenses }) {
  const data = Object.values(
    expenses.reduce((acc, exp) => {
      const date = new Date(exp.date).toLocaleDateString();
      if (!acc[date]) acc[date] = { date, amount: 0 };
      acc[date].amount += exp.amount;
      return acc;
    }, {})
  );

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
