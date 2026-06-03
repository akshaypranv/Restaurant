const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

// Mock db.query
jest.mock('../config/db', () => ({
  query: jest.fn()
}));

describe('GET /api/v1/health', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns 200 and healthy status when DB is connected', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ 1: 1 }] });
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.database).toBe('connected');
  });

  test('returns 500 when DB connectivity fails', async () => {
    db.query.mockRejectedValueOnce(new Error('Connection failed'));
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(500);
    expect(res.body.status).toBe('error');
    expect(res.body.database).toContain('Connection failed');
  });
});

describe('GET /api/v1/categories', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns list of categories with item counts', async () => {
    const mockCategories = [
      { id: 1, name: 'Soups', slug: 'soups', display_order: 1, page_group: 'starters', item_count: 3 },
      { id: 2, name: 'Veg Starters', slug: 'veg-starters', display_order: 2, page_group: 'starters', item_count: 11 }
    ];
    db.query.mockResolvedValueOnce({ rows: mockCategories });

    const res = await request(app).get('/api/v1/categories');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toEqual(mockCategories);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('categories'));
  });
});

describe('GET /api/v1/menu', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns all categories and items', async () => {
    const mockMenu = [
      {
        id: 1,
        category_name: 'Soups',
        category_slug: 'soups',
        category_display_order: 1,
        category_page_group: 'starters',
        item_id: 1,
        item_name: 'Sweet Corn',
        price: 150.00,
        price_alt: 190.00,
        price_label: 'VEG / CHICKEN',
        is_veg: true,
        is_available: true,
        is_popular: false,
        note: null
      }
    ];
    db.query.mockResolvedValueOnce({ rows: mockMenu });

    const res = await request(app).get('/api/v1/menu');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].slug).toBe('soups');
    expect(res.body.data[0].items[0].name).toBe('Sweet Corn');
  });

  test('filters for vegOnly if query ?veg=true is passed', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/api/v1/menu?veg=true');
    expect(res.status).toBe(200);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('is_veg = true'), expect.any(Array));
  });
});

describe('GET /api/v1/menu/:categorySlug', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns 404 for unknown category slug', async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // Category check fails
    const res = await request(app).get('/api/v1/menu/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('NOT_FOUND');
  });

  test('returns items for valid category slug', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Soups', slug: 'soups', display_order: 1, page_group: 'starters' }] }) // Category exists
      .mockResolvedValueOnce({
        rows: [
          { id: 1, name: 'Sweet Corn', price: 150.00, price_alt: 190.00, price_label: 'VEG / CHICKEN', is_veg: true, is_available: true, is_popular: false, note: null }
        ]
      }); // Items list

    const res = await request(app).get('/api/v1/menu/soups');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.name).toBe('Soups');
    expect(res.body.data.items[0].name).toBe('Sweet Corn');
  });
});

describe('GET /api/v1/search', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('SQL injection attempt returns 400', async () => {
    const res = await request(app).get("/api/v1/search?q='; DROP TABLE menu_items; --");
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });

  test('Query shorter than 2 chars returns 400', async () => {
    const res = await request(app).get('/api/v1/search?q=a');
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });

  test('Missing q param returns 400', async () => {
    const res = await request(app).get('/api/v1/search');
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });

  test('Valid query returns array of matching items', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        { id: 1, name: 'Paneer Tikka', price: 275.00, is_veg: true, is_available: true, is_popular: false, category_name: 'Veg Starters' }
      ]
    });
    const res = await request(app).get('/api/v1/search?q=paneer');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].name).toBe('Paneer Tikka');
  });

  test('Rate limiter restricts to 30 requests per minute', async () => {
    db.query.mockResolvedValue({ rows: [] });
    // Fire 30 requests
    for (let i = 0; i < 30; i++) {
      await request(app).get('/api/v1/search?q=test');
    }
    // The 31st request should be rate limited (429)
    const res = await request(app).get('/api/v1/search?q=test');
    expect(res.status).toBe(429);
  });
});
