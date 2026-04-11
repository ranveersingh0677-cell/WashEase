import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiMinus, FiShoppingBag, FiMapPin } from 'react-icons/fi';
import './PlaceOrder.css';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

const services = [
  { id: 'wash-fold',  name: 'Wash & Fold',   priceRange: '₹8 – ₹15 / piece',   icon: '👕' },
  { id: 'wash-iron',  name: 'Wash & Iron',   priceRange: '₹12 – ₹20 / piece',  icon: '👔' },
  { id: 'dry-clean',  name: 'Dry Cleaning',  priceRange: '₹40 – ₹80 / piece',  icon: '👗' },
  { id: 'iron-only',  name: 'Ironing Only',  priceRange: '₹5 – ₹10 / piece',   icon: '🧺' },
];

const clothTypes = [
  'Shirt', 'T-Shirt', 'Jeans', 'Trousers', 'Saree',
  'Kurta', 'Jacket', 'Bedsheet', 'Towel',
];

const shops = [
  { id: 'sharma',  label: 'Sharma Laundry',        area: 'Civil Lines, Jhansi' },
  { id: 'clean',   label: 'Clean & Fresh',          area: 'Sipri Bazaar, Jhansi' },
  { id: 'jhansi',  label: 'Jhansi Laundry House',  area: 'Sadar Bazaar, Jhansi' },
];

const defaultItems = () =>
  Object.fromEntries(services.map((s) => [s.id, { qty: 0, clothType: '' }]));

