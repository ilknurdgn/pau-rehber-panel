import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
      <span className="navbar-title"><Link to="/">PAU REHBER</Link></span>
      </div>
      <div className="navbar-right">
        
      </div>
    </nav>
  );
};

export default Navbar; 