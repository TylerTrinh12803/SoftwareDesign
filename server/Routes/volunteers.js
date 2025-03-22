import express from "express";
import db from "../config/db.js"; // Ensure this points to your database connection file

const router = express.Router();

// GET /volunteers - Retrieve all volunteers
router.get("/volunteers", async (req, res) => {
    try {
      const [volunteers] = await db.query(`
        SELECT u.user_id, COALESCE(up.full_name, 'Unknown') AS full_name
        FROM users u
        LEFT JOIN user_profile up ON u.user_id = up.user_id
        WHERE LOWER(u.role) = 'user'
      `);
      console.log("Fetched Volunteers:", volunteers); // Debugging
      res.json(volunteers);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  

export default router;