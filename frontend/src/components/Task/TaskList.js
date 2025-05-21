import React, { useEffect, useState } from 'react';
import api, { createTaskInBoard, updateTaskInBoard, deleteTaskInBoard } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const TaskList = ({ boardId, refreshKey }) => {
  const [tasks, setTasks] = useState([]);
  const { showToast } = useToast();
  const [localRefresh, setLocalRefresh] = useState(0);

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
  }, [boardId, showToast, refreshKey, localRefresh]);

  if (!boardId) return null;

  return (
    <div className="task-list">
      <h3>Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <div>
                <strong style={task.status === 'completed' ? { textDecoration: 'line-through', color: '#888' } : {}}>{task.title}</strong>
              </div>
              <div style={{ fontSize: '0.97em', color: '#666', marginBottom: 2, textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>{task.description}</div>
              <div style={{ fontSize: '0.95em', color: '#888' }}>
                Status: <span style={{ color: '#7c83fd' }}>{task.status}</span> |
                Priority: <span style={{ color: task.priority === 'high' ? '#f67280' : task.priority === 'medium' ? '#ffb347' : '#388e3c' }}>{task.priority}</span> |
                Date: <span>{task.due_date ? task.due_date : 'Sin fecha'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={{
                  padding: '6px 14px',
                  borderRadius: 5,
                  background: task.status === 'completed' ? '#e0e0e0' : '#a5dee5',
                  color: task.status === 'completed' ? '#aaa' : '#2d2d2d',
                  border: 'none',
                  cursor: task.status === 'completed' ? 'not-allowed' : 'pointer',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
                disabled={task.status === 'completed'}
                onClick={async () => {
                  if (task.status !== 'completed') {
                    try {
                      await updateTaskInBoard(boardId, task.id, { ...task, status: 'completed' });
                      setLocalRefresh(Date.now());
                      showToast('Task completed', 'success');
                    } catch (err) {
                      showToast('Error completing task', 'error');
                    }
                  }
                }}
              >
                {task.status === 'completed' ? 'Completed' : 'Complete'}
              </button>
              <button
                style={{
                  padding: '6px 14px',
                  borderRadius: 5,
                  background: '#f67280',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    try {
                      await deleteTaskInBoard(boardId, task.id);
                      setLocalRefresh(Date.now());
                      showToast('Task deleted', 'success');
                    } catch (err) {
                      showToast('Error deleting task', 'error');
                    }
                  }
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
