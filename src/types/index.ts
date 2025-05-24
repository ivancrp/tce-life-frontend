export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: 'male' | 'female';
  cpf: string;
  rg: string;
  avatar_url?: string;
  age?: number;
  blood_type: string;
  allergies: string[];
  health_insurance: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  contact: {
    phone: string;
    email: string;
    emergency_contact: string;
  };
}

export interface VitalSigns {
  blood_pressure: string;
  heart_rate: number;
  temperature: number;
  respiratory_rate: number;
  oxygen_saturation: number;
  weight: number;
  updated_at: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  active: boolean;
  instructions?: string;
  prescribed_by: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  specialty: string;
  title: string;
  date: string;
  type: string;
  notes: string;
  tags?: string[];
  vital_signs?: VitalSigns;
  symptoms?: string[];
  diagnosis?: string[];
}

export interface Exam {
  id: string;
  name: string;
  category: string;
  lab: string;
  date: string;
  time: string;
  result_url?: string;
}

export interface Patient {
  id: string;
  name: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other';
  cpf: string;
  rg: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  contact: {
    phone: string;
    email: string;
    emergency_contact: string;
  };
  nationality: string;
  marital_status: string;
  occupation: string;
  health_insurance?: string;
  blood_type?: string;
  allergies: string[];
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: string;
  medical_record_id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  created_at: string;
}

export interface Procedure {
  id: string;
  medical_record_id: string;
  name: string;
  type: string;
  date: string;
  description: string;
  notes: string;
  created_at: string;
}

export interface Attachment {
  id: string;
  medical_record_id: string;
  name: string;
  type: string;
  url: string;
  created_at: string;
}

export interface MedicalCertificate {
  id: string;
  medical_record_id: string;
  patient_id: string;
  doctor_id: string;
  type: 'absence' | 'fitness' | 'condition';
  start_date: string;
  end_date?: string;
  description: string;
  created_at: string;
}