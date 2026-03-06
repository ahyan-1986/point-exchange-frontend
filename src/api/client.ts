import axios from 'axios';

const api = axios.create({
  baseURL: 'http://103.103.157.147:30080//v1', // Update to your backend URL if needed
});

export default api;
