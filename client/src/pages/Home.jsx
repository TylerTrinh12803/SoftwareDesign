import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Home.css";
import volunteerImage from "../assets/32595.jpg";
import logo from "../assets/logo.png";

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState(0);
    const [events, setEvents] = useState([]);
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [joinSuccess, setJoinSuccess] = useState(null);

    useEffect(() => {
        const msg = localStorage.getItem("joinMessage");
        if (msg) {
            alert(msg);
            localStorage.removeItem("joinMessage");
        }
    }, []);
    
    
    // Fetch events from the backend
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:3360/events");
            const data = await response.json();
            console.log("Fetched events data:", data); // Check if this is an array
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]); // Ensure events remains an array
        }
    };
    

    // Check if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email"); 
        const role = localStorage.getItem("role");
        const newNotifications = localStorage.getItem("notifications") || 0;

        if (token && email) {
            const userId = localStorage.getItem("userId");
            setUser({ email, role, user_id: userId });
            setNotifications(parseInt(newNotifications, 10));
        }
    }, []);
    useEffect(() => {
        const fetchJoinedEvents = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) return;
    
            try {
                const response = await fetch(`http://localhost:3360/history/${userId}`);
                const data = await response.json();
                const eventIds = data.map(entry => entry.event_id);
                setJoinedEvents(eventIds);
            } catch (error) {
                console.error("Error fetching joined events:", error);
            }
        };
    
        fetchJoinedEvents();
    }, []);
    
    // Logout function
    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        setNotifications(0);
        navigate("/");
    };

    const handleJoinEvent = async (eventId) => {
        const userId = user?.user_id;
        if (!userId) return alert("You must be logged in.");
    
        const joinedEvent = events.find(e => e.event_id === eventId);
        const eventName = joinedEvent?.event_name || "event";
    
        // Save message now
        localStorage.setItem("joinMessage", `Successfully joined: ${eventName}`);
    
        // Send request (but don't wait for it to finish)
        fetch("http://localhost:3360/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, event_id: eventId }),
        });
    
        // Immediately reload the page
        window.location.href = window.location.href;
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
    const handleUnjoinEvent = async (eventId) => {
        const userId = user?.user_id;
        if (!userId) return;
    
        const confirm = window.confirm("Are you sure you want to unjoin this event?");
        if (!confirm) return;
    
        try {
            const response = await fetch(`http://localhost:3360/history/${userId}/${eventId}`, {
                method: "DELETE"
            });
    
            if (response.ok) {
                setJoinedEvents(prev => prev.filter(id => id !== eventId));
            } else {
                alert("Failed to unjoin.");
            }
        } catch (error) {
            console.error("Unjoin error:", error);
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
                {joinSuccess && (
                <div className="join-alert">
                    ✅ {joinSuccess}
                </div>
            )}
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
                            const formattedDate = new Date(event.event_date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            });
                            return (
                                <div className="event">
                                <h3 className="event-title">{event.event_name}</h3>
                                <p className="event-date">{formattedDate} | {event.location}</p>
                                <p className="event-description">{event.description}</p>

                                {/* 👇 Join / Joined / Unjoin go here */}
                                {user && (
                                    joinedEvents.includes(Number(event.event_id)) ? (
                                        <div className="join-button-wrapper">
                                            <button className="hover-unjoin" onClick={() => handleUnjoinEvent(event.event_id)}></button>

                                        </div>
                                    ) : (
                                        <div className="join-button-wrapper">
                                            <button className="join-btn" onClick={() => handleJoinEvent(event.event_id)}>Join Event</button>
                                        </div>
                                    )
                                )}

                                {/* 👇 Admin controls stay below join buttons */}
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
