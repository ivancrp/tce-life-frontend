import axios from 'axios';
import { API_URL } from '../config/api';
import { setAuthData, logout, setupAuthToken } from '../utils/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    imageUrl?: string;
  };
}

export class AuthService {
  /**
   * Realiza login com credenciais (email e senha)
   * @param credentials Credenciais de login (email e senha)
   * @returns Promise com os dados de autenticação
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Tentando login com email:', credentials.email);
      
      // DEV_MODE: Login direto para desenvolvimento/teste
      // Isso permite login mesmo se a API estiver indisponível
      if (process.env.NODE_ENV === 'development' && 
          (credentials.email === 'admin@example.com' && credentials.password === 'admin123' ||
           credentials.email === 'medico@example.com' && credentials.password === 'medico123')) {
        
        console.log('DEV_MODE: Usando login direto para desenvolvimento');
        const devToken = 'dev-token-' + Math.random().toString(36).substring(2);
        const userData = {
          id: 'dev-user-id',
          name: credentials.email === 'admin@example.com' ? 'Administrador' : 'Dr. Teste',
          email: credentials.email,
          role: credentials.email === 'admin@example.com' ? 'Admin' : 'Médico'
        };
        
        // Armazenar token e dados do usuário
        await setAuthData(devToken, userData);
        
        // Configurar o token para requisições futuras
        axios.defaults.headers.common['Authorization'] = `Bearer ${devToken}`;
        
        return {
          token: devToken,
          user: userData
        };
      }
      
      // Chamar a API de autenticação
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const data = response.data;
      
      console.log('Login bem-sucedido para:', credentials.email);
      console.log('Dados do usuário:', data.user);
      
      // Armazenar token e dados do usuário
      await setAuthData(data.token, data.user);
      
      // Configurar o token para requisições futuras
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      return data;
    } catch (error: any) {
      console.error('Erro de login:', error);
      
      // Tratamento específico para erros conhecidos
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          throw new Error(data.message || 'Email ou senha inválidos');
        }
        
        if (status === 400) {
          throw new Error(data.message || 'Campos obrigatórios não preenchidos');
        }
        
        if (status === 500) {
          throw new Error('Erro interno do servidor. Por favor, tente novamente mais tarde.');
        }
      }
      
      // Para erros de rede
      if (error.message === 'Network Error') {
        throw new Error('Erro de conexão. Verifique sua conexão com a internet.');
      }
      
      // Para outros erros
      throw new Error('Ocorreu um erro ao fazer login. Por favor, tente novamente.');
    }
  }

  /**
   * Realiza login com Google
   * @param googleToken Token de autenticação do Google
   * @returns Promise com os dados de autenticação
   */
  static async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
    try {
      console.log('Enviando token do Google para o backend:', { token: googleToken ? `${googleToken.substring(0, 10)}...` : 'ausente' });
      
      if (!googleToken) {
        throw new Error('Token do Google não fornecido');
      }
      
      // Usar o modo de tratamento de CORS mais permissivo para esta requisição
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false, // Evita problemas de CORS com credentials
        timeout: 10000 // Timeout de 10 segundos para evitar esperas indefinidas
      };
      
      // Chamar a API de autenticação com Google
      const response = await axios.post(
        `${API_URL}/auth/google`, 
        { token: googleToken },
        axiosConfig
      );
      
      // Verificar se a resposta tem o formato esperado
      if (!response || !response.data || !response.data.token || !response.data.user) {
        console.error('Resposta do backend inválida:', response?.data);
        throw new Error('Resposta do servidor inválida');
      }
      
      const data = response.data;
      console.log('Dados do usuário Google:', data.user);
      
      // Armazenar token e dados do usuário
      await setAuthData(data.token, data.user);
      
      // Configurar o token para requisições futuras
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      console.log('Login com Google bem-sucedido:', { email: data.user.email });
      
      return data;
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      
      // Tratamento específico para erros conhecidos
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          throw new Error(data.message || 'Token do Google inválido ou expirado');
        }
        
        if (status === 400) {
          throw new Error(data.message || 'Token do Google não fornecido');
        }
        
        if (status === 500) {
          throw new Error('Erro interno do servidor. Por favor, tente novamente mais tarde.');
        }
      }
      
      // Para erros de rede
      if (error.message === 'Network Error') {
        throw new Error('Erro de conexão. Verifique sua conexão com a internet.');
      }
      
      // Para outros erros
      throw new Error('Ocorreu um erro ao fazer login com Google. Por favor, tente novamente.');
    }
  }

  /**
   * Realiza logout do usuário
   */
  static logout(): void {
    logout();
  }

  /**
   * Verifica se o token atual é válido
   * @returns Promise<boolean> indicando se o token é válido
   */
  static async verifyToken(): Promise<boolean> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('verifyToken: Nenhum token encontrado no localStorage');
      return false;
    }

    // Em ambiente de desenvolvimento, aceitar tokens que começam com 'dev-token-'
    // Isso permite que o frontend funcione mesmo sem o backend em desenvolvimento
    if (process.env.NODE_ENV === 'development' && token.startsWith('dev-token-')) {
      console.log('verifyToken: Token de desenvolvimento válido');
      return true;
    }

    console.log('verifyToken: Verificando token com o servidor');
    
    try {
      // Configurar o header para essa requisição específica
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      };
      
      // Fazer a requisição para verificar o token
      const response = await axios.get(`${API_URL}/auth/verify`, config);
      
      // Verificar se a resposta indica que o token é válido
      if (response && response.status === 200) {
        console.log('verifyToken: Token válido confirmado pelo servidor');
        return true;
      } else {
        console.log('verifyToken: Servidor retornou resposta inesperada:', response?.status);
        return false;
      }
    } catch (error: any) {
      console.error('verifyToken: Erro ao verificar token:', error);
      
      // Em ambiente de desenvolvimento, ignorar erros de rede
      // para permitir testes mesmo sem backend disponível
      if (process.env.NODE_ENV === 'development' && error.message && error.message.includes('Network Error')) {
        console.log('verifyToken: Ignorando erro de rede no ambiente de desenvolvimento');
        return true;
      }
      
      // Verificar o tipo de erro
      if (error.response) {
        console.log('verifyToken: Resposta de erro do servidor:', error.response.status);
        
        // Se o erro for 401 (Unauthorized) ou 403 (Forbidden), o token é inválido
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('verifyToken: Token inválido, removendo dados de autenticação');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
        }
      } else if (error.request) {
        console.log('verifyToken: Nenhuma resposta recebida do servidor');
      } else {
        console.log('verifyToken: Erro ao preparar requisição');
      }
      
      return false;
    }
  }
} 