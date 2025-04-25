import express from "express";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import eventRoutes from "./Routes/eventRoutes.js";
import notificationRoutes from "./Routes/notificationRoutes.js";
import profileRoutes from "./Routes/profileRoutes.js";
import volunteersRoutes from "./Routes/volunteers.js"; 
import volunteeraddRoutes from "./Routes/volunteeraddRoutes.js"; 
import matchingRoutes from "./Routes/matching.js"; // Ensure this is correct
import reportRoutes from "./Routes/reportRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(authRoutes);
app.use(userRoutes);
app.use(eventRoutes);
app.use("/notifications", notificationRoutes);
app.use('/api/profile', profileRoutes);
app.use("/", volunteersRoutes);
app.use("/", volunteeraddRoutes);
app.use("/", matchingRoutes);
app.use("/", reportRoutes);


// Start the server
const PORT = 3360;
if (process.env.NODE_ENV !== 'test') {
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});}
