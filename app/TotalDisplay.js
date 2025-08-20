'use client';

import styles from './TotalDisplay.module.css';

export default function TotalDisplay({ total }) {
  return (
    <tfoot className={styles.tfoot}>
      <tr>
        <td className={styles.td} colSpan="3">Total</td>
        <td className={styles.td}>${total.toFixed(2)}</td>
        <td className={styles.td}></td>
      </tr>
    </tfoot>
  );
}
