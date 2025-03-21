import express from "express";
import db from "../config/db.js"; // Import database connection

const router = express.Router();

// GET all volunteers from the database
router.get("/volunteers", async (req, res) => {
  try {
    const [volunteers] = await db.query("SELECT user_id, email FROM users WHERE role = 'user'");
    res.json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all events
router.get("/events", async (req, res) => {
  try {
    const [events] = await db.query("SELECT event_id, event_name FROM events");
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Match volunteers to an event (Insert into history_table)
router.post("/match-volunteer", async (req, res) => {
  const { volunteers, event_id } = req.body;
  
  if (!event_id || !Array.isArray(volunteers) || volunteers.length === 0) {
    return res.status(400).json({ message: "Event ID and volunteer list are required." });
  }

  try {
    const values = volunteers.map((volunteer_id) => [event_id, volunteer_id, 'Upcoming']);
    await db.query("INSERT INTO history_table (event_id, user_id, participated) VALUES ?", [values]);
    
    res.status(201).json({ message: "Volunteers successfully matched to event." });
  } catch (error) {
    console.error("Error matching volunteers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Unmatch a volunteer from an event
router.delete("/unmatch-volunteer/:event_id/:volunteer_id", async (req, res) => {
  const { event_id, volunteer_id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM history_table WHERE event_id = ? AND user_id = ?", [event_id, volunteer_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Volunteer not found in event" });
    }

    res.status(200).json({ message: "Volunteer unmatched from event." });
  } catch (error) {
    console.error("Error unmatching volunteer:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;