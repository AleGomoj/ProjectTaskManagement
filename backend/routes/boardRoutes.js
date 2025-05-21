const express = require('express');
const { createBoard, getBoards, getBoardById, updateBoard, deleteBoard } = require('../controllers/boardController');
const { createTask, getTasks, updateTask, deleteTask, updateTasksOrder } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl} - Body:`, req.body, 'User:', req.user);
  next();
});

router.post('/', createBoard);
router.get('/', getBoards);
router.get('/:id', getBoardById);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);

router.post('/:boardId/tasks', createTask);
router.get('/:boardId/tasks', getTasks);
router.put('/:boardId/tasks/order', updateTasksOrder);
router.put('/:boardId/tasks/:taskId', updateTask);
router.delete('/:boardId/tasks/:taskId', deleteTask);

module.exports = router;