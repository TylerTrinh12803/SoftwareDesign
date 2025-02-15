import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/MatchingAdd.css";

const MatchingAdd = () => {
  const navigate = useNavigate();

  // Event Form State
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [urgency, setUrgency] = useState("");
  const [error, setError] = useState("");

  // Volunteer Matching Form State
  const [volunteers, setVolunteers] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ]);

  const [suggestedEvents, setSuggestedEvents] = useState([
    { id: 1, name: "Community Cleanup" },
    { id: 2, name: "Charity Concert" },
    { id: 3, name: "Tech for Good Hackathon" },
  ]);

  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [message, setMessage] = useState("");
  const handleVolunteerSelect = (e) => {
    const selected = e.target.value;
    if (selected && !selectedVolunteers.includes(selected)) {
      setSelectedVolunteers([...selectedVolunteers, selected]);
    }
  };
  const removeVolunteer = (volunteer) => {
    setSelectedVolunteers(selectedVolunteers.filter((v) => v !== volunteer));
  };
    
  // Skill Options
  const skillOptions = [
    "Teamwork",
    "Communication",
    "Leadership",
    "Problem-Solving",
    "Time Management",
    "Physical Stamina",
    "Animal Care",
    "Fundraising",
    "Event Planning",
  ];

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/home");
    }
  }, [navigate]);

  const handleSkillSelect = (e) => {
    const selectedSkill = e.target.value;
    if (selectedSkill && !requiredSkills.includes(selectedSkill)) {
      setRequiredSkills([...requiredSkills, selectedSkill]);
    }
  };

  const removeSkill = (skill) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    if (!eventName || !eventDate || !location || !description || !urgency || requiredSkills.length === 0) {
      setError("All fields are required");
      return;
    }

    setError("");
    console.log("Event Submitted:", { eventName, eventDate, location, description, requiredSkills, urgency });
  };

  const handleSubmitMatch = (event) => {
    event.preventDefault();
    setMessage(`Match submitted for Volunteer ID: ${selectedVolunteer} with Event ID: ${selectedEvent}`);
  };
  
  return (
    <div className="page-container">
      {/* Back to Events Button - Fixed at the Top */}
        <button className="back-button" onClick={() => navigate("/")}>
          ⬅ Back to Events
        </button>
      
  
      <div className="form-container">
        {/* Add Event Form */}
        <div className="form-box">
          <h2>Add New Event</h2>
          <form onSubmit={handleSubmitEvent}>
            <input type="text" placeholder="Event Name (100 characters max)" value={eventName} onChange={(e) => setEventName(e.target.value)} required maxLength="100" />
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
            <textarea placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <textarea placeholder="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
  
            <select onChange={handleSkillSelect} required>
              <option value="">Select a Skill</option>
              {skillOptions.map((skill, index) => (
                <option key={index} value={skill}>{skill}</option>
              ))}
            </select>
  
            <div className="selected-skills">
            {requiredSkills.map((skill, index) => (
                <span 
                key={index} 
                className="skill-bubble" 
                onClick={() => removeSkill(skill)} // Whole bubble is clickable
                >
                {skill}
                </span>
            ))}
            </div>
            
            <select value={urgency} onChange={(e) => setUrgency(e.target.value)} required>
              <option value="">Select Urgency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button type="submit">Add Event</button>
          </form>
        </div>
  
        {/* Volunteer Matching Form */}
        <div className="form-box">
          <h2>Volunteer Match Form</h2>
          <form onSubmit={handleSubmitMatch}>
            {/* Multi-Select Volunteer Dropdown */}
            <select id="volunteer-select" onChange={handleVolunteerSelect}>
            <option value="">Select a Volunteer</option>
            {volunteers.map((volunteer) => (
                <option key={volunteer.id} value={volunteer.name}>
                {volunteer.name}
                </option>
            ))}
            </select>

            {/* Display selected volunteers as bubbles */}
            <div className="selected-volunteers">
            {selectedVolunteers.map((volunteer, index) => (
                <span
                key={index}
                className="volunteer-bubble"
                onClick={() => removeVolunteer(volunteer)}
                >
                {volunteer}
                </span>
            ))}
            </div>
  
            <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
              <option value="">Select an Event</option>
              {suggestedEvents.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
          </form>
        </div>
      </div>
    </div>
  );  
};

export default MatchingAdd;
