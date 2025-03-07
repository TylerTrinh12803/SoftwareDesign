import express from "express";

const router = express.Router();

// In‑memory storage for skills and events
let skills = [
  { skill_id: 1, skill_name: "Cooking" },
  { skill_id: 2, skill_name: "First Aid" }
];
let nextSkillId = 3;

let events = [
  {
    event_id: 1,
    event_name: "Beach Cleanup",
    description: "Help clean up the beach.",
    location: "Santa Monica",
    urgency: "high",
    event_date: "2025-04-15",
    // storing associated skills as an array of skill IDs
    skills: [1]
  },
  {
    event_id: 2,
    event_name: "Food Drive",
    description: "Collect food donations for the community.",
    location: "Downtown",
    urgency: "medium",
    event_date: "2025-05-10",
    skills: [2]
  }
];
let nextEventId = 3;

// -----------------------------
// Skills Endpoints
// -----------------------------

// Add a New Skill
router.post("/skills", (req, res) => {
  const { skill_name } = req.body;
  console.log("Received request to add skill:", skill_name);

  if (!skill_name) {
    return res.status(400).json({ message: "Skill name is required." });
  }

  const newSkill = { skill_id: nextSkillId++, skill_name };
  skills.push(newSkill);
  console.log("Skill added successfully:", newSkill.skill_id);
  res.status(201).json({ message: "Skill added successfully", skill_id: newSkill.skill_id });
});

// Get All Skills
router.get("/skills", (req, res) => {
  res.json(skills);
});

// Delete a Skill
router.delete("/skills/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = skills.findIndex(skill => skill.skill_id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Skill not found" });
  }
  skills.splice(index, 1);
  res.status(200).json({ message: "Skill deleted successfully" });
});

// -----------------------------
// Events Endpoints
// -----------------------------

// Create a New Event with Skills
router.post("/events", (req, res) => {
  const { event_name, description, location, urgency, event_date, skills: eventSkills } = req.body;

  if (!event_name || !description || !location || !urgency || !event_date || !eventSkills) {
    return res.status(400).json({ message: "All event fields and skills are required." });
  }

  // Validate the event date is not in the past (compare only date)
  const eventDateObj = new Date(event_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDateObj.setHours(0, 0, 0, 0);
  if (eventDateObj < today) {
    return res.status(400).json({ message: "You cannot create an event for a past date." });
  }

  const newEvent = {
    event_id: nextEventId++,
    event_name,
    description,
    location,
    urgency,
    event_date,
    skills: eventSkills // expects an array of skill IDs
  };

  events.push(newEvent);
  res.status(201).json({ message: "Event created successfully", event_id: newEvent.event_id });
});

// Get All Events
router.get("/events", (req, res) => {
  // Map each event to include a concatenated string of required skill names
  const formattedEvents = events.map(e => {
    const required_skills = e.skills
      .map(skillId => {
        const found = skills.find(s => s.skill_id === skillId);
        return found ? found.skill_name : null;
      })
      .filter(name => name !== null)
      .join(", ");
    return { ...e, required_skills };
  });

  // Sort events by urgency (high < medium < low) then by event_date ascending
  const urgencyOrder = { high: 1, medium: 2, low: 3 };
  formattedEvents.sort((a, b) => {
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }
    return new Date(a.event_date) - new Date(b.event_date);
  });

  res.json(formattedEvents);
});

// Delete an Event
router.delete("/events/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = events.findIndex(event => event.event_id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Event not found" });
  }
  events.splice(index, 1);
  res.json({ message: "Event deleted successfully!" });
});

// Get a Specific Event by ID
router.get("/events/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const event = events.find(e => e.event_id === id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  const required_skills = event.skills
    .map(skillId => {
      const found = skills.find(s => s.skill_id === skillId);
      return found ? found.skill_name : null;
    })
    .filter(name => name !== null)
    .join(", ");
  res.json({ ...event, required_skills });
});

// Update an Event
router.put("/events/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { event_name, description, location, urgency, event_date, skills: eventSkills } = req.body;
  const event = events.find(e => e.event_id === id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Validate new event_date is not in the past
  const eventDateObj = new Date(event_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDateObj.setHours(0, 0, 0, 0);
  if (eventDateObj < today) {
    return res.status(400).json({ message: "You cannot update an event to a past date." });
  }

  // Update event details
  event.event_name = event_name;
  event.description = description;
  event.location = location;
  event.urgency = urgency;
  event.event_date = event_date;
  event.skills = eventSkills;

  res.json({ message: "Event updated successfully!" });
});

export default router;
