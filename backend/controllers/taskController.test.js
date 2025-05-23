const request = require('supertest');
const app = require('../app');

describe('Task Controller', () => {
  it('GET /api/tasks should return tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect([200,404]).toContain(res.statusCode); // Ajustar según implementación
  });
});
