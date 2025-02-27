import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/MatchingAdd.css";

const MatchingAdd = () => {
  const navigate = useNavigate();

  // Event Form State
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);

  // Skill Management State
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const [showSkillModal, setShowSkillModal] = useState(false); // Modal state

  // Volunteer Matching State
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  // Messages & Errors
  const [message, setMessage] = useState("");

  // Redirect non-admin users
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/home");
    }
    fetchEvents();
    fetchSkills();
    fetchVolunteers();
  }, [navigate]);

  // Fetch Data from Backend
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3360/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch("http://localhost:3360/skills");
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const response = await fetch("http://localhost:3360/volunteers");
      const data = await response.json();
      setVolunteers(data);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  // Handle Adding a New Skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) {
      setMessage("Skill name is required");
      return;
    }
    try {
      const response = await fetch("http://localhost:3360/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill_name: newSkill }),
      });

      if (response.ok) {
        setMessage("Skill added successfully!");
        setNewSkill("");
        fetchSkills();
        setShowSkillModal(false); // Close modal
      } else {
        setMessage("Failed to add skill.");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      setMessage("Server error while adding skill.");
    }
  };

  // Handle Adding an Event
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    if (!eventName || !eventDate || !location || !description || !urgency || requiredSkills.length === 0) {
      setMessage("All event fields are required.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3360/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_name: eventName, description, location, urgency, event_date: eventDate, skills: requiredSkills }),
      });

      if (response.ok) {
        setMessage("Event added successfully!");
        fetchEvents();
        setEventName("");
        setEventDate("");
        setLocation("");
        setDescription("");
        setUrgency("");
        setRequiredSkills([]);
      } else {
        setMessage("Failed to add event.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setMessage("Server error while adding event.");
    }
  };

  // Handle Volunteer Match Submission
  const handleSubmitMatch = async (event) => {
    event.preventDefault();
    if (!selectedVolunteers.length || !selectedEvent) {
      setMessage("Please select a volunteer and an event.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3360/match-volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteers: selectedVolunteers, event_id: selectedEvent }),
      });

      if (response.ok) {
        setMessage("Volunteer successfully matched to the event!");
        setSelectedVolunteers([]);
        setSelectedEvent("");
      } else {
        setMessage("Failed to match volunteer.");
      }
    } catch (error) {
      console.error("Error matching volunteer:", error);
      setMessage("Server error while matching volunteer.");
    }
  };

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅ Back to Events
      </button>

      <div className="form-container">
        {/* Add Event Form */}
        <div className="form-box">
          <h2>Add Event</h2>
          <form onSubmit={handleSubmitEvent}>
            <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
            <textarea placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <select onChange={(e) => setUrgency(e.target.value)} required>
              <option value="">Select Urgency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Skill Selection */}
            <select onChange={(e) => setRequiredSkills([...requiredSkills, e.target.value])}>
              <option value="">Select a Skill</option>
              {skills.map((skill) => (
                <option key={skill.skill_id} value={skill.skill_id}>
                  {skill.skill_name}
                </option>
              ))}
            </select>

            {/* Add Skill Button */}
            <button type="button" onClick={() => setShowSkillModal(true)}>
              Can't find skill? Add Skill
            </button>

            <button type="submit">Add Event</button>
          </form>
        </div>

        {/* Volunteer Matching Form */}
        <div className="form-box">
          <h2>Volunteer Match Form</h2>
          <form onSubmit={handleSubmitMatch}>
            <select onChange={(e) => setSelectedVolunteers([e.target.value])}>
              <option value="">Select a Volunteer</option>
              {volunteers.map((volunteer) => (
                <option key={volunteer.id} value={volunteer.name}>
                  {volunteer.name}
                </option>
              ))}
            </select>
            <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
              <option value="">Select an Event</option>
              {events.map((event) => (
                <option key={event.event_id} value={event.event_id}>
                  {event.event_name}
                </option>
              ))}
            </select>
            <button type="submit">Match Volunteer</button>
          </form>
        </div>
      </div>

      {/* Modal for Adding Skill */}
      {showSkillModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Skill</h2>
            <form onSubmit={handleAddSkill}>
              <input type="text" placeholder="Enter Skill Name" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} required />
              <button type="submit">Add Skill</button>
              <button type="button" onClick={() => setShowSkillModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default MatchingAdd;
