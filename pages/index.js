import React, { useState, useEffect } from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
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
    desc: '',
    amount: ''
  });

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
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to add expense');
      const newExp = await res.json();
      setExpenses((prev) => [newExp, ...prev]);
      setForm({ date: new Date().toISOString().substr(0, 10), desc: '', amount: '' });
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="container">
      <h2>Daily Expense Dashboard</h2>
      <form id="expense-form" onSubmit={handleSubmit}>
        <input type="date" id="date" value={form.date} onChange={handleChange} required />
        <input type="text" id="desc" value={form.desc} onChange={handleChange} placeholder="Description" required />
        <input type="number" id="amount" value={form.amount} onChange={handleChange} placeholder="Amount" min="0.01" step="0.01" required />
        <button type="submit">Add Expense</button>
      </form>
      <table id="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount ($)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
              <td>{exp.desc}</td>
              <td>${exp.amount.toFixed(2)}</td>
              <td><button className="remove-btn" onClick={() => removeExpense(exp.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">Total</td>
            <td id="total">${total.toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          margin: 40px;
          background: #f5f6fa;
        }
        h2 {
          color: #333;
        }
        #expense-form {
          margin-bottom: 20px;
        }
        input, button {
          padding: 8px;
          margin: 5px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        button {
          background: #0d6efd;
          color: #fff;
          border: none;
        }
        button:hover {
          background: #0b5ed7;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          background: #fff;
        }
        th, td {
          padding: 10px;
          border-bottom: 1px solid #eee;
          text-align: left;
        }
        th {
          background: #e9ecef;
        }
        tfoot td {
          font-weight: bold;
          background: #f1f3f5;
        }
        .remove-btn {
          color: #dc3545;
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
