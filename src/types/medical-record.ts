import { User } from './index';

export interface PatientUser extends User {
  avatar_url?: string;
  age?: number;
  blood_type?: string;
  allergies?: string[];
  health_insurance?: string;
  birth_date?: string;
  phone?: string;
  rg?: string;
  gender?: 'male' | 'female';
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  contact?: {
    phone: string;
    email: string;
    emergency_contact: string;
  };
}

export interface VitalSigns {
  id: string;
  patient_id: string;
  blood_pressure: string;
  temperature: number;
  heart_rate: number;
  respiratory_rate: number;
  oxygen_saturation: number;
  weight: number;
  height: number;
  bmi: number;
  updated_at: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  instructions?: string;
  prescribed_by: string;
  active: boolean;
}

export interface Exam {
  id: string;
  name: string;
  category: string;
  lab: string;
  date: string;
  time: string;
  status: string;
  result_url: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  title: string;
  date: string;
  doctor_name: string;
  specialty: string;
  notes: string;
  tags?: string[];
  type: string;
} 