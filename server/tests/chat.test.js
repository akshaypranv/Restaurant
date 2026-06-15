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
    });

    test('successful chat call forwards to Anthropic when API key is configured', async () => {
      // Temporarily mock API key
      const oldKey = process.env.ANTHROPIC_API_KEY;
      process.env.ANTHROPIC_API_KEY = 'real-api-key-from-testing';

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          content: [
            { text: 'Mock Claude Response' }
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
          menuContext: { test: true }
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.reply).toBe('Mock Claude Response');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'x-api-key': 'real-api-key-from-testing'
          })
        })
      );

      // Restore key
      process.env.ANTHROPIC_API_KEY = oldKey;
    });

    test('handles Anthropic API errors and returns 502', async () => {
      const oldKey = process.env.ANTHROPIC_API_KEY;
      process.env.ANTHROPIC_API_KEY = 'real-api-key-from-testing';

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
      expect(res.body.code).toBe('BAD_GATEWAY');

      process.env.ANTHROPIC_API_KEY = oldKey;
    });
  });
});
