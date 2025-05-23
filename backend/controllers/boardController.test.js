const request = require('supertest');
const app = require('../app');

describe('Board Controller', () => {
  it('GET /api/boards should return boards or unauthorized', async () => {
    const res = await request(app).get('/api/boards');
    expect([200, 401]).toContain(res.statusCode);
  });
});
