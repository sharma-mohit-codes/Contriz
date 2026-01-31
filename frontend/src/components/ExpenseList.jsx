import React from 'react';
import { expenseAPI } from '../services/api';

const ExpenseList = ({ expenses, onExpenseDeleted }) => {
  if (expenses.length === 0) {
    return (
      <div className="card">
        <p className="text-center">No expenses yet</p>
      </div>
    );
  }

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Token payload is { userId: ... } — match that exactly
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  const handleDeleteExpense = async (expenseId) => {
    const confirm = window.confirm('Are you sure you want to delete this expense?');
    if (!confirm) return;

    try {
      await expenseAPI.delete(expenseId);
      alert('Expense deleted successfully');
      if (onExpenseDeleted) onExpenseDeleted();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete expense';
      alert(msg);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Expense History</h3>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4CAF50' }}>
          Total: ₹{totalAmount.toFixed(2)}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Paid By</th>
            <th>Split Among</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense._id}>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>{expense.description}</td>
              <td style={{ fontWeight: 'bold' }}>₹{expense.amount.toFixed(2)}</td>
              <td>{expense.paidBy.name}</td>
              <td>{expense.participants.length} people</td>
              <td>
                {/* .toString() on both sides: paidBy._id is a Mongoose ObjectId, currentUserId is a string */}
                {expense.paidBy._id.toString() === currentUserId && (
                  <button
                    onClick={() => handleDeleteExpense(expense._id)}
                    style={{
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;