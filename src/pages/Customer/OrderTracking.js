import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import OrderStatusTimeline from '../../components/OrderStatusTimeline/OrderStatusTimeline';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './OrderTracking.css';

const statusToStepMap = {
  'Order Placed': 1,
  'Picked Up': 2,
  'Washing': 3,
  'Out for Delivery': 4,
  'Delivered': 5
};

const OrderTracking = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState(location.state?.orderId || '');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!location.state?.orderId);
  const [error, setError] = useState('');

  const fetchOrder = useCallback(async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, "orders"), where("orderId", "==", idToFetch.trim()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setOrderData(data);
        setSearched(true);
      } else {
        setOrderData(null);
        setError('Order not found. Please check the ID.');
        setSearched(true);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError('An error occurred while fetching the order.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (location.state?.orderId) {
      fetchOrder(location.state.orderId);
    }
  }, [location.state?.orderId, fetchOrder]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrder(orderId);
  };

  return (
    <div className="track-order-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="page-header">
            <h2>Track Your Order</h2>
            <p>Enter your order ID to see the live status</p>
          </div>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g. WE-AB12CD)"
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}

          {searched && orderData && (
            <motion.div
              className="tracking-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="order-meta">
                <div className="meta-row">
                  <span className="meta-label">Order ID</span>
                  <span className="meta-value">{orderData.orderId}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Status</span>
                  <span className="meta-value" style={{fontWeight: '700', color: 'var(--primary-color)'}}>
                    {orderData.status}
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Placed On</span>
                  <span className="meta-value">
                    {orderData.createdAt?.toDate ? orderData.createdAt.toDate().toLocaleString() : 'Just now'}
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Shop</span>
                  <span className="meta-value">{orderData.shopName}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Address</span>
                  <span className="meta-value">{orderData.address}</span>
                </div>
              </div>

              <div className="timeline-wrapper">
                <h3>Order Progress</h3>
                <OrderStatusTimeline currentStepId={statusToStepMap[orderData.status] || 1} />
              </div>

              <div className="order-items-breakdown">
                <h3>Items Summary</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Qty</th>
                      <th>Cloth Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(orderData.items).filter(([_, details]) => details.qty > 0).map(([id, details]) => (
                      <tr key={id}>
                        <td style={{textTransform: 'capitalize'}}>{id.replace('-', ' ')}</td>
                        <td>{details.qty} pcs</td>
                        <td>{details.clothType || 'General'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="track-actions">
                <Link to="/my-orders" className="btn-outline">← Back to My Orders</Link>
                <Link to="/place-order" className="btn-primary">Place New Order</Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTracking;
