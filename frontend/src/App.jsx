import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import AddExpense from './pages/AddExpense';
import './App.css';

// Register component (similar to Login)
const Register = () => {
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '' });
  const [error, setError] = React.useState('');
  const { register } = useAuth();
  const navigate = require('react-router-dom').useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/groups');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '80px' }}>
      <div className="card">
        <h2 className="text-center">Register</h2>
        
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Register
          </button>
        </form>

        <p className="text-center mt-20">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

// Private Route wrapper
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="container text-center" style={{ marginTop: '100px' }}>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<Navigate to="/groups" replace />} />
            
            <Route
              path="/groups"
              element={
                <PrivateRoute>
                  <Groups />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/groups/:id"
              element={
                <PrivateRoute>
                  <GroupDetail />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/groups/:id/add-expense"
              element={
                <PrivateRoute>
                  <AddExpense />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;