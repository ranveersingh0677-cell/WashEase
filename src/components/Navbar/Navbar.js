import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShop, setHasShop] = useState(false);
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await logout();
      setHasShop(false);
      toggleMenu();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    let unsubscribe = () => {};

    if (userData?.email) {
      const q = query(collection(db, "shops"), where("email", "==", userData.email));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        setHasShop(!querySnapshot.empty);
      }, (error) => {
        console.error("Error monitoring shop registration:", error);
      });
    } else {
      setHasShop(false);
    }

    return () => unsubscribe();
  }, [userData]);

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
          {hasShop && <Link to="/shop-dashboard" className="nav-link" onClick={toggleMenu}>Shop Dashboard</Link>}
          
          <div className="nav-actions">
            {userData ? (
              <div className="user-nav-info">
                {!hasShop && <Link to="/shop-register" className="nav-link partner-link" onClick={toggleMenu} style={{marginRight: '1rem'}}>Partner with us</Link>}
                <span className="user-name">
                  <FiUser className="icon" /> {userData.name}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  <FiLogOut /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/shop-register" className="btn-outline" onClick={toggleMenu}>Partner with us</Link>
                <Link to="/login" className="btn-primary" onClick={toggleMenu}>Login</Link>
              </>
            )}
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
