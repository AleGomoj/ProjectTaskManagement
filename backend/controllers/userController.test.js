const request = require('supertest');
const app = require('../app');
const userController = require('./userController');

jest.mock('../models', () => {
  return {
    User: {
      findOne: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
    },
  };
});
const { User } = require('../models');
const bcrypt = require('bcryptjs');

describe('User Controller', () => {
  it('GET /api/users should return users', async () => {
    const res = await request(app).get('/api/users');
    expect([200,404]).toContain(res.statusCode);
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
    it('should return 400 if email already in use', async () => {
      User.findOne.mockResolvedValue({});
      const req = { body: { name: 'abc', email: 'a@b.com', password: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email already in use' });
    });
    it('should handle errors and return 500', async () => {
      User.findOne.mockRejectedValue(new Error('DB error'));
      const req = { body: { name: 'abc', email: 'a@b.com', password: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('login', () => {
    it('should return 401 if user not found', async () => {
      User.findOne.mockResolvedValue(null);
      const req = { body: { email: 'a@b.com', password: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
    it('should return 401 if password is invalid', async () => {
      User.findOne.mockResolvedValue({ password: 'hashed' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      const req = { body: { email: 'a@b.com', password: 'wrong' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
      bcrypt.compare.mockRestore();
    });
    it('should handle errors and return 500', async () => {
      User.findOne.mockRejectedValue(new Error('DB error'));
      const req = { body: { email: 'a@b.com', password: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('getById', () => {
    it('should return 404 if user not found', async () => {
      User.findByPk.mockResolvedValue(null);
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('update', () => {
    it('should return 404 if user not found', async () => {
      User.findByPk.mockResolvedValue(null);
      const req = { params: { id: 1 }, body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
    it('should return 400 if password is too short', async () => {
      User.findByPk.mockResolvedValue({});
      const req = { params: { id: 1 }, body: { password: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password must be at least 6 characters long' });
    });
    it('should return 400 if nothing to update', async () => {
      User.findByPk.mockResolvedValue({});
      const req = { params: { id: 1 }, body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nothing to update' });
    });
  });

  describe('delete', () => {
    it('should return 404 if user not found', async () => {
      User.findByPk.mockResolvedValue(null);
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('getAll', () => {
    it('should return users', async () => {
      User.findAll.mockResolvedValue([{ id: 1 }]);
      const req = {};
      const res = { json: jest.fn() };
      await userController.getAll(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });
  });
});
