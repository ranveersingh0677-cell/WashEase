import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import './ShopRegister.css';

const ShopRegister = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    pinCode: ''
  });

  // Check for existing registration
  React.useEffect(() => {
    const checkRegistration = async () => {
      if (userData?.email) {
        try {
          const q = query(collection(db, "shops"), where("email", "==", userData.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setAlreadyRegistered(true);
          }
        } catch (error) {
          console.error("Error checking shop registration:", error);
        } finally {
          setCheckingStatus(false);
        }
      } else if (currentUser === null) {
        setCheckingStatus(false);
      }
    };
    checkRegistration();
  }, [userData, currentUser]);

  // Pre-fill form when userData is available
  React.useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        ownerName: userData.name || '',
        phone: userData.phone || '',
        email: userData.email || ''
      }));
    }
  }, [userData]);

  const [services, setServices] = useState({
    'Wash & Fold': true,
    'Wash & Iron': true,
    'Dry Cleaning': false,
    'Blankets & Curtains': false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (service) => {
    setServices(prev => ({ ...prev, [service]: !prev[service] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const selectedServices = Object.keys(services).filter(s => services[s]);
      
      await addDoc(collection(db, "shops"), {
        ...formData,
        services: selectedServices,
        createdAt: serverTimestamp(),
        uid: userData?.uid || null // Optional: link to user ID if available
      });

      setSubmitted(true);
      setTimeout(() => navigate('/shop-dashboard'), 2000);
    } catch (error) {
      console.error("Error registering shop:", error);
      alert("Failed to register shop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="shop-register-page">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h3>Checking registration status...</h3>
        </div>
      </div>
    );
  }

  if (alreadyRegistered) {
    return (
      <div className="shop-register-page">
        <div className="container">
          <motion.div
            className="login-prompt-box"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ 
              textAlign: 'center', 
              padding: '50px 40px', 
              background: 'white', 
              borderRadius: '15px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
              maxWidth: '500px',
              margin: '60px auto'
            }}
          >
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏪</div>
            <h2 style={{ marginBottom: '15px', color: '#1a1a1a' }}>Already Partnered!</h2>
            <p style={{ marginBottom: '30px', color: '#666', lineHeight: '1.6' }}>
              You have already registered your shop with WashEase! You can manage your orders and shop details from your dashboard.
            </p>
            <button 
              onClick={() => navigate('/shop-dashboard')} 
              className="btn-primary"
              style={{ padding: '12px 30px', width: 'auto' }}
            >
              Go to Shop Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="shop-register-page">
        <div className="container">
          <motion.div
            className="login-prompt-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ 
              textAlign: 'center', 
              padding: '40px', 
              background: 'white', 
              borderRadius: '15px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
              maxWidth: '500px',
              margin: '60px auto'
            }}
          >
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>🔐</div>
            <h2 style={{ marginBottom: '15px', color: '#1a1a1a' }}>Login Required</h2>
            <p style={{ marginBottom: '30px', color: '#666', lineHeight: '1.6' }}>
              Please login first to register your shop and start partnering with WashEase.
            </p>
            <button 
              onClick={() => navigate('/login')} 
              className="btn-primary"
              style={{ padding: '12px 30px', width: 'auto' }}
            >
              Login to Continue
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

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
                  <input 
                    type="text" 
                    name="shopName"
                    placeholder="e.g. Sharma Laundry" 
                    value={formData.shopName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Owner Name *</label>
                  <input 
                    type="text" 
                    name="ownerName"
                    placeholder="Full name" 
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="10-digit mobile number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="shop@example.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Shop Location (Jhansi)</h3>
              <div className="form-group">
                <label>Full Address *</label>
                <input 
                  type="text" 
                  name="address"
                  placeholder="Shop address with landmark" 
                  value={formData.address}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Area / Locality *</label>
                  <select 
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select area</option>
                    <option value="Civil Lines">Civil Lines</option>
                    <option value="Sipri Bazar">Sipri Bazar</option>
                    <option value="Sadar Bazar">Sadar Bazar</option>
                    <option value="Cantonment">Cantonment</option>
                    <option value="Nai Sadak">Nai Sadak</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>PIN Code *</label>
                  <input 
                    type="text" 
                    name="pinCode"
                    placeholder="e.g. 284001" 
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Services Offered</h3>
              <div className="checkbox-group">
                {Object.keys(services).map(service => (
                  <label key={service} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={services[service]} 
                      onChange={() => handleServiceChange(service)}
                    /> {service}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary btn-submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ShopRegister;
