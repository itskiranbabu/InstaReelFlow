import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>InstaReelFlow</h1>
        </Link>
        
        <nav className="nav">
          {user ? (
            <div className="nav-authenticated">
              <Link to="/" className="nav-link">
                <span className="nav-icon">🏠</span>
                Home
              </Link>
              <Link to="/upload" className="nav-link">
                <span className="nav-icon">➕</span>
                Upload
              </Link>
              <Link to="/profile" className="nav-link">
                <span className="nav-icon">👤</span>
                Profile
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                <span className="nav-icon">🚪</span>
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-guest">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link register-btn">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;