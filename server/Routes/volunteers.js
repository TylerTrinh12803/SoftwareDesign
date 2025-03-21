import express from "express";
import db from "../config/db.js"; // Ensure this points to your database connection file

const router = express.Router();

// GET /volunteers - Retrieve all volunteers
router.get("/volunteers", async (req, res) => {
  try {
    const [volunteers] = await db.query("SELECT user_id, email FROM users WHERE role = 'user'");
    res.json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
