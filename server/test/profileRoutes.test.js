// server/test/profileRoutes.test.js
import request from "supertest";
import express from "express";
import { expect } from "chai";
import profileRoutes, { savedProfile, saveProfile } from "../Routes/profileRoutes.js"; // Import saveProfile


// Create a mini Express app for testing
const app = express();
app.use(express.json());
app.use("/", profileRoutes); // Mount the profileRoutes

describe("Profile Routes", () => {
    describe("POST /", () => {
        it("should create a new profile with valid data", async () => {
            const newProfile = {
                fullName: "Test User",
                address1: "123 Test St",
                city: "Test City",
                state: "TX",
                zipCode: "12345",
                skills: ["Skill 1", "Skill 2"],
                availability: ["2025-04-01", "2025-04-02"]
            };

            const res = await request(app)
                .post("/")
                .send(newProfile);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("message", "Profile saved successfully");
        });

        it("should fail with invalid data", async () => {
            const invalidProfile = {
                // Missing required fields
                city: "Test City",
                state: "Invalid State", // Invalid state
                zipCode: "12345",
                skills: "not an array", // Invalid skills format
                availability: ["invalid date"] // Invalid date format
            };

            const res = await request(app)
                .post("/")
                .send(invalidProfile);

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property("errors");
            expect(res.body.errors).to.be.an("object");
            // Add more specific checks for the error messages if needed
        });
    });

    describe("GET /", () => {
        let savedProfile; // Re-declare savedProfile with let
        
        beforeEach(() => {
            savedProfile = {}; // Reset savedProfile to an empty object before each test
        });

        it("should retrieve the saved profile", async () => {
            // First, create a profile
            const newProfile = {
                fullName: "Test User",
                address1: "123 Test St",
                city: "Test City",
                state: "TX",
                zipCode: "12345",
                skills: ["Skill 1", "Skill 2"],
                availability: ["2025-04-01", "2025-04-02"]
            };
            await request(app)
                .post("/")
                .send(newProfile);

            // Save the profile using the imported saveProfile function
            saveProfile(newProfile);

            // Now, get the profile
            const res = await request(app).get("/");
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("fullName", "Test User");
            // Add more checks for other profile properties if needed
        });

        it("should return 404 if no profile is saved", async () => {
            // Assuming no profile is saved initially (or you can clear savedProfile)
            const res = await request(app).get("/");
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property("message", "Profile not found");
        });
    });
});