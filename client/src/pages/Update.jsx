import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/MatchingAdd.css";

const Update = () => {
  const { id } = useParams(); // Get event ID from URL
  const navigate = useNavigate();

  // Event Form State
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [selectedSkillToDelete, setSelectedSkillToDelete] = useState("");

  // Skill Management State
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const [showSkillModal, setShowSkillModal] = useState(false);

  // Volunteer Matching State
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);

  // Messages & Errors
  const [message, setMessage] = useState("");

  // Fetch data when page loads
  useEffect(() => {
    fetchEventDetails();
    fetchSkills();
    fetchVolunteers();
  }, []);

  // Fetch event details by ID
  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3360/events/${id}`);
      const data = await response.json();

      setEventName(data.event_name);
      setEventDate(data.event_date);
      setLocation(data.location);
      setDescription(data.description);
      setUrgency(data.urgency);
      setRequiredSkills(data.required_skills ? data.required_skills.split(",") : []);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  // Fetch all skills
  const fetchSkills = async () => {
    try {
      const response = await fetch("http://localhost:3360/skills");
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  // Fetch all volunteers
  const fetchVolunteers = async () => {
    try {
      const response = await fetch("http://localhost:3360/volunteers");
      const data = await response.json();
      setVolunteers(data);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  // Handle Updating an Event
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
  
    if (!eventName || !eventDate || !location || !description || !urgency || requiredSkills.length === 0) {
      setMessage("All fields are required.");
      return;
    }
  
    const formattedDate = eventDate.split("T")[0]; // Ensure YYYY-MM-DD format
  
    try {
      const response = await fetch(`http://localhost:3360/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: eventName,
          event_date: formattedDate, // Use correctly formatted date
          location,
          description,
          urgency,
          skills: requiredSkills,
        }),
      });
  
      if (response.ok) {
        setMessage("Event updated successfully!");
        navigate("/"); // Redirect to home page after update
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to update event.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setMessage("Server error while updating event.");
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
        setShowSkillModal(false);
      } else {
        setMessage("Failed to add skill.");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      setMessage("Server error while adding skill.");
    }
  };

  // Handle Deleting a Skill
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

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅ Back to Events
      </button>

      <div className="form-container">
        {/* Update Event Form */}
        <div className="form-box">
          <h2>Update Event</h2>
          <form onSubmit={handleUpdateEvent}>
            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
            <textarea value={location} onChange={(e) => setLocation(e.target.value)} required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            <select value={urgency} onChange={(e) => setUrgency(e.target.value)} required>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button type="submit">Update Event</button>
          </form>
        </div>

        {/* Volunteer Matching Form */}
        <div className="form-box">
          <h2>Volunteer Match Form</h2>
          <form>
            <select multiple onChange={(e) => setSelectedVolunteers([...e.target.selectedOptions].map(o => o.value))}>
              <option value="">Select Volunteers</option>
              {volunteers.map((volunteer) => (
                <option key={volunteer.id} value={volunteer.id}>
                  {volunteer.name}
                </option>
              ))}
            </select>
            <button type="submit">Match Volunteers</button>
          </form>
        </div>
        <div className="form-box delete-skill-box">
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

export default Update;
