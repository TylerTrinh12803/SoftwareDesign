import express from "express";
import db from "../config/db.js"; // Import database connection

const router = express.Router();

// GET /volunteers - Retrieve volunteers from the database
router.get("/volunteers", async (req, res) => {
  try {
    const [volunteers] = await db.query("SELECT user_id, email FROM users WHERE role = 'volunteer'");
    res.json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /events - Retrieve all events
router.get("/events", async (req, res) => {
  try {
    const [events] = await db.query("SELECT event_id, event_name FROM events");
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /match-volunteer - Match volunteers to an event
router.post("/match-volunteer", async (req, res) => {
  const { volunteers, event_id } = req.body;

  if (!event_id || !Array.isArray(volunteers) || volunteers.length === 0) {
    return res.status(400).json({ message: "Event ID and volunteers are required" });
  }

  try {
    // Insert each volunteer into the history_table
    const values = volunteers.map((volunteer_id) => [event_id, volunteer_id, 'Upcoming']);
    await db.query("INSERT INTO history_table (event_id, user_id, participated) VALUES ?", [values]);

    res.status(201).json({ message: "Volunteers matched to the event successfully" });
  } catch (error) {
    console.error("MATCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /unmatch-volunteer/:event_id/:volunteer_id - Remove a match
router.delete("/unmatch-volunteer/:event_id/:volunteer_id", async (req, res) => {
  const { event_id, volunteer_id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM history_table WHERE event_id = ? AND user_id = ?",
      [event_id, volunteer_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json({ message: "Volunteer unmatched from event successfully" });
  } catch (error) {
    console.error("Error unmatching volunteer:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;