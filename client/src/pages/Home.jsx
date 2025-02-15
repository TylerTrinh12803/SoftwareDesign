import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Home.css";
import volunteerImage from "../assets/32595.jpg"; // Volunteer Image
import logo from "../assets/logo.png"; // Logo

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState(0);
    const [events, setEvents] = useState([
        { id: 1, title: "Community Clean-Up", date: "2025-03-15", location: "Central Park, NY", description: "Join us to clean up the park and make it greener!" },
        { id: 2, title: "Food Drive", date: "2025-04-10", location: "Local Food Bank", description: "Help distribute food to those in need." },
        { id: 3, title: "Tree Planting", date: "2025-05-05", location: "City Botanical Garden", description: "Contribute to a greener future by planting trees." }
    ]);

    // Check if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");
        const newNotifications = localStorage.getItem("notifications") || 0; // Retrieve stored notifications

        if (token && username) {
            setUser({ username, role });
            setNotifications(parseInt(newNotifications, 10)); // Convert to number
        }
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("notifications"); // Clear notifications on logout
        navigate("/"); // Redirect to home after logout
        setUser(null);
        setNotifications(0);
    };

    const handleNotificationClick = () => {
        // Reset notifications in localStorage
        localStorage.setItem("notifications", "0");
        setNotifications(0); // Update state to re-render component
    };

    // Navigate to Add Event Form
    const addEvent = () => {
        navigate("/add");
    };

    // Admin-Only: Delete Event
    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this event?");
        if (confirmDelete) {
            setEvents(events.filter(event => event.id !== id));
        }
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo-img" />
                </div>

                <div className="nav-right">
                    {user ? (
                        <>
                            {/* Logout Button - Positioned at the Top Right */}
                            <div className="logout-container">
                                <button onClick={handleLogout} className="btn-logout">Logout</button>
                            </div>

                            <span className="user-name">Welcome, {user.username}</span>
                            <Link to="/profile" className="profile-icon"></Link>

                            {/* Notification Bell - Rings if new notifications exist */}
                            <Link 
                                to="/Notification" 
                                className={`notification-icon ${notifications > 0 ? "ringing" : ""}`} 
                                onClick={handleNotificationClick}
                            >
                                🔔
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="btn btn-outline">Sign up</Link>
                            <Link to="/login" className="btn btn-primary">Sign in</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">Become a Volunteer</h1>
                    <p className="hero-text">Join us in making a difference! Help communities, support causes, and contribute to meaningful change.</p>
                </div>
                <div className="hero-img">
                    <img src={volunteerImage} alt="Volunteer" />
                </div>
            </section>

            {/* Events Section */}
            <div className="events-section">
                <h2 className="events-title">Upcoming Events</h2>

                {/* Admin-Only Controls */}
                {user?.role === "admin" && (
                    <div className="admin-controls">
                         <button className="add-btn" onClick={() => navigate("/add")}></button>
                    </div>
                )}

                <div className="events-container">
                    {events.map(event => (
                        <div key={event.id} className="event">
                            <h3 className="event-title">{event.title}</h3>
                            <p className="event-date">{event.date} | {event.location}</p>
                            <p className="event-description">{event.description}</p>

                            {user && user.role === "admin" && (
                                <div className="admin-controls">
                                    {/* Edit Button */}
                                    <button className="edit-btn" onClick={() => navigate(`/update/${event.id}`)}></button>

                                    {/* Delete Button */}
                                    <button className="delete-btn" onClick={() => handleDelete(event.id)}></button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
