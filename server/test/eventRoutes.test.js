// server/test/eventRoutes.test.js
import request from "supertest";
import express from "express";
import { expect } from "chai";
import eventRoutes from "../Routes/eventRoutes.js";

// Create a mini Express app for testing
const app = express();
app.use(express.json());
app.use("/", eventRoutes);

describe("Event Routes", () => {
  describe("GET /events", () => {
    it("should return a list of events with formatted required_skills", async () => {
      const res = await request(app).get("/events");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      // Our dummy data initially contains 2 events
      expect(res.body.length).to.be.at.least(2);
      // Check that one event (Beach Cleanup) includes a required_skills string
      const beachCleanup = res.body.find((e) => e.event_id === 1);
      expect(beachCleanup).to.exist;
      expect(beachCleanup).to.have.property("required_skills");
      expect(beachCleanup.required_skills).to.contain("Cooking");
    });
  });

  describe("GET /events/:id", () => {
    it("should return a specific event by ID", async () => {
      const res = await request(app).get("/events/1");
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("event_id", 1);
      expect(res.body).to.have.property("event_name", "Beach Cleanup");
    });

    it("should return 404 for a non-existent event", async () => {
      const res = await request(app).get("/events/999");
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "Event not found");
    });
  });

  describe("POST /events", () => {
    it("should create a new event with valid data", async () => {
      const futureDate = "2099-01-01"; // valid future date
      const newEvent = {
        event_name: "Test Event",
        description: "This is a test event.",
        location: "Test Location",
        urgency: "high",
        event_date: futureDate,
        skills: [1] // use existing skill id
      };

      const res = await request(app)
        .post("/events")
        .send(newEvent);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("message", "Event created successfully");
      expect(res.body).to.have.property("event_id");

      // Confirm the new event exists by fetching it
      const getRes = await request(app).get(`/events/${res.body.event_id}`);
      expect(getRes.status).to.equal(200);
      expect(getRes.body).to.have.property("event_name", "Test Event");
    });

    it("should fail when required fields are missing", async () => {
      const res = await request(app)
        .post("/events")
        .send({ event_name: "Incomplete Event" });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "All event fields and skills are required.");
    });

    it("should fail when event_date is in the past", async () => {
      const pastDate = "2000-01-01";
      const newEvent = {
        event_name: "Past Event",
        description: "This event is in the past.",
        location: "Nowhere",
        urgency: "low",
        event_date: pastDate,
        skills: [1]
      };
      const res = await request(app)
        .post("/events")
        .send(newEvent);
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "You cannot create an event for a past date.");
    });
  });

  describe("PUT /events/:id", () => {
    it("should update an existing event", async () => {
      // First, create an event to update
      const futureDate = "2099-02-01";
      const newEvent = {
        event_name: "Event To Update",
        description: "Original Description",
        location: "Original Location",
        urgency: "medium",
        event_date: futureDate,
        skills: [2]
      };
      const createRes = await request(app)
        .post("/events")
        .send(newEvent);
      expect(createRes.status).to.equal(201);
      const eventId = createRes.body.event_id;

      // Now, update the event details
      const updatedEvent = {
        event_name: "Updated Event Name",
        description: "Updated Description",
        location: "Updated Location",
        urgency: "low",
        event_date: futureDate,
        skills: [1, 2]
      };
      const updateRes = await request(app)
        .put(`/events/${eventId}`)
        .send(updatedEvent);
      expect(updateRes.status).to.equal(200);
      expect(updateRes.body).to.have.property("message", "Event updated successfully!");

      // Verify the update
      const getRes = await request(app).get(`/events/${eventId}`);
      expect(getRes.status).to.equal(200);
      expect(getRes.body).to.have.property("event_name", "Updated Event Name");
      // Check that the concatenated required_skills string includes both "Cooking" and "First Aid"
      expect(getRes.body.required_skills).to.contain("Cooking");
      expect(getRes.body.required_skills).to.contain("First Aid");
    });

    it("should fail when updating a non-existent event", async () => {
      const futureDate = "2099-03-01";
      const updatedEvent = {
        event_name: "Non-existent Event",
        description: "Does not exist",
        location: "Nowhere",
        urgency: "high",
        event_date: futureDate,
        skills: [1]
      };
      const res = await request(app)
        .put(`/events/9999`)
        .send(updatedEvent);
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "Event not found");
    });

    it("should fail when updating with a past event_date", async () => {
      // Create an event first
      const futureDate = "2099-04-01";
      const newEvent = {
        event_name: "Event For Past Date Update",
        description: "Original Description",
        location: "Test Location",
        urgency: "medium",
        event_date: futureDate,
        skills: [1]
      };
      const createRes = await request(app)
        .post("/events")
        .send(newEvent);
      expect(createRes.status).to.equal(201);
      const eventId = createRes.body.event_id;

      // Attempt to update with a past date
      const pastDate = "2000-01-01";
      const updatedEvent = {
        event_name: "Should Fail Update",
        description: "Updated Description",
        location: "Updated Location",
        urgency: "low",
        event_date: pastDate,
        skills: [1]
      };
      const updateRes = await request(app)
        .put(`/events/${eventId}`)
        .send(updatedEvent);
      expect(updateRes.status).to.equal(400);
      expect(updateRes.body).to.have.property("message", "You cannot update an event to a past date.");
    });
  });

  describe("DELETE /events/:id", () => {
    it("should delete an existing event", async () => {
      // Create an event to delete
      const futureDate = "2099-05-01";
      const newEvent = {
        event_name: "Event To Delete",
        description: "Will be deleted",
        location: "Test Location",
        urgency: "medium",
        event_date: futureDate,
        skills: [2]
      };
      const createRes = await request(app)
        .post("/events")
        .send(newEvent);
      expect(createRes.status).to.equal(201);
      const eventId = createRes.body.event_id;

      // Delete the event
      const deleteRes = await request(app).delete(`/events/${eventId}`);
      expect(deleteRes.status).to.equal(200);
      expect(deleteRes.body).to.have.property("message", "Event deleted successfully!");

      // Verify deletion by attempting to fetch the event
      const getRes = await request(app).get(`/events/${eventId}`);
      expect(getRes.status).to.equal(404);
      expect(getRes.body).to.have.property("message", "Event not found");
    });

    it("should return 404 when deleting a non-existent event", async () => {
      const res = await request(app).delete("/events/9999");
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "Event not found");
    });
  });
});
