import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/Add.css';

const Update = () => {
  const { id } = useParams(); // Get event ID from URL params
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [maxVolunteers, setMaxVolunteers] = useState(10);
  const [error, setError] = useState('');

  // Check if the user is an admin before rendering
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/home'); // Redirect non-admin users
    }

    // Fetch event details based on ID
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3360/events/${id}`);
        if (response.ok) {
          const eventData = await response.json();
          setEventName(eventData.eventName);
          setEventDate(eventData.eventDate);
          setLocation(eventData.location);
          setDescription(eventData.description);
          setMaxVolunteers(eventData.maxVolunteers);
        } else {
          setError('Failed to fetch event details');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('An error occurred while fetching event details');
      }
    };

    fetchEventDetails();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventName || !eventDate || !location || !description || !maxVolunteers) {
      setError('All fields are required');
      return;
    }

    if (eventName.length > 50) {
      setError('Event title cannot exceed 50 characters.');
      return;
    }

    if (location.length > 50) {
      setError('Location cannot exceed 50 characters.');
      return;
    }

    if (description.length > 200) {
      setError('Description cannot exceed 200 characters.');
      return;
    }

    if (maxVolunteers < 1 || maxVolunteers > 500) {
      setError('Maximum volunteers must be between 1 and 500.');
      return;
    }

    setError('');

    // Update event data
    const updatedEvent = { eventName, eventDate, location, description, maxVolunteers };

    try {
      const response = await fetch(`http://localhost:3360/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        console.log('Event updated successfully:', updatedEvent);
        navigate('/'); // Redirect to events list
      } else {
        setError('Failed to update event');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while updating the event');
    }
  };

  return (
    <div className="add-event-page">
      <div className="add-event-container">
        <h2>Update Event</h2>
        <form onSubmit={handleSubmit} className="add-event-form">
          <div className="input-group">
            <label htmlFor="eventName">Event Name:</label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
              maxLength="50"
            />
            <small>{eventName.length}/50</small>
          </div>

          <div className="input-group">
            <label htmlFor="eventDate">Event Date:</label>
            <input
              type="date"
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter event location"
              maxLength="50"
            />
            <small>{location.length}/50</small>
          </div>

          <div className="input-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
              maxLength="200"
            />
            <small>{description.length}/200</small>
          </div>

          {/* Max Volunteers Input */}
          <div className="input-group">
            <label htmlFor="maxVolunteers">Max Volunteers:</label>
            <input
              type="number"
              id="maxVolunteers"
              value={maxVolunteers}
              onChange={(e) => setMaxVolunteers(Math.max(1, Math.min(500, e.target.value)))}
              placeholder="Enter max number of volunteers"
              min="1"
              max="500"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button">Update Event</button>
        </form>

        {/* Back to Admin Dashboard */}
        <div className="back-to-dashboard">
          <button onClick={() => navigate('/')} className="dashboard-button">
            Back to events
          </button>
        </div>
      </div>
    </div>
  );
};

export default Update;
