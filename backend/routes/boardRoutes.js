const express = require('express');
const { createBoard, getBoards, getBoardById, updateBoard, deleteBoard } = require('../controllers/boardController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new board
router.post('/', authMiddleware, createBoard);

// Get all boards for the authenticated user
router.get('/', authMiddleware, getBoards);

// Get a specific board by ID
router.get('/:id', authMiddleware, getBoardById);

// Update a board by ID
router.put('/:id', authMiddleware, updateBoard);

// Delete a board by ID
router.delete('/:id', authMiddleware, deleteBoard);

module.exports = router;