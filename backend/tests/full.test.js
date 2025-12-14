const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Sweet = require('../models/Sweet');
const Order = require('../models/Order');

let adminToken;
let userToken;
let sweetId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  await User.deleteMany({});
  await Sweet.deleteMany({});
  await Order.deleteMany({});

  // Setup Admin
  await request(app).post('/api/auth/register').send({
    name: 'Super Admin',
    email: 'admin@sweetshop.com',
    password: 'admin123'
  });
  const adminLogin = await request(app).post('/api/auth/login').send({
    email: 'admin@sweetshop.com',
    password: 'admin123'
  });
  adminToken = adminLogin.body.token;
}, 30000);

afterAll(async () => {
  await mongoose.connection.close();
  if (app.close) app.close();
});

describe('Full System Flow (TDD)', () => {

  // --- AUTHENTICATION ---
  test('Auth: Register a new Customer', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Customer',
      email: 'customer@test.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(201);
    userToken = res.body.token;
  });

  test('Auth: Login as Customer', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'customer@test.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(200);
  });

  // --- SWEET MANAGEMENT ---
  test('Sweets: Admin creates a new Sweet', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Integration Test Choco',
        description: 'Created by TDD',
        category: 'Chocolates',
        price: 15.00,
        quantity: 10,
        image: 'http://example.com/choco.jpg'
      });
    expect(res.statusCode).toBe(201);
    sweetId = res.body._id;
  });

  test('Sweets: Public can view sweets', async () => {
    const res = await request(app).get('/api/sweets');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // [NEW] Search Test
  test('Sweets: Search functionality', async () => {
    const res = await request(app).get('/api/sweets/search?search=Integration');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toContain('Integration');
  });

  // [NEW] Update Test
  test('Sweets: Admin updates price', async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 25.00 });
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(25.00);
  });

  // --- PURCHASING FLOW ---
  test('Inventory: Customer purchases a sweet', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });

  test('Inventory: Admin restocks the sweet', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 20 });
    expect(res.statusCode).toBe(200);
  });

  // --- ORDERS ---
  test('Orders: Customer places a full order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        items: [{ sweetId: sweetId, quantity: 1, pricePerUnit: 25.00 }],
        totalPrice: 25.00
      });
    expect(res.statusCode).toBe(201);
  });

  test('Orders: Customer views history', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  // [NEW] Delete Test (Must be last)
  test('Sweets: Admin deletes the sweet', async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});