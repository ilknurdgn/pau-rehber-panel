import React from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const isAuthenticated = () => {
    if (!token) return false;
    try {
      const { exp } = jwtDecode(token);
      return exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-title">
          <Link to="/">PAU REHBER</Link>
        </span>
      </div>
      <div className="navbar-right">
        {isAuthenticated() ? (
          <button className="navbar-button" onClick={handleLogout}>
            Çıkış Yap
          </button>
        ) : (
          <Link to="/login" className="navbar-button">
            Giriş Yap
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
