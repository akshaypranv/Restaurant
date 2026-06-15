const request = require('supertest');
const app = require('../app');

describe('ChatBot API Proxy', () => {
  let originalFetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/v1/chat', () => {
    test('missing or invalid messages returns 400', async () => {
      const res = await request(app)
        .post('/api/v1/chat')
        .send({ messages: [] });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });

    test('successful chat call returns mock response when API key is missing', async () => {
      const oldKey = process.env.GROQ_API_KEY;
      delete process.env.GROQ_API_KEY;

      const res = await request(app)
        .post('/api/v1/chat')
        .send({
          messages: [
            { role: 'user', content: 'hello' }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.reply).toContain('Brewed');

      if (oldKey) {
        process.env.GROQ_API_KEY = oldKey;
      }
    });

    test('successful chat call forwards to Groq when API key is configured', async () => {
      // Temporarily mock API key
      const oldKey = process.env.GROQ_API_KEY;
      process.env.GROQ_API_KEY = 'real-api-key-from-testing';

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          choices: [
            { message: { content: 'Mock Groq Response' } }
          ]
        })
      };
      global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

      const res = await request(app)
        .post('/api/v1/chat')
        .send({
          messages: [
            { role: 'user', content: 'hello' }
          ],
          menuContext: [{ name: 'Veg Pizza', price: 250 }]
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.reply).toBe('Mock Groq Response');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.groq.com/openai/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer real-api-key-from-testing'
          })
        })
      );

      // Restore key
      process.env.GROQ_API_KEY = oldKey;
    });

    test('handles Groq API errors and returns 502', async () => {
      const oldKey = process.env.GROQ_API_KEY;
      process.env.GROQ_API_KEY = 'real-api-key-from-testing';

      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: { message: 'Some API error' }
        })
      };
      global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

      const res = await request(app)
        .post('/api/v1/chat')
        .send({
          messages: [
            { role: 'user', content: 'hello' }
          ]
        });

      expect(res.status).toBe(502);
      expect(res.body.status).toBe('error');

      process.env.GROQ_API_KEY = oldKey;
    });
  });
});
