// server/test/userRoutes.test.js
import express from 'express';
import request from 'supertest';
import { expect } from 'chai';
import userRoutes from '../Routes/userRoutes.js';

// Create a mini Express app for testing
const app = express();
app.use(express.json());
// Mount your user routes at the root ("/")
app.use('/', userRoutes);

describe('User Routes', () => {
  describe('GET /users', () => {
    it('should return all users with user_id, email, and role', async () => {
      const res = await request(app).get('/users');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      // We initially have 3 users in our dummy data
      expect(res.body.length).to.equal(3);

      // Check for the seeded admin user
      const adminUser = res.body.find((user) => user.email === 'admin@example.com');
      expect(adminUser).to.exist;
      expect(adminUser).to.have.property('user_id');
      expect(adminUser).to.have.property('email', 'admin@example.com');
      expect(adminUser).to.have.property('role', 'admin');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete an existing user and return a success message', async () => {
      // Delete the user with user_id 2
      const deleteRes = await request(app).delete('/users/2');
      expect(deleteRes.status).to.equal(200);
      expect(deleteRes.body).to.have.property('message', 'User deleted successfully');

      // Verify the user has been removed
      const getRes = await request(app).get('/users');
      expect(getRes.status).to.equal(200);
      // After deletion, there should be 2 users left
      expect(getRes.body.length).to.equal(2);
      const deletedUser = getRes.body.find((user) => user.user_id === 2);
      expect(deletedUser).to.be.undefined;
    });

    it('should return 404 when trying to delete a non-existent user', async () => {
      const res = await request(app).delete('/users/999');
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'User not found');
    });
  });
});
