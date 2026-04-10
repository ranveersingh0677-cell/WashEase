import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const { loginWithEmail, setupRecaptcha, loginWithPhone } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    }
    setLoading(false);
  };

  const onSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const appVerifier = setupRecaptcha('recaptcha-container');
      const formatPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const result = await loginWithPhone(formatPhone, appVerifier);
      setConfirmationResult(result);
      setShowOtp(true);
    } catch (err) {
      setError('Error sending OTP. Please try again.');
      console.error(err);
      if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    }
    setLoading(false);
  };

  const onVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      navigate('/');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
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
            <h2>Welcome Back</h2>
            <p>Log in to manage your laundry orders</p>
          </div>

          <div className="method-toggle">
            <button 
              className={loginMethod === 'email' ? 'active' : ''} 
              onClick={() => { setLoginMethod('email'); setError(''); }}
            >
              Email
            </button>
            <button 
              className={loginMethod === 'phone' ? 'active' : ''} 
              onClick={() => { setLoginMethod('phone'); setError(''); }}
            >
              Phone
            </button>
          </div>
          
          {error && <div className="error-alert">{error}</div>}

          {loginMethod === 'email' ? (
            <form className="auth-form" onSubmit={handleEmailLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <button disabled={loading} type="submit" className="btn-primary btn-block">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <div className="phone-auth-container">
              {!showOtp ? (
                <form className="auth-form" onSubmit={onSendOTP}>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="phone-input-wrapper">
                      <span>+91</span>
                      <input 
                        type="tel" 
                        placeholder="9876543210" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <div id="recaptcha-container"></div>
                  <button disabled={loading} type="submit" className="btn-primary btn-block">
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form className="auth-form" onSubmit={onVerifyOTP}>
                  <div className="form-group">
                    <label>Enter OTP</label>
                    <input 
                      type="text" 
                      placeholder="6-digit code" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required 
                    />
                  </div>
                  <button disabled={loading} type="submit" className="btn-primary btn-block">
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button 
                    type="button" 
                    className="text-btn btn-block mt-10" 
                    onClick={() => setShowOtp(false)}
                  >
                    Change Phone Number
                  </button>
                </form>
              )}
            </div>
          )}
          
          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register" className="text-btn">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
