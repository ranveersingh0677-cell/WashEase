import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown, FiSettings } from 'react-icons/fi';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../NotificationCenter/NotificationCenter';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [hasShop, setHasShop] = useState(false);
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = React.useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setHasShop(false);
      setUserOpen(false);
      if (isOpen) toggleMenu();
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
                
                <NotificationCenter />

                <div className="user-dropdown-container" ref={dropdownRef}>
                  <div className="user-name-trigger" onClick={() => setUserOpen(!userOpen)}>
                    <FiUser className="icon" /> {userData.name.split(' ')[0]} <FiChevronDown style={{fontSize: '12px'}} />
                  </div>
                  
                  {userOpen && (
                    <div className="user-dropdown-menu">
                      <Link 
                        to={hasShop ? "/shop-profile" : "/profile"} 
                        className="dropdown-item" 
                        onClick={() => { setUserOpen(false); if(isOpen) toggleMenu(); }}
                      >
                        <FiSettings /> Profile
                      </Link>
                      <button onClick={handleLogout} className="dropdown-item logout-link">
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  )}
                </div>
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
