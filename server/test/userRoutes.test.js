import express from "express";
import request from "supertest";
import { expect } from "chai";
import userRoutes from "../Routes/userRoutes.js";
import db from "../config/db.js";

const app = express();
app.use(express.json());
app.use("/", userRoutes);

describe("User Routes Integration", () => {
  let testUserId;
  const testEmail = `testuser${Date.now()}@example.com`;
  const testPassword = "Test1234";

  before(async () => {
    // Insert a test user into the database.
    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [testEmail]);
    if (existingUsers.length === 0) {
      const [result] = await db.query(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [testEmail, testPassword, "user"]
      );
      testUserId = result.insertId;
    } else {
      testUserId = existingUsers[0].user_id;
    }
  });

  describe("GET /users", () => {
    it("should return a list of users", async () => {
      const res = await request(app).get("/users");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body.some(user => user.email === testEmail)).to.be.true;
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete the test user", async () => {
      const res = await request(app).delete(`/users/${testUserId}`);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("User deleted successfully");

      // Confirm deletion from DB.
      const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [testUserId]);
      expect(rows.length).to.equal(0);
    });

    it("should return 200 even if the user does not exist (idempotent)", async () => {
      const res = await request(app).delete("/users/999999");
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("User deleted successfully");
    });
  });

  describe("Error Handling (Trigger catch blocks)", () => {
    let originalQuery;
    before(() => {
      // Save original db.query method.
      originalQuery = db.query;
    });
    after(() => {
      // Restore original method.
      db.query = originalQuery;
    });

    it("should return 500 if DB fails on GET /users", async () => {
      // Manually override db.query to simulate a DB failure.
      db.query = async () => { throw new Error("Simulated DB error"); };
      const res = await request(app).get("/users");
      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Database error");
      // Restore after test.
      db.query = originalQuery;
    });

    it("should return 500 if DB fails on DELETE /users/:id", async () => {
      // Override db.query to simulate failure.
      db.query = async () => { throw new Error("Simulated DB error"); };
      const res = await request(app).delete("/users/1");
      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Failed to delete user");
      db.query = originalQuery;
    });
  });

  // Optional cleanup – remove test user if it wasn't deleted already.
  after(async () => {
    await db.query("DELETE FROM users WHERE email = ?", [testEmail]);
    // Do not call db.end() here; manage connection closure globally.
  });
});
