import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import '../style/Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === '' || password === '' || email === '') {
      setError('Please fill in all fields');
    } else {
      setError('');
      console.log('User Registered');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>

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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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

        {/* Register button inside the form */}
        <button type="submit" className="submit-button">Register</button>

        {/* Back to login link */}
        <div className="back-to-login">
          <p>Already have an account?</p>
          <Link to="/login" className="link-button">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
