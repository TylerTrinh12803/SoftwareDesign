import express from 'express';
import request from 'supertest';
import { expect } from 'chai';
import authRoutes from '../Routes/authRoutes.js';

const app = express();
app.use(express.json());
app.use('/', authRoutes);

describe('Auth Routes', () => {
  describe('POST /login', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/login')
        .send({ password: 'somepass' });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Please provide email and password.');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: 'admin@example.com' });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Please provide email and password.');
    });

    it('should return 401 if user is not found', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: 'nonexistent@example.com', password: 'whatever' });
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'User not found');
    });

    it('should return 401 if password is incorrect', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: 'admin@example.com', password: 'wrongpass' });
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Incorrect password');
    });

    it('should return 200 if login is successful', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: 'admin@example.com', password: 'adminpass' });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token', 'dummy-token');
      expect(res.body).to.have.property('role', 'admin');
      expect(res.body).to.have.property('email', 'admin@example.com');
    });
  });

  describe('POST /register', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/register')
        .send({ password: 'test123', role: 'user' });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Email and password are required.');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/register')
        .send({ email: 'newuser@example.com', role: 'user' });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Email and password are required.');
    });

    it('should return 400 if user already exists', async () => {
      // Since the admin is already seeded, trying to register with that email should fail.
      const res = await request(app)
        .post('/register')
        .send({ email: 'admin@example.com', password: 'adminpass', role: 'admin' });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'User already exists');
    });

    it('should register a new user successfully', async () => {
      // Create a unique email to avoid collision with existing users
      const uniqueEmail = `user${Date.now()}@example.com`;
      const res = await request(app)
        .post('/register')
        .send({ email: uniqueEmail, password: 'test123', role: 'user' });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User registered successfully');
      expect(res.body).to.have.property('userId');
      expect(res.body).to.have.property('role', 'user');
      expect(res.body).to.have.property('email', uniqueEmail);
    });
  });
});
