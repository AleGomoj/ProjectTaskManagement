const request = require('supertest');
const app = require('../app');
const taskController = require('./taskController');

jest.mock('../models', () => {
  return {
    Task: {
      findOne: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
    Board: {},
    sequelize: {
      query: jest.fn(),
    },
  };
});

const { Task, sequelize } = require('../models');

describe('Task Controller', () => {
  it('GET /api/tasks should return tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect([200,404]).toContain(res.statusCode); 
  });
});

describe('taskController', () => {
  describe('createTask', () => {
    it('should return 400 if title is missing', async () => {
      const req = { params: { boardId: 1 }, body: {}, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.createTask(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task title is required' });
    });
    it('should handle errors and return 500', async () => {
      Task.findOne.mockRejectedValue(new Error('DB error'));
      const req = { params: { boardId: 1 }, body: { title: 'T' }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.createTask(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('getTasks', () => {
    it('should return 404 if user not in board', async () => {
      sequelize.query.mockResolvedValue([[]]);
      const req = { params: { boardId: 1 }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.getTasks(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Board not found or access denied' });
    });
    it('should handle errors and return 500', async () => {
      sequelize.query.mockRejectedValue(new Error('DB error'));
      const req = { params: { boardId: 1 }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.getTasks(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('updateTask', () => {
    it('should return 404 if user not in board', async () => {
      sequelize.query.mockResolvedValue([[]]);
      const req = { params: { boardId: 1, taskId: 1 }, body: {}, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.updateTask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Board not found or access denied' });
    });
    it('should return 404 if task not found', async () => {
      sequelize.query.mockResolvedValue([[{ id: 1 }]]);
      Task.findOne.mockResolvedValue(null);
      const req = { params: { boardId: 1, taskId: 1 }, body: {}, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.updateTask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
    it('should handle errors and return 500', async () => {
      sequelize.query.mockRejectedValue(new Error('DB error'));
      const req = { params: { boardId: 1, taskId: 1 }, body: {}, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.updateTask(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('deleteTask', () => {
    it('should return 404 if user not in board', async () => {
      sequelize.query.mockResolvedValue([[]]);
      const req = { params: { boardId: 1, taskId: 1 }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.deleteTask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Board not found or access denied' });
    });
    it('should return 404 if task not found', async () => {
      sequelize.query.mockResolvedValue([[{ id: 1 }]]);
      Task.findOne.mockResolvedValue(null);
      const req = { params: { boardId: 1, taskId: 1 }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.deleteTask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
    it('should handle errors and return 500', async () => {
      sequelize.query.mockRejectedValue(new Error('DB error'));
      const req = { params: { boardId: 1, taskId: 1 }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.deleteTask(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('updateTasksOrder', () => {
    it('should return 400 if orderedIds is not array', async () => {
      const req = { params: { boardId: 1 }, body: { orderedIds: null }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.updateTasksOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'orderedIds must be an array' });
    });
    it('should return 400 if task ids are invalid', async () => {
      Task.findAll.mockResolvedValue([{ id: 1 }]);
      const req = { params: { boardId: 1 }, body: { orderedIds: [1,2] }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.updateTasksOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid task ids' });
    });
    it('should handle errors and return 500', async () => {
      Task.findAll.mockRejectedValue(new Error('DB error'));
      const req = { params: { boardId: 1 }, body: { orderedIds: [1] }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.updateTasksOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });
});
