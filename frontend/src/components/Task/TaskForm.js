import React, { useState } from 'react';
import { createTaskInBoard, updateTaskInBoard } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const TaskForm = ({ task, boardId, setTask }) => {
  const [formData, setFormData] = useState({
    title: task ? task.title : '',
    description: task ? task.description : '',
    status: task ? task.status : 'pending',
    priority: task ? task.priority : 'medium',
    due_date: task ? (task.due_date ? task.due_date.substring(0, 10) : '') : '',
  });

  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        await updateTaskInBoard(boardId, task.id, formData);
        showToast('Task updated', 'success');
      } else {
        await createTaskInBoard(boardId, formData);
        showToast('Task created', 'success');
      }
      setTask && setTask(null);
    } catch (error) {
      console.error('TaskForm error:', error, error?.response);
      showToast('Error saving task', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Task Title"
        required
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Task Description"
      />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="canceled">Canceled</option>
      </select>
      <select name="priority" value={formData.priority} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="date"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
        placeholder="Due Date"
      />
      <button type="submit" style={{ marginTop: '6px' }}>Save Task</button>
    </form>
  );
};

export default TaskForm;
