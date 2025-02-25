import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Users.css";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ email: "", password: "", confirmPassword: "", role: "user" });

  // Get user role from localStorage
  const role = localStorage.getItem("role");

  // Redirect non-admins
  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, [role, navigate]);

  // Fetch all users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3360/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete user function
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:3360/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove the deleted user from the UI
      setUsers(users.filter((user) => user.user_id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    }
  };

  // Handle input change for new user form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Add new user function
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!newUser.email || !newUser.password || !newUser.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3360/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add user");
      }

      // Refresh the user list
      setUsers([...users, { user_id: data.userId, email: newUser.email, role: newUser.role }]);
      setNewUser({ email: "", password: "", confirmPassword: "", role: "user" });
      alert("User added successfully!");

    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user");
    }
  };

  return (
    <div className="users-container">
      <h2>Manage Users</h2>

      {error && <p className="error-message">{error}</p>}

      {/* Add User Form */}
      <div className="add-user-form">
        <h3>Add New User</h3>
        <form onSubmit={handleAddUser}>
          <input
            type="email"
            name="email"
            placeholder="User Email"
            value={newUser.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={newUser.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <select name="role" value={newUser.role} onChange={handleInputChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      </div>

      {/* User List */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user.user_id)}
                  >
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
