import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import '../style/Register.css';

const Register = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New confirm password field
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (password === '' || confirmPassword === '' || email === '') {
      setError('Please fill in all fields');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    // Prepare registration data
    const userData = {
      email,
      password,
      role, // Include selected role
    };

    try {
      const response = await fetch('http://localhost:3360/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User Registered:', data);
        alert('Registration successful!');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>

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

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
          />
        </div>

        {/* Role Selection */}
        <div className="input-group">
          <label htmlFor="role">Register As:</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}

        {/* Register button inside the form */}
        <button type="submit" className="submit-button">Register</button>

        {/* Back to login link */}
        <div className="back-to-login">
          <p>Already have an account?</p>
          <Link to="/login" className="link-button">Back to Login</Link>
        </div>

        {/* Back to Home Button */}
        <div className="back-to-home">
          <Link to="/" className="home-button">Back to Home</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
