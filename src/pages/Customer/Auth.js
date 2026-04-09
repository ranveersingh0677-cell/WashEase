import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate auth
    navigate('/place-order');
  };

  return (
    <div className="auth-page">
      <div className="container">
        <motion.div 
          className="auth-box"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
            <p>{isLogin ? 'Log in to manage your orders' : 'Join WashEase for fresh laundry'}</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" required />
              </div>
            )}
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="e.g. 9876543210" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" required />
            </div>
            
            <button type="submit" className="btn-primary btn-block">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button className="text-btn" onClick={toggleMode}>
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
