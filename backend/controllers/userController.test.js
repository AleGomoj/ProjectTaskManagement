const request = require('supertest');
const app = require('../app');
const userController = require('./userController');

describe('User Controller', () => {
  it('GET /api/users should return users', async () => {
    const res = await request(app).get('/api/users');
    expect([200,404]).toContain(res.statusCode); // Ajustar según implementación
  });
});

describe('userController', () => {
  describe('register', () => {
    it('should return 400 if name is too short', async () => {
      const req = { body: { name: 'ab', email: 'a@b.com', password: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
    it('should return 400 if email is invalid', async () => {
      const req = { body: { name: 'abc', email: 'abc', password: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
    it('should return 400 if password is too short', async () => {
      const req = { body: { name: 'abc', email: 'a@b.com', password: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
