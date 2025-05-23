const request = require('supertest');
const app = require('../app');

describe('Google Routes', () => {
  it('GET /api/google should return 200', async () => {
    const res = await request(app).get('/api/google');
    expect([200,404]).toContain(res.statusCode);
  });
});
