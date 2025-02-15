import React, { useEffect, useState } from 'react';
import '../style/Notification.css';

const Notification = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New Event Assigned', message: 'You have been assigned to the Community Cleanup event.', unread: true },
        { id: 2, title: 'Event Update', message: 'The location for the Charity Concert has been changed to Central Park.', unread: true },
        { id: 3, title: 'Reminder', message: 'Remember to check in for the upcoming Tech for Good Hackathon.', unread: true },
        { id: 4, title: 'New Event Assigned', message: 'You have been assigned to the Pumpkin Patch Setup.', unread: true },
        { id: 5, title: 'Event Update', message: 'The Charity Ball has been canceled.', unread: true }
    ]);

    useEffect(() => {
        document.body.classList.add('notification-background');
        return () => {
            document.body.classList.remove('notification-background');
        };
    }, []);

    const dismissNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    const dismissAllNotifications = () => {
        setNotifications([]);
    };

    return (
        <>
            {/* Back to Home Button - Styled as a button in the top right */}
            <button className="back-home-button" onClick={() => window.location.href = "/"}>Back to Home</button>

            <div className="notification-container">
                <div className="notification-header">
                    <span>Notifications <span className="notification-count">{notifications.length}</span></span>
                    {notifications.length > 0 && <span className="mark-read" onClick={dismissAllNotifications}>Dismiss All</span>}
                </div>

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
        </>
    );
};

export default Notification;
