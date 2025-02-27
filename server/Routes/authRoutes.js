import express from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js"; // Import database connection

const router = express.Router();

// User Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Send token (simplified)
    res.json({
      token: "dummy-token",
      userId: user.user_id,
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// User Registration Route
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  // Only "user" or "admin" roles are allowed
  const newUserRole = role === "admin" ? "admin" : "user";

  try {
    // Check if user already exists
    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const [result] = await db.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, newUserRole]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
      role: newUserRole,
      email,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
