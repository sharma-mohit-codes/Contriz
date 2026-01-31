import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupAPI } from '../services/api';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDeleteGroup = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (!confirmDelete) return;
  
    try {
      await groupAPI.delete(id);
      alert("Group deleted");
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert("Failed to delete group");
    }
  };
  
  const fetchGroups = async () => {
    try {
      const response = await groupAPI.getAll();
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Groups</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn btn-primary">
          {showCreateForm ? 'Cancel' : '+ Create Group'}
        </button>
      </div>

      {showCreateForm && (
        <CreateGroupForm
          onSuccess={() => {
            fetchGroups();
            setShowCreateForm(false);
          }}
        />
      )}

      {groups.length === 0 ? (
        <div className="card text-center">
          <h3>No groups yet</h3>
          <p>Create your first group to start splitting expenses!</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {groups.map(group => (
            <div
              key={group._id}
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/groups/${group._id}`)}
            >
              <h3>{group.name}</h3><button
                onClick={handleDeleteGroup(group._id)}
                style={{
                  background: 'red',
                  color: 'white',
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  marginLeft: '10px'
                }}
              >
                Delete Group
              </button>

              {group.description && <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>{group.description}</p>}
              <div style={{ marginTop: '15px', fontSize: '14px', color: '#888' }}>
                👥 {group.members.length} members
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CreateGroupForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberEmails: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const emails = formData.memberEmails
        .split(',')
        .map(e => e.trim())
        .filter(e => e);

      await groupAPI.create({
        ...formData,
        memberEmails: emails
      });

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    }
  };

  return (
    <div className="card mb-20">
      <h3>Create New Group</h3>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Group Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description (optional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="2"
          />
        </div>

        <div className="form-group">
          <label>Member Emails (comma-separated, optional)</label>
          <input
            type="text"
            value={formData.memberEmails}
            onChange={(e) => setFormData({ ...formData, memberEmails: e.target.value })}
            placeholder="email1@example.com, email2@example.com"
          />
          <small style={{ color: '#666' }}>You will be added automatically as a member</small>
        </div>

        <button type="submit" className="btn btn-primary">Create Group</button>
      </form>
    </div>
  );
};

export default Groups;