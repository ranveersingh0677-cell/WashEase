import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await signup(
        formData.email, 
        formData.password, 
        formData.name, 
        formData.phone
      );
      navigate('/');
    } catch (err) {
      setError('Failed to create an account. ' + (err.message || ''));
      console.error(err);
    }
    setLoading(false);
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
            <h2>Create Account</h2>
            <p>Join WashEase for professional laundry services</p>
          </div>
          
          {error && <div className="error-alert">{error}</div>}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name"
                placeholder="Enter your full name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                placeholder="e.g. 9876543210" 
                value={formData.phone}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                placeholder="Create a password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Confirm your password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>
            
            <button disabled={loading} type="submit" className="btn-primary btn-block">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login" className="text-btn">Log in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
