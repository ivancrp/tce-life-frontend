import api from './api';
import { setupAuthToken } from '../utils/auth';

export interface Specialty {
  id: string;
  name: string;
  description: string;
}

export const specialtyService = {
  getAll: async () => {
    try {
      setupAuthToken();
      const response = await api.get<Specialty[]>('/api/specialties');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar especialidades:', error);

      // Tratamento específico para erros conhecidos
      if (error.response) {
        const { status, data } = error.response;

        if (status === 404 && data.message?.includes('Usuário não encontrado')) {
          // Limpar dados de autenticação e redirecionar para login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
      }

      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      setupAuthToken();
      const response = await api.get<Specialty>(`/api/specialties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar especialidade:', error);
      throw error;
    }
  },

  create: async (data: Omit<Specialty, 'id'>) => {
    try {
      setupAuthToken();
      const response = await api.post<Specialty>('/api/specialties', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar especialidade:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<Specialty>) => {
    try {
      setupAuthToken();
      const response = await api.put<Specialty>(`/api/specialties/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar especialidade:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      setupAuthToken();
      await api.delete(`/api/specialties/${id}`);
    } catch (error) {
      console.error('Erro ao deletar especialidade:', error);
      throw error;
    }
  },

  assignToUser: async (userId: string, specialties: string[]) => {
    try {
      setupAuthToken();
      const response = await api.post('/api/specialties/assign', {
        userId,
        specialties
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atribuir especialidades:', error);
      throw error;
    }
  }
}; 