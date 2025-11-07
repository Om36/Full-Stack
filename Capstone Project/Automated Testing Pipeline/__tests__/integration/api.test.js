const request = require('supertest');
const express = require('express');
const { connect, closeDatabase, clearDatabase } = require('../utils/dbHelper');

// Mock app setup
const app = express();
app.use(express.json());

// Sample routes for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.post('/api/users', (req, res) => {
  const { email, username } = req.body;
  
  if (!email || !username) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  res.status(201).json({
    id: '123',
    email,
    username,
    createdAt: new Date()
  });
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    email: 'test@example.com',
    username: 'testuser'
  });
});

describe('API Integration Tests', () => {
  beforeAll(async () => {
    await connect();
  });
  
  afterAll(async () => {
    await closeDatabase();
  });
  
  beforeEach(async () => {
    await clearDatabase();
  });
  
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
  
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        username: 'newuser'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body.username).toBe(userData.username);
    });
    
    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com' })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
      const userId = '123';
      
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('username');
    });
  });
});
