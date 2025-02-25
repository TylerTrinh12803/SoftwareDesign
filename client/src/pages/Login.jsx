import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/Login.css';

const Login = ({ onLogin }) => { // Accept `onLogin` callback as a prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For redirection after successful login

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      setError('Please fill in both fields');
      return;
    }

    setError('');

    try {
      const response = await fetch('http://localhost:3360/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save authentication data to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('role', data.role);
        localStorage.setItem('email', email);

        console.log('Logged in successfully as:', data.role);

        // Call the `onLogin` callback to update parent state
        if (onLogin) onLogin();

        // Redirect to home page after login
        navigate('/');
      } else {
        if (data.message === 'User not found') {
          setError("This account doesn't exist");
        } else if (data.message === 'Incorrect password') {
          setError('The email or password is incorrect');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Invalid login credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
          
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
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
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button">Login</button>

          {/* Register link inside the same form */}
          <div className="register-link">
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>

          {/* Back to Home Button */}
          <div className="back-to-home">
            <Link to="/" className="home-button">Back to Home</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
