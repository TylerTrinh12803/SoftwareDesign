import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET /volunteers - Retrieve all volunteers (email instead of full name)
router.get("/volunteers", async (req, res) => {
  try {
    const [volunteers] = await db.query(`
      SELECT u.user_id, u.email
      FROM users u
      WHERE LOWER(u.role) = 'user'
    `);
    console.log("Fetched Volunteers:", volunteers); // Debugging
    res.json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /history - Join an event
router.post("/history", (req, res) => {
  const { user_id, event_id } = req.body;

  if (!user_id || !event_id) {
    return res.status(400).json({ message: "Missing user_id or event_id" });
  }

  try {
    const query = `
      INSERT INTO history_table (user_id, event_id, participated)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE participated = VALUES(participated);
    `;

    db.query(query, [user_id, event_id, 'Upcoming'], (err, result) => {
      if (err) {
        console.error("MySQL error:", err.sqlMessage);
        return res.status(500).json({ message: "Database error", error: err.sqlMessage });
      }
      return res.status(200).json({ message: "Event joined successfully" });
    });
  } catch (e) {
    console.error("Unexpected error:", e);
    return res.status(500).json({ message: "Unexpected server error", error: e.message });
  }
});

// GET /history/:userId - Get event history for a user
router.get("/history/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        e.event_id,
        e.event_name,
        e.description,
        e.location,
        e.urgency,
        e.event_date,
        h.participated AS status
      FROM history_table h
      JOIN events e ON h.event_id = e.event_id
      WHERE h.user_id = ?
    `, [userId]);

    console.log("Fetched rows:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Fetch history error:", error);
    res.status(500).json({ message: "Error fetching joined events" });
  }
});

// DELETE /history/:userId/:eventId - Unjoin an event
router.delete("/history/:userId/:eventId", async (req, res) => {
  const { userId, eventId } = req.params;
  try {
    await db.query(
      "DELETE FROM history_table WHERE user_id = ? AND event_id = ?",
      [userId, eventId]
    );
    res.status(200).json({ message: "Unjoined successfully" });
  } catch (error) {
    console.error("Unjoin error:", error);
    res.status(500).json({ message: "Error unjoining event" });
  }
});

export default router;
