import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f8f9fa' }}>
      <div className="navbar-brand">
        <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>TasteTrack</Link>
      </div>
      <div className="navbar-links" style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/restaurants">Restaurants</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
};

export default Navbar;
