import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPackage, FiArrowRight, FiLoader } from 'react-icons/fi';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import './MyOrders.css';

const statusColors = {
  'Order Placed': '#6366F1',
  'Picked Up': '#3B82F6',
  'Washing': '#00B4D8',
  'Out for Delivery': '#F59E0B',
  'Delivered': '#10B981',
};

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      console.log("Current user ID:", currentUser.uid);
      try {
        const q = query(
          collection(db, "orders"),
          where("customerId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Orders fetched:", fetchedOrders.length);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching my orders:", error);
        console.error("Full error details:", error.code, error.message);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [currentUser]);
  return (
    <div className="my-orders-page">
      <div className="container">
        <div className="page-header">
          <h2>My Orders</h2>
          <p>View all your past and active laundry orders</p>
        </div>

        <div className="orders-list">
          {loading ? (
            <div className="loading-state">
              <FiLoader className="spinner" />
              <p>Fetching your orders...</p>
            </div>
          ) : orders.length > 0 ? (
            orders.map((order, index) => (
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
                    <h4>{order.orderId}</h4>
                    <p className="order-meta-text">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'} · {order.totalItems} items
                    </p>
                    <p className="order-shop-name">🏪 {order.shopName || 'Laundry Shop'}</p>
                  </div>
                </div>
                <div className="order-card-right">
                  <span
                    className="status-badge"
                    style={{ 
                      backgroundColor: `${statusColors[order.status]}20`, 
                      color: statusColors[order.status] 
                    }}
                  >
                    {order.status}
                  </span>
                  <span className="order-amount">To be confirmed by shop</span>
                  <Link to="/track-order" state={{ orderId: order.orderId }} className="track-link">
                    Track <FiArrowRight />
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="empty-state">
              <p>No orders found. Start by scheduling a pickup!</p>
            </div>
          )}
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
