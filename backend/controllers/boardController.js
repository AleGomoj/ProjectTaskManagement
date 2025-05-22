const { Board, sequelize } = require('../models');

exports.createBoard = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    if (!name) {
      return res.status(400).json({ message: 'Board name is required' });
    }
    const board = await Board.create({ name, description, userId }, { transaction: t });
    await sequelize.models.board_users.create({ boardId: board.id, userId }, { transaction: t });
    await t.commit();
    res.status(201).json(board);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};

exports.getBoards = async (req, res) => {
  try {
    const userId = req.user.id;
    const boards = await Board.findAll({
      include: [{
        association: 'users',
        where: { id: userId },
        attributes: [],
        through: { attributes: [] }
      }],
      order: [['order', 'ASC'], ['id', 'ASC']]
    });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

exports.updateBoardsOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds must be an array' });
    }
    const boards = await Board.findAll({
      where: { id: orderedIds, userId },
    });
    if (boards.length !== orderedIds.length) {
      return res.status(400).json({ message: 'Invalid board ids' });
    }
    await Promise.all(orderedIds.map((id, idx) => Board.update({ order: idx }, { where: { id, userId } })));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};