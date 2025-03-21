// server/test/profileRoutes.test.js
import request from "supertest";
import express from "express";
import { expect } from "chai";
import profileRoutes, * as ProfileModule from "../Routes/profileRoutes.js"; // Import everything to access saveProfile

// Create a mini Express app for testing
const app = express();
app.use(express.json());
app.use("/", profileRoutes); // Mount the profileRoutes

describe("Profile Routes", () => {
  beforeEach(() => {
    // Clear the actual savedProfile before each test
    ProfileModule.saveProfile(null);
  });

  describe("POST /", () => {
    it("should create a new profile with valid data", async () => {
      const newProfile = {
        fullName: "Test User",
        address1: "123 Test St",
        city: "Test City",
        state: "TX",
        zipCode: "12345",
        skills: ["Skill 1", "Skill 2"],
        availability: ["2025-04-01", "2025-04-02"],
        preferences: "Evening shifts"
      };

      const res = await request(app).post("/").send(newProfile);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Profile saved successfully");
    });

    it("should fail with multiple invalid fields", async () => {
      const invalidProfile = {
        city: "Test City",
        state: "InvalidState",
        zipCode: "abcde",
        skills: "not an array",
        availability: ["invalid-date"]
      };

      const res = await request(app).post("/").send(invalidProfile);
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.an("object");
      expect(res.body.errors).to.have.property("fullName");
      expect(res.body.errors).to.have.property("address1");
      expect(res.body.errors).to.have.property("state");
      expect(res.body.errors).to.have.property("zipCode");
      expect(res.body.errors).to.have.property("skills");
      expect(res.body.errors).to.have.property("availability[0]");
    });

    it("should fail if preferences is not a string", async () => {
      const res = await request(app).post("/").send({
        fullName: "Test",
        address1: "123 Test St",
        city: "Test City",
        state: "TX",
        zipCode: "12345",
        skills: ["Skill A"],
        availability: ["2025-05-01"],
        preferences: { not: "a string" }
      });

      expect(res.status).to.equal(400);
      expect(res.body.errors).to.have.property("preferences");
    });
  });

  describe("GET /", () => {
    it("should return 404 if no profile is saved", async () => {
      const res = await request(app).get("/");
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "Profile not found");
    });

    it("should retrieve the saved profile", async () => {
      const newProfile = {
        fullName: "Test User",
        address1: "123 Test St",
        city: "Test City",
        state: "TX",
        zipCode: "12345",
        skills: ["Skill 1", "Skill 2"],
        availability: ["2025-04-01", "2025-04-02"],
        preferences: "Evening shifts"
      };

      await request(app).post("/").send(newProfile); // saves the profile
      const res = await request(app).get("/");
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("fullName", "Test User");
    });
  });
});
