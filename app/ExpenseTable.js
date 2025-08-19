'use client';

import { useState } from 'react';
import TotalDisplay from './TotalDisplay';
import styles from './ExpenseTable.module.css';

export default function ExpenseTable({ expenses, onRemove }) {
  const [filter, setFilter] = useState('');
  const categories = Array.from(new Set(expenses.map(e => e.category)));
  const filtered = filter ? expenses.filter(e => e.category === filter) : expenses;
  const total = filtered.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  return (
    <>
      <select className={styles.select} value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Date</th>
            <th className={styles.th}>Description</th>
            <th className={styles.th}>Category</th>
            <th className={styles.th}>Amount ($)</th>
            <th className={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((exp, idx) => (
            <tr key={idx}>
              <td className={styles.td}>{exp.date}</td>
              <td className={styles.td}>{exp.desc}</td>
              <td className={styles.td}>{exp.category}</td>
              <td className={styles.td}>${parseFloat(exp.amount).toFixed(2)}</td>
              <td className={styles.td}>
                <button className={styles.removeBtn} onClick={() => onRemove(idx)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
        <TotalDisplay total={total} />
      </table>
    </>
  );
}
