import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupAPI, expenseAPI } from '../services/api';

const AddExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    participants: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const fetchGroup = async () => {
    try {
      const response = await groupAPI.getOne(id);
      setGroup(response.data);
      // By default, select all members
      setFormData(prev => ({
        ...prev,
        participants: response.data.members.map(m => m._id)
      }));
    } catch (error) {
      console.error('Error fetching group:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.participants.length === 0) {
      setError('Please select at least one participant');
      return;
    }

    try {
      await expenseAPI.create({
        groupId: id,
        description: formData.description,
        amount: parseFloat(formData.amount),
        participants: formData.participants
      });

      setSuccess('Expense added successfully!');
      
      setTimeout(() => {
        navigate(`/groups/${id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const toggleParticipant = (memberId) => {
    if (formData.participants.includes(memberId)) {
      setFormData({
        ...formData,
        participants: formData.participants.filter(id => id !== memberId)
      });
    } else {
      setFormData({
        ...formData,
        participants: [...formData.participants, memberId]
      });
    }
  };

  if (!group) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <button onClick={() => navigate(`/groups/${id}`)} className="btn btn-secondary mb-20">
        ← Back to Group
      </button>

      <div className="card">
        <h2>Add Expense to {group.name}</h2>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description *</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Dinner at restaurant"
              required
            />
          </div>

          <div className="form-group">
            <label>Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label>Split Among (select participants) *</label>
            <div style={{ marginTop: '10px' }}>
              {group.members.map(member => (
                <label 
                  key={member._id} 
                  style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    padding: '8px',
                    backgroundColor: formData.participants.includes(member._id) ? '#e8f5e9' : '#f5f5f5',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.participants.includes(member._id)}
                    onChange={() => toggleParticipant(member._id)}
                    style={{ marginRight: '8px' }}
                  />
                  {member.name}
                </label>
              ))}
            </div>
            <small style={{ color: '#666' }}>
              Amount will be split equally among selected participants
            </small>
          </div>

          {formData.amount && formData.participants.length > 0 && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#f0f0f0', 
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              <strong>Share per person:</strong> ₹
              {(parseFloat(formData.amount) / formData.participants.length).toFixed(2)}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;