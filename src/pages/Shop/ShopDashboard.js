import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPackage, FiCheckCircle, FiClock, FiTrendingUp, FiDollarSign, FiLoader } from 'react-icons/fi';
import './ShopDashboard.css';

const mockOrders = [
  { id: 'WE-20240001', customer: 'Rahul Gupta', items: 8, amount: 95, status: 'Washing', time: '10:30 AM' },
  { id: 'WE-20240004', customer: 'Priya Sharma', items: 12, amount: 180, status: 'Picked Up', time: '11:15 AM' },
  { id: 'WE-20240005', customer: 'Amit Singh', items: 5, amount: 75, status: 'Order Placed', time: '12:00 PM' },
  { id: 'WE-20240006', customer: 'Neha Verma', items: 10, amount: 150, status: 'Out for Delivery', time: '01:30 PM' },
];

const statusColors = {
  'Order Placed': { bg: '#EEF2FF', text: '#6366F1' },
  'Picked Up':    { bg: '#DBEAFE', text: '#3B82F6' },
  'Washing':      { bg: '#CFFAFE', text: '#0077B6' },
  'Out for Delivery': { bg: '#FEF3C7', text: '#D97706' },
  'Delivered':    { bg: '#D1FAE5', text: '#10B981' },
};

const stats = [
  { label: 'Today\'s Orders', value: '12', icon: <FiPackage />, color: '#00B4D8' },
  { label: 'Completed', value: '8', icon: <FiCheckCircle />, color: '#10B981' },
  { label: 'Pending', value: '4', icon: <FiClock />, color: '#F59E0B' },
  { label: 'Today\'s Revenue', value: '₹1,840', icon: <FiDollarSign />, color: '#6366F1' },
];

const ShopDashboard = () => {
  const [orders, setOrders] = useState(mockOrders);

  return (
    <div className="shop-dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h2>Shop Dashboard</h2>
            <p>Sharma Laundry, Civil Lines, Jhansi — Welcome back!</p>
          </div>
          <Link to="/update-order" className="btn-primary">
            Update Order Status
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Incoming Orders */}
        <div className="orders-section">
          <h3>Incoming Orders</h3>
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const sc = statusColors[order.status] || { bg: '#f3f4f6', text: '#374151' };
                  return (
                    <tr key={order.id}>
                      <td className="order-id">{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.items} pcs</td>
                      <td>₹{order.amount}</td>
                      <td>{order.time}</td>
                      <td>
                        <span className="status-pill" style={{ background: sc.bg, color: sc.text }}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <Link to="/update-order" className="action-link">Update →</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
