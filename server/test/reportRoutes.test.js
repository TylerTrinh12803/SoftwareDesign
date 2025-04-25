import express from "express";
import request from "supertest";
import { expect } from "chai";
import reportRoutes from "../Routes/reportRoutes.js";// Adjust path if needed
import db from "../config/db.js";

const app = express();
app.use(express.json());
app.use("/", reportRoutes);

describe("Event Routes Integration", () => {
  let testEventId;
  const testEvent = {
    event_name: "Test Event",
    event_date: "2025-12-31",
    description: "Test description",
    location: "Test Location",
    urgency: "high",
    skills: [1, 2]
  };

  before(async () => {
    // Create a test event in the database before tests
    const [result] = await db.query(
      "INSERT INTO events (event_name, event_date, description, location, urgency) VALUES (?, ?, ?, ?, ?)",
      [testEvent.event_name, testEvent.event_date, testEvent.description, testEvent.location, testEvent.urgency]
    );
    testEventId = result.insertId;
  });

  describe("GET /events", () => {
    it("should return a list of events", async () => {
      const res = await request(app).get("/events");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("GET /events/:id", () => {
    it("should fetch event by ID", async () => {
      const res = await request(app).get(`/events/${testEventId}`);
      expect(res.status).to.equal(200);
      expect(res.body.event_name).to.equal(testEvent.event_name);
    });

    it("should return 404 for non-existent event", async () => {
      const res = await request(app).get("/events/999999");
      expect(res.status).to.equal(404);
    });
  });

  describe("POST /events", () => {
    it("should create a new event", async () => {
      const res = await request(app).post("/events").send(testEvent);
      expect(res.status).to.equal(201);
      expect(res.body.event_name).to.equal(testEvent.event_name);
    });
  });

  describe("DELETE /events/:id", () => {
    it("should delete the event", async () => {
      const res = await request(app).delete(`/events/${testEventId}`);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Event deleted successfully");

      // Confirm deletion from DB
      const [rows] = await db.query("SELECT * FROM events WHERE event_id = ?", [testEventId]);
      expect(rows.length).to.equal(0);
    });

    it("should return 404 if event is not found", async () => {
      const res = await request(app).delete("/events/999999");
      expect(res.status).to.equal(404);
    });
  });

  // Clean up test data after tests
  after(async () => {
    await db.query("DELETE FROM events WHERE event_id = ?", [testEventId]);
  });
});
