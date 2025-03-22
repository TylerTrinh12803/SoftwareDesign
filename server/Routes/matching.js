import express from "express";
import db from "../config/db.js";

const router = express.Router();

// POST /match-volunteer - Assign volunteers to an event
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
    console.error("Error matching volunteers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;