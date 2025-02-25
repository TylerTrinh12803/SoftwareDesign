import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "../style/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (password === "" || confirmPassword === "" || email === "") {
      setError("Please fill in all fields");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    // Prepare registration data (role is automatically set to "user")
    const userData = {
      email,
      password,
      role: "user", // Automatically assign "user" role
    };

    try {
      // Register user
      const registerResponse = await fetch("http://localhost:3360/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || "Registration failed");
      }

      console.log("User Registered:", registerData);

      // Automatically log in the user after successful registration
      const loginResponse = await fetch("http://localhost:3360/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Use same email & password for login
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || "Login failed after registration");
      }

      // Store login data in localStorage
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("userId", loginData.userId);
      localStorage.setItem("role", loginData.role);
      localStorage.setItem("email", email);

      console.log("User Logged In:", loginData);

      // Redirect to home page after successful login
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An error occurred during registration");
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

        {error && <p className="error-message">{error}</p>}

        {/* Register button inside the form */}
        <button type="submit" className="submit-button">
          Register
        </button>

        {/* Back to login link */}
        <div className="back-to-login">
          <p>Already have an account?</p>
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </div>
        {/* Back to Home Button */}
        <div className="back-to-home">
          <Link to="/" className="home-button">
            Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
