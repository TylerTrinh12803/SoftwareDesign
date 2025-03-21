import express from 'express';
import request from 'supertest';
import { expect } from 'chai';
import authRoutes from '../Routes/authRoutes.js';
import db from '../config/db.js';

const app = express();
app.use(express.json());
app.use('/', authRoutes);

// Utility to clean up test users
const deleteTestUser = async (email) => {
  await db.query('DELETE FROM users WHERE email = ?', [email]);
};

describe('Auth Routes (Integration)', () => {
  const testEmail = `user${Date.now()}@test.com`;
  const testPassword = 'TestPassword123';

  describe('POST /register', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/register')
        .send({ password: '123456', role: 'user' });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Email and password are required.');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/register')
        .send({ email: 'no-pass@test.com', role: 'user' });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Email and password are required.');
    });

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/register')
        .send({ email: testEmail, password: testPassword, role: 'user' });

      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('User registered successfully');
      expect(res.body).to.include.keys('userId', 'role', 'email');
      expect(res.body.email).to.equal(testEmail);
    });

    it('should return 400 if user already exists', async () => {
      const res = await request(app)
        .post('/register')
        .send({ email: testEmail, password: testPassword, role: 'user' });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('User already exists');
    });
  });

  describe('POST /login', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/login')
        .send({ password: testPassword });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Please provide email and password.');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: testEmail });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Please provide email and password.');
    });

    it('should return 401 if user not found', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: 'nonexistent@test.com', password: 'irrelevant' });

      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('User not found');
    });

    it('should return 401 if password is incorrect', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: testEmail, password: 'WrongPassword' });

      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Incorrect password');
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: testEmail, password: testPassword });

      expect(res.status).to.equal(200);
      expect(res.body).to.include.keys('token', 'userId', 'role', 'email');
      expect(res.body.email).to.equal(testEmail);
    });
  });

  // Cleanup test user after all tests
  after(async () => {
    await deleteTestUser(testEmail);
  });
});

