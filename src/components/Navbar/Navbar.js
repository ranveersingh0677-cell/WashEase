import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="navbar-logo">
          Wash<span>Ease</span>
        </Link>
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={toggleMenu}>Home</Link>
          <Link to="/place-order" className="nav-link" onClick={toggleMenu}>Place Order</Link>
          <Link to="/track-order" className="nav-link" onClick={toggleMenu}>Track Order</Link>
          <Link to="/my-orders" className="nav-link" onClick={toggleMenu}>My Orders</Link>
          <Link to="/shop-dashboard" className="nav-link" onClick={toggleMenu}>Shop Dashboard</Link>
          <div className="nav-actions">
            <Link to="/auth" className="btn-outline" onClick={toggleMenu}>Login</Link>
            <Link to="/shop-register" className="btn-primary" onClick={toggleMenu}>Partner with us</Link>
          </div>
        </div>
        <div className="nav-icon" onClick={toggleMenu}>
          {isOpen ? <FiX /> : <FiMenu />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
