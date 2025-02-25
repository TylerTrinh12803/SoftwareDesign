// Assuming you are using Express.js in your backend
import express from "express"
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';


const app = express()
app.use(cors());
app.use(express.json());
// MySQL connection setup
const db = await mysql.createConnection({
  host: '127.0.0.1',
  port: 8800,  // make sure this is the port your MySQL server is using
  user: 'root',
  password: 'softwaredesign123',
  database: 'volunteer',
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];

    // Compare the provided password with the hashed password stored in the "password" column
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // On success, send back token and user info (token generation is simplified here)
    res.json({
      token: "dummy-token",
      userId: user.user_id,
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Ensure only "user" or "admin" is stored in the database
  const newUserRole = (role === 'admin' || role === 'user') ? role : 'user';

  try {
    // Check if user already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user using the correct role
    const [result] = await db.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, newUserRole]
    );

    return res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId,
      role: newUserRole,
      email,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const [users] = await db.query("SELECT user_id, email, role FROM users");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE user_id = ?", [id]);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});


// Start the server
app.listen(3360, () => {
  console.log('Server running on http://localhost:3360');
});
