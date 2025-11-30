// src/configs/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // On Vercel: https://ai-resume-builder-7140.onrender.com
  timeout: 20000, // 20s – helps with Render + AI latency
});

// Optional: small interceptor just to log in case of weird errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error?.response || error?.message || error);
    return Promise.reject(error);
  }
);

export default api;
