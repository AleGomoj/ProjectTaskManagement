import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const TaskList = ({ boardId, refreshKey }) => {
  const [tasks, setTasks] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    if (!boardId) return;
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/boards/${boardId}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
        setTasks(response.data);
      } catch (error) {
        showToast('Error fetching tasks', 'error');
      }
    };
    fetchTasks();
  }, [boardId, showToast, refreshKey]);

  if (!boardId) return null;

  return (
    <div className="task-list">
      <h3>Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

// Para futuras acciones de eliminar/editar tareas, usar showToast('mensaje', 'tipo')

export default TaskList;
