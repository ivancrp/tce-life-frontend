import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { 
  ArrowLeft,
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
  Download,
  ChevronDown,
  Search,
  Filter,
  Plus,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';
import { PatientUser, VitalSigns, Medication, Exam, MedicalRecord } from '../types/medical-record';
import api from '../services/api';
import ErrorNotification from '../components/ErrorNotification';
import Breadcrumbs from '../components/Breadcrumbs';

interface ErrorState {
  visible: boolean;
  message: string;
}

const PatientRecord = () => {
  console.log('=== PatientRecord: Componente inicializado ===');
  
  const { id } = useParams();
  const navigate = useNavigate();
  console.log('ID do paciente recebido:', id);

  const [patient, setPatient] = useState<PatientUser | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [consultations, setConsultations] = useState<MedicalRecord[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({ visible: false, message: '' });

  useEffect(() => {
    // Configurar token de autenticação
    const token = localStorage.getItem('@TCE:token');
    if (!token) {
      console.log('Token não encontrado, usando modo de desenvolvimento');
      // Em desenvolvimento, permitir acesso mesmo sem token
      if (process.env.NODE_ENV === 'development') {
        loadAllData();
        return;
      }
      console.error('Token não encontrado');
      setError({ visible: true, message: 'Sessão expirada. Por favor, faça login novamente.' });
      navigate('/login');
      return;
    }
    
    api.defaults.headers.Authorization = `Bearer ${token}`;
    loadAllData();
  }, [id, navigate]);

  const handleError = (error: any, context: string) => {
    console.group(`=== Erro em ${context} ===`);
    console.error('Erro completo:', error);
    console.log('Mensagem:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados da resposta:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else if (error.request) {
      console.log('Requisição sem resposta:', error.request);
    }
    console.groupEnd();

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

    console.log('Mensagem de erro definida:', errorMessage);
    setError({ visible: true, message: errorMessage });
  };

  const loadAllData = async () => {
    console.group('=== Iniciando carregamento de todos os dados ===');
    console.log('ID do paciente:', id);
    
    setIsLoading(true);
    setError({ visible: false, message: '' });
    
    try {
      // Usando diretamente os dados mockados sem tentar chamar a API
      console.log('Carregando dados mockados...');
      
      const mockPatient = {
        id: id || 'mock-123',
        name: "Maria Silva Santos",
        email: "maria.silva@email.com",
        profilePicture: "https://i.pravatar.cc/300?img=47",
        isActive: true,
        role: {
          id: "1",
          name: "PACIENTE"
        },
        dateOfBirth: new Date("1985-03-15"),
        gender: "female" as "female",
        cpf: "123.456.789-00",
        insurance: "Unimed",
        createdAt: new Date(),
        updatedAt: new Date(),
        // Campos adicionais do PatientUser
        avatar_url: "https://i.pravatar.cc/300?img=47",
        age: 38,
        blood_type: "A+",
        allergies: ["Penicilina", "Dipirona", "Frutos do Mar"],
        health_insurance: "Unimed",
        phone: "(11) 98765-4321",
        rg: "12.345.678-9",
        birth_date: "1985-03-15",
        address: {
          street: "Avenida Paulista",
          number: "1000",
          neighborhood: "Bela Vista",
          city: "São Paulo",
          state: "SP",
          zip_code: "01310-100"
        },
        contact: {
          phone: "(11) 98765-4321",
          email: "maria.silva@email.com",
          emergency_contact: "(11) 99999-8888"
        }
      } as PatientUser;

      const mockVitalSigns = {
        id: "vs-" + Date.now(),
        patient_id: id || 'mock-123',
        blood_pressure: "120/80",
        temperature: 36.5,
        heart_rate: 72,
        respiratory_rate: 16,
        oxygen_saturation: 98,
        weight: 65.5,
        height: 165,
        bmi: 24.1,
        updated_at: new Date().toISOString()
      };

      const mockMedications = [
        {
          id: "med-1",
          name: "Losartana Potássica",
          dosage: "50mg",
          frequency: "1x ao dia",
          start_date: "2024-01-01",
          end_date: undefined,
          instructions: "Tomar 1 comprimido pela manhã",
          prescribed_by: "Dr. Carlos Santos",
          active: true
        },
        {
          id: "med-2",
          name: "Metformina",
          dosage: "850mg",
          frequency: "2x ao dia",
          start_date: "2024-01-01",
          end_date: undefined,
          instructions: "Tomar após as principais refeições",
          prescribed_by: "Dra. Ana Oliveira",
          active: true
        },
        {
          id: "med-3",
          name: "Atorvastatina",
          dosage: "20mg",
          frequency: "1x ao dia",
          start_date: "2024-01-15",
          end_date: undefined,
          instructions: "Tomar 1 comprimido à noite",
          prescribed_by: "Dr. Carlos Santos",
          active: true
        }
      ];

      const mockConsultations = [
        {
          id: "cons-1",
          patient_id: id || 'mock-123',
          doctor_id: "doc-1",
          title: "Consulta de Rotina - Clínico Geral",
          date: "2024-02-15",
          doctor_name: "Dr. Carlos Santos",
          specialty: "Clínico Geral",
          notes: "Paciente apresenta pressão arterial controlada. Mantidos medicamentos atuais. Solicitados exames de rotina.",
          tags: ["Rotina", "Hipertensão", "Check-up"],
          type: "consultation"
        },
        {
          id: "cons-2",
          patient_id: id || 'mock-123',
          doctor_id: "doc-2",
          title: "Avaliação Cardiológica",
          date: "2024-02-01",
          doctor_name: "Dra. Maria Silva",
          specialty: "Cardiologia",
          notes: "Eletrocardiograma normal. Mantida medicação anti-hipertensiva. Retorno em 6 meses.",
          tags: ["Cardiologia", "Hipertensão"],
          type: "consultation"
        },
        {
          id: "cons-3",
          patient_id: id || 'mock-123',
          doctor_id: "doc-3",
          title: "Consulta Endocrinologia",
          date: "2024-01-20",
          doctor_name: "Dr. Roberto Oliveira",
          specialty: "Endocrinologia",
          notes: "Diabetes controlada. HbA1c: 6.5%. Ajustada dose da Metformina. Orientações nutricionais reforçadas.",
          tags: ["Endocrinologia", "Diabetes"],
          type: "consultation"
        }
      ];

      const mockExams = [
        {
          id: "exam-1",
          name: "Hemograma Completo",
          category: "Exame de Sangue",
          lab: "Laboratório Central",
          date: "2024-02-10",
          time: "08:30",
          status: "Concluído",
          result_url: "#"
        },
        {
          id: "exam-2",
          name: "Eletrocardiograma",
          category: "Cardiologia",
          lab: "Centro Cardio",
          date: "2024-02-01",
          time: "14:15",
          status: "Concluído",
          result_url: "#"
        },
        {
          id: "exam-3",
          name: "Hemoglobina Glicada (HbA1c)",
          category: "Exame de Sangue",
          lab: "Laboratório Central",
          date: "2024-01-20",
          time: "09:00",
          status: "Concluído",
          result_url: "#"
        },
        {
          id: "exam-4",
          name: "Perfil Lipídico",
          category: "Exame de Sangue",
          lab: "Laboratório Central",
          date: "2024-01-20",
          time: "09:00",
          status: "Concluído",
          result_url: "#"
        }
      ];

      console.log('Definindo dados mockados no estado...');
      setPatient(mockPatient);
      setVitalSigns(mockVitalSigns);
      setMedications(mockMedications);
      setConsultations(mockConsultations);
      setExams(mockExams);
      
      console.log('Dados mockados carregados com sucesso');
    } catch (error) {
      console.error('Erro ao carregar dados mockados:', error);
      handleError(error, 'dados do prontuário');
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  };

  const loadVitalSigns = async () => {
    console.group('=== Carregando sinais vitais ===');
    if (!id) {
      console.log('ID não fornecido, abortando');
      console.groupEnd();
      return;
    }

    try {
      console.log('Iniciando requisição para /medical-records/vital-signs/latest');
      const response = await api.get('/medical-records/vital-signs/latest', {
        params: { 
          patient_id: id,
          type: 'vital-signs'
        }
      });
      
      console.log('Resposta recebida:', response);
      console.log('Dados:', response.data);

      // Dados mockados temporários
      const mockVitalSigns = {
        id: "vs-" + Date.now(),
        patient_id: id,
        blood_pressure: "120/80",
        temperature: "36.5",
        heart_rate: "72",
        respiratory_rate: "16",
        oxygen_saturation: 98,
        weight: "75.5",
        height: "175",
        bmi: "24.6",
        updated_at: new Date().toISOString()
      };

      let vitalSignsData;
      if (response.data && typeof response.data === 'object' && !response.data.message) {
        if (Array.isArray(response.data)) {
          console.log('Resposta é um array, pegando primeiro item');
          vitalSignsData = response.data[0];
        } else {
          console.log('Resposta é um objeto');
          vitalSignsData = response.data;
        }
      } else {
        console.log('API retornou apenas mensagem, usando dados mockados');
        vitalSignsData = mockVitalSigns;
      }

      console.log('Dados processados:', vitalSignsData);
      setVitalSigns(vitalSignsData);
    } catch (error) {
      console.error('Erro ao carregar sinais vitais:', error);
      handleError(error, 'Sinais vitais');
      setVitalSigns(null);
    } finally {
      console.groupEnd();
    }
  };

  const loadMedications = async () => {
    console.group('=== Carregando medicações ===');
    if (!id) {
      console.log('ID não fornecido, abortando');
      console.groupEnd();
      return;
    }

    try {
      console.log('Iniciando requisição para /prescriptions/active');
      const response = await api.get('/prescriptions/active', {
        params: { 
          patient_id: id,
          status: 'active'
        }
      });
      
      console.log('Resposta recebida:', response);
      console.log('Dados:', response.data);

      // Dados mockados temporários
      const mockMedications = [
        {
          id: "med-1",
          name: "Dipirona",
          dosage: "500mg",
          frequency: "A cada 6 horas",
          start_date: "2024-01-01",
          end_date: "2024-01-07",
          instructions: "Tomar com água",
          prescribed_by: "Dr. Carlos Santos",
          status: "active"
        },
        {
          id: "med-2",
          name: "Omeprazol",
          dosage: "20mg",
          frequency: "1x ao dia",
          start_date: "2024-01-01",
          end_date: null,
          instructions: "Tomar em jejum",
          prescribed_by: "Dra. Ana Oliveira",
          status: "active"
        }
      ];

      let medicationsData;
      if (response.data && typeof response.data === 'object' && !response.data.message) {
        medicationsData = Array.isArray(response.data) ? response.data : response.data?.prescriptions || [];
      } else {
        console.log('API retornou apenas mensagem, usando dados mockados');
        medicationsData = mockMedications;
      }

      console.log('Dados processados:', medicationsData);
      setMedications(medicationsData);
    } catch (error) {
      console.error('Erro ao carregar medicações:', error);
      handleError(error, 'Medicações');
      setMedications([]);
    } finally {
      console.groupEnd();
    }
  };

  const loadConsultations = async () => {
    console.group('=== Carregando consultas ===');
    if (!id) {
      console.log('ID não fornecido, abortando');
      console.groupEnd();
      return;
    }

    try {
      console.log('Iniciando requisição para /medical-records');
      const response = await api.get('/medical-records', {
        params: { 
          patient_id: id,
          type: 'consultation',
          order: 'desc'
        }
      });
      
      console.log('Resposta recebida:', response);
      console.log('Dados:', response.data);

      // Dados mockados temporários
      const mockConsultations = [
        {
          id: "cons-1",
          title: "Consulta de Rotina",
          date: "2024-01-15",
          doctor_name: "Dr. Carlos Santos",
          specialty: "Clínico Geral",
          notes: "Paciente apresentou queixas de dor de cabeça. Prescritos analgésicos e exames de rotina.",
          tags: ["Rotina", "Dor de cabeça"]
        },
        {
          id: "cons-2",
          title: "Avaliação Cardiológica",
          date: "2024-01-02",
          doctor_name: "Dra. Maria Silva",
          specialty: "Cardiologia",
          notes: "Exame cardíaco normal. Mantida medicação atual.",
          tags: ["Cardiologia", "Checkup"]
        }
      ];

      let consultationsData;
      if (response.data && typeof response.data === 'object' && !response.data.message) {
        consultationsData = Array.isArray(response.data) ? response.data : response.data?.records || [];
      } else {
        console.log('API retornou apenas mensagem, usando dados mockados');
        consultationsData = mockConsultations;
      }

      console.log('Dados processados:', consultationsData);
      setConsultations(consultationsData);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
      handleError(error, 'Consultas');
      setConsultations([]);
    } finally {
      console.groupEnd();
    }
  };

  const loadExams = async () => {
    console.group('=== Carregando exames ===');
    if (!id) {
      console.log('ID não fornecido, abortando');
      console.groupEnd();
      return;
    }

    try {
      console.log('Iniciando requisição para /medical-records');
      const response = await api.get('/medical-records', {
        params: { 
          patient_id: id,
          type: 'exam',
          order: 'desc'
        }
      });
      
      console.log('Resposta recebida:', response);
      console.log('Dados:', response.data);

      // Dados mockados temporários
      const mockExams = [
        {
          id: "exam-1",
          name: "Hemograma Completo",
          category: "Exame de Sangue",
          lab: "Laboratório Central",
          date: "2024-01-10",
          time: "08:30",
          status: "Concluído",
          result_url: "#"
        },
        {
          id: "exam-2",
          name: "Raio-X de Tórax",
          category: "Radiologia",
          lab: "Centro de Imagem",
          date: "2024-01-05",
          time: "14:15",
          status: "Concluído",
          result_url: "#"
        }
      ];

      let examsData;
      if (response.data && typeof response.data === 'object' && !response.data.message) {
        examsData = Array.isArray(response.data) ? response.data : response.data?.records || [];
      } else {
        console.log('API retornou apenas mensagem, usando dados mockados');
        examsData = mockExams;
      }

      console.log('Dados processados:', examsData);
      setExams(examsData);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
      handleError(error, 'Exames');
      setExams([]);
    } finally {
      console.groupEnd();
    }
  };

  const dismissError = () => {
    console.log('Fechando notificação de erro');
    setError({ visible: false, message: '' });
  };

  console.log('=== Estado atual do componente ===');
  console.log('isLoading:', isLoading);
  console.log('error:', error);
  console.log('patient:', patient);
  console.log('vitalSigns:', vitalSigns);
  console.log('medications.length:', medications.length);
  console.log('consultations.length:', consultations.length);
  console.log('exams.length:', exams.length);

  if (isLoading) {
    console.log('Renderizando tela de carregamento');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando prontuário...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    console.log('Renderizando tela de paciente não encontrado');
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Paciente não encontrado</h3>
          <p className="mt-2 text-gray-500">
            Não foi possível encontrar os dados do paciente solicitado.
          </p>
          <button
            onClick={() => navigate('/pacientes')}
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para lista de pacientes
          </button>
        </div>
      </div>
    );
  }

  console.log('Renderizando prontuário completo');
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs />
      {error.visible && (
        <ErrorNotification
          message={error.message}
          onDismiss={dismissError}
        />
      )}

      <div className="space-y-6">
        {/* Informações do Paciente */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white shadow-lg">
                {patient.avatar_url ? (
                  <img
                    src={patient.avatar_url}
                    alt={patient.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50">
                    <UserIcon className="w-12 h-12 text-blue-300" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
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
                  <span className="text-sm text-gray-600">
                    {patient.gender === 'male' ? 'Masculino' : 'Feminino'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {patient.birth_date
                      ? `${patient.age} anos (${new Date(patient.birth_date).toLocaleDateString()})`
                      : 'Não informado'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">{patient.health_insurance}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Tipo Sanguíneo:</span>
                  <span className="text-sm text-gray-600">{patient.blood_type}</span>
                </div>
                {patient.allergies && patient.allergies.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="text-sm font-medium text-gray-700">Alergias:</span>
                    <div className="flex gap-2">
                      {patient.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-sm"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Coluna da esquerda: Sinais Vitais + Histórico de Consultas */}
          <div className="space-y-4">
        {/* Sinais Vitais */}
        {vitalSigns && (
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Sinais Vitais</h2>
                  <span className="text-xs text-gray-500">
                    Atualizado: 10/03/2024 14:30
              </span>
            </div>
                <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                  {/* Pressão Arterial */}
                  <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Pressão Arterial</span>
                </div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-medium text-gray-900">120/80</span>
                      <span className="text-xs text-gray-500 ml-1">m</span>
                </div>
                    <div className="mt-1">
                      <span className="text-xs text-green-700 bg-green-100 px-1.5 py-px rounded-full">Normal</span>
                      <span className="text-xs text-gray-400 ml-1.5">—</span>
              </div>
                </div>

                  {/* Temperatura */}
                  <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Thermometer className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Temperatura</span>
                </div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-medium text-gray-900">36.5</span>
                      <span className="text-xs text-gray-500 ml-1">°C</span>
              </div>
                    <div className="mt-1">
                      <span className="text-xs text-green-700 bg-green-100 px-1.5 py-px rounded-full">Normal</span>
                      <span className="text-xs text-gray-400 ml-1.5">—</span>
                </div>
                </div>

                  {/* Frequência Cardíaca */}
                  <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Heart className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Freq. Cardíaca</span>
              </div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-medium text-gray-900">88</span>
                      <span className="text-xs text-gray-500 ml-1">bpm</span>
                </div>
                    <div className="mt-1">
                      <span className="text-xs text-green-700 bg-green-100 px-1.5 py-px rounded-full">Normal</span>
                      <span className="text-xs text-gray-400 ml-1.5">↗</span>
                </div>
              </div>

                  {/* Frequência Respiratória */}
                  <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Freq. Respiratória</span>
                </div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-medium text-gray-900">18</span>
                      <span className="text-xs text-gray-500 ml-1">rpm</span>
                </div>
                    <div className="mt-1">
                      <span className="text-xs text-green-700 bg-green-100 px-1.5 py-px rounded-full">Normal</span>
                      <span className="text-xs text-gray-400 ml-1.5">—</span>
              </div>
            </div>

                  {/* Peso */}
                  <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Scale className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Peso</span>
          </div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-medium text-gray-900">68.5</span>
                      <span className="text-xs text-gray-500 ml-1">kg</span>
                      </div>
                    <div className="mt-1">
                      <span className="text-xs text-green-700 bg-green-100 px-1.5 py-px rounded-full">Normal</span>
                      <span className="text-xs text-gray-400 ml-1.5">↗</span>
                    </div>
                  </div>
                    </div>
                    </div>
            )}

        {/* Histórico de Consultas */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Histórico de Consultas</h2>
            <button
              onClick={loadConsultations}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </button>
          </div>
              <div className="space-y-3">
            {consultations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhuma consulta registrada
              </p>
            ) : (
              consultations.map((consultation) => (
                <div
                  key={consultation.id}
                      className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <span className="text-xs text-gray-500 mt-1">
                          {new Date(consultation.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                            <h3 className="text-sm font-medium text-gray-900">
                          {consultation.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                              <UserIcon size={14} className="text-gray-400" />
                              <span className="text-xs text-gray-600">
                            Dr. {consultation.doctor_name}
                          </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-600">
                            {consultation.specialty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-600">{consultation.notes}</p>
                  </div>
                  {consultation.tags && consultation.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                      {consultation.tags.map((tag, index) => (
                        <span
                          key={index}
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

            {/* Últimos Atestados */}
            <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Últimos Atestados</h2>


                <div className="flex gap-2">  
              
                <button className="p-2">
                  <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <button  className="p-2">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </button>
                </div>
              </div>

              <div className="relative">
            
              <Swiper
                  modules={[Navigation]}
                  navigation={{
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next',
                  }}
                  spaceBetween={16}
                  slidesPerView={3}
                  breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                  }}
                >
              
                  {/* Atestado 1 */}
                  <SwiperSlide>
                    <div className="border border-gray-200 rounded-lg p-4 h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <h3 className="text-sm font-medium text-gray-900">Atestado Médico</h3>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>23/01/2024</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                              <UserIcon className="w-3 h-3 text-gray-600" />
                            </div>
                            <span>Dra. Fernanda Lopes</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          Afastamento: 3 dias
                        </p>
                        <p className="text-xs text-gray-600">
                          CID: L23 - Dermatite
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Emitido há 2 meses</span>
                        <button className="text-blue-600 hover:text-blue-700">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>

                  {/* Atestado 2 */}
                  <SwiperSlide>
                    <div className="border border-gray-200 rounded-lg p-4 h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <h3 className="text-sm font-medium text-gray-900">Atestado Médico</h3>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>15/11/2023</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                              <UserIcon className="w-3 h-3 text-gray-600" />
                            </div>
                            <span>Dr. Roberto Almeida</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          Afastamento: 15 dias
                        </p>
                        <p className="text-xs text-gray-600">
                          CID: K35 - Apendicite
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Emitido há 4 meses</span>
                        <button className="text-blue-600 hover:text-blue-700">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>

                  {/* Atestado 3 */}
                  <SwiperSlide>
                    <div className="border border-gray-200 rounded-lg p-4 h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <h3 className="text-sm font-medium text-gray-900">Atestado Médico</h3>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>05/10/2023</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                              <UserIcon className="w-3 h-3 text-gray-600" />
                            </div>
                            <span>Dr. Carlos Mendes</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          Afastamento: 1 dia
                        </p>
                        <p className="text-xs text-gray-600">
                          CID: M54 - Lombalgia
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Emitido há 5 meses</span>
                        <button className="text-blue-600 hover:text-blue-700">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>

                  {/* Atestado 4 */}
                  <SwiperSlide>
                    <div className="border border-gray-200 rounded-lg p-4 h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <h3 className="text-sm font-medium text-gray-900">Atestado Médico</h3>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>05/10/2023</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                              <UserIcon className="w-3 h-3 text-gray-600" />
                            </div>
                            <span>Dr. Carlos Mendes</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          Afastamento: 1 dia
                        </p>
                        <p className="text-xs text-gray-600">
                          CID: M54 - Lombalgia
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Emitido há 5 meses</span>
                        <button className="text-blue-600 hover:text-blue-700">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>

          {/* Coluna da direita: Medicamentos */}
          <div className="bg-white rounded-lg p-4">
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Medicações</h2>
              <h3 className="text-sm text-gray-600 mt-0.5">Medicamentos Ativos</h3>
            </div>
            <div className="space-y-3">
              {medications.map((medication) => (
                <div key={medication.id} className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-base font-medium text-gray-900">{medication.name}</h3>
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">Dosagem:</span>
                        <span className="text-xs font-medium text-gray-900">{medication.dosage}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        <Clock className="w-4 h-4 inline mr-1.5 text-gray-400" />
                        {medication.frequency}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        <Calendar className="w-4 h-4 inline mr-1.5 text-gray-400" />
                        De {new Date(medication.start_date).toLocaleDateString()} até{' '}
                        {medication.end_date ? new Date(medication.end_date).toLocaleDateString() : 'Uso contínuo'}
                      </div>
                      {medication.instructions && (
                        <div className="text-xs text-gray-600 italic mt-1.5">
                          {medication.instructions}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="px-1.5 py-px bg-green-100 text-green-700 rounded-full text-xs">
                        Ativo
                      </span>
                      <span className="text-xs text-gray-500">
                        Prescrito por: {medication.prescribed_by}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Histórico de Medicamentos */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Histórico de Medicamentos</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs text-gray-500 pb-2">Medicamento</th>
                      <th className="text-left text-xs text-gray-500 pb-2">Dosagem</th>
                      <th className="text-left text-xs text-gray-500 pb-2">Frequência</th>
                      <th className="text-left text-xs text-gray-500 pb-2">Período</th>
                      <th className="text-left text-xs text-gray-500 pb-2">Prescrito por</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="text-xs">
                      <td className="py-2">
                        <div>Betametasona</div>
                        <div className="text-xs text-gray-500">(Pomada)</div>
                      </td>
                      <td className="py-2">1%</td>
                      <td className="py-2">Aplicar 2x ao dia</td>
                      <td className="py-2">
                        23/01/2024<br/>
                        <span className="text-gray-500">-</span><br/>
                        06/02/2024
                      </td>
                      <td className="py-2">
                        <span className="text-blue-600">Dra. Fernanda Lopes</span>
                      </td>
                    </tr>
                    <tr className="text-xs">
                      <td className="py-2">Amoxicilina</td>
                      <td className="py-2">500mg</td>
                      <td className="py-2">8/8 horas</td>
                      <td className="py-2">
                        15/11/2023<br/>
                        <span className="text-gray-500">-</span><br/>
                        22/11/2023
                      </td>
                      <td className="py-2">
                        <span className="text-blue-600">Dr. Roberto Almeida</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Exames */}
        <div className="bg-white rounded-lg p-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Resultados de Exames</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtrar por:</span>
              <select className="text-sm border border-gray-200 rounded-md px-2 py-1">
                <option>Todos os tipos</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            {exams.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum exame registrado
              </p>
            ) : (
              exams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 border border-gray-100 rounded-lg"
                >
                  {/* Data */}
                  <div className="flex flex-col items-center justify-center w-24 text-emerald-500">
                    <FileCheck className="w-5 h-5 mb-1" />
                    <span className="text-xs">{new Date(exam.date).toLocaleDateString()}</span>
                  </div>

                  {/* Informações do Exame */}
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{exam.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-blue-600">{exam.category}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600">{exam.time}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600">{exam.lab}</span>
                      </div>
                    </div>

                  {/* Botões */}
                  <div className="flex items-center gap-2">
                    <button 
                      className="flex items-center gap-1 px-3 py-1 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => window.open(exam.result_url, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                      <span>PDF</span>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Anotações Clínicas */}
        <div className="bg-white rounded-lg p-4 mt-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Anotações Clínicas</h2>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar nas anotações..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
                    <div className="flex items-center gap-2">
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option>Todas as categorias</option>
              </select>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nova Anotação
              </button>
                    </div>
          </div>

          <div className="space-y-4">
            {/* Avaliação Clínica de Rotina */}
            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-medium text-gray-900">Avaliação Clínica de Rotina</h3>
                    <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-blue-500">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-500">
                    <Trash className="w-4 h-4" />
                  </button>
                    </div>
                  </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Calendar className="w-4 h-4" />
                <span>10/03/2024</span>
                <span className="text-gray-300">•</span>
                <Clock className="w-4 h-4" />
                <span>14:45</span>
                <span className="text-gray-300">•</span>
                <UserIcon className="w-4 h-4" />
                <span>Dr. Carlos Mendes (Clínico Geral)</span>
                </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>Paciente comparece para consulta de rotina. Refere bem-estar geral, sem queixas específicas. Relata prática regular de atividade física (caminhada 3x/semana).</p>
                <p>Exame físico: PA 120/80 mmHg, FC 88 bpm, Peso 68.5 kg. Ausculta cardíaca e pulmonar normais.</p>
                <p>Solicitados exames de rotina para avaliação anual. Mantida medicação anti-hipertensiva. Retorno em 3 meses com resultados.</p>
          </div>

              <div className="flex items-center gap-2 mt-3">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Rotina</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Avaliação Clínica</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Bem-estar</span>
              </div>
            </div>

            {/* Avaliação Dermatológica */}
            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-medium text-gray-900">Avaliação Dermatológica - Dermatite</h3>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-blue-500">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-500">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Calendar className="w-4 h-4" />
                <span>23/01/2024</span>
                <span className="text-gray-300">•</span>
                <Clock className="w-4 h-4" />
                <span>09:30</span>
                <span className="text-gray-300">•</span>
                <UserIcon className="w-4 h-4" />
                <span>Dra. Fernanda Lopes (Dermatologista)</span>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>Paciente apresenta lesões eritematosas, pruriginosas em braço direito com início há 3 dias. Relata contato com produto de limpeza novo.</p>
                <p>Diagnóstico: Dermatite de contato irritativa.</p>
                <p>Prescrição: Betametasona creme 1% 2x/dia por 14 dias. Orientada a evitar o produto de limpeza identificado como possível causador e usar sabonetes neutros. Retorno em caso de piora ou não melhora em 7 dias.</p>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Dermatologia</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Dermatite</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Alergia</span>
              </div>
            </div>

            {/* Nota Pós-Operatório */}
            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-medium text-gray-900">Nota Pós-Operatório - Apendicectomia</h3>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-blue-500">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-500">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Calendar className="w-4 h-4" />
                <span>15/11/2023</span>
                <span className="text-gray-300">•</span>
                <Clock className="w-4 h-4" />
                <span>22:30</span>
                <span className="text-gray-300">•</span>
                <UserIcon className="w-4 h-4" />
                <span>Dr. Roberto Almeida (Cirurgião Geral)</span>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>Paciente submetida a apendicectomia de emergência por videolaparoscopia sob anestesia geral. Achado de apêndice em fase supurativa. Procedimento sem intercorrências. Duração: 50 minutos. Sangramento mínimo.</p>
                <p>Bom estado geral no pós-operatório imediato. Prescritos analgésicos, antibióticos e orientações pós-operatórias.</p>
                <p>Plano: Alta prevista para amanhã, caso evolução satisfatória. Retorno ambulatorial em 7 dias para revisão.</p>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Cirurgia</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Pós-Operatório</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Apendicectomia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecord; 