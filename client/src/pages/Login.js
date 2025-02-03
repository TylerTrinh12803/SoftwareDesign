import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for redirection
import '../style/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For redirection after successful login

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === '' || password === '') {
      setError('Please fill in both fields');
    } else {
      setError('');

      // Send a POST request to your backend for authentication
      try {
        const response = await fetch('http://localhost:3360/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }), // Sending username and password
        });

        const data = await response.json();

        if (response.ok) {
          // Assuming the response contains a valid user token or success message
          console.log('Logged in successfully');
          navigate('/home'); // Redirect to home page if login is successful
        } else {
          // If login fails, show the error message
          setError(data.message || 'Invalid username or password');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred while logging in');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="login-form">
          {/* Login word inside the form */}
          <h2>Login</h2>
          
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">Login</button>

          {/* Register link inside the same form */}
          <div className="register-link">
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
