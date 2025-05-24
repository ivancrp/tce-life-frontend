import axios from 'axios';
import { TOKEN_KEY } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      if (error.response.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api; 