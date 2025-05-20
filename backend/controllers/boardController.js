const { Board, sequelize } = require('../models');

// Create a new board
exports.createBoard = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: 'Board name is required' });
    }

    // Crear el board
    const board = await Board.create({ name, description, userId }, { transaction: t });
    // Insertar en board_users
    await sequelize.models.board_users.create({ boardId: board.id, userId }, { transaction: t });

    await t.commit();
    res.status(201).json(board);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};

// Get all boards for the authenticated user
exports.getBoards = async (req, res) => {
  try {
    const userId = req.user.id;
    // Buscar boards donde el usuario esté en board_users
    const boards = await Board.findAll({
      include: [{
        association: 'users',
        where: { id: userId },
        attributes: [],
        through: { attributes: [] }
      }]
    });
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