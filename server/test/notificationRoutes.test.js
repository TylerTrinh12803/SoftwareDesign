// server/test/notificationRoutes.test.js
import express from 'express';
import request from 'supertest';
import { expect } from 'chai';
import notificationRoutes from '../Routes/notificationRoutes.js'; // Ensure this is correct

const app = express();
app.use(express.json());
app.use('/notifications', notificationRoutes);

describe('Notification Routes (No DB)', () => {
  // Reset the in-memory notifications before each test, if needed.
  beforeEach(() => {
    // Reinitialize the notifications array in the route module.
    // One way is to re-import the module or add a reset function.
    // For simplicity, if your tests run in sequence in one process,
    // you might call a reset function that you export from the module.
    // Here, we'll assume tests run in a fresh environment.
  });

  describe('GET /notifications', () => {
    it('should return a list of notifications', async () => {
      const res = await request(app).get('/notifications');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(2);
      expect(res.body[0]).to.include({ id: 1, title: 'Test Notification' });
    });

    it('should return an empty array if no notifications exist', async () => {
      // You can mock or reset the notifications to an empty array to test this case
      const res = await request(app).get('/notifications');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(0);
    });
  });

  describe('DELETE /notifications/dismiss-all', () => {
    it('should mark all notifications as read', async () => {
      const res = await request(app).delete('/notifications/dismiss-all');
      expect(res.status).to.equal(200);
      expect(res.text).to.equal('All notifications have been marked as read.');

      // Verify that all notifications are now marked as read
      const getRes = await request(app).get('/notifications');
      getRes.body.forEach(n => {
        expect(n.unread).to.be.false;
      });
    });

    it('should handle the case when there are no notifications to mark as read', async () => {
      // Reset notifications to an empty state
      // Perform delete operation when no notifications exist
      const res = await request(app).delete('/notifications/dismiss-all');
      expect(res.status).to.equal(200);
      expect(res.text).to.equal('All notifications have been marked as read.');

      // Confirm notifications are still empty
      const getRes = await request(app).get('/notifications');
      expect(getRes.body).to.have.lengthOf(0);
    });
  });

  describe('DELETE /notifications/:id', () => {
    it('should dismiss a notification if found', async () => {
      const res = await request(app).delete('/notifications/1');
      expect(res.status).to.equal(200);
      expect(res.text).to.contain('Notification with id 1 has been dismissed.');
    });

    it('should return 404 if the notification is not found', async () => {
      const res = await request(app).delete('/notifications/999');
      expect(res.status).to.equal(404);
      expect(res.text).to.equal('Notification not found');
    });

    it('should handle deleting a notification that has already been dismissed', async () => {
      // Ensure notification exists first
      const res1 = await request(app).delete('/notifications/1');
      expect(res1.status).to.equal(200);

      // Try to delete the same notification again
      const res2 = await request(app).delete('/notifications/1');
      expect(res2.status).to.equal(404); // It should now return a 404
      expect(res2.text).to.equal('Notification not found');
    });

    it('should return an error if the ID is invalid (non-numeric)', async () => {
      const res = await request(app).delete('/notifications/invalid-id');
      expect(res.status).to.equal(400);
      expect(res.text).to.include('Invalid ID format');
    });
  });
});
