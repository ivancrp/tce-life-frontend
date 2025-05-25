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

export interface Medication {
  id: string;
  userId: string;
  attendanceId: string | null;
  name: string;
  dosage: string;
  frequency: string;
  duration: string | null;
  instructions: string | null;
  startDate: Date;
  endDate: Date | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  allergies: string[];
  medications: Medication[];
  chronicDiseases: string[];
  gender: string;
  raca: string;
  bloodType?: string;
}

export interface MedicalExam {
  id: string;
  userId: string;
  attendanceId: string;
  examType: string;
  requestDate: string | Date;
  resultDate?: string | Date;
  status: 'pending' | 'completed' | 'canceled';
  result?: string;
  laboratory?: string;
  observations?: string;
  attachments?: Array<{
    name?: string;
    url: string;
  }>;
}

export interface Attendance {
  id: string;
  userId: string;
  scheduleId: string;
  doctorId: string;
  doctor: {
    id: string;
    name: string;
    crm: string;
  };
  patient: {
    id: string;
    name: string;
    email: string;
    telefone: string;
    celular: string;
    gender: string;
    raca: string;
    allergies: string[];
    medications: Medication[];
    chronicDiseases: string[];
    profilePicture?: string;
    bloodType?: string;
  };
  status: 'in_progress' | 'completed' | 'cancelled';
  symptoms: string;
  diagnosis: string;
  prescription: string;
  observations: string;
  vitalSigns?: VitalSigns;
  medicalExams?: MedicalExam[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicalCertificate {
  id?: string;
  userId: string;
  attendanceId: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  cid?: string;
  description: string;
  daysOff: number;
}

class AttendanceService {
  private readonly baseUrl = '/attendance';

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
    const response = await api.get(`/attendance/schedule/${scheduleId}`);
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

  async addAllergy(patientId: string, allergy: string): Promise<Patient> {
    const response = await api.post(`/patients/${patientId}/allergies`, { allergy });
    return response.data;
  }

  async removeAllergy(patientId: string, allergy: string): Promise<Patient> {
    const response = await api.delete(`/patients/${patientId}/allergies/${encodeURIComponent(allergy)}`);
    return response.data;
  }

  async addMedication(patientId: string, medication: Omit<Medication, 'id' | 'prescritoPor' | 'status'>) {
    try {
      const response = await api.post(`/patients/${patientId}/medications`, medication);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar medicamento:', error);
      throw error;
    }
  }

  async updateMedication(patientId: string, medicationId: string, medication: Omit<Medication, 'id' | 'prescritoPor'>) {
    try {
      const response = await api.put(`/patients/${patientId}/medications/${medicationId}`, medication);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar medicamento:', error);
      throw error;
    }
  }

  async removeMedication(patientId: string, medicationId: string) {
    try {
      const response = await api.delete(`/patients/${patientId}/medications/${medicationId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao remover medicamento:', error);
      throw error;
    }
  }

  async saveMedicalCertificate(data: Omit<MedicalCertificate, 'id'>): Promise<MedicalCertificate> {
    setupAuthToken();
    const response = await api.post('/medical-certificates', data);
    return response.data;
  }

  async getMedicalCertificatesByAttendanceId(attendanceId: string): Promise<MedicalCertificate[]> {
    setupAuthToken();
    const response = await api.get(`/medical-certificates/attendance/${attendanceId}`);
    return response.data;
  }

  async requestMedicalExam(data: {
    userId: string;
    attendanceId: string;
    examType: string;
    laboratory?: string;
    observations?: string;
    requestDate: Date;
  }): Promise<MedicalExam> {
    setupAuthToken();
    // Garantindo que a data seja enviada no formato ISO
    const formattedData = {
      ...data,
      requestDate: data.requestDate.toISOString(),
      status: 'pending' as const
    };
    
    const response = await api.post('/medical-exams', formattedData);
    return response.data;
  }

  async getMedicalExamsByAttendanceId(attendanceId: string): Promise<MedicalExam[]> {
    setupAuthToken();
    const response = await api.get(`/medical-exams/attendance/${attendanceId}`);
    return response.data;
  }

  async getAttendanceById(id: string): Promise<Attendance> {
    const response = await api.get(`/attendances/${id}`);
    return response.data;
  }

  async uploadExamFiles(examId: string, formData: FormData): Promise<MedicalExam> {
    setupAuthToken();
    const response = await api.post(`/medical-exams/${examId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async getMedicalExamsByUserId(userId: string): Promise<MedicalExam[]> {
    try {
      const response = await api.get(`/medical-exams/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar exames do paciente:', error);
      throw error;
    }
  }
}

export const attendanceService = new AttendanceService(); 