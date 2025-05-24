export interface CreateAttendanceDTO {
  userId: string;
  vitalSigns: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
  anamnesis: string;
  diagnosis?: string;
  observations?: string;
}

export interface UpdateAttendanceDTO extends Partial<CreateAttendanceDTO> {}

export interface Attendance {
  id: string;
  userId: string;
  doctorId: string;
  date: Date;
  vitalSigns: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
  anamnesis: string;
  diagnosis?: string;
  observations?: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
} 