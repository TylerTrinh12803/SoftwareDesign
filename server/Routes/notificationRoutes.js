import express from "express";
import cors from "cors";
import db from "../config/db.js"; 

const router = express.Router();
router.use(cors()); // Allow cross-origin requests

// GET notifications for a specific user
router.get("/", async (req, res) => {
  try {
    const { volunteer_id } = req.query;
    if (!volunteer_id) {
      return res.status(400).json({ message: "volunteer_id is required" });
    }

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

// Dismiss all notifications (delete all for user)
router.delete("/dismiss-all/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [result] = await db.query(
      "DELETE FROM notification WHERE volunteer_id = ?", 
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No notifications found for this user." });
    }

    res.json({ message: "All notifications deleted successfully." });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Dismiss (delete) a single notification
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const [result] = await db.query("DELETE FROM notification WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: `Notification with id ${id} has been dismissed.` });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
