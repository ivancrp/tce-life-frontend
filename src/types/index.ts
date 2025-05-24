export interface User {
  id: string;
  name: string;
  nomeSocial?: string;
  email: string;
  profilePicture?: string;
  isActive: boolean;
  role: Role;
  dateOfBirth?: Date;
  gender?: string;
  naturalidade?: string;
  nomeMae?: string;
  nomePai?: string;
  estadoCivil?: string;
  escolaridade?: string;
  telefone?: string;
  celular?: string;
  tipoSanguineo?: string;
  raca?: string;
  cpf?: string;
  insurance?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface RegisterUserData {
  name: string;
  nomeSocial?: string;
  email: string;
  password: string;
  cpf: string;
  dateOfBirth: Date;
  gender: string;
  naturalidade: string;
  nomeMae: string;
  nomePai?: string;
  estadoCivil: string;
  escolaridade: string;
  telefone?: string;
  celular: string;
  tipoSanguineo: string;
  raca: string;
  insurance?: string;
}

export const ESTADO_CIVIL_OPTIONS = [
  { value: 'SOLTEIRO', label: 'Solteiro(a)' },
  { value: 'CASADO', label: 'Casado(a)' },
  { value: 'DIVORCIADO', label: 'Divorciado(a)' },
  { value: 'VIUVO', label: 'Viúvo(a)' },
  { value: 'SEPARADO', label: 'Separado(a)' },
  { value: 'UNIAO_ESTAVEL', label: 'União Estável' }
];

export const ESCOLARIDADE_OPTIONS = [
  { value: 'FUNDAMENTAL_INCOMPLETO', label: 'Fundamental Incompleto' },
  { value: 'FUNDAMENTAL_COMPLETO', label: 'Fundamental Completo' },
  { value: 'MEDIO_INCOMPLETO', label: 'Médio Incompleto' },
  { value: 'MEDIO_COMPLETO', label: 'Médio Completo' },
  { value: 'SUPERIOR_INCOMPLETO', label: 'Superior Incompleto' },
  { value: 'SUPERIOR_COMPLETO', label: 'Superior Completo' },
  { value: 'POS_GRADUACAO', label: 'Pós-graduação' },
  { value: 'MESTRADO', label: 'Mestrado' },
  { value: 'DOUTORADO', label: 'Doutorado' }
];

export const TIPO_SANGUINEO_OPTIONS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' }
];

export const RACA_OPTIONS = [
  { value: 'BRANCO', label: 'Branco' },
  { value: 'PARDO', label: 'Pardo' },
  { value: 'NEGRO', label: 'Negro' },
  { value: 'AMARELO', label: 'Amarelo' },
  { value: 'INDIGENA', label: 'Indígena' },
  { value: 'NAO_DECLARADO', label: 'Não Declarado' }
];

export const GENDER_OPTIONS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },
  { value: 'OUTRO', label: 'Outro' },
  { value: 'NAO_DECLARADO', label: 'Prefiro não declarar' }
];

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