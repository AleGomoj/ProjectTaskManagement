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

export default api;