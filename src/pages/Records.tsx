import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { 
  Search,
  Download,
  Plus,
  ChevronDown,
  FileText,
  Calendar,
  Clock,
  User as UserIcon,
  FileCheck,
  AlertCircle,
  Activity,
  Thermometer,
  Heart,
  Mail,
  Scale,
  MoreVertical,
  Edit,
  Trash,
  RefreshCw,
  Users,
  ArrowRight
} from 'lucide-react';
import type { MedicalRecord, User, VitalSigns, Medication, Exam } from '../types';
import api from '../services/api';
import ErrorNotification from '../components/ErrorNotification';

interface PatientHeaderProps {
  patient: User;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  if (!patient) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="animate-pulse flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 flex items-start gap-6">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
        <img src={patient.avatar_url || '/default-avatar.svg'} alt={patient.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">{patient.name}</h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
            ID: {patient.id}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-2">
          <div className="flex items-center gap-2">
            <UserIcon size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">{patient.gender === 'female' ? 'Feminino' : 'Masculino'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">{patient.birth_date ? `${patient.age} anos (${new Date(patient.birth_date).toLocaleDateString()})` : 'Não informado'}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">{patient.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">{patient.email}</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Tipo Sanguíneo:</span>
            <span className="text-sm text-gray-600">{patient.blood_type}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-sm font-medium text-gray-700">Alergias:</span>
            <div className="flex gap-2">
              {patient.allergies?.map((allergy: string, index: number) => (
                <span key={index} className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-sm">
                  {allergy}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <FileCheck size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Convênio:</span>
            <span className="text-sm text-gray-600">{patient.health_insurance}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface VitalSignsCardProps {
  vitalSigns: VitalSigns;
  updatedAt: string;
}

const VitalSignsCard: React.FC<VitalSignsCardProps> = ({ vitalSigns, updatedAt }) => (
  <div className="bg-white rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">Sinais Vitais</h2>
      <span className="text-sm text-gray-500">Atualizado: {new Date(updatedAt).toLocaleString()}</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      <div>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600">Pressão Arterial</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-gray-900">{vitalSigns.blood_pressure}</span>
          <span className="text-sm text-gray-500">mmHg</span>
        </div>
        <span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded">Normal</span>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600">Temperatura</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-gray-900">{vitalSigns.temperature}</span>
          <span className="text-sm text-gray-500">°C</span>
        </div>
        <span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded">Normal</span>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600">Freq. Cardíaca</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-gray-900">{vitalSigns.heart_rate}</span>
          <span className="text-sm text-gray-500">bpm</span>
        </div>
        <span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded">Normal</span>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600">Freq. Respiratória</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-gray-900">{vitalSigns.respiratory_rate}</span>
          <span className="text-sm text-gray-500">rpm</span>
        </div>
        <span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded">Normal</span>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600">Peso</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-gray-900">{vitalSigns.weight}</span>
          <span className="text-sm text-gray-500">kg</span>
        </div>
        <span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded">Normal</span>
      </div>
    </div>
  </div>
);

interface MedicationCardProps {
  medication: Medication;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
          {medication.active && (
            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-sm">
              Ativo
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">Dosagem: {medication.dosage}</p>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <MoreVertical size={20} />
      </button>
    </div>
    <div className="mt-3">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock size={16} />
        <span>{medication.frequency}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
        <Calendar size={16} />
        <span>De {new Date(medication.start_date).toLocaleDateString()} até {medication.end_date ? new Date(medication.end_date).toLocaleDateString() : 'Uso contínuo'}</span>
      </div>
    </div>
    {medication.instructions && (
      <p className="mt-3 text-sm text-gray-600 italic">{medication.instructions}</p>
    )}
    <div className="mt-3 text-sm text-gray-500">
      Prescrito por: Dr. {medication.prescribed_by}
    </div>
  </div>
);

interface ConsultationCardProps {
  consultation: MedicalRecord;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({ consultation, onEdit, onDelete }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <Calendar className="w-6 h-6 text-blue-500" />
          <span className="text-sm text-gray-500 mt-1">{new Date(consultation.date).toLocaleDateString()}</span>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{consultation.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <UserIcon size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Dr. {consultation.doctor_name}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">{consultation.specialty}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onEdit && (
          <button onClick={onEdit} className="p-1 text-gray-400 hover:text-gray-600">
            <Edit size={18} />
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-600">
            <Trash size={18} />
          </button>
        )}
      </div>
    </div>
    <div className="mt-4">
      <p className="text-gray-600">{consultation.notes}</p>
    </div>
    {consultation.tags && consultation.tags.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {consultation.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

interface ExamCardProps {
  exam: Exam;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{exam.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-500">{exam.category}</span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-500">{exam.lab}</span>
        </div>
      </div>
      <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
        PDF
      </button>
    </div>
    <div className="mt-3 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-gray-400" />
        <span className="text-sm text-gray-600">{new Date(exam.date).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-gray-400" />
        <span className="text-sm text-gray-600">{exam.time}</span>
      </div>
    </div>
  </div>
);

interface ErrorState {
  visible: boolean;
  message: string;
}

interface PatientListProps {
  patients: User[];
  onViewDetails: (patientId: string) => void;
  isLoading: boolean;
}

const PatientList: React.FC<PatientListProps> = ({ patients, onViewDetails, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = Array.isArray(patients) ? patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toString().includes(searchTerm)
  ) : [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar paciente por nome ou ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Nenhum paciente encontrado
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 border border-transparent"
            >
              <div className="flex-1 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={patient.avatar_url || '/default-avatar.svg'}
                    alt={patient.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-500">
                    ID: {patient.id} • {patient.birth_date ? `${patient.age} anos` : 'Idade não informada'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onViewDetails(patient.id)}
                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                title="Ver prontuário completo"
              >
                Ver prontuário
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Records = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({ visible: false, message: '' });

  const handleError = (error: any, context: string) => {
    let errorMessage = 'Ocorreu um erro ao carregar os dados.';
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
          break;
        case 403:
          errorMessage = 'Você não tem permissão para acessar estes dados.';
          break;
        case 404:
          errorMessage = `${context} não encontrado.`;
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = `Erro ao carregar ${context.toLowerCase()}. Tente novamente.`;
      }
    } else if (error.request) {
      errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    }

    setError({ visible: true, message: errorMessage });
    console.error(`Erro em ${context}:`, error);
  };

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users', {
        params: {
          type: 'PACIENTE'
        }
      });

      if (Array.isArray(response.data)) {
        setPatients(response.data);
      } else if (response.data && typeof response.data === 'object') {
        const patientsArray = response.data.users || response.data.data || [];
        if (!Array.isArray(patientsArray)) {
          throw new Error('Dados de pacientes em formato inválido');
        }
        
        const filteredPatients = patientsArray.filter(user => user.type === 'PACIENTE');
        setPatients(filteredPatients);
      } else {
        throw new Error('Formato de dados inválido');
      }
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      handleError(error, 'Lista de pacientes');
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (patientId: string) => {
    navigate(`/medical-records/${patientId}`);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const dismissError = () => {
    setError({ visible: false, message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        {error.visible && (
          <ErrorNotification
            message={error.message}
            onDismiss={dismissError}
          />
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Lista de Pacientes
          </h1>
          <button
            onClick={loadPatients}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar lista
          </button>
        </div>

        <PatientList
          patients={patients}
          onViewDetails={handleViewDetails}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Records;