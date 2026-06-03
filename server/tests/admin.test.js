// Ensure JWT_SECRET is set for tests before loading config
process.env.JWT_SECRET = 'mock_jwt_secret_must_be_at_least_32_chars_long';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('../app');
const db = require('../config/db');
const syncMenuJson = require('../utils/syncMenuJson');

// Mock db.query and syncMenuJson
jest.mock('../config/db', () => ({
  query: jest.fn()
}));
jest.mock('../utils/syncMenuJson', () => jest.fn().mockResolvedValue(true));

describe('Admin Authentication and Authorization', () => {
  let adminToken;
  const adminEmail = 'admin@silvertip.com';
  const password = 'password123';
  let passwordHash;

  beforeAll(() => {
    passwordHash = bcrypt.hashSync(password, 10);
    adminToken = jwt.sign({ id: 1, email: adminEmail }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/admin/auth/login', () => {
    test('successful login returns a signed JWT', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, email: adminEmail, password_hash: passwordHash }]
      });

      const res = await request(app)
        .post('/api/v1/admin/auth/login')
        .send({ email: adminEmail, password });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.email).toBe(adminEmail);
    });

    test('invalid credentials return 401', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // User not found

      const res = await request(app)
        .post('/api/v1/admin/auth/login')
        .send({ email: 'nonexistent@silvertip.com', password });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
    });

    test('incorrect password returns 401', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, email: adminEmail, password_hash: passwordHash }]
      });

      const res = await request(app)
        .post('/api/v1/admin/auth/login')
        .send({ email: adminEmail, password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
    });

    test('invalid input format returns 400 validation error', async () => {
      const res = await request(app)
        .post('/api/v1/admin/auth/login')
        .send({ email: 'invalid-email', password: '123' }); // short password, bad email

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Protected Routes access restriction', () => {
    test('GET /api/v1/admin/menu without token returns 401', async () => {
      const res = await request(app).get('/api/v1/admin/menu');
      expect(res.status).toBe(401);
    });

    test('GET /api/v1/admin/menu with invalid token returns 401', async () => {
      const res = await request(app)
        .get('/api/v1/admin/menu')
        .set('Authorization', 'Bearer invalid_token');
      expect(res.status).toBe(401);
    });
  });

  describe('Admin CRUD Operations (JWT Protected)', () => {
    test('GET /api/v1/admin/menu returns all menu items', async () => {
      const mockItems = [
        { id: 1, name: 'French Fries', price: '190.00', is_available: true, category_name: 'Veg Starters' },
        { id: 2, name: 'Chicken Fingers', price: '250.00', is_available: false, category_name: 'Non-Veg Starters' }
      ];
      db.query.mockResolvedValueOnce({ rows: mockItems });

      const res = await request(app)
        .get('/api/v1/admin/menu')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].price).toBe(190.00);
      expect(res.body.data[1].is_available).toBe(false); // returned inactive ones too
    });

    test('POST /api/v1/admin/menu creates an item, escapes HTML inputs, and triggers sync', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Category validation passes
        .mockResolvedValueOnce({
          rows: [{ id: 10, name: '&lt;script&gt;alert(1)&lt;/script&gt;', price: 150.00, is_veg: true }]
        }); // Insert result

      const res = await request(app)
        .post('/api/v1/admin/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          category_id: 1,
          name: '<script>alert(1)</script>',
          price: 150,
          is_veg: true,
          is_available: true
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.name).toBe('&lt;script&gt;alert(1)&lt;/script&gt;'); // Sanitised/Escaped
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO menu_items'),
        expect.arrayContaining(['&lt;script&gt;alert(1)&lt;/script&gt;'])
      );
      expect(syncMenuJson).toHaveBeenCalled();
    });

    test('PUT /api/v1/admin/menu/:id updates an item and triggers sync', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Item check passes
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Category check passes
        .mockResolvedValueOnce({
          rows: [{ id: 1, name: 'French Fries Extra', price: 210.00, is_veg: true }]
        }); // Update result

      const res = await request(app)
        .put('/api/v1/admin/menu/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          category_id: 1,
          name: 'French Fries Extra',
          price: 210,
          is_veg: true
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE menu_items'),
        expect.any(Array)
      );
      expect(syncMenuJson).toHaveBeenCalled();
    });

    test('DELETE /api/v1/admin/menu/:id soft-deletes the item (sets is_available = false) and syncs', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Item check passes
        .mockResolvedValueOnce({
          rows: [{ id: 1, name: 'French Fries', is_available: false }]
        }); // Soft-delete result

      const res = await request(app)
        .delete('/api/v1/admin/menu/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      
      // Ensure no DELETE statement was called, only UPDATE
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE menu_items SET is_available = false'),
        [1]
      );
      expect(db.query).not.toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM menu_items'),
        expect.any(Array)
      );
      expect(syncMenuJson).toHaveBeenCalled();
    });
  });
});
