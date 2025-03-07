import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();
let users = [];
let nextUserId = 1;

// Seed admin user using top-level await
const hashedPassword = await bcrypt.hash("adminpass", 10);
users.push({
  user_id: nextUserId++,
  email: "admin@example.com",
  password: hashedPassword,
  role: "admin",
});

// User Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }

  try {
    // Look up the user in the in-memory array
    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Send a dummy token and user info
    res.json({
      token: "dummy-token",
      userId: user.user_id,
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.error("Error during login:", error);
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
    // Check if a user with the given email already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user object
    const newUser = {
      user_id: nextUserId++,
      email,
      password: hashedPassword,
      role: newUserRole,
    };

    // Add the new user to the in-memory storage
    users.push(newUser);

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.user_id,
      role: newUserRole,
      email,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
