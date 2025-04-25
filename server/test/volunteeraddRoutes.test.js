import { expect } from "chai";  // Chai's expect
import request from "supertest";
import express from "express";
import volunteerRoutes from "../Routes/volunteeraddRoutes.js";  // Adjust path
import db from "../config/db.js";

const app = express();
app.use(express.json());
app.use("/", volunteerRoutes);  // Mount the actual volunteerRoutes.js

let testVolunteerId;
let testEventId;

describe("Volunteer Routes (Real DB)", () => {
  before(async () => {
    // Insert test user (volunteer)
    const [volunteerResult] = await db.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [`testvolunteer${Date.now()}@test.com`, "password", "volunteer"]
    );
    testVolunteerId = volunteerResult.insertId;

    // Insert test event
    const [eventResult] = await db.query(
      "INSERT INTO events (event_name, description, location, urgency, event_date) VALUES (?, ?, ?, ?, NOW())",
      [`Test Event ${Date.now()}`, "Test Description", "Test Location", "High"]
    );
    testEventId = eventResult.insertId;
  });

  describe("POST /match-volunteer", () => {
    it("should match a volunteer to an event", async () => {
      const res = await request(app)
        .post("/match-volunteer")
        .send({ event_id: testEventId, volunteers: [testVolunteerId] });

      expect(res.status).to.equal(201);
      expect(res.body.message).to.include("matched");
    });

    it("should not match if already matched", async () => {
      // Trying to match the same volunteer again
      const res = await request(app)
        .post("/match-volunteer")
        .send({ event_id: testEventId, volunteers: [testVolunteerId] });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.match(/already attending/i);
    });

    it("should fail if event_id or volunteers are missing", async () => {
      const res = await request(app).post("/match-volunteer").send({});
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Event ID and volunteers are required");
    });

    it("should fail if volunteers array is empty", async () => {
      const res = await request(app)
        .post("/match-volunteer")
        .send({ event_id: testEventId, volunteers: [] });
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Event ID and volunteers are required");
    });
  });

  describe("DELETE /unmatch-volunteer/:event_id/:volunteer_id", () => {
    it("should unmatch a volunteer", async () => {
      const res = await request(app).delete(
        `/unmatch-volunteer/${testEventId}/${testVolunteerId}`
      );
      expect(res.status).to.equal(200);
      expect(res.body.message).to.include("unmatched");
    });

    it("should return 404 if trying to unmatch nonexistent match", async () => {
      const res = await request(app).delete(`/unmatch-volunteer/999999/999999`);
      expect(res.status).to.equal(404);
      expect(res.body.message).to.include("not found");
    });
  });

  describe("GET /volunteers", () => {
    it("should return list of volunteers", async () => {
      const res = await request(app).get("/volunteers");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("should handle error if no volunteers exist", async () => {
      // Manually delete volunteers or test with an empty database
      const res = await request(app).get("/volunteers");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").that.is.empty;
    });
  });

  describe("GET /events", () => {
    it("should return list of events", async () => {
      const res = await request(app).get("/events");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("should return empty array if no events", async () => {
      // Simulate no events in the database
      const res = await request(app).get("/events");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").that.is.empty;
    });
  });

  describe("GET /notifications", () => {
    it("should return 500 if volunteer_id is missing", async () => {
      const res = await request(app).get("/notifications");
      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("volunteer_id is required");
    });

    it("should return notifications for a volunteer", async () => {
      const res = await request(app).get(
        `/notifications?volunteer_id=${testVolunteerId}`
      );
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("should return empty array if no notifications for volunteer", async () => {
      const res = await request(app).get(
        `/notifications?volunteer_id=${testVolunteerId}`
      );
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").that.is.empty;
    });
  });

  after(async () => {
    // Clean up test data
    await db.query("DELETE FROM history_table WHERE user_id = ?", [testVolunteerId]);
    await db.query("DELETE FROM users WHERE user_id = ?", [testVolunteerId]);
    await db.query("DELETE FROM events WHERE event_id = ?", [testEventId]);
    await db.end(); // Close the DB connection
  });
});
