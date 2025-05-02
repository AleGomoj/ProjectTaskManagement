const { Board } = require('../models');

// Create a new board
exports.createBoard = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: 'Board name is required' });
    }

    const board = await Board.create({ name, description, userId });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all boards for the authenticated user
exports.getBoards = async (req, res) => {
  try {
    const userId = req.user.id;
    const boards = await Board.findAll({ where: { userId } });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific board by ID
exports.getBoardById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const board = await Board.findOne({ where: { id, userId } });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a board by ID
exports.updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    const board = await Board.findOne({ where: { id, userId } });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    await board.update({ name, description });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a board by ID
exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const board = await Board.findOne({ where: { id, userId } });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    await board.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};