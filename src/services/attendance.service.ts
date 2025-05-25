import api from './api';
import { setupAuthToken } from '../utils/auth';

export interface VitalSigns {
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  cpf: string;
  telefone: string;
  celular: string;
  workPhone?: string;
  profilePicture?: string;
  allergies?: string[];
  medications?: string[];
  chronicDiseases?: string[];
  gender?: string;
  raca?: string;
}

export interface Attendance {
  id: string;
  scheduleId: string;
  patientId: string;
  doctorId: string;
  patient: Patient;
  symptoms: string;
  diagnosis: string;
  prescription: string;
  observations: string;
  anamnesis: string;
  vitalSigns: VitalSigns;
  status: 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

class AttendanceService {
  private readonly baseUrl = '/attendances';

  async create(data: Partial<Attendance>): Promise<Attendance> {
    setupAuthToken();
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  async getById(id: string): Promise<Attendance> {
    setupAuthToken();
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getByScheduleId(scheduleId: string): Promise<Attendance> {
    setupAuthToken();
    console.log('Buscando atendimento pelo scheduleId:', scheduleId);
    const response = await api.get(`${this.baseUrl}/schedule/${scheduleId}`);
    console.log('Resposta do servidor (getByScheduleId):', response.data);
    return response.data;
  }

  async update(id: string, data: Partial<Attendance>): Promise<Attendance> {
    setupAuthToken();
    console.log('Atualizando atendimento:', {
      id,
      data
    });
    const response = await api.put(`${this.baseUrl}/${id}`, data);
    console.log('Resposta do servidor (update):', response.data);
    return response.data;
  }

  async startAttendance(scheduleId: string): Promise<Attendance> {
    setupAuthToken();
    console.log('Iniciando atendimento para scheduleId:', scheduleId);
    console.log('URL da requisição:', `${this.baseUrl}/start`);
    try {
      const response = await api.post(`${this.baseUrl}/start`, { scheduleId });
      console.log('Resposta do servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao iniciar atendimento:', error);
      throw error;
    }
  }

  async complete(id: string): Promise<Attendance> {
    setupAuthToken();
    console.log('Finalizando atendimento:', id);
    const response = await api.put(`${this.baseUrl}/${id}/complete`, {});
    console.log('Resposta do servidor (complete):', response.data);
    return response.data;
  }

  async getByPatientId(patientId: string): Promise<Attendance[]> {
    setupAuthToken();
    const response = await api.get(`${this.baseUrl}/patient/${patientId}`);
    return response.data;
  }

  async cancel(id: string, reason: string): Promise<Attendance> {
    setupAuthToken();
    console.log('Cancelando atendimento:', id, 'Motivo:', reason);
    const response = await api.put(`${this.baseUrl}/${id}/cancel`, { reason });
    console.log('Resposta do servidor (cancel):', response.data);
    return response.data;
  }
}

export const attendanceService = new AttendanceService(); 