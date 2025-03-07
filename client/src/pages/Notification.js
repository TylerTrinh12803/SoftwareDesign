import React, { useState, useEffect } from 'react';
import '../style/Notification.css';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch notifications from the server
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:3360/notifications');
                const data = await response.json();
                if (response.ok) {
                    setNotifications(data);
                } else {
                    throw new Error(data.message || 'Error fetching notifications');
                }
            } catch (error) {
                setError(error.message);
                console.error('Fetch error:', error);
            }
        };

        fetchNotifications();
    }, []);

    const dismissNotification = async (id) => {
        try {
            const response = await fetch(`http://localhost:3360/notifications/${id}`, { method: 'DELETE' });
            const data = await response.text();
            if (response.ok) {
                setNotifications(notifications.filter(notification => notification.id !== id));
            } else {
                throw new Error(data || 'Error dismissing notification');
            }
        } catch (error) {
            setError(error.message);
            console.error('Dismiss error:', error);
        }
    };

    const dismissAllNotifications = async () => {
        try {
            const response = await fetch('http://localhost:3360/notifications/dismiss-all', { method: 'DELETE' });
            const data = await response.text();
            if (response.ok) {
                setNotifications([]);
            } else {
                throw new Error(data || 'Error dismissing all notifications');
            }
        } catch (error) {
            setError(error.message);
            console.error('Dismiss all error:', error);
        }
    };

    return (
        <div className="notification-container">
            <div className="notification-header">
                <span>Notifications <span className="notification-count">{notifications.length}</span></span>
                {notifications.length > 0 && (
                    <span className="mark-read" onClick={dismissAllNotifications}>Dismiss All</span>
                )}
            </div>

            {error && <p className="error-message">{error}</p>}

            {notifications.length > 0 ? (
                notifications.map(notification => (
                    <div key={notification.id} className="notification-item">
                        <div className="notification-content">
                            <h4>{notification.title}</h4>
                            <p>{notification.message}</p>
                        </div>
                        <button className="dismiss-btn" onClick={() => dismissNotification(notification.id)}>
                            Dismiss
                        </button>
                    </div>
                ))
            ) : (
                <div className="notification-item">
                    <p>No new notifications.</p>
                </div>
            )}
        </div>
    );
};

export default Notification;





   /* const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        // Placeholder for your actual API endpoint
        const response = await fetch('http://localhost:3000/api/notifications');
        const data = await response.json();
        setNotifications(data);
    };*/
