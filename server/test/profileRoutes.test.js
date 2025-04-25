import { expect } from "chai";  // Importing Chai's expect
import request from "supertest";
import express from "express";
import profileRoutes from "../Routes/profileRoutes.js";  // Adjust path to your profile routes

let mockProfile = null; // In-memory storage for mock data

// Setting up express app with profile routes
const app = express();
app.use(express.json());
app.use("/", profileRoutes); // Mount the actual profileRoutes.js

describe("Profile Routes", () => {
  beforeEach(() => {
    mockProfile = null;  // Reset mock profile before each test
  });

  describe("POST /", () => {
    it("should create a new profile with valid data", async () => {
      const res = await request(app).post("/").send({
        userID: 1,
        fullName: "Test User",
        address1: "123 Test St",
        city: "Test City",
        state: "TX",
        zipCode: "12345",
        skills: ["Skill 1", "Skill 2"],
        availability: ["Monday", "Tuesday"],
        preferences: "Evening shifts"
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Profile saved successfully");
    });

    it("should fail with multiple invalid fields", async () => {
      const res = await request(app).post("/").send({
        city: "Test City",
        state: "InvalidState",
        zipCode: "abcde",
        skills: "not an array",
        availability: ["invalid-day"]
      });
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.have.property("userID");
      expect(res.body.errors).to.have.property("fullName");
      expect(res.body.errors).to.have.property("address1");
      expect(res.body.errors).to.have.property("city");
      expect(res.body.errors).to.have.property("state");
      expect(res.body.errors).to.have.property("zipCode");
      expect(res.body.errors).to.have.property("skills");
      expect(res.body.errors).to.have.property("availability[0]");
    });

    it("should fail if preferences is not a string", async () => {
      const res = await request(app).post("/").send({
        userID: 1,
        fullName: "Test",
        address1: "123 Test St",
        city: "City",
        state: "TX",
        zipCode: "12345",
        skills: ["Skill A"],
        availability: ["Monday"],
        preferences: { obj: true }  // Invalid preferences
      });
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.have.property("preferences");
    });

    it("should fail if address2 is not a string", async () => {
      const res = await request(app).post("/").send({
        userID: 1,
        fullName: "Test",
        address1: "123 Test St",
        address2: {},  // Invalid address2 type
        city: "City",
        state: "TX",
        zipCode: "12345",
        skills: ["Skill A"],
        availability: ["Monday"],
        preferences: "Anything"
      });
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.have.property("address2");
    });

    it("should fail if availability contains invalid day names", async () => {
      const res = await request(app).post("/").send({
        userID: 1,
        fullName: "Test",
        address1: "123 Test St",
        city: "City",
        state: "TX",
        zipCode: "12345",
        skills: ["Skill A"],
        availability: ["Moonday"],  // Invalid day
        preferences: "Evening shifts"
      });
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.have.property("availability[0]");
    });

    it("should handle when state is missing or invalid", async () => {
      const res = await request(app).post("/").send({
        userID: 1,
        fullName: "Test",
        address1: "123 Test St",
        city: "City",
        state: "ZZ", // Invalid state
        zipCode: "12345",
        skills: ["Skill A"],
        availability: ["Monday"],
        preferences: "Any"
      });
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.have.property("state");
    });

    it("should fail if userID is not a number", async () => {
      const res = await request(app).post("/").send({
        userID: "not-a-number",
        fullName: "Test User",
        address1: "123 Test St",
        city: "Test City",
        state: "TX",
        zipCode: "12345",
        skills: ["Skill 1"],
        availability: ["Monday"]
      });
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.have.property("userID");
    });
  });

  describe("GET /", () => {
    it("should return 400 if userID is missing or invalid", async () => {
      const res = await request(app).get("/?userID=abc");
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "userID is required and must be a number.");
    });

    it("should return 404 if no profile is saved", async () => {
      const res = await request(app).get("/?userID=1");
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "Profile not found");
    });

    it("should retrieve the saved profile", async () => {
      const newProfile = {
        userID: 1,
        fullName: "Test User",
        address1: "123 Test St",
        city: "Test City",
        state: "TX",
        zipCode: "12345",
        skills: ["Skill 1"],
        availability: ["Monday"],
        preferences: "Evening shifts"
      };

      await request(app).post("/").send(newProfile);
      const res = await request(app).get("/?userID=1");
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("fullName", "Test User");
    });
  });
});