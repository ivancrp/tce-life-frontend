import axios from 'axios';
import { TOKEN_KEY } from '../utils/auth';

// URL base da API - Obtém do ambiente ou usa o valor padrão
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

console.log('API URL:', API_URL);

// Criar uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar o token de autenticação e o prefixo /api
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Interceptor - Token:', token ? 'Presente' : 'Ausente');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Interceptor - Authorization Header:', config.headers.Authorization);
    } else {
      console.log('Interceptor - Token não encontrado no localStorage');
    }

    // Adiciona o prefixo /api se não for uma rota de autenticação
    if (!config.url?.startsWith('/auth')) {
      config.url = `/api${config.url}`;
    }
    
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('[API Response Error]', {
      config: error.config,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response?.status === 401) {
      // Remover token apenas se não for uma rota de autenticação
      const isAuthRoute = error.config.url?.includes('/auth/');
      if (!isAuthRoute) {
        localStorage.removeItem(TOKEN_KEY);
        console.log('Token inválido ou expirado');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 