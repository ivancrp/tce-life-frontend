import api from './api';
import { format } from 'date-fns';
import { setupAuthToken } from '../utils/auth';

// Função para obter a data formatada para a API
const getFormattedDate = (date: Date) => format(date, 'yyyy-MM-dd');

export interface Schedule {
  id: string;
  userId: string;
  doctorId: string;
  date: Date;
  time: string;
  type: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'in_progress';
  notes?: string;
  patientName?: string;
  doctorName?: string;
  duration?: number;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  doctor?: {
    id: string;
    name: string;
    email: string;
    role?: {
      id: string;
      name: string;
    };
  };
}

export interface CreateScheduleDto {
  userId: string;
  doctorId: string;
  date: Date;
  time: string;
  type: string;
  notes?: string;
}

// Função para formatar os dados do agendamento
const formatSchedule = (schedule: any): Schedule => {
  // Log detalhado dos dados recebidos
  console.log('Dados brutos do agendamento:', JSON.stringify(schedule, null, 2));

  // Validar dados obrigatórios
  if (!schedule.id || !schedule.userId || !schedule.doctorId) {
    console.error('Dados obrigatórios faltando no agendamento:', schedule);
    throw new Error('Dados inválidos no agendamento');
  }

  const formattedSchedule: Schedule = {
    id: schedule.id,
    userId: schedule.userId,
    doctorId: schedule.doctorId,
    date: new Date(schedule.date),
    time: schedule.time,
    type: schedule.type,
    status: schedule.status || 'pending',
    notes: schedule.notes,
    patientName: schedule.user?.name || 'Nome não disponível',
    doctorName: schedule.doctor?.name || 'Nome não disponível',
    duration: schedule.duration,
    user: schedule.user ? {
      id: schedule.user.id,
      name: schedule.user.name,
      email: schedule.user.email
    } : undefined,
    doctor: schedule.doctor ? {
      id: schedule.doctor.id,
      name: schedule.doctor.name,
      email: schedule.doctor.email,
      role: schedule.doctor.role
    } : undefined
  };

  console.log('Agendamento formatado:', JSON.stringify(formattedSchedule, null, 2));
  return formattedSchedule;
};

export const scheduleService = {
  getAll: async () => {
    try {
      setupAuthToken();
      const token = localStorage.getItem('token');
      console.log('Token atual:', token ? 'Presente' : 'Ausente');
      console.log('Headers da requisição:', api.defaults.headers);
      
      const response = await api.get<any[]>('/schedules');
      console.log('Resposta da API (getAll):', response.data);
      return response.data.map(formatSchedule);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      setupAuthToken();
      const response = await api.get<any>(`/schedules/${id}`);
      console.log('Resposta da API (getById):', response.data);
      return formatSchedule(response.data);
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      throw error;
    }
  },

  getByUserId: async (userId: string) => {
    try {
      setupAuthToken();
      const response = await api.get<any[]>(`/schedules/user/${userId}`);
      console.log('Resposta da API (getByUserId):', response.data);
      return response.data.map(formatSchedule);
    } catch (error) {
      console.error('Erro ao buscar agendamentos do usuário:', error);
      throw error;
    }
  },

  create: async (data: CreateScheduleDto) => {
    try {
      setupAuthToken();
      console.log('Enviando dados para criar agendamento:', data);
      const response = await api.post('/schedules', data);
      console.log('Resposta da API (create):', response.data);
      return formatSchedule(response.data);
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);

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

        if (status === 400) {
          throw new Error(data.message || 'Dados inválidos para agendamento');
        }

        if (status === 403) {
          throw new Error('Você não tem permissão para agendar consultas');
        }

        if (status === 409) {
          throw new Error('Horário já está ocupado. Por favor, escolha outro horário.');
        }
      }

      // Para erros de rede
      if (error.message === 'Network Error') {
        throw new Error('Erro de conexão. Verifique sua conexão com a internet.');
      }

      // Para outros erros
      throw new Error('Ocorreu um erro ao agendar a consulta. Por favor, tente novamente.');
    }
  },

  update: async (id: string, data: Partial<Schedule>) => {
    try {
      setupAuthToken();
      const response = await api.put<any>(`/schedules/${id}`, data);
      console.log('Resposta da API (update):', response.data);
      return formatSchedule(response.data);
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      setupAuthToken();
      await api.delete(`/schedules/${id}`);
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      throw error;
    }
  }
}; 