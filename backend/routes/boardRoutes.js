const express = require('express');
const { createBoard, getBoards, getBoardById, updateBoard, deleteBoard } = require('../controllers/boardController');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Boards CRUD
router.post('/', authMiddleware, createBoard);
router.get('/', authMiddleware, getBoards);
router.get('/:id', authMiddleware, getBoardById);
router.put('/:id', authMiddleware, updateBoard);
router.delete('/:id', authMiddleware, deleteBoard);

// Tasks CRUD within a board
router.post('/:boardId/tasks', authMiddleware, createTask);
router.get('/:boardId/tasks', authMiddleware, getTasks);
router.put('/:boardId/tasks/:taskId', authMiddleware, updateTask);
router.delete('/:boardId/tasks/:taskId', authMiddleware, deleteTask);

module.exports = router;