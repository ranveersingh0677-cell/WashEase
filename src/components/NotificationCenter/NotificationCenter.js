import React, { useState, useEffect, useRef } from 'react';
import { FiBell } from 'react-icons/fi';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const { currentUser, userData } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!currentUser?.uid) return;

    // Request browser notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Include both UID and Email in identifiers
    const identifiers = [currentUser.uid];
    if (userData?.email) identifiers.push(userData.email);

    const q = query(
      collection(db, "notifications"),
      where("recipientId", "in", identifiers),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const newUnread = notifs.filter(n => !n.isRead);
      
      // Only trigger browser alert if it's NOT the first load and count increased
      if (!isFirstLoad.current && newUnread.length > unreadCount && Notification.permission === 'granted') {
        const latest = newUnread[0];
        new Notification("WashEase Update", {
          body: latest.message,
          icon: "/logo192.png"
        });
      }

      setNotifications(notifs);
      setUnreadCount(newUnread.length);
      isFirstLoad.current = false;
    });

    return () => unsubscribe();
  }, [currentUser, unreadCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (notifId, isRead) => {
    if (isRead) return;
    try {
      const notifRef = doc(db, "notifications", notifId);
      await updateDoc(notifRef, { isRead: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;

    const batch = writeBatch(db);
    unread.forEach(n => {
      const ref = doc(db, "notifications", n.id);
      batch.update(ref, { isRead: true });
    });
    
    try {
      await batch.commit();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <div className="notification-center" ref={dropdownRef}>
      <div className="bell-icon" onClick={() => setIsOpen(!isOpen)}>
        <FiBell />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </div>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-read-all" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>
          <div className="notif-list">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                  onClick={() => markAsRead(n.id, n.isRead)}
                >
                  <div className="notif-msg">{n.message}</div>
                  <div className="notif-time">
                    {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString() : 'Just now'}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-notifs">No notifications yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
