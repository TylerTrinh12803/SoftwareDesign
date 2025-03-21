// server/test/volunteerRoutes.test.js
import express from "express";
import request from "supertest";
import { expect } from "chai";
import volunteerRoutes from "../Routes/volunteeraddRoutes.js";
import db from "../config/db.js";

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use('/', volunteerRoutes);

describe("Volunteer Routes (In-Memory)", () => {
  // Reset the in-memory eventVolunteers array before each test if needed
  beforeEach(() => {
    // Since eventVolunteers is declared in the module scope,
    // you might want to export a reset function from your route file.
    // For simplicity, if your tests run sequentially, it will persist.
    // Alternatively, restart the process between tests.
  });

  describe("GET /volunteers", () => {
    it("should return a list of volunteers", async () => {
      const res = await request(app).get("/volunteers");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.lengthOf(2);
      expect(res.body[0]).to.include({ id: 1, name: "Alice" });
    });
  });

  describe("POST /match-volunteer", () => {
    it("should return 400 if event_id is missing", async () => {
      const res = await request(app)
        .post("/match-volunteer")
        .send({ volunteers: [1, 2] });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "Event and volunteers are required for matching.");
    });

    it("should return 400 if volunteers array is empty", async () => {
      const res = await request(app)
        .post("/match-volunteer")
        .send({ event_id: 1, volunteers: [] });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "Event and volunteers are required for matching.");
    });

    it("should match volunteers to an event successfully", async () => {
      const res = await request(app)
        .post("/match-volunteer")
        .send({ event_id: 1, volunteers: [1, 2] });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("message", "Volunteer matched to event successfully");
    });
  });

  describe("DELETE /unmatch-volunteer/:event_id/:volunteer_id", () => {
    it("should unmatch a volunteer if match exists", async () => {
      // First, create a match so we can remove it.
      await request(app)
        .post("/match-volunteer")
        .send({ event_id: 2, volunteers: [1] });
      
      const res = await request(app).delete("/unmatch-volunteer/2/1");
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Volunteer unmatched from event successfully");
    });

    it("should return 404 if the match is not found", async () => {
      const res = await request(app).delete("/unmatch-volunteer/999/999");
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "Match not found");
    });
  });
});

after(async () => {
  await db.end(); // ✅ Close DB connection ONCE globally
});
