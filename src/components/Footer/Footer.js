import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3>Wash<span>Ease</span></h3>
          <p>Fresh Clothes, Delivered to Your Door. Experience the best laundry service in Jhansi.</p>
          <div className="social-icons">
            <button className="social-btn" aria-label="Facebook"><FiFacebook /></button>
            <button className="social-btn" aria-label="Instagram"><FiInstagram /></button>
            <button className="social-btn" aria-label="Twitter"><FiTwitter /></button>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/place-order">Place Order</Link></li>
            <li><Link to="/track-order">Track Order</Link></li>
            <li><Link to="/shop-register">Partner With Us</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul className="contact-info">
            <li><FiMapPin className="contact-icon" /> Civil Lines, Jhansi, UP 284001</li>
            <li><FiPhone className="contact-icon" /> +91 98765 43210</li>
            <li><FiMail className="contact-icon" /> support@washease.in</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} WashEase Laundry Services. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
