'use client';

import { useState, useEffect } from 'react';
import styles from './ExpenseForm.module.css';

export default function ExpenseForm({ onAdd }) {
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    onAdd({ date, desc: desc.trim(), amount, category: category.trim() });
    setDesc('');
    setAmount('');
    setCategory('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="date"
        className={styles.input}
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />
      <input
        type="text"
        className={styles.input}
        placeholder="Description"
        value={desc}
        onChange={e => setDesc(e.target.value)}
        required
      />
      <input
        type="text"
        className={styles.input}
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
        required
      />
      <input
        type="number"
        className={styles.input}
        placeholder="Amount"
        min="0.01"
        step="0.01"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />
      <button type="submit" className={styles.button}>Add Expense</button>
    </form>
  );
}
