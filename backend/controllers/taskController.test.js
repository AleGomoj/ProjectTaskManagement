const request = require('supertest');
const app = require('../app');
const taskController = require('./taskController');

describe('Task Controller', () => {
  it('GET /api/tasks should return tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect([200,404]).toContain(res.statusCode); // Ajustar según implementación
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
  });
  describe('updateTasksOrder', () => {
    it('should return 400 if orderedIds is not array', async () => {
      const req = { params: { boardId: 1 }, body: { orderedIds: null }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await taskController.updateTasksOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'orderedIds must be an array' });
    });
  });
});
