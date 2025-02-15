import React, { useState } from 'react';
import '../style/Notification.css';

const Notification = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New Event Assigned', message: 'You have been assigned to the Community Cleanup event.', unread: true },
        { id: 2, title: 'Event Update', message: 'The location for the Charity Concert has been changed to Central Park.', unread: true },
        { id: 3, title: 'Reminder', message: 'Remember to check in for the upcoming Tech for Good Hackathon.', unread: true },
        { id: 4, title: 'New Event Assigned', message: 'You have been assigned to the Pumpkin Patch Setup.', unread: true },
        { id: 5, title: 'Event Update', message: 'The Charity Ball has been canceled.', unread: true }
    ]);

    // Function to dismiss a single notification
    const dismissNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    // Function to dismiss all notifications
    const dismissAllNotifications = () => {
        setNotifications([]); // Clears the entire notification list
    };

    return (
        <div className="page-container">
            {/* Back to Home Button - Positioned on Top Right */}
            <button className="back-home-button" onClick={() => window.location.href = "/"}>
                Back to Home
            </button>

            <div className="notification-container">
                {/* Header with Notification Count */}
                <div className="notification-header">
                    <span>Notifications <span className="notification-count">{notifications.length}</span></span>
                    {notifications.length > 0 && <span className="mark-read" onClick={dismissAllNotifications}>Dismiss All</span>}
                </div>

                {/* Notification List */}
                {notifications.length > 0 ? notifications.map(notification => (
                    <div key={notification.id} className="notification-item">
                        <div className="notification-content">
                            <h4>{notification.title}</h4>
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
        </div>
    );
};

export default Notification;
