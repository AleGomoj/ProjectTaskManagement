const request = require('supertest');
const app = require('../app');
const boardController = require('./boardController');

jest.mock('../models', () => {
  const actual = jest.requireActual('../models');
  return {
    ...actual,
    sequelize: {
      transaction: jest.fn().mockResolvedValue({
        commit: jest.fn(),
        rollback: jest.fn(),
      }),
      models: {
        board_users: { create: jest.fn() }
      }
    },
    Board: {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    }
  };
});

describe('Board Controller', () => {
  it('GET /api/boards should return boards or unauthorized', async () => {
    const res = await request(app).get('/api/boards');
    expect([200, 401]).toContain(res.statusCode);
  });
});

describe('boardController', () => {
  describe('createBoard', () => {
    it('should return 400 if name is missing', async () => {
      const req = { body: {}, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await boardController.createBoard(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Board name is required' });
    });
    it('should handle errors and return 500', async () => {
      const req = { body: { name: 'Test' }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const { Board, sequelize } = require('../models');
      Board.create.mockRejectedValue(new Error('DB error'));
      await boardController.createBoard(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('getBoards', () => {
    it('should handle errors and return 500', async () => {
      const req = { user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const { Board } = require('../models');
      Board.findAll.mockRejectedValue(new Error('DB error'));
      await boardController.getBoards(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('getBoardById', () => {
    it('should return 404 if board not found', async () => {
      const req = { params: { id: 1 }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const { Board } = require('../models');
      Board.findOne.mockResolvedValue(null);
      await boardController.getBoardById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
    it('should handle errors and return 500', async () => {
      const req = { params: { id: 1 }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const { Board } = require('../models');
      Board.findOne.mockRejectedValue(new Error('DB error'));
      await boardController.getBoardById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('updateBoard', () => {
    it('should return 404 if board not found', async () => {
      const req = { params: { id: 1 }, body: {}, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const { Board } = require('../models');
      Board.findOne.mockResolvedValue(null);
      await boardController.updateBoard(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
    it('should handle errors and return 500', async () => {
      const req = { params: { id: 1 }, body: {}, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const { Board } = require('../models');
      Board.findOne.mockRejectedValue(new Error('DB error'));
      await boardController.updateBoard(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('deleteBoard', () => {
    it('should return 404 if board not found', async () => {
      const req = { params: { id: 1 }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const { Board } = require('../models');
      Board.findOne.mockResolvedValue(null);
      await boardController.deleteBoard(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
    it('should handle errors and return 500', async () => {
      const req = { params: { id: 1 }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const { Board } = require('../models');
      Board.findOne.mockRejectedValue(new Error('DB error'));
      await boardController.deleteBoard(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('updateBoardsOrder', () => {
    it('should return 400 if orderedIds is not array', async () => {
      const req = { body: { orderedIds: null }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await boardController.updateBoardsOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'orderedIds must be an array' });
    });
    it('should return 400 if board ids are invalid', async () => {
      const req = { body: { orderedIds: [1,2] }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const { Board } = require('../models');
      Board.findAll.mockResolvedValue([]);
      await boardController.updateBoardsOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid board ids' });
    });
    it('should handle errors and return 500', async () => {
      const req = { body: { orderedIds: [1,2] }, user: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const { Board } = require('../models');
      Board.findAll.mockRejectedValue(new Error('DB error'));
      await boardController.updateBoardsOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });
});
