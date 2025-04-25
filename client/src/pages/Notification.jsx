import React, { useEffect, useState } from 'react';
import '../style/Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:3360/notifications?volunteer_id=${userId}`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    document.body.classList.add('notification-background');
    return () => {
      document.body.classList.remove('notification-background');
    };
  }, []);

  const dismissNotification = async (id) => {
    try {
      await fetch(`http://localhost:3360/notifications/${id}`, {
        method: "DELETE", // ✅ delete instead of put
      });
  
      // Remove it from UI
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };
  

  const dismissAllNotifications = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:3360/notifications/dismiss-all/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) setNotifications([]);
    } catch (error) {
      console.error("Error dismissing all notifications:", error);
    }
  };

  return (
    <>
      <button className="back-home-button" onClick={() => window.location.href = "/"}>Back to Home</button>

      <div className="notification-container">
        <div className="notification-header">
          <span>Notifications <span className="notification-count">{notifications.length}</span></span>
          {notifications.length > 0 && (
            <span className="mark-read" onClick={dismissAllNotifications}>Dismiss All</span>
          )}
        </div>

        {notifications.length > 0 ? notifications.map(notification => (
          <div key={notification.id} className="notification-item">
            <div className="notification-content">
              <h4>{notification.title || "Notification"}</h4>
              <p>{notification.message}</p>
            </div>
            <button className="dismiss-btn" onClick={() => dismissNotification(notification.id)}>Dismiss</button>
          </div>
        )) : (
          <div className="notification-item">
            <p>No new notifications.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Notification;