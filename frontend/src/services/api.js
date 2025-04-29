import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3306/api',
});

export default api;