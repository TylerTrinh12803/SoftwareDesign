// Routes/volunteerRoutes.js
import express from "express";
const router = express.Router();

// In-memory data for volunteers (dummy data)
const volunteers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

// In-memory array to store volunteer-to-event matches
let eventVolunteers = [];

// GET /volunteers: Return all volunteers
router.get("/volunteers", (req, res) => {
  res.json(volunteers);
});

// POST /match-volunteer: Match volunteers to an event
router.post("/match-volunteer", (req, res) => {
  const { volunteers: volunteerIds, event_id } = req.body;
  if (!event_id || !Array.isArray(volunteerIds) || volunteerIds.length === 0) {
    return res.status(400).json({ message: "Event and volunteers are required for matching." });
  }
  // Create match records for each volunteer
  volunteerIds.forEach(vId => {
    eventVolunteers.push({ event_id, volunteer_id: vId });
  });
  res.status(201).json({ message: "Volunteer matched to event successfully" });
});

// DELETE /unmatch-volunteer/:event_id/:volunteer_id: Remove a match
router.delete("/unmatch-volunteer/:event_id/:volunteer_id", (req, res) => {
  const event_id = parseInt(req.params.event_id, 10);
  const volunteer_id = parseInt(req.params.volunteer_id, 10);
  const index = eventVolunteers.findIndex(match => match.event_id === event_id && match.volunteer_id === volunteer_id);
  if (index === -1) {
    return res.status(404).json({ message: "Match not found" });
  }
  eventVolunteers.splice(index, 1);
  res.status(200).json({ message: "Volunteer unmatched from event successfully" });
});

export default router;
