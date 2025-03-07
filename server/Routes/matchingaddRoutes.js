import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/MatchingAdd.css';

const MatchingAdd = () => {
  const navigate = useNavigate();

  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [selectedSkillToDelete, setSelectedSkillToDelete] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/home');
    }
    fetchEvents();
    fetchSkills();
    fetchVolunteers();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3360/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:3360/skills');
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const response = await fetch('http://localhost:3360/volunteers');
      const data = await response.json();
      setVolunteers(data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) {
      setMessage('Skill name is required');
      return;
    }
    try {
      const response = await fetch('http://localhost:3360/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_name: newSkill })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Skill added successfully!');
        setNewSkill('');
        fetchSkills();
        setShowSkillModal(false);
      } else {
        setMessage(data.message || 'Failed to add skill.');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      setMessage('Server error while adding skill.');
    }
  };

  const handleDeleteSkill = async (e) => {
    e.preventDefault();
    if (!selectedSkillToDelete) {
      setMessage('Please select a skill to delete.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3360/skills/${selectedSkillToDelete}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessage('Skill deleted successfully!');
        setSelectedSkillToDelete('');
        fetchSkills();
      } else {
        setMessage('Failed to delete skill.');
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      setMessage('Server error while deleting skill.');
    }
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    if (!eventName || !eventDate || !location || !description || !urgency || requiredSkills.length === 0) {
      setMessage('All event fields are required.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3360/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: eventName,
          description: description,
          location: location,
          urgency: urgency,
          event_date: eventDate,
          skills: requiredSkills
        })
      });
      if (response.ok) {
        if (window.confirm(`Successfully added event: "${eventName}". Click OK to return to home page.`)) {
          navigate('/');
        }
      } else {
        setMessage('Failed to add event.');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      setMessage('Server error while adding event.');
    }
  };

  const handleSubmitMatch = async (event) => {
    event.preventDefault();
    if (!selectedVolunteers.length || !selectedEvent) {
      setMessage('Please select a volunteer and an event.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3360/match-volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteers: selectedVolunteers, event_id: selectedEvent })
      });
      if (response.ok) {
        setMessage('Volunteer successfully matched to the event!');
        setSelectedVolunteers([]);
        setSelectedEvent('');
      } else {
        setMessage('Failed to match volunteer.');
      }
    } catch (error) {
      console.error('Error matching volunteer:', error);
      setMessage('Server error while matching volunteer.');
    }
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'button',
      { className: 'back-home-button', onClick: () => navigate('/') },
      'Back to Home'
    ),
    React.createElement(
      'div',
      { className: 'notification-container' },
      React.createElement(
        'div',
        { className: 'notification-header' },
        React.createElement(
          'span',
          null,
          'Notifications ',
          React.createElement(
            'span',
            { className: 'notification-count' },
            notifications.length
          )
        ),
        notifications.length > 0 && React.createElement(
          'span',
          { className: 'mark-read', onClick: dismissAllNotifications },
          'Dismiss All'
        )
      ),
      notifications.length > 0 ? notifications.map(notification =>
        React.createElement(
          'div',
          { key: notification.id, className: 'notification-item' },
          React.createElement(
            'div',
            { className: 'notification-content' },
            React.createElement('h4', null, notification.title),
            React.createElement('p', null, notification.message)
          ),
          React.createElement(
            'button',
            { className: 'dismiss-btn', onClick: () => dismissNotification(notification.id) },
            'Dismiss'
          )
        )
      ) : React.createElement(
        'div',
        { className: 'notification-item' },
        React.createElement('p', null, 'No new notifications.')
      )
    )
  );
};

export default MatchingAdd;
