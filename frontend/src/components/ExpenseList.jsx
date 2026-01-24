import React from 'react';

const ExpenseList = ({ expenses }) => {
  if (expenses.length === 0) {
    return (
      <div className="card">
        <p className="text-center">No expenses yet</p>
      </div>
    );
  }

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;