import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Add a New Skill
router.post("/skills", async (req, res) => {
  const { skill_name } = req.body;

  if (!skill_name) {
    return res.status(400).json({ message: "Skill name is required." });
  }

  try {
    const [result] = await db.query("INSERT INTO skills (skill_name) VALUES (?)", [skill_name]);
    res.status(201).json({ message: "Skill added successfully", skill_id: result.insertId });
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// Get All Skills
router.get("/skills", async (req, res) => {
  try {
    const [skills] = await db.query("SELECT * FROM skills");
    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// Create a New Event with Skills
router.post("/events", async (req, res) => {
  const { event_name, description, location, urgency, event_date, skills } = req.body;

  if (!event_name || !description || !location || !urgency || !event_date || !skills) {
    return res.status(400).json({ message: "All event fields and skills are required." });
  }

  try {
    // Insert event into database
    const [eventResult] = await db.query(
      "INSERT INTO events (event_name, description, location, urgency, event_date) VALUES (?, ?, ?, ?, ?)",
      [event_name, description, location, urgency, event_date]
    );

    const event_id = eventResult.insertId;

    // Assign skills to event
    for (const skill_id of skills) {
      await db.query("INSERT INTO event_skills (event_id, skill_id) VALUES (?, ?)", [event_id, skill_id]);
    }

    res.status(201).json({ message: "Event created successfully", event_id });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// Get All Events with Their Skills
router.get("/events", async (req, res) => {
  try {
    const [events] = await db.query(
      `SELECT e.event_id, e.event_name, e.description, e.location, e.urgency, e.event_date, 
              GROUP_CONCAT(s.skill_name) AS required_skills
       FROM events e
       LEFT JOIN event_skills es ON e.event_id = es.event_id
       LEFT JOIN skills s ON es.skill_id = s.skill_id
       GROUP BY e.event_id`
    );

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Database error" });
  }
});

export default router;
