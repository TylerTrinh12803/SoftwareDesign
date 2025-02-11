import React, { useState, useEffect } from 'react';
import '../style/Notification.css';


const Notification = () => {

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New Event Assigned', message: 'You have been assigned to the Community Cleanup event.' },
        { id: 2, title: 'Event Update', message: 'The location for the Charity Concert has been changed to Central Park.' },
        { id: 3, title: 'Reminder', message: 'Remember to check in for the upcoming Tech for Good Hackathon.' },
        { id: 4, title: 'New Event Assigned', message: 'You have been assigned to the Pumkin Patch Setup.' },
        { id: 5, title: 'Event Update', message: 'The Charity Ball has been canceled.' }
]);
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

    return (
        <div className="notification-container">
            {notifications.length > 0 ? notifications.map((notification, index) => (
                <div key={index} className="notification-card">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                </div>
            )) : (
                <div className="notification-card">
                    <p>No new notifications.</p>
                </div>
            )}
            <a href="/" className="link-button">Back to Home</a>
        </div>
    );
};

export default Notification;