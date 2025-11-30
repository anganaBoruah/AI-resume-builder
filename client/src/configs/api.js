// api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 20000, // 20 seconds – helps with Render + AI latency
});

export default api;
