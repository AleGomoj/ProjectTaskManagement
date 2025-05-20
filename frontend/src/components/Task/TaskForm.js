import React, { useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const TaskForm = ({ task, boardId, setTask }) => {
  const [formData, setFormData] = useState({
    title: task ? task.title : '',
    description: task ? task.description : '',
  });

  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        await api.put(`/tasks/${task.id}`, formData);
        showToast('Task updated', 'success');
      } else {
        await api.post(`/tasks`, { ...formData, boardId });
        showToast('Task created', 'success');
      }
      setTask(null);
    } catch (error) {
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
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Task Description"
      />
      <button type="submit">Save Task</button>
    </form>
  );
};

export default TaskForm;
