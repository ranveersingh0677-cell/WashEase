import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiUser, FiMail, FiPhone, FiShoppingBag, FiInfo } from 'react-icons/fi';
import { doc, updateDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { currentUser, userData, fetchAndSetUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalOrders: 0, lastStatus: 'No orders yet' });
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    phone: userData?.phone || ''
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || ''
      });
      fetchOrderStats();
    }
  }, [userData]);

  const fetchOrderStats = async () => {
    if (!currentUser?.uid) return;
    try {
      const q = query(
        collection(db, "orders"),
        where("customerId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const count = querySnapshot.size;
      let lastStatus = 'No orders yet';
      
      if (count > 0) {
        lastStatus = querySnapshot.docs[0].data().status;
      }
      
      setStats({ totalOrders: count, lastStatus });
    } catch (error) {
      console.error("Error fetching order stats:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!currentUser?.uid) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        name: formData.name,
        phone: formData.phone
      });
      await fetchAndSetUserData(currentUser.uid);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading profile...</div>;

  return (
    <div className="profile-page">
      <div className="container profile-container">
        <motion.div 
          className="profile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="profile-header">
            <h2>My Profile</h2>
            {!isEditing && (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FiEdit2 /> Edit Profile
              </button>
            )}
          </div>

          <div className="profile-info-grid">
            <div className="info-item">
              <label><FiUser style={{marginRight: 6}}/> Full Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              ) : (
                <p>{userData.name}</p>
              )}
            </div>

            <div className="info-item">
              <label><FiMail style={{marginRight: 6}}/> Email Address</label>
              <p>{userData.email}</p>
            </div>

            <div className="info-item">
              <label><FiPhone style={{marginRight: 6}}/> Phone Number</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                />
              ) : (
                <p>{userData.phone || 'Not provided'}</p>
              )}
            </div>

            <div className="info-item">
              <label><FiInfo style={{marginRight: 6}}/> Account Role</label>
              <p style={{textTransform: 'capitalize'}}>{userData.role}</p>
            </div>
          </div>

          {isEditing && (
            <div className="edit-actions">
              <button className="cancel-btn" onClick={() => setIsEditing(false)} disabled={loading}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </motion.div>

        <motion.div 
          className="profile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="profile-header">
            <h2>Activity Overview</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-box">
              <h3><FiShoppingBag style={{marginRight: 6, verticalAlign: 'middle'}}/> Total Orders</h3>
              <div className="stat-val">{stats.totalOrders}</div>
            </div>
            <div className="stat-box">
              <h3>Latest Order Status</h3>
              <div className="last-status">{stats.lastStatus}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
