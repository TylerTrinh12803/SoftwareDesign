import express from "express";
import request from "supertest";
import { expect } from "chai";
import db from "../config/db.js";
import eventRoutes from "../Routes/eventRoutes.js";

const app = express();
app.use(express.json());
app.use("/", eventRoutes);

let originalQuery;

describe("Event Routes", () => {
  let testSkillId;
  let testEventId;

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 5);
  const formattedFutureDate = futureDate.toISOString().split("T")[0];

  before(() => {
    originalQuery = db.query;
  });

  after(() => {
    db.query = originalQuery;
  });

  describe("Skills", () => {
    it("should return 400 if skill_name is missing", async () => {
      const res = await request(app).post("/skills").send({});
      expect(res.status).to.equal(400);
    });

    it("should create a new skill", async () => {
      const res = await request(app).post("/skills").send({ skill_name: "TestSkill" });
      expect(res.status).to.equal(201);
      testSkillId = res.body.skill_id;
    });

    it("should return 500 if db fails on skill creation", async () => {
      db.query = async () => { throw new Error("Fake DB error"); };
      const res = await request(app).post("/skills").send({ skill_name: "FailSkill" });
      expect(res.status).to.equal(500);
      db.query = originalQuery;
    });

    it("should fetch all skills", async () => {
      const res = await request(app).get("/skills");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("should return 500 if db fails on fetching skills", async () => {
      db.query = async () => { throw new Error("Fake DB error"); };
      const res = await request(app).get("/skills");
      expect(res.status).to.equal(500);
      db.query = originalQuery;
    });

    it("should return 404 if skill not found on delete", async () => {
      const res = await request(app).delete("/skills/999999");
      expect(res.status).to.equal(404);
    });

    it("should return 500 on invalid skill ID", async () => {
      const res = await request(app).delete("/skills/notanumber");
      expect(res.status).to.equal(500);
    });

    it("should return 500 if db fails on deleting skill", async () => {
      db.query = async () => { throw new Error("Fake DB error"); };
      const res = await request(app).delete("/skills/1");
      expect(res.status).to.equal(500);
      db.query = originalQuery;
    });
  });

  describe("Events", () => {
    it("should return 400 if fields are missing", async () => {
      const res = await request(app).post("/events").send({});
      expect(res.status).to.equal(400);
    });

    it("should return 400 if skills is empty", async () => {
      const res = await request(app).post("/events").send({
        event_name: "Test",
        description: "Desc",
        location: "Here",
        urgency: "low",
        event_date: formattedFutureDate,
        skills: []
      });
      expect(res.status).to.equal(400);
    });

    it("should return 400 for past event date", async () => {
      const res = await request(app).post("/events").send({
        event_name: "Past",
        description: "Desc",
        location: "Here",
        urgency: "low",
        event_date: "2000-01-01",
        skills: [testSkillId]
      });
      expect(res.status).to.equal(400);
    });

    it("should create an event", async () => {
      const res = await request(app).post("/events").send({
        event_name: "Future",
        description: "Upcoming",
        location: "City",
        urgency: "medium",
        event_date: formattedFutureDate,
        skills: [testSkillId]
      });
      expect(res.status).to.equal(201);
      testEventId = res.body.event_id;
    });

    it("should return 500 if db fails on event creation", async () => {
      db.query = async () => { throw new Error("Fake DB error"); };
      const res = await request(app).post("/events").send({
        event_name: "Error",
        description: "Test",
        location: "City",
        urgency: "high",
        event_date: formattedFutureDate,
        skills: [1]
      });
      expect(res.status).to.equal(500);
      db.query = originalQuery;
    });

    it("should fetch all events", async () => {
      const res = await request(app).get("/events");
      expect(res.status).to.equal(200);
    });

    it("should return 500 if db fails on fetching events", async () => {
      db.query = async () => { throw new Error("Fake DB error"); };
      const res = await request(app).get("/events");
      expect(res.status).to.equal(500);
      db.query = originalQuery;
    });

    it("should fetch event by ID", async () => {
      const res = await request(app).get(`/events/${testEventId}`);
      expect(res.status).to.equal(200);
    });

    it("should return 404 for non-existent ID", async () => {
      const res = await request(app).get("/events/999999");
      expect(res.status).to.equal(404);
    });

    it("should return 500 on invalid ID format", async () => {
      const res = await request(app).get("/events/invalid");
      expect(res.status).to.equal(500);
    });

    it("should return 500 if db fails on get event by ID", async () => {
      db.query = async () => { throw new Error("Fake DB error"); };
      const res = await request(app).get("/events/1");
      expect(res.status).to.equal(500);
      db.query = originalQuery;
    });

    it("should update event (no skills)", async () => {
      const res = await request(app).put(`/events/${testEventId}`).send({
        event_name: "Updated Event",
        description: "Updated",
        location: "Place",
        urgency: "low",
        event_date: formattedFutureDate,
        skills: []
      });
      expect(res.status).to.equal(200);
    });

    it("should update event with skills", async () => {
      const res = await request(app).put(`/events/${testEventId}`).send({
        event_name: "With Skills",
        description: "Desc",
        location: "Place",
        urgency: "high",
        event_date: formattedFutureDate,
        skills: ["TestSkill"]
      });
      expect(res.status).to.equal(200);
    });

    it("should return 400 for past date update", async () => {
      const res = await request(app).put(`/events/${testEventId}`).send({
        event_name: "Too Late",
        description: "Past",
        location: "Here",
        urgency: "medium",
        event_date: "2000-01-01",
        skills: []
      });
      expect(res.status).to.equal(400);
    });

    it("should return 500 if db fails on update", async () => {
      db.query = async () => { throw new Error("Fake DB error"); };
      const res = await request(app).put(`/events/${testEventId}`).send({
        event_name: "Fail",
        description: "Fail",
        location: "Fail",
        urgency: "low",
        event_date: formattedFutureDate,
        skills: []
      });
      expect(res.status).to.equal(500);
      db.query = originalQuery;
    });

    it("should delete the event", async () => {
      const res = await request(app).delete(`/events/${testEventId}`);
      expect(res.status).to.equal(200);
    });

    it("should return 500 for invalid ID on delete", async () => {
      const res = await request(app).delete("/events/invalid");
      expect(res.status).to.equal(500);
    });
  });
});
