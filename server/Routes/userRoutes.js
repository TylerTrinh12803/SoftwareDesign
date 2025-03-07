import express from "express";

const router = express.Router();

// In‑memory storage for users (dummy data)
let users = [
  { user_id: 1, email: "admin@example.com", role: "admin" },
  { user_id: 2, email: "user1@example.com", role: "user" },
  { user_id: 3, email: "user2@example.com", role: "user" }
];

// Get All Users (Admins Only)
// This endpoint returns a list of users with their id, email, and role.
router.get("/users", (req, res) => {
  res.json(users.map(({ user_id, email, role }) => ({ user_id, email, role })));
});

// Delete User (Admins Only)
// This endpoint deletes a user based on the user_id provided in the URL.
router.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = users.findIndex(user => user.user_id === id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  // Remove the user from the in-memory array
  users.splice(index, 1);
  res.status(200).json({ message: "User deleted successfully" });
});

export default router;
