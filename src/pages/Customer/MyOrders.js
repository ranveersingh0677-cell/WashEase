import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPackage, FiArrowRight } from 'react-icons/fi';
import './MyOrders.css';

const mockOrders = [
  {
    id: 'WE-20240001',
    date: '08 Apr 2026',
    items: 8,
    total: 95,
    status: 'Washing',
    statusStep: 3,
  },
  {
    id: 'WE-20240002',
    date: '05 Apr 2026',
    items: 12,
    total: 180,
    status: 'Delivered',
    statusStep: 5,
  },
  {
    id: 'WE-20240003',
    date: '01 Apr 2026',
    items: 5,
    total: 75,
    status: 'Delivered',
    statusStep: 5,
  },
];

const statusColors = {
  'Delivered': '#10B981',
  'Washing': '#00B4D8',
  'Out for Delivery': '#F59E0B',
  'Order Placed': '#6366F1',
  'Picked Up': '#3B82F6',
};

const MyOrders = () => {
  return (
    <div className="my-orders-page">
      <div className="container">
        <div className="page-header">
          <h2>My Orders</h2>
          <p>View all your past and active laundry orders</p>
        </div>

        <div className="orders-list">
          {mockOrders.map((order, index) => (
            <motion.div
              key={order.id}
              className="order-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="order-card-left">
                <div className="order-icon">
                  <FiPackage />
                </div>
                <div className="order-info">
                  <h4>{order.id}</h4>
                  <p>{order.date} · {order.items} items</p>
                </div>
              </div>
              <div className="order-card-right">
                <span
                  className="status-badge"
                  style={{ backgroundColor: `${statusColors[order.status]}20`, color: statusColors[order.status] }}
                >
                  {order.status}
                </span>
                <span className="order-amount">₹{order.total}</span>
                <Link to="/track-order" className="track-link">
                  Track <FiArrowRight />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="orders-empty-cta">
          <Link to="/place-order" className="btn-primary">
            Place a New Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
