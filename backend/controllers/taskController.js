const { Task, Board, sequelize } = require('../models');

exports.createTask = async (req, res) => {
  console.log(`[POST] /api/boards/${req.params.boardId}/tasks - Body:`, req.body, 'User:', req.user);
  try {
    const { boardId } = req.params;
    const { title, description, status, priority, due_date } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }
    const maxOrderTask = await Task.findOne({ where: { boardId }, order: [['order', 'DESC']] });
    const nextOrder = maxOrderTask ? maxOrderTask.order + 1 : 0;
    const task = await Task.create({ title, description, status, priority, due_date, boardId, order: nextOrder });
    res.status(201).json(task);
  } catch (err) {
    console.error('Error in createTask:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  console.log(`[GET] /api/boards/${req.params.boardId}/tasks - Body:`, req.body, 'User:', req.user);
  try {
    const { boardId } = req.params;
    const userId = req.user.id;
    const [results] = await sequelize.query(
      'SELECT 1 FROM board_users WHERE boardId = ? AND userId = ? LIMIT 1',
      { replacements: [boardId, userId] }
    );
    if (!results.length) {
      return res.status(404).json({ message: 'Board not found or access denied' });
    }
    const tasks = await Task.findAll({ where: { boardId }, order: [['order', 'ASC'], ['id', 'ASC']] });
    res.json(tasks);
  } catch (err) {
    console.error('Error in getTasks:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  console.log(`[PUT] /api/boards/${req.params.boardId}/tasks/${req.params.taskId} - Body:`, req.body, 'User:', req.user);
  try {
    const { boardId, taskId } = req.params;
    const userId = req.user.id;
    const [results] = await sequelize.query(
      'SELECT 1 FROM board_users WHERE boardId = ? AND userId = ? LIMIT 1',
      { replacements: [boardId, userId] }
    );
    if (!results.length) {
      console.warn('[UPDATE TASK] Access denied for user', userId, 'on board', boardId);
      return res.status(404).json({ message: 'Board not found or access denied' });
    }
    const { title, description, status, priority, due_date } = req.body;
    const task = await Task.findOne({ where: { id: taskId, boardId } });
    if (!task) {
      console.warn('[UPDATE TASK] Task not found:', taskId, 'in board', boardId);
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.update({ title, description, status, priority, due_date });
    res.json(task);
  } catch (err) {
    console.error('Error in updateTask:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  console.log(`[DELETE] /api/boards/${req.params.boardId}/tasks/${req.params.taskId} - User:`, req.user);
  try {
    const { boardId, taskId } = req.params;
    const userId = req.user.id;
    const [results] = await sequelize.query(
      'SELECT 1 FROM board_users WHERE boardId = ? AND userId = ? LIMIT 1',
      { replacements: [boardId, userId] }
    );
    if (!results.length) {
      console.warn('[DELETE TASK] Access denied for user', userId, 'on board', boardId);
      return res.status(404).json({ message: 'Board not found or access denied' });
    }
    const task = await Task.findOne({ where: { id: taskId, boardId } });
    if (!task) {
      console.warn('[DELETE TASK] Task not found:', taskId, 'in board', boardId);
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.destroy();
    res.status(204).end();
  } catch (err) {
    console.error('Error in deleteTask:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.updateTasksOrder = async (req, res) => {
  console.log(`[PUT] /api/boards/${req.params.boardId}/tasks/order - Body:`, req.body, 'User:', req.user);
  try {
    const { boardId } = req.params;
    const { orderedIds } = req.body; 
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds must be an array' });
    }

    const tasks = await Task.findAll({ where: { boardId } });
    const idSet = new Set(tasks.map(t => t.id));
    if (!orderedIds.every(id => idSet.has(id))) {
      return res.status(400).json({ message: 'Invalid task ids' });
    }

    await Promise.all(orderedIds.map((id, idx) => Task.update({ order: idx }, { where: { id, boardId } })));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};