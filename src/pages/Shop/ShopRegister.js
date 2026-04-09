import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './ShopRegister.css';

const ShopRegister = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate('/shop-dashboard'), 2000);
  };

  if (submitted) {
    return (
      <div className="shop-register-page">
        <div className="container">
          <motion.div
            className="success-box"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="success-icon">🎉</div>
            <h2>Registration Submitted!</h2>
            <p>Welcome to WashEase! Our team will verify your shop and get back to you within 24 hours. Redirecting to your dashboard...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-register-page">
      <div className="container">
        <motion.div
          className="register-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="register-header">
            <h2>Partner With WashEase</h2>
            <p>Register your laundry shop and start getting orders from customers across Jhansi</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Shop Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Shop Name *</label>
                  <input type="text" placeholder="e.g. Sharma Laundry" required />
                </div>
                <div className="form-group">
                  <label>Owner Name *</label>
                  <input type="text" placeholder="Full name" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" placeholder="10-digit mobile number" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="shop@example.com" />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Shop Location (Jhansi)</h3>
              <div className="form-group">
                <label>Full Address *</label>
                <input type="text" placeholder="Shop address with landmark" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Area / Locality *</label>
                  <select required defaultValue="">
                    <option value="" disabled>Select area</option>
                    <option>Civil Lines</option>
                    <option>Sipri Bazar</option>
                    <option>Sadar Bazar</option>
                    <option>Cantonment</option>
                    <option>Nai Sadak</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>PIN Code *</label>
                  <input type="text" placeholder="e.g. 284001" required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Services Offered</h3>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked /> Wash & Fold
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked /> Wash & Iron
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" /> Dry Cleaning
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" /> Blankets & Curtains
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary btn-submit">
              Submit Registration
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ShopRegister;
