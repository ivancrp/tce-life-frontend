import axios from 'axios';
import { TOKEN_KEY } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Interceptor de requisição:', {
      url: config.url,
      method: config.method,
      hasToken: !!token
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token configurado:', `Bearer ${token.substring(0, 10)}...`);
    } else {
      console.log('Nenhum token encontrado no localStorage');
    }
    
    console.log('Headers da requisição:', config.headers);
    return config;
  },
  (error) => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Erro na resposta:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      if (error.response.status === 401) {
        // Token expirado ou inválido
        console.log('Token inválido ou expirado, removendo dados de autenticação');
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    }
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

export default api; 