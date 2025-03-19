import express from "express";
import db from "../config/db.js"; // Import database connection

const router = express.Router();

// Get All Users (Admins Only)
router.get("/users", async (req, res) => {
  try {
    const [users] = await db.query("SELECT user_id, email, role FROM users");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// Delete User (Admins Only)
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE user_id = ?", [id]);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;
