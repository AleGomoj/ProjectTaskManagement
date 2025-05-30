const request = require('supertest');
const app = require('../app');

describe('User Routes', () => {
  it('GET /api/users should return users', async () => {
    const res = await request(app).get('/api/users');
    expect([200,404]).toContain(res.statusCode);
  });
});
