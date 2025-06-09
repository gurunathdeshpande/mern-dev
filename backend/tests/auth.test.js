const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const mongoose = require('mongoose');

beforeAll(async () => {
  const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        role: 'student',
        firstName: 'Test',
        lastName: 'User',
        studentId: '12345678',
        academicYear: 1
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('username', 'testuser');
  });

  it('should login existing user', async () => {
    // First create a user
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        role: 'student',
        firstName: 'Test',
        lastName: 'User',
        studentId: '12345678',
        academicYear: 1
      });

    // Then try to login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'test@test.com');
  });
}); 