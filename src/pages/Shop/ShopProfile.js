import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiX, FiInfo, FiMapPin, FiPhone, FiMail, FiTag, FiUser } from 'react-icons/fi';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import './ShopProfile.css';

const availableServices = [
  'Wash & Fold',
  'Wash & Iron',
  'Dry Cleaning',
  'Blankets & Curtains',
  'Ironing Only'
];

const ShopProfile = () => {
  const { userData } = useAuth();
  const [shopData, setShopData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    address: '',
    area: '',
    pinCode: '',
    services: []
  });

  const fetchShopData = async () => {
    if (!userData?.email) return;
    try {
      const q = query(collection(db, "shops"), where("email", "==", userData.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        const id = querySnapshot.docs[0].id;
        const data = { id, ...docData };
        setShopData(data);
        setFormData({
          shopName: data.shopName || '',
          ownerName: data.ownerName || '',
          phone: data.phone || '',
          address: data.address || '',
          area: data.area || '',
          pinCode: data.pinCode || '',
          services: data.services || []
        });
      }
    } catch (error) {
      console.error("Error fetching shop profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSave = async () => {
    if (!shopData?.id) return;
    setSaving(true);
    try {
      const shopRef = doc(db, "shops", shopData.id);
      await updateDoc(shopRef, formData);
      setShopData({ ...shopData, ...formData });
      setIsEditing(false);
      alert("Shop profile updated successfully!");
    } catch (error) {
      console.error("Error updating shop profile:", error);
      alert("Failed to update shop details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading shop profile...</div>;
  if (!shopData) return <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>No shop data found.</div>;

  return (
    <div className="shop-profile-page">
      <div className="container shop-profile-container">
        <motion.div 
          className="shop-card"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="shop-header">
            <div>
              <h2>Shop Profile</h2>
              <p>Manage your laundry shop information</p>
            </div>
            {!isEditing && (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FiEdit2 /> Edit Details
              </button>
            )}
          </div>

          <div className="shop-form-grid">
            <div className="form-group">
              <label><FiTag style={{marginRight: 6}}/> Shop Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="shopName" 
                  value={formData.shopName} 
                  onChange={handleInputChange} 
                />
              ) : (
                <p>{shopData.shopName}</p>
              )}
            </div>

            <div className="form-group">
              <label><FiUser style={{marginRight: 6}}/> Owner Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="ownerName" 
                  value={formData.ownerName} 
                  onChange={handleInputChange} 
                />
              ) : (
                <p>{shopData.ownerName}</p>
              )}
            </div>

            <div className="form-group">
              <label><FiPhone style={{marginRight: 6}}/> Phone Number</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                />
              ) : (
                <p>{shopData.phone}</p>
              )}
            </div>

            <div className="form-group">
              <label><FiMail style={{marginRight: 6}}/> Email (Read-only)</label>
              <p>{shopData.email}</p>
            </div>

            <div className="form-group full-width">
              <label><FiMapPin style={{marginRight: 6}}/> Full Address</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                />
              ) : (
                <p>{shopData.address}</p>
              )}
            </div>

            <div className="form-group">
              <label>Area / Locality</label>
              {isEditing ? (
                <select name="area" value={formData.area} onChange={handleInputChange}>
                  <option value="Civil Lines">Civil Lines</option>
                  <option value="Sipri Bazar">Sipri Bazar</option>
                  <option value="Sadar Bazar">Sadar Bazar</option>
                  <option value="Cantonment">Cantonment</option>
                  <option value="Nai Sadak">Nai Sadak</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p>{shopData.area}</p>
              )}
            </div>

            <div className="form-group">
              <label>PIN Code</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="pinCode" 
                  value={formData.pinCode} 
                  onChange={handleInputChange} 
                />
              ) : (
                <p>{shopData.pinCode}</p>
              )}
            </div>

            <div className="form-group full-width">
              <label><FiInfo style={{marginRight: 6}}/> Services Offered</label>
              {isEditing ? (
                <div className="services-edit-grid">
                  {availableServices.map(service => (
                    <label key={service} className="service-checkbox">
                      <input 
                        type="checkbox" 
                        checked={formData.services.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                      />
                      {service}
                    </label>
                  ))}
                </div>
              ) : (
                <div style={{marginTop: 8}}>
                  {shopData.services?.map(s => (
                    <span key={s} className="service-badge">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button 
                className="cancel-btn" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({...shopData});
                }} 
                disabled={saving}
              >
                <FiX style={{marginRight: 6, verticalAlign: 'middle'}}/> Cancel
              </button>
              <button className="save-btn" onClick={handleSave} disabled={saving}>
                <FiSave style={{marginRight: 6, verticalAlign: 'middle'}}/> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ShopProfile;
