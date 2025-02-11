import React from "react";
import { Link } from "react-router-dom";
import "../style/Home.css";
import volunteerImage from "../assets/32595.jpg"; // Import the volunteer illustration
import logo from "../assets/logo.png"; // Import the logo

const events = [
    { id: 1, title: "Community Clean-Up", date: "March 15, 2025", location: "Central Park, NY", description: "Join us to clean up the park and make it greener!" },
    { id: 2, title: "Food Drive", date: "April 10, 2025", location: "Local Food Bank", description: "Help distribute food to those in need." },
    { id: 3, title: "Tree Planting", date: "May 5, 2025", location: "City Botanical Garden", description: "Contribute to a greener future by planting trees." }
];

const Home = () => {
    return (
        <div>
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo-img" />
                </div>
                <div>
                    <Link to="/register" className="btn btn-outline">Sign up</Link>
                    <Link to="/login" className="btn btn-primary">Sign in</Link>
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
            <div className="events-container">
                {events.map(event => (
                    <div key={event.id} className="event">
                        <h3 className="event-title">{event.title}</h3>
                        <p className="event-date">{event.date} | {event.location}</p>
                        <p className="event-description">{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default Home;
