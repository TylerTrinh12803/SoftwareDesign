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
  const [selectedSkillToDelete, setSelectedSkillToDelete] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Skill Management State
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const [showSkillModal, setShowSkillModal] = useState(false);

  // Volunteer Matching State
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  // Messages
  const [message, setMessage] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/home");
    }
    fetchEvents();
    fetchSkills();
    fetchVolunteers();
  }, [navigate]);

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
      console.log("Fetched volunteers:", data);
  
      // ✅ Defensive check
      if (Array.isArray(data)) {
        setVolunteers(data);
      } else {
        console.error("Unexpected response format:", data);
        setVolunteers([]); // fallback to empty array
      }
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      setVolunteers([]);
    }
  };  

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

      const data = await response.json();

      if (response.ok) {
        setMessage("Skill added successfully!");
        setNewSkill("");
        fetchSkills();
        setShowSkillModal(false);
      } else {
        setMessage(data.message || "Failed to add skill.");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      setMessage("Server error while adding skill.");
    }
  };

  const handleDeleteSkill = async (e) => {
    e.preventDefault();
    if (!selectedSkillToDelete) {
      setMessage("Please select a skill to delete.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3360/skills/${selectedSkillToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Skill deleted successfully!");
        setSelectedSkillToDelete("");
        fetchSkills();
      } else {
        setMessage("Failed to delete skill.");
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      setMessage("Server error while deleting skill.");
    }
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
  
    if (!eventName || !eventDate || !location || !description || !urgency || requiredSkills.length === 0) {
      setMessage("All event fields are required.");
      return;
    }
  
    setIsSubmitting(true); // ⛔ prevent multiple submissions
  
    try {
      const response = await fetch("http://localhost:3360/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: eventName,
          description,
          location,
          urgency,
          event_date: eventDate,
          skills: requiredSkills,
        }),
      });
  
      if (response.ok) {
        setIsSubmitting(false); // ✅ Reset after submission
        if (window.confirm(`Successfully added event: "${eventName}". Click OK to return to homepage.`)) {
          navigate("/");
        }
      } else {
        setMessage("Failed to add event.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setMessage("Server error while adding event.");
      setIsSubmitting(false);
    }
  };
  

  const removeSkill = (skillId) => {
    setRequiredSkills((prevSkills) => prevSkills.filter((id) => id !== skillId));
  };

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
        body: JSON.stringify({
          volunteers: selectedVolunteers,
          event_id: selectedEvent,
        }),
      });
  
      const data = await response.json(); // <-- Important: read the server's message!
  
      if (response.ok) {
        alert(data.message || "Volunteer matched successfully!"); // ✅ Success popup
        setSelectedVolunteers([]);
        setSelectedEvent("");
      } else {
        alert(data.message || "Failed to match volunteer."); // ⚠️ Error popup
      }
    } catch (error) {
      console.error("Error matching volunteer:", error);
      alert("Server error while matching volunteer."); // ⚠️ Server error popup
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

            <select
              onChange={(e) => {
                const skillId = Number(e.target.value);
                if (skillId && !requiredSkills.includes(skillId)) {
                  setRequiredSkills((prevSkills) => [...prevSkills, skillId]);
                }
              }}
            >
              <option value="">Select a Skill</option>
              {skills.map((skill) => (
                <option key={skill.skill_id} value={skill.skill_id}>
                  {skill.skill_name}
                </option>
              ))}
            </select>

            <div className="selected-skills">
            {requiredSkills.map((skillId) => {
              const skill = skills.find((s) => Number(s.skill_id) === Number(skillId));
              return skill ? (
                <div key={`skill-${skill.skill_id}`} className="skill-bubble" onClick={() => removeSkill(skill.skill_id)}>
                  {skill.skill_name} ✖
                </div>
              ) : null;
            })}

            </div>

            <button type="button" onClick={() => setShowSkillModal(true)}>
              Can't find skill? Add Skill
            </button>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add Event"}
            </button>

          </form>
        </div>

        {/* Volunteer Matching Form */}
        <div className="form-box">
          <h2>Volunteer Match Form</h2>
          <form onSubmit={handleSubmitMatch}>
          <select
             value={selectedVolunteers[0] || ""}
             onChange={(e) => setSelectedVolunteers([parseInt(e.target.value)])}
            >
            <option value="">Select a Volunteer</option>
              {volunteers.map((volunteer) => (
            <option key={volunteer.user_id} value={volunteer.user_id}>
              {volunteer.email} {/* Now displaying full name */}
            </option>
            ))}
          </select>


          <select
            value={selectedEvent}
             onChange={(e) => setSelectedEvent(parseInt(e.target.value))}
            >
            <option value="">Select an Event</option>
              {events.map((event) => (
              <option key={event.event_id} value={event.event_id}>
              {event.event_name} {/* Event name displayed properly */}
            </option>
            ))}
          </select>

            <button type="submit">Match Volunteer</button>
          </form>
        </div>
      </div>

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

      <div className="delete-skill-box">
        <h2>Delete Skill</h2>
        <form onSubmit={handleDeleteSkill}>
          <select value={selectedSkillToDelete} onChange={(e) => setSelectedSkillToDelete(e.target.value)}>
            <option value="">Select a Skill to Delete</option>
            {skills.map((skill) => (
              <option key={skill.skill_id} value={skill.skill_id}>
                {skill.skill_name}
              </option>
            ))}
          </select>
          <button type="submit" className="delete-btn"></button>
        </form>
      </div>
    </div>
  );
};

export default MatchingAdd;