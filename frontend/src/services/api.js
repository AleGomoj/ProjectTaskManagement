import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Boards CRUD
export const fetchBoards = async () => {
  const token = localStorage.getItem('token');
  const res = await api.get('/boards', { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const createBoard = async (data) => {
  const token = localStorage.getItem('token');
  const res = await api.post('/boards', data, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const updateBoard = async (id, data) => {
  const token = localStorage.getItem('token');
  const res = await api.put(`/boards/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const deleteBoard = async (id) => {
  const token = localStorage.getItem('token');
  await api.delete(`/boards/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

// Tasks CRUD within a board
export const fetchTasksByBoard = async (boardId) => {
  const token = localStorage.getItem('token');
  const res = await api.get(`/boards/${boardId}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const createTaskInBoard = async (boardId, data) => {
  const token = localStorage.getItem('token');
  const res = await api.post(`/boards/${boardId}/tasks`, data, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const updateTaskInBoard = async (boardId, taskId, data) => {
  const token = localStorage.getItem('token');
  const res = await api.put(`/boards/${boardId}/tasks/${taskId}`, data, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const deleteTaskInBoard = async (boardId, taskId) => {
  const token = localStorage.getItem('token');
  await api.delete(`/boards/${boardId}/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
};

// User profile update
export const updateUserProfile = async (id, data) => {
  const token = localStorage.getItem('token');
  const res = await api.put(`/users/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export default api;