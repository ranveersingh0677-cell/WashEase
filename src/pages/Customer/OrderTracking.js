import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import OrderStatusTimeline from '../../components/OrderStatusTimeline/OrderStatusTimeline';
import './OrderTracking.css';

const mockOrder = {
  id: 'WE-20240001',
  items: [
    { name: 'Wash & Fold', qty: 5, price: 50 },
    { name: 'Wash & Iron', qty: 3, price: 45 },
  ],
  total: 95,
  address: 'Civil Lines, Jhansi, UP 284001',
  placedOn: '08 Apr 2026, 10:30 AM',
  currentStep: 3,
};

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('WE-20240001');
  const [searched, setSearched] = useState(true);

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

          <div className="search-bar">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g. WE-20240001)"
            />
            <button className="btn-primary" onClick={() => setSearched(true)}>
              Track
            </button>
          </div>

          {searched && (
            <motion.div
              className="tracking-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="order-meta">
                <div className="meta-row">
                  <span className="meta-label">Order ID</span>
                  <span className="meta-value">{mockOrder.id}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Placed On</span>
                  <span className="meta-value">{mockOrder.placedOn}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Address</span>
                  <span className="meta-value">{mockOrder.address}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Total</span>
                  <span className="meta-value">₹{mockOrder.total}</span>
                </div>
              </div>

              <div className="timeline-wrapper">
                <h3>Order Status</h3>
                <OrderStatusTimeline currentStepId={mockOrder.currentStep} />
              </div>

              <div className="order-items-breakdown">
                <h3>Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Qty</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrder.items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.qty} pcs</td>
                        <td>₹{item.price}</td>
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
