const request = require('supertest');
const app = require('../app');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Ensure JWT_SECRET is set for tests
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'mock_jwt_secret_must_be_at_least_32_chars_long';
}

jest.mock('../config/db', () => ({
  query: jest.fn()
}));

describe('Contact Submission API', () => {
  let adminToken;
  const adminEmail = 'admin@silvertip.com';

  beforeAll(() => {
    adminToken = jwt.sign({ id: 1, email: adminEmail }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/contact', () => {
    test('successful contact submission returns 201', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Reservation', message: 'Hello', read: false }]
      });

      const res = await request(app)
        .post('/api/v1/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Reservation',
          message: 'Hello'
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.name).toBe('John Doe');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO contact_submissions'),
        expect.arrayContaining(['John Doe', 'john@example.com', 'Reservation', 'Hello'])
      );
    });

    test('invalid email validation error returns 400', async () => {
      const res = await request(app)
        .post('/api/v1/contact')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          subject: 'Reservation',
          message: 'Hello'
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });

    test('invalid subject validation error returns 400', async () => {
      const res = await request(app)
        .post('/api/v1/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'InvalidSubjectType',
          message: 'Hello'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/contact (Admin-protected)', () => {
    test('unauthorized request returns 401', async () => {
      const res = await request(app).get('/api/v1/contact');
      expect(res.status).toBe(401);
    });

    test('authorized request returns list of submissions', async () => {
      const mockSubmissions = [
        { id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Reservation', message: 'Hello', read: false }
      ];
      db.query.mockResolvedValueOnce({ rows: mockSubmissions });

      const res = await request(app)
        .get('/api/v1/contact')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockSubmissions);
    });
  });

  describe('PUT /api/v1/contact/:id/read (Admin-protected)', () => {
    test('unauthorized request returns 401', async () => {
      const res = await request(app).put('/api/v1/contact/1/read');
      expect(res.status).toBe(401);
    });

    test('marks submission as read and returns 200', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Reservation', message: 'Hello', read: true }]
      });

      const res = await request(app)
        .put('/api/v1/contact/1/read')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.read).toBe(true);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE contact_submissions'),
        [1]
      );
    });
  });
});
