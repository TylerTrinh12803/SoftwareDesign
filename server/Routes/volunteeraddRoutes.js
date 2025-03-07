import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Fetch Volunteers
router.get("/volunteers", async (req, res) => {
  try {
    const [volunteers] = await db.query("SELECT * FROM volunteers");
    res.json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// Match Volunteer to an Event
router.post("/match-volunteer", async (req, res) => {
  const { volunteers, event_id } = req.body;

  if (!event_id || !volunteers.length) {
    return res.status(400).json({ message: "Event and volunteers are required for matching." });
  }

  try {
    for (const volunteer_id of volunteers) {
      await db.query("INSERT INTO event_volunteers (event_id, volunteer_id) VALUES (?, ?)", [event_id, volunteer_id]);
    }
    res.status(201).json({ message: "Volunteer matched to event successfully" });
  } catch (error) {
    console.error("Error matching volunteer to event:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// Delete Volunteer from an Event
router.delete("/unmatch-volunteer/:event_id/:volunteer_id", async (req, res) => {
  const { event_id, volunteer_id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM event_volunteers WHERE event_id = ? AND volunteer_id = ?", [event_id, volunteer_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.status(200).json({ message: "Volunteer unmatched from event successfully" });
  } catch (error) {
    console.error("Error unmatching volunteer from event:", error);
    res.status(500).json({ message: "Database error" });
  }
});

export default router;
