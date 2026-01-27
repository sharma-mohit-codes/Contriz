import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          💰 Contriz
        </Link>

        {isAuthenticated && (
          <div style={styles.menu}>
            <Link to="/groups" style={styles.link}>My Groups</Link>
            <div style={styles.userSection}>
              <span style={styles.userName}>👤 {user?.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary" style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none'
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  userName: {
    color: 'white'
  },
  logoutBtn: {
    padding: '6px 12px',
    fontSize: '13px'
  }
};

export default Navbar;