import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPackage, FiCheckCircle, FiClock, FiDollarSign, FiLoader, FiChevronDown, FiChevronUp, FiMapPin } from 'react-icons/fi';
import { collection, query, where, orderBy, getDocs, updateDoc, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [shopData, setShopData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [stats, setStats] = useState([
    { label: 'Total Orders', value: '0', icon: <FiPackage />, color: '#00B4D8' },
    { label: 'Completed', value: '0', icon: <FiCheckCircle />, color: '#10B981' },
    { label: 'Pending', value: '0', icon: <FiClock />, color: '#F59E0B' },
    { label: 'Total Items', value: '0', icon: <FiDollarSign />, color: '#6366F1' },
  ]);

  useEffect(() => {
    const initializeDashboard = async () => {
      if (!userData) {
        // Wait for userData to be available from AuthContext
        return;
      }

      try {
        // 1. Fetch Shop Data - Must match currently logged in user's email
        if (!userData.email) {
          console.log("User email not found. Redirecting to registration.");
          navigate('/shop-register');
          return;
        }

        const shopQuery = query(
          collection(db, "shops"),
          where("email", "==", userData.email)
        );
        
        const shopSnapshot = await getDocs(shopQuery);
        
        if (shopSnapshot.empty) {
          console.log("No shop found for this user. Redirecting to registration.");
          navigate('/shop-register');
          return;
        }

        const currentShop = {
          id: shopSnapshot.docs[0].id,
          ...shopSnapshot.docs[0].data()
        };
        setShopData(currentShop);

        // 2. Fetch Shop Orders
        const ordersQuery = query(
          collection(db, "orders"),
          where("shopName", "==", currentShop.shopName),
          orderBy("createdAt", "desc")
        );
        
        const orderSnapshot = await getDocs(ordersQuery);
        const fetchedOrders = orderSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setOrders(fetchedOrders);
        console.log("Registered shop name:", currentShop.shopName);
        console.log("Orders found for this shop:", fetchedOrders.length);

        // 3. Update Stats
        const completed = fetchedOrders.filter(o => o.status === 'Delivered').length;
        const pending = fetchedOrders.length - completed;
        const totalItems = fetchedOrders.reduce((acc, curr) => acc + (parseInt(curr.totalItems) || 0), 0);
        
        setStats([
          { label: 'Total Orders', value: fetchedOrders.length.toString(), icon: <FiPackage />, color: '#00B4D8' },
          { label: 'Completed', value: completed.toString(), icon: <FiCheckCircle />, color: '#10B981' },
          { label: 'Pending', value: pending.toString(), icon: <FiClock />, color: '#F59E0B' },
          { label: 'Total Items', value: totalItems.toString(), icon: <FiDollarSign />, color: '#6366F1' },
        ]);

      } catch (error) {
        console.error("Error initializing dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [userData, navigate]);

  const handleStatusUpdate = async (docId, newStatus) => {
    setUpdatingId(docId);
    try {
      const orderRef = doc(db, "orders", docId);
      await updateDoc(orderRef, { status: newStatus });
      
      // Create Notification for Customer
      const order = orders.find(o => o.id === docId);
      if (order && order.customerId) {
        await addDoc(collection(db, "notifications"), {
          recipientId: order.customerId,
          orderId: order.orderId,
          message: `Your order ${order.orderId} status updated to ${newStatus}!`,
          status: newStatus,
          type: "status_update",
          isRead: false,
          createdAt: serverTimestamp()
        });
      }
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === docId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveShop = async () => {
    if (!shopData?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove your shop from WashEase? This cannot be undone."
    );

    if (confirmed) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "shops", shopData.id));
        alert("Your shop has been removed successfully");
        navigate('/');
      } catch (error) {
        console.error("Error removing shop:", error);
        alert("Failed to remove shop. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="loading-state"><FiLoader className="spinner" /> Loading Dashboard...</div>;

  return (
    <div className="shop-dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h2>Shop Dashboard</h2>
            <p>{shopData?.shopName || 'Your Shop'} — Welcome back!</p>
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
                    const sc = statusColors[order.status] || { bg: '#f3f4f5', text: '#374151' };
                    const isExpanded = expandedOrderId === order.id;

                    return (
                      <React.Fragment key={order.id}>
                        <tr className={isExpanded ? 'row-expanded' : ''}>
                          <td className="order-id">{order.orderId}</td>
                          <td>{order.customerName}</td>
                          <td>{order.totalItems} pcs</td>
                          <td>{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Today'}</td>
                          <td>
                            <select 
                              className="status-select"
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              disabled={updatingId === order.id}
                              style={{ 
                                backgroundColor: sc.bg, 
                                color: sc.text,
                                border: `1px solid ${sc.text}40`
                              }}
                            >
                              {Object.keys(statusColors).map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                            {updatingId === order.id && <FiLoader className="inline-spinner" />}
                          </td>
                          <td>
                            <button 
                              className="btn-details" 
                              onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            >
                              {isExpanded ? <><FiChevronUp /> Less</> : <><FiChevronDown /> Details</>}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="details-row">
                            <td colSpan="6">
                              <motion.div 
                                className="expanded-details"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                              >
                                <div className="details-grid">
                                  <div className="details-items">
                                    <h4>Items Breakdown</h4>
                                    <table className="mini-table">
                                      <thead>
                                        <tr>
                                          <th>Service</th>
                                          <th>Qty</th>
                                          <th>Cloth Type</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {Object.entries(order.items || {}).filter(([_, details]) => details.qty > 0).map(([id, details]) => (
                                          <tr key={id}>
                                            <td style={{textTransform: 'capitalize'}}>{id.replace('-', ' ')}</td>
                                            <td>{details.qty} pcs</td>
                                            <td>{details.clothType || 'General'}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="details-info">
                                    <h4>Order Info</h4>
                                    <p><strong><FiMapPin /> Address:</strong> {order.address}</p>
                                    <p><strong>🕒 Pickup Time:</strong> {order.pickupTime}</p>
                                    <p><strong>📞 Contact:</strong> {order.customerPhone}</p>
                                    <p><strong>💳 Payment:</strong> {order.paymentMethod}</p>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
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

        {/* Danger Zone */}
        <div className="danger-zone">
          <button 
            className="btn-danger-outline"
            onClick={handleRemoveShop}
          >
            Remove My Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
