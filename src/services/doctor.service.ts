import api from './api';
import { setupAuthToken } from '../utils/auth';

export interface Doctor {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: string;
  isActive: boolean;
  dateOfBirth: string;
  gender: string;
  insurance: string;
  createdAt: string;
  updatedAt: string;
}

export const doctorService = {
  getAll: async () => {
    try {
      setupAuthToken();
      const response = await api.get<Doctor[]>('/users/doctors');
      return response.data.filter(doctor => doctor.isActive);
    } catch (error: any) {
      console.error('Erro ao buscar médicos:', error);

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
      const response = await api.get<Doctor>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar médico:', error);
      throw error;
    }
  }
}; 