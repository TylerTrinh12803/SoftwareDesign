import React, { useEffect, useState } from 'react';
import '../style/Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const storedUserId = localStorage.getItem("userId"); // Ensure it's retrieved properly
      if (!storedUserId) {
        console.error("No user logged in.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3360/notifications?volunteer_id=${storedUserId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const dismissNotification = async (id) => {
    try {
      await fetch(`http://localhost:3360/notifications/${id}`, { method: 'DELETE' });
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const dismissAllNotifications = async () => {
    try {
      const storedUserId = localStorage.getItem("userId"); // Ensure it's retrieved properly
      if (!storedUserId) {
        console.error("No user logged in.");
        return;
      }

      const response = await fetch(`http://localhost:3360/notifications/dismiss-all/${storedUserId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to dismiss all notifications");
      }

      // Remove all notifications from state
      setNotifications([]);
      
    } catch (error) {
      console.error('Error dismissing all notifications:', error);
    }
};



  return (
    <>
      <button className="back-home-button" onClick={() => window.location.href = "/"}>Back to Home</button>

      <div className="notification-container">
        <div className="notification-header">
          <span>Notifications <span className="notification-count">{notifications.length}</span></span>
          {notifications.length > 0 && <span className="mark-read" onClick={dismissAllNotifications}>Dismiss All</span>}
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
