const { Task } = require('../models');

// Create a new task within a board
exports.createTask = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, status, priority, due_date } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({ title, description, status, priority, due_date, boardId });
    res.status(201).json(task);
  } catch (err) {
    console.error('Error in createTask:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks within a board
exports.getTasks = async (req, res) => {
  try {
    const { boardId } = req.params;
    // Validar que el board existe y pertenece al usuario autenticado
    const { Board, Task } = require('../models');
    const userId = req.user.id;
    const board = await Board.findOne({ where: { id: boardId, userId } });
    if (!board) {
      return res.status(404).json({ message: 'Board not found or access denied' });
    }
    const tasks = await Task.findAll({ where: { boardId } });
    res.json(tasks);
  } catch (err) {
    console.error('Error in getTasks:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update a task by ID
exports.updateTask = async (req, res) => {
  try {
    const { boardId, taskId } = req.params;
    const { title, description, status, priority, due_date } = req.body;

    const task = await Task.findOne({ where: { id: taskId, boardId } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({ title, description, status, priority, due_date });
    res.json(task);
  } catch (err) {
    console.error('Error in updateTask:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a task by ID
exports.deleteTask = async (req, res) => {
  try {
    const { boardId, taskId } = req.params;

    const task = await Task.findOne({ where: { id: taskId, boardId } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    res.status(204).end();
  } catch (err) {
    console.error('Error in deleteTask:', err);
    res.status(500).json({ message: err.message });
  }
};