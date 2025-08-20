'use client';

import React, { useState, useEffect } from 'react';
import ExpenseChart from './ExpenseChart';
function expensesToCSV(expenses) {
  const header = ['Date', 'Description', 'Category', 'Amount'];
  const rows = expenses.map((exp) => [
    new Date(exp.date).toISOString().split('T')[0],
    `"${exp.description.replace(/"/g, '""')}"`,
    `"${(exp.category || '').replace(/"/g, '""')}"`,
    exp.amount.toFixed(2),
  ]);
  return [header, ...rows].map((row) => row.join(',')).join('\n');
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught an error', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <p role="alert">Something went wrong.</p>;
    }
    return this.props.children;
  }
}

function ExpenseDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().substr(0, 10),
    description: '',
    amount: '',
    category: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    async function loadExpenses() {
      try {
        const res = await fetch('/api/expenses');
        if (!res.ok) throw new Error('Failed to load expenses');
        const data = await res.json();
        setExpenses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadExpenses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/expenses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editingId })
      });
      if (!res.ok) throw new Error(editingId ? 'Failed to update expense' : 'Failed to add expense');
      const saved = await res.json();
      if (editingId) {
        setExpenses((prev) => prev.map((exp) => (exp.id === saved.id ? saved : exp)));
      } else {
        setExpenses((prev) => [saved, ...prev]);
      }
      setForm({ date: new Date().toISOString().substr(0, 10), description: '', amount: '', category: '' });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeExpense = async (id) => {
    setError(null);
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove expense');
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const editExpense = (exp) => {
    setForm({
      date: new Date(exp.date).toISOString().substr(0, 10),
      description: exp.description,
      amount: exp.amount.toString(),
      category: exp.category,
    });
    setEditingId(exp.id);
  };

  const downloadCSV = () => {
    const csv = expensesToCSV(expenses);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  const categories = Array.from(new Set(expenses.map(e => e.category)));
  const displayed = categoryFilter ? expenses.filter(exp => exp.category === categoryFilter) : expenses;
  const total = displayed.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="container">
      <h2>Daily Expense Dashboard</h2>
      <form id="expense-form" onSubmit={handleSubmit}>
        <input type="date" id="date" value={form.date} onChange={handleChange} required />
        <input type="text" id="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        <input type="text" id="category" value={form.category} onChange={handleChange} placeholder="Category" required />
        <input type="number" id="amount" value={form.amount} onChange={handleChange} placeholder="Amount" min="0.01" step="0.01" required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Expense</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ date: new Date().toISOString().substr(0, 10), description: '', amount: '', category: '' }); }}>Cancel</button>
        )}
      </form>
      <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <ExpenseChart expenses={displayed} />
      <table id="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount ($)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((exp) => (
            <tr key={exp.id}>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
              <td>{exp.description}</td>
              <td>{exp.category}</td>
              <td>${exp.amount.toFixed(2)}</td>
              <td>
                <button onClick={() => editExpense(exp)}>Edit</button>
                <button className="remove-btn" onClick={() => removeExpense(exp.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">Total</td>
            <td id="total">${total.toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <button type="button" onClick={downloadCSV}>Download CSV</button>
      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          margin: 40px;
          background: var(--bg);
          color: var(--fg);
        }
        h2 {
          color: var(--accent);
        }
        #expense-form {
          margin-bottom: 20px;
        }
        input, button {
          padding: 8px;
          margin: 5px;
          border-radius: 4px;
          border: 1px solid var(--accent);
          background: color-mix(in srgb, var(--bg), var(--fg) 5%);
          color: var(--fg);
        }
        button {
          background: var(--accent);
          color: var(--fg);
          border: none;
        }
        button:hover {
          background: color-mix(in srgb, var(--accent), black 10%);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          background: color-mix(in srgb, var(--bg), var(--fg) 5%);
          color: var(--fg);
        }
        th, td {
          padding: 10px;
          border-bottom: 1px solid color-mix(in srgb, var(--bg), var(--fg) 20%);
          text-align: left;
        }
        th {
          background: color-mix(in srgb, var(--bg), var(--fg) 10%);
        }
        tfoot td {
          font-weight: bold;
          background: color-mix(in srgb, var(--bg), var(--fg) 10%);
        }
        .remove-btn {
          color: var(--accent);
          background: none;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default function Page() {
  return (
    <ErrorBoundary>
      <ExpenseDashboard />
    </ErrorBoundary>
  );
}

