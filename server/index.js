// Assuming you are using Express.js in your backend
import express from "express"
import mysql2 from "mysql2"


const app = express()
// MySQL connection setup
/*const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'your_database_name',
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query to check if the user exists in the database
  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length > 0) {
        // User exists, send a success response (you could also send a token here)
        return res.status(200).json({ message: 'Login successful' });
      } else {
        // Invalid username or password
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    }
  );
});*/

// Start the server
app.listen(3360, () => {
  console.log('Server running on http://localhost:3360');
});
