import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheck, FiLoader } from 'react-icons/fi';
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import './UpdateOrderStatus.css';

const statusSteps = ['Order Placed', 'Picked Up', 'Washing', 'Out for Delivery', 'Delivered'];

const UpdateOrderStatus = () => {
  const { userData } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(null);

  const fetchOrders = async () => {
    if (!userData?.name) return;
    try {
      const q = query(
        collection(db, "orders"),
        where("shopName", "==", userData.name),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders for update:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

  const moveToNext = async (docId, currentStatus) => {
    const currentIndex = statusSteps.indexOf(currentStatus);
    if (currentIndex >= statusSteps.length - 1) return;

    const nextStatus = statusSteps[currentIndex + 1];
    setUpdated(docId);

    try {
      const orderRef = doc(db, "orders", docId);
      await updateDoc(orderRef, {
        status: nextStatus
      });
      
      // Update local state
      setOrders(prev => prev.map(o => o.id === docId ? { ...o, status: nextStatus } : o));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }

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
          {loading ? (
            <div className="loading-state"><FiLoader className="spinner" /> Loading orders...</div>
          ) : orders.length > 0 ? (
            orders.map((order, index) => {
              const currentIndex = statusSteps.indexOf(order.status);
              const isDelivered = order.status === 'Delivered';

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
                      <h4>{order.orderId}</h4>
                      <p>Customer: {order.customerName}</p>
                    </div>
                    <span className={`current-status ${isDelivered ? 'delivered' : ''}`}>
                      {order.status}
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
                        onClick={() => moveToNext(order.id, order.status)}
                        whileTap={{ scale: 0.97 }}
                        disabled={updated === order.id}
                      >
                        {updated === order.id ? '✓ Updating...' : `Mark as "${statusSteps[currentIndex + 1]}"`}
                      </motion.button>
                    ) : (
                      <span className="delivered-badge">✓ Order Delivered</span>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="empty-state">No orders to update.</div>
          )}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link to="/shop-dashboard" className="btn-outline">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderStatus;
