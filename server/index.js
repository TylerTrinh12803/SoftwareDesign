import express from "express";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(authRoutes);
app.use(userRoutes);

// Start the server
const PORT = 3360;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

