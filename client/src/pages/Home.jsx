import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Home.css";
import volunteerImage from "../assets/32595.jpg";
import logo from "../assets/logo.png";

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState(0);
    const [events, setEvents] = useState([
        {
            event_id: 1,
            event_name: "Beach Cleanup",
            event_date: "2025-04-15",
            location: "Santa Monica",
            description: "Join us for a beach cleanup event and help keep our beaches clean!"
        },
        {
            event_id: 2,
            event_name: "Tree Planting",
            event_date: "2025-05-01",
            location: "Central Park",
            description: "Help us plant trees and green our city for a sustainable future."
        },
        {
            event_id: 3,
            event_name: "Food Drive",
            event_date: "2025-05-10",
            location: "Downtown",
            description: "Support local families by donating food during our annual food drive."
        }
    ]);

    // Fetch events from the backend
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:3360/events");
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    // Check if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email"); 
        const role = localStorage.getItem("role");
        const newNotifications = localStorage.getItem("notifications") || 0;

        if (token && email) {
            setUser({ email, role });
            setNotifications(parseInt(newNotifications, 10));
        }
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        setNotifications(0);
        navigate("/");
    };

    const handleNotificationClick = () => {
        localStorage.setItem("notifications", "0");
        setNotifications(0);
    };

    // Admin-Only: Delete Event
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await fetch(`http://localhost:3360/events/${id}`, {
                    method: "DELETE",
                });

                // Refresh the event list after deletion
                fetchEvents();
            } catch (error) {
                console.error("Error deleting event:", error);
            }
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
                            <span className="user-name">Welcome, {user.email}</span> 
                            <Link to="/profile" className="profile-icon"></Link>

                            {/* Notification Bell */}
                            <Link 
                                to="/Notification" 
                                className={`notification-icon ${notifications > 0 ? "ringing" : ""}`} 
                                onClick={handleNotificationClick}
                            >
                                🔔
                            </Link>

                            {/* Logout Button */}
                            <button onClick={handleLogout} className="btn-logout">Logout</button>
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

                {/* Admin Controls */}
                {user?.role === "admin" && (
                    <div className="admin-controls">
                        <button className="add-btn" onClick={() => navigate("/eventandmatch")}></button>
                    </div>
                )}

                <div className="events-container">
                    {events.length === 0 ? (
                        <p>No events available.</p>
                    ) : (
                        events.map(event => {
                            // Convert event_date to a readable format (DD-MM-YYYY)
                            const formattedDate = new Date(event.event_date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            });

                            return (
                                <div key={event.event_id} className="event">
                                    <h3 className="event-title">{event.event_name}</h3>
                                    <p className="event-date">{formattedDate} | {event.location}</p>
                                    <p className="event-description">{event.description}</p>

                                    {/* Admin-Only Edit & Delete Buttons */}
                                    {user?.role === "admin" && (
                                        <div className="admin-controls">
                                            <button className="edit-btn" onClick={() => navigate(`/update/${event.event_id}`)}></button>
                                            <button className="delete-btn" onClick={() => handleDelete(event.event_id)}></button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
