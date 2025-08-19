'use client';

import TotalDisplay from './TotalDisplay';
import styles from './ExpenseTable.module.css';

export default function ExpenseTable({ expenses, onRemove }) {
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>Date</th>
          <th className={styles.th}>Description</th>
          <th className={styles.th}>Amount ($)</th>
          <th className={styles.th}>Action</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((exp, idx) => (
          <tr key={idx}>
            <td className={styles.td}>{exp.date}</td>
            <td className={styles.td}>{exp.desc}</td>
            <td className={styles.td}>${parseFloat(exp.amount).toFixed(2)}</td>
            <td className={styles.td}>
              <button className={styles.removeBtn} onClick={() => onRemove(idx)}>Remove</button>
            </td>
          </tr>
        ))}
      </tbody>
      <TotalDisplay total={total} />
    </table>
  );
}
