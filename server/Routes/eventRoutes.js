import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Add a New Skill
router.post("/skills", async (req, res) => {
  const { skill_name } = req.body;
  console.log("Received request to add skill:", skill_name);  // Debugging Log

  if (!skill_name) {
    return res.status(400).json({ message: "Skill name is required." });
  }

  try {
    const [result] = await db.query("INSERT INTO skills (skill_name) VALUES (?)", [skill_name]);
    console.log("Skill added successfully:", result.insertId);  // Debugging Log
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

router.delete("/skills/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(500).json({ message: "Database error" });
  }
  try {
    const [result] = await db.query("DELETE FROM skills WHERE skill_id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({ message: "Database error" });
  }
});


// Create a New Event with Skills
router.post("/events", async (req, res) => {
  const { event_name, description, location, urgency, event_date, skills } = req.body;

  // Check for missing fields and ensure skills is a non-empty array.
  if (!event_name || !description || !location || !urgency || !event_date || 
      !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ message: "All event fields and skills are required." });
  }

  // Convert event_date to a JavaScript Date object
  const eventDateObj = new Date(event_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDateObj.setHours(0, 0, 0, 0);

  if (eventDateObj < today) {
    return res.status(400).json({ message: "You cannot create an event for a past date." });
  }

  try {
    const [eventResult] = await db.query(
      "INSERT INTO events (event_name, description, location, urgency, event_date) VALUES (?, ?, ?, ?, ?)",
      [event_name, description, location, urgency, event_date]
    );
    const event_id = eventResult.insertId;

    // Assign skills to event
    for (const skill_id of skills) {
      await db.query(
        "INSERT INTO event_skills (event_id, skill_id) VALUES (?, ?)",
        [event_id, skill_id]
      );
    }
    
    res.status(201).json({ message: "Event created successfully", event_id });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Database error" });
  }
});

router.get("/events", async (req, res) => {
  try {
    const [events] = await db.query(
      `SELECT e.event_id, e.event_name, e.description, e.location, e.urgency, 
              DATE_FORMAT(e.event_date, '%Y-%m-%d') AS event_date, 
              GROUP_CONCAT(s.skill_name) AS required_skills
       FROM events e
       LEFT JOIN event_skills es ON e.event_id = es.event_id
       LEFT JOIN skills s ON es.skill_id = s.skill_id
       GROUP BY e.event_id
       ORDER BY 
         CASE 
           WHEN e.urgency = 'high' THEN 1 
           WHEN e.urgency = 'medium' THEN 2 
           WHEN e.urgency = 'low' THEN 3 
         END, 
         e.event_date ASC` // Second order by event_date to sort within urgency
    );

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Database error" });
  }
});

router.delete("/events/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(500).json({ message: "Database error" });
  }
  try {
    await db.query("DELETE FROM events WHERE event_id = ?", [id]);
    res.json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Database error" });
  }
});

router.get("/events/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    return res.status(500).json({ message: "Invalid event ID." });
  }

  try {
    // Fetch base event details
    const [[event]] = await db.query(
      `SELECT event_id, event_name, description, location, urgency, 
              DATE_FORMAT(event_date, '%Y-%m-%d') AS event_date
       FROM events WHERE event_id = ?`,
      [id]
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Fetch associated skills
    const [skills] = await db.query(
      `SELECT s.skill_id, s.skill_name
       FROM event_skills es
       JOIN skills s ON es.skill_id = s.skill_id
       WHERE es.event_id = ?`,
      [id]
    );

    event.required_skills = skills;
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Database error" });
  }
});


router.put("/events/:id", async (req, res) => {
  const { id } = req.params;
  const { event_name, description, location, urgency, event_date, skills } = req.body;

  try {
    // Convert event_date to a JavaScript Date object
    const eventDateObj = new Date(event_date);
    const today = new Date();

    // Set time to midnight to compare only the date, not the time
    today.setHours(0, 0, 0, 0);
    eventDateObj.setHours(0, 0, 0, 0);

    if (eventDateObj < today) {
      return res.status(400).json({ message: "You cannot update an event to a past date." });
    }

    // Update event details
    await db.query(
      "UPDATE events SET event_name = ?, description = ?, location = ?, urgency = ?, event_date = ? WHERE event_id = ?",
      [event_name, description, location, urgency, event_date, id]
    );

    // Remove old skills and insert new ones
    await db.query("DELETE FROM event_skills WHERE event_id = ?", [id]);

    if (skills.length > 0) {
      for (const skill_id of skills) {
        if (!skill_id) {
          console.warn("Skipping invalid skill_id:", skill_id);
          continue;
        }
    
        await db.query(
          "INSERT INTO event_skills (event_id, skill_id) VALUES (?, ?)",
          [id, skill_id]
        );
      }
    } 
    
    res.json({ message: "Event updated successfully!" });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Database error" });
  }
});


export default router;