'use client';

import { useState, useEffect } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';

export default function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('expenses');
    if (stored) {
      setExpenses(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = exp => {
    setExpenses(prev => [...prev, exp]);
  };

  const removeExpense = idx => {
    setExpenses(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <h2>Daily Expense Dashboard</h2>
      <ExpenseForm onAdd={addExpense} />
      <ExpenseTable expenses={expenses} onRemove={removeExpense} />
    </div>
  );
}
