import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPackage, FiCheckCircle, FiClock, FiDollarSign, FiLoader } from 'react-icons/fi';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import './ShopDashboard.css';

const statusColors = {
  'Order Placed': { bg: '#EEF2FF', text: '#6366F1' },
  'Picked Up':    { bg: '#DBEAFE', text: '#3B82F6' },
  'Washing':      { bg: '#CFFAFE', text: '#0077B6' },
  'Out for Delivery': { bg: '#FEF3C7', text: '#D97706' },
  'Delivered':    { bg: '#D1FAE5', text: '#10B981' },
};

const ShopDashboard = () => {
  const { userData } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Today\'s Orders', value: '0', icon: <FiPackage />, color: '#00B4D8' },
    { label: 'Completed', value: '0', icon: <FiCheckCircle />, color: '#10B981' },
    { label: 'Pending', value: '0', icon: <FiClock />, color: '#F59E0B' },
    { label: 'Today\'s Revenue', value: '₹0', icon: <FiDollarSign />, color: '#6366F1' },
  ]);

  useEffect(() => {
    const fetchShopOrders = async () => {
      if (!userData?.name) return;
      try {
        const q = query(
          collection(db, "orders"),
          where("shopName", "==", userData.name),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(fetchedOrders);

        // Update basic stats
        const completed = fetchedOrders.filter(o => o.status === 'Delivered').length;
        const pending = fetchedOrders.length - completed;
        setStats([
          { label: 'Total Orders', value: fetchedOrders.length.toString(), icon: <FiPackage />, color: '#00B4D8' },
          { label: 'Completed', value: completed.toString(), icon: <FiCheckCircle />, color: '#10B981' },
          { label: 'Pending', value: pending.toString(), icon: <FiClock />, color: '#F59E0B' },
          { label: 'Total Items', value: fetchedOrders.reduce((acc, curr) => acc + (curr.totalItems || 0), 0).toString(), icon: <FiDollarSign />, color: '#6366F1' },
        ]);
      } catch (error) {
        console.error("Error fetching shop orders:", error);
      }
      setLoading(false);
    };

    fetchShopOrders();
  }, [userData]);

  if (loading) return <div className="loading-state"><FiLoader className="spinner" /> Loading Dashboard...</div>;

  return (
    <div className="shop-dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h2>Shop Dashboard</h2>
            <p>{userData?.name || 'Your Shop'} — Welcome back!</p>
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
          <h3>Recent Orders</h3>
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const sc = statusColors[order.status] || { bg: '#f3f4f6', text: '#374151' };
                    return (
                      <tr key={order.id}>
                        <td className="order-id">{order.orderId}</td>
                        <td>{order.customerName}</td>
                        <td>{order.totalItems} pcs</td>
                        <td>{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Today'}</td>
                        <td>
                          <span className="status-pill" style={{ background: sc.bg, color: sc.text }}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <Link to="/update-order" state={{ docId: order.id }} className="action-link">Update →</Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