const generateOrderId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'WE-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [items, setItems] = useState(defaultItems());
  const [selectedPayment, setSelectedPayment] = useState('cash on delivery');
  const [selectedShop, setSelectedShop] = useState('');
  const [address, setAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading] = useState(false);

  const updateQty = (id, delta) =>
    setItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], qty: Math.max(0, prev[id].qty + delta) },
    }));

  const updateClothType = (id, value) =>
    setItems((prev) => ({ ...prev, [id]: { ...prev[id], clothType: value } }));

  const totalItemsCount = Object.values(items).reduce((a, b) => a + b.qty, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalItemsCount === 0) {
      alert('Please add at least one item.');
      return;
    }
    if (!selectedShop) {
      alert('Please select a laundry shop.');
      return;
    }
    if (!address || !pickupTime) {
      alert('Please provide address and pickup time.');
      return;
    }

    setLoading(true);
    try {
      const orderId = generateOrderId();
      const shopInfo = shops.find(s => s.id === selectedShop);
      
      const orderData = {
        orderId: orderId,
        customerId: currentUser.uid,
        customerName: userData?.name || 'Guest User',
        customerPhone: userData?.phone || '',
        items: items,
        totalItems: totalItemsCount,
        totalAmount: 0, // Confirmed after pickup
        shopId: selectedShop,
        shopName: shopInfo?.label || '',
        address: address,
        pickupTime: pickupTime,
        paymentMethod: selectedPayment,
        status: "Order Placed",
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "orders"), orderData);
      navigate('/track-order', { state: { orderId: orderId, newOrder: true } });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="place-order-page">
      <div className="container">
        <div className="order-header">
          <h2>Schedule a Pickup</h2>
          <p>Select services and quantity for your laundry</p>
        </div>

        <div className="order-content">
          {/* ── LEFT COLUMN ── */}
          <div className="services-selection">

            {/* Shop selector */}
            <div className="shop-selector mb-4">
              <h3><FiMapPin style={{ marginRight: 8, verticalAlign: 'middle' }} />Select Laundry Shop</h3>
              <select
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                required
                className="shop-select"
              >
                <option value="">— Choose a shop —</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.label} · {shop.area}
                  </option>
                ))}
              </select>
            </div>

            {/* Service rows */}
            <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>
              Select Services
            </h3>

            {services.map((service) => (
              <motion.div
                key={service.id}
                className={`service-row${items[service.id].qty > 0 ? ' service-row--active' : ''}`}
                whileHover={{ scale: 1.01 }}
              >
                <div className="service-top">
                  <div className="service-info">
                    <span className="service-icon">{service.icon}</span>
                    <div>
                      <h4>{service.name}</h4>
                      <p className="price-range">{service.priceRange}</p>
                    </div>
                  </div>
                  <div className="quantity-controls">
                    <button type="button" onClick={() => updateQty(service.id, -1)} className="btn-qty">
                      <FiMinus />
                    </button>
                    <span className="qty-display">{items[service.id].qty}</span>
                    <button type="button" onClick={() => updateQty(service.id, 1)} className="btn-qty">
                      <FiPlus />
                    </button>
                  </div>
                </div>

                {/* Cloth type — show only when qty > 0 */}
                {items[service.id].qty > 0 && (
                  <motion.div
                    className="cloth-type-row"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.25 }}
                  >
                    <label htmlFor={`cloth-${service.id}`}>Cloth Type:</label>
                    <select
                      id={`cloth-${service.id}`}
                      value={items[service.id].clothType}
                      onChange={(e) => updateClothType(service.id, e.target.value)}
                      className="cloth-select"
                    >
                      <option value="">— Select type —</option>
                      {clothTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* Pricing note */}
            <div className="pricing-note">
              <span>ℹ️</span>
              <p>
                Final price will be confirmed by the shop after pickup.
                <br />Prices may vary by shop.
              </p>
            </div>

            {/* Address */}
            <div className="address-section mt-4">
              <h3>Pickup Address (Jhansi)</h3>
              <textarea 
                placeholder="Enter full address, landmark, nearby area..." 
                rows="3" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required 
              />
            </div>

            {/* Pickup time */}
            <div className="pickup-time mt-4">
              <h3>Preferred Pickup Time</h3>
              <select 
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
              >
                <option value="">Select a time slot</option>
                <option value="Today (09:00 AM – 12:00 PM)">Today (09:00 AM – 12:00 PM)</option>
                <option value="Today (04:00 PM – 07:00 PM)">Today (04:00 PM – 07:00 PM)</option>
                <option value="Tomorrow (09:00 AM – 12:00 PM)">Tomorrow (09:00 AM – 12:00 PM)</option>
              </select>
            </div>
          </div>

          {/* ── RIGHT COLUMN (Summary) ── */}
          <div className="order-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Total Items</span>
                  <span>{totalItemsCount} pieces</span>
                </div>

                {services.map((s) =>
                  items[s.id].qty > 0 ? (
                    <div className="summary-row" key={s.id}>
                      <span>{s.name} × {items[s.id].qty}</span>
                      <span className="price-tbd">TBD</span>
                    </div>
                  ) : null
                )}

                <div className="summary-row">
                  <span>Estimated Total</span>
                  <span className="price-tbd">Confirmed after pickup</span>
                </div>

                <div className="summary-row">
                  <span>Pickup Fee</span>
                  <span>Free</span>
                </div>

                {selectedShop && (
                  <div className="selected-shop-badge">
                    🏪 {shops.find((s) => s.id === selectedShop)?.label}
                  </div>
                )}
              </div>

              {/* Payment */}
              <div className="payment-options mt-4">
                <h4>Payment Method</h4>
                <div className="payment-grid">
                  <label className="payment-label active">
                    <input
                      type="radio"
                      name="payment"
                      value="cash on delivery"
                      checked={true}
                      readOnly
                    />
                    Cash on Delivery
                  </label>
                </div>
                <p className="payment-info-note">
                  Pay cash to the pickup boy when clothes are collected. 
                  <br /><span>Online payments coming soon!</span>
                </p>
              </div>


              <button
                type="button"
                className="btn-primary btn-block place-order-btn"
                onClick={handleSubmit}
                disabled={totalItemsCount === 0 || !selectedShop || loading}
              >
                {loading ? 'Processing Order...' : 'Place Order'} <FiShoppingBag />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
