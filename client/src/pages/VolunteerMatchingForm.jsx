import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/VolunteerMatchingForm.css';  // Ensure the path is correct

const VolunteerMatchingForm = () => {
    // Dummy data for volunteers
    const [volunteers, setVolunteers] = useState([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Alice Johnson' }
    ]);

    // Dummy data for events
    const [suggestedEvents, setSuggestedEvents] = useState([
        { id: 1, name: 'Community Cleanup' },
        { id: 2, name: 'Charity Concert' },
        { id: 3, name: 'Tech for Good Hackathon' }
    ]);

    const [selectedVolunteer, setSelectedVolunteer] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [message, setMessage] = useState('');

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage(`Match submitted for Volunteer ID: ${selectedVolunteer} with Event ID: ${selectedEvent}`);
    };

    return (
        <div className="match-form-container">
            <form className="volunteer-form" onSubmit={handleSubmit}>
                <h1>Volunteer Match Form</h1>
                <div className="input-group">
                    <label htmlFor="volunteer-select">Select Volunteer:</label>
                    <select
                        id="volunteer-select"
                        value={selectedVolunteer}
                        onChange={e => setSelectedVolunteer(e.target.value)}
                    >
                        <option value="">Select a volunteer</option>
                        {volunteers.map(volunteer => (
                            <option key={volunteer.id} value={volunteer.id}>{volunteer.name}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="event-select">Matched Event:</label>
                    <select
                        id="event-select"
                        value={selectedEvent}
                        onChange={e => setSelectedEvent(e.target.value)}
                    >
                        <option value="">Select an event</option>
                        {suggestedEvents.map(event => (
                            <option key={event.id} value={event.id}>{event.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="submit-button">Submit Match</button>
                {message && <p>{message}</p>}
            </form>
            <Link to="/" className="link-button">Back to Home</Link>
        </div>
    );
};

export default VolunteerMatchingForm;
