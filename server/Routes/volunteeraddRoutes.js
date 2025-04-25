import express from "express";
import db from "../config/db.js";

const router = express.Router();

// POST /match-volunteer - Match volunteers to an event
router.post("/match-volunteer", async (req, res) => {
  const { event_id, volunteers } = req.body;

  if (!event_id || !Array.isArray(volunteers) || volunteers.length === 0) {
    return res.status(400).json({ message: "Event ID and volunteers are required" });
  }

  try {
    // Check if the combination of event_id and volunteer_id already exists in the history_table
    const [existingMatch] = await db.query(
      "SELECT * FROM history_table WHERE event_id = ? AND user_id IN (?)",
      [event_id, volunteers]
    );

    if (existingMatch.length > 0) {
      return res.status(200).json({ message: "This volunteer is already attending this event" });
    }

    // If not matched, insert the match into the history_table
    const values = volunteers.map((volunteer_id) => [event_id, volunteer_id, 'Upcoming']);
    await db.query(
      "INSERT INTO history_table (event_id, user_id, participated) VALUES ?",
      [values]
    );

    res.status(201).json({ message: "Volunteer matched to event successfully" });
  } catch (error) {
    console.error("Error matching volunteers:", error);

    if (error.code === 'ER_DUP_ENTRY') {
      res.status(200).json({ message: "This volunteer is already attending this event" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
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

// GET /volunteers - Get list of volunteers
router.get("/volunteers", async (req, res) => {
  try {
    const [volunteers] = await db.query("SELECT user_id, email FROM users WHERE role = 'volunteer'");
    res.json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /events - Get list of events
router.get("/events", async (req, res) => {
  try {
    const [events] = await db.query("SELECT event_id, event_name FROM events");
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /notifications - Get notifications for volunteer
router.get("/notifications", async (req, res) => {
  const { volunteer_id } = req.query;

  if (!volunteer_id) {
    return res.status(500).json({ message: "volunteer_id is required" });
  }

  try {
    const [notifications] = await db.query(
      "SELECT * FROM notification WHERE volunteer_id = ? ORDER BY created_at DESC",
      [volunteer_id]
    );
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
