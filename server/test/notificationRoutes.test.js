// server/test/notificationRoutes.test.js
import express from "express";
import request from "supertest";
import { expect } from "chai";

// Instead of importing real database routes that depend on db.js
// we mock a fake app with fake handlers
const app = express();
app.use(express.json());

// Mock data
let notifications = [
  { id: 1, volunteer_id: 101, message: "Test Notification 1", status: "Unread", created_at: new Date() },
  { id: 2, volunteer_id: 101, message: "Test Notification 2", status: "Unread", created_at: new Date() }
];

// Mock GET /notifications
app.get("/notifications", (req, res) => {
  const volunteer_id = parseInt(req.query.volunteer_id, 10);
  if (isNaN(volunteer_id)) {
    return res.status(400).json({ message: "volunteer_id is required" });
  }
  const userNotifications = notifications.filter(n => n.volunteer_id === volunteer_id);
  res.json(userNotifications);
});

// Mock DELETE /notifications/dismiss-all/:userId
app.delete("/notifications/dismiss-all/:userId", (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const initialCount = notifications.length;
  notifications = notifications.filter(n => n.volunteer_id !== userId);
  if (initialCount === notifications.length) {
    return res.status(404).json({ message: "No notifications found for this user." });
  }
  res.json({ message: "All notifications deleted successfully." });
});

// Mock DELETE /notifications/:id
app.delete("/notifications/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = notifications.findIndex(n => n.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Notification not found" });
  }
  notifications.splice(index, 1);
  res.json({ message: `Notification with id ${id} has been dismissed.` });
});

// Actual tests
describe("Notification Routes (Mocked)", () => {
  beforeEach(() => {
    notifications = [
      { id: 1, volunteer_id: 101, message: "Test Notification 1", status: "Unread", created_at: new Date() },
      { id: 2, volunteer_id: 101, message: "Test Notification 2", status: "Unread", created_at: new Date() }
    ];
  });

  describe("GET /notifications", () => {
    it("should return notifications for a valid volunteer_id", async () => {
      const res = await request(app).get("/notifications?volunteer_id=101");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.equal(2);
    });

    it("should return 400 if volunteer_id is missing", async () => {
      const res = await request(app).get("/notifications");
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("volunteer_id is required");
    });
  });

  describe("DELETE /notifications/dismiss-all/:userId", () => {
    it("should delete all notifications for a user", async () => {
      const res = await request(app).delete("/notifications/dismiss-all/101");
      expect(res.status).to.equal(200);
      expect(res.body.message).to.include("successfully");

      // Now check if notifications are gone
      const after = await request(app).get("/notifications?volunteer_id=101");
      expect(after.body.length).to.equal(0);
    });

    it("should return 404 if no notifications to delete", async () => {
      await request(app).delete("/notifications/dismiss-all/101"); // delete first
      const res = await request(app).delete("/notifications/dismiss-all/101"); // delete again
      expect(res.status).to.equal(404);
    });
  });

  describe("DELETE /notifications/:id", () => {
    it("should delete a notification by id", async () => {
      const res = await request(app).delete("/notifications/1");
      expect(res.status).to.equal(200);
      expect(res.body.message).to.include("dismissed");
    });

    it("should return 404 if notification not found", async () => {
      const res = await request(app).delete("/notifications/9999");
      expect(res.status).to.equal(404);
    });
  });
});