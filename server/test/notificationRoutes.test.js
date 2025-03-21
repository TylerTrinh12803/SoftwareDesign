import express from "express";
import db from "../config/db.js"; // Ensure this connects to MySQL

const router = express.Router();

// GET notifications for a specific user
router.get("/", async (req, res) => {
  try {
    const { volunteer_id } = req.query; // Get volunteer ID from query parameters

    if (!volunteer_id) {
      return res.status(400).json({ message: "volunteer_id is required" });
    }

    const volunteerIdInt = parseInt(volunteer_id, 10);

    const [notifications] = await db.query(
      "SELECT id, message, status, created_at FROM notification WHERE volunteer_id = ? ORDER BY created_at DESC",
      [volunteerIdInt]
    );

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
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
    
    res.json({ message: `Notification with ID ${id} dismissed.` });
  } catch (error) {
    console.error("Error dismissing notification:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Dismiss all notifications (mark as read)
router.delete("/dismiss-all/:userId", async (req, res) => {
  const { userId } = req.params; // Get user ID from request params
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




export default router;
