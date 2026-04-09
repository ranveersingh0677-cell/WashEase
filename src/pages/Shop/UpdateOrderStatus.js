import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import './UpdateOrderStatus.css';

const statusSteps = ['Order Placed', 'Picked Up', 'Washing', 'Out for Delivery', 'Delivered'];

const mockOrders = [
  { id: 'WE-20240001', customer: 'Rahul Gupta', currentStatus: 'Washing' },
  { id: 'WE-20240004', customer: 'Priya Sharma', currentStatus: 'Picked Up' },
  { id: 'WE-20240005', customer: 'Amit Singh', currentStatus: 'Order Placed' },
];

const UpdateOrderStatus = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [updated, setUpdated] = useState(null);

  const moveToNext = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const currentIndex = statusSteps.indexOf(o.currentStatus);
        const nextStatus = currentIndex < statusSteps.length - 1
          ? statusSteps[currentIndex + 1]
          : o.currentStatus;
        return { ...o, currentStatus: nextStatus };
      })
    );
    setUpdated(orderId);
    setTimeout(() => setUpdated(null), 2000);
  };

  return (
    <div className="update-status-page">
      <div className="container">
        <div className="page-header">
          <h2>Update Order Status</h2>
          <p>Manage and advance order statuses for your shop</p>
        </div>

        <div className="orders-update-list">
          {orders.map((order, index) => {
            const currentIndex = statusSteps.indexOf(order.currentStatus);
            const isDelivered = order.currentStatus === 'Delivered';

            return (
              <motion.div
                key={order.id}
                className="update-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="update-card-top">
                  <div>
                    <h4>{order.id}</h4>
                    <p>Customer: {order.customer}</p>
                  </div>
                  <span className={`current-status ${isDelivered ? 'delivered' : ''}`}>
                    {order.currentStatus}
                  </span>
                </div>

                <div className="status-stepper">
                  {statusSteps.map((step, i) => (
                    <div key={step} className="step-group">
                      <div className={`step-dot ${i <= currentIndex ? 'active' : ''} ${i === currentIndex ? 'current' : ''}`}>
                        {i < currentIndex ? <FiCheck /> : i + 1}
                      </div>
                      <span className={`step-label ${i <= currentIndex ? 'active' : ''}`}>{step}</span>
                      {i < statusSteps.length - 1 && (
                        <div className={`step-line ${i < currentIndex ? 'active' : ''}`} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="update-actions">
                  {!isDelivered ? (
                    <motion.button
                      className="btn-primary"
                      onClick={() => moveToNext(order.id)}
                      whileTap={{ scale: 0.97 }}
                    >
                      {updated === order.id ? '✓ Updated!' : `Mark as "${statusSteps[currentIndex + 1]}"`}
                    </motion.button>
                  ) : (
                    <span className="delivered-badge">✓ Order Delivered</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link to="/shop-dashboard" className="btn-outline">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderStatus;
