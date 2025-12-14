const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Sweet = require('../models/Sweet');
const User = require('../models/User');

// Setup for Test DB
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await Sweet.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Sweet Shop API', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    // Create Admin
    await request(app).post('/api/auth/register').send({
      name: 'Admin', email: 'admin@sweetshop.com', password: 'password'
    });
    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@sweetshop.com', password: 'password'
    });
    adminToken = adminLogin.body.token;

    // Create User
    const userReg = await request(app).post('/api/auth/register').send({
      name: 'User', email: 'user@test.com', password: 'password'
    });
    userToken = userReg.body.token;
  });

  // Test 1: GET /api/sweets
  it('should retrieve all sweets', async () => {
    await Sweet.create({ 
      name: 'Test Choco', category: 'Chocolates', price: 10, quantity: 5 
    });
    
    const res = await request(app).get('/api/sweets');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Test Choco');
  });

  // Test 2: POST /api/sweets (Protected)
  it('should allow admin to create a sweet', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New Sweet',
        category: 'Cakes',
        price: 20,
        quantity: 10
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('New Sweet');
  });

  // Test 3: Purchase (Stock Reduction)
  it('should decrease stock when purchased', async () => {
    const sweet = await Sweet.create({ 
      name: 'Buy Me', category: 'Chocolates', price: 10, quantity: 5 
    });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(4); // 5 - 1
  });
});