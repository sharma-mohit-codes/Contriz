import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { groupAPI, expenseAPI } from '../services/api';
import ExpenseList from '../components/ExpenseList';

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses');

  const fetchGroupData = useCallback(async () => {
    try {
      const [groupRes, expensesRes, balancesRes, settlementsRes] = await Promise.all([
        groupAPI.getOne(id),
        expenseAPI.getByGroup(id),
        expenseAPI.getBalances(id),
        expenseAPI.getSettlements(id)
      ]);

      setGroup(groupRes.data);
      setExpenses(expensesRes.data);
      setBalances(balancesRes.data);
      setSettlements(settlementsRes.data);
    } catch (error) {
      console.error('Error fetching group data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  if (loading) return <div className="container">Loading...</div>;
  if (!group) return <div className="container">Group not found</div>;

  return (
    <div className="container">
      <button onClick={() => navigate('/groups')} className="btn btn-secondary mb-20">
        ← Back to Groups
      </button>

      <div className="card">
        <h1>{group.name}</h1>
        {group.description && <p style={{ color: '#666', marginTop: '8px' }}>{group.description}</p>}
        
        <div style={{ marginTop: '15px' }}>
          <strong>Members:</strong> {group.members.map(m => m.name).join(', ')}
        </div>
      </div>

      <div style={{ marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('expenses')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'expenses' ? '3px solid #4CAF50' : 'none',
            fontWeight: activeTab === 'expenses' ? 'bold' : 'normal'
          }}
        >
          Expenses
        </button>
        <button
          onClick={() => setActiveTab('balances')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'balances' ? '3px solid #4CAF50' : 'none',
            fontWeight: activeTab === 'balances' ? 'bold' : 'normal'
          }}
        >
          Balances
        </button>
        <button
          onClick={() => setActiveTab('settlements')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'settlements' ? '3px solid #4CAF50' : 'none',
            fontWeight: activeTab === 'settlements' ? 'bold' : 'normal'
          }}
        >
          Settlements ⭐
        </button>
      </div>

      {activeTab === 'expenses' && (
        <>
          <button 
            onClick={() => navigate(`/groups/${id}/add-expense`)} 
            className="btn btn-primary mb-20"
          >
            + Add Expense
          </button>
          <ExpenseList
            expenses={expenses}
            onExpenseDeleted={fetchGroupData}
          />
        </>
      )}

      {activeTab === 'balances' && (
        <div className="card">
          <h3>Group Balances</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            Positive balance = owed money | Negative balance = owes money
          </p>
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {balances.map(b => (
                <tr key={b.user.id}>
                  <td>{b.user.name}</td>
                  <td style={{ 
                    fontWeight: 'bold',
                    color: b.balance > 0 ? '#4CAF50' : b.balance < 0 ? '#f44336' : '#666'
                  }}>
                    ₹{b.balance.toFixed(2)}
                  </td>
                  <td>
                    {b.balance > 0 && <span className="badge badge-success">Gets back</span>}
                    {b.balance < 0 && <span className="badge badge-danger">Owes</span>}
                    {b.balance === 0 && <span className="badge badge-warning">Settled</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settlements' && (
        <div className="card">
          <h3>💡 Smart Settlement Recommendations</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Optimized to minimize number of transactions
          </p>

          {settlements.length === 0 ? (
            <div className="text-center" style={{ padding: '40px', color: '#4CAF50' }}>
              <h2>✅ All Settled!</h2>
              <p>No pending settlements in this group</p>
            </div>
          ) : (
            <div>
              {settlements.map((s, idx) => (
                <div key={idx} className="settlement-box">
                  <div style={{ fontSize: '16px' }}>
                    <strong>{s.from.name}</strong> pays <strong>{s.to.name}</strong>
                  </div>
                  <div className="amount">₹{s.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupDetail;