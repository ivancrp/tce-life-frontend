import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Clock,
  Save,
  Printer,
  Send,
  FileText,
  FileCheck,
  ChevronLeft,
  User,
  Thermometer,
  Heart,
  Activity,
  Wind,
  Weight,
  Ruler,
  Check,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
  Pill,
  Activity as ActivityIcon,
  ArrowLeft,
  XCircle,
  CheckCircle2,
  Ban
} from 'lucide-react';
import Button from '../components/Button';
import { attendanceService, Attendance, VitalSigns, Medication, MedicalExam } from '../services/attendance.service';
import PrescriptionModal from '../components/PrescriptionModal';
import CertificateModal from '../components/CertificateModal';
import AddAllergyModal from '../components/AddAllergyModal';
import AddMedicationInUseModal, { MedicationInUse } from '../components/AddMedicationInUseModal';
import InputMask from 'react-input-mask';
import { toast } from 'react-hot-toast';
import RequestExamModal from '../components/RequestExamModal';
import { ExamRequestModal } from '../components/ExamRequestModal';
import ExamUploadModal from '../components/ExamUploadModal';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import Breadcrumbs from '../components/Breadcrumbs';

interface VitalSignsInput {
  temperature: string;
  bloodPressure: string;
  heartRate: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  weight: string;
  height: string;
}

interface VitalSignsErrors {
  temperature?: string;
  bloodPressure?: string;
  heartRate?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  weight?: string;
  height?: string;
}

const validateVitalSigns = (vitalSigns: VitalSignsInput): VitalSignsErrors => {
  const errors: VitalSignsErrors = {};

  // Temperatura (35°C - 42°C)
  const temp = parseFloat(vitalSigns.temperature);
  if (temp && (temp < 35 || temp > 42)) {
    errors.temperature = 'Temperatura deve estar entre 35°C e 42°C';
  }

  // Pressão Arterial (formato XXX/XX)
  if (vitalSigns.bloodPressure) {
    const [systolic, diastolic] = vitalSigns.bloodPressure.split('/').map(Number);
    if (systolic < 70 || systolic > 200 || diastolic < 40 || diastolic > 130) {
      errors.bloodPressure = 'Pressão arterial fora dos limites normais';
    }
  }

  // Frequência Cardíaca (40-200 bpm)
  const hr = parseInt(vitalSigns.heartRate);
  if (hr && (hr < 40 || hr > 200)) {
    errors.heartRate = 'Frequência cardíaca deve estar entre 40 e 200 bpm';
  }

  // Frequência Respiratória (8-40 rpm)
  const rr = parseInt(vitalSigns.respiratoryRate);
  if (rr && (rr < 8 || rr > 40)) {
    errors.respiratoryRate = 'Frequência respiratória deve estar entre 8 e 40 rpm';
  }

  // Saturação O2 (60-100%)
  const o2 = parseInt(vitalSigns.oxygenSaturation);
  if (o2 && (o2 < 60 || o2 > 100)) {
    errors.oxygenSaturation = 'Saturação de O2 deve estar entre 60% e 100%';
  }

  // Peso (0.5-300 kg)
  const weight = parseFloat(vitalSigns.weight);
  if (weight && (weight < 0.5 || weight > 300)) {
    errors.weight = 'Peso deve estar entre 0.5 e 300 kg';
  }

  // Altura (0.3-2.5 m)
  const height = parseFloat(vitalSigns.height);
  if (height && (height < 0.3 || height > 2.5)) {
    errors.height = 'Altura deve estar entre 0.3 e 2.5 metros';
  }

  return errors;
};

export function AtendimentoPage() {
  const { id: scheduleId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizingAttendance, setIsFinalizingAttendance] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [finalizationSuccess, setFinalizationSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isAddAllergyModalOpen, setIsAddAllergyModalOpen] = useState(false);
  const [isAddMedicationModalOpen, setIsAddMedicationModalOpen] = useState(false);
  const [isExamRequestModalOpen, setIsExamRequestModalOpen] = useState(false);

  // Estados para todos os campos do atendimento
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [observations, setObservations] = useState('');
  const [vitalSigns, setVitalSigns] = useState<VitalSignsInput>({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: ''
  });

  const [vitalSignsErrors, setVitalSignsErrors] = useState<VitalSignsErrors>({});

  useEffect(() => {
    if (scheduleId) {
      loadAttendance(scheduleId);
    }
  }, [scheduleId]);

  async function loadAttendance(scheduleId: string) {
    try {
      setLoading(true);
      const data = await attendanceService.getByScheduleId(scheduleId);
      console.log('Dados do atendimento carregados:', data);
      setAttendance(data);
      
      // Inicializar todos os campos
      setSymptoms(data.symptoms || '');
      setDiagnosis(data.diagnosis || '');
      setPrescription(data.prescription || '');
      setObservations(data.observations || '');
      setVitalSigns({
        temperature: data.vitalSigns?.temperature?.toString() || '',
        bloodPressure: data.vitalSigns?.bloodPressure || '',
        heartRate: data.vitalSigns?.heartRate?.toString() || '',
        respiratoryRate: data.vitalSigns?.respiratoryRate?.toString() || '',
        oxygenSaturation: data.vitalSigns?.oxygenSaturation?.toString() || '',
        weight: data.vitalSigns?.weight?.toString() || '',
        height: data.vitalSigns?.height?.toString() || ''
      });
    } catch (error) {
      setError('Erro ao carregar dados do atendimento');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Função para atualizar sinais vitais
  const handleVitalSignsChange = (field: string, value: string) => {
    const newVitalSigns = {
      ...vitalSigns,
      [field]: value
    };
    setVitalSigns(newVitalSigns);
    
    // Valida o campo alterado
    const errors = validateVitalSigns(newVitalSigns);
    setVitalSignsErrors(errors);
  };

  // Função de salvamento
  const handleSave = async () => {
    if (!scheduleId || !attendance) return;

    try {
      // Valida os sinais vitais antes de salvar
      const errors = validateVitalSigns(vitalSigns);
      if (Object.keys(errors).length > 0) {
        setVitalSignsErrors(errors);
        toast.error('Por favor, corrija os valores dos sinais vitais antes de salvar.');
        return;
      }

      // Converte os valores dos sinais vitais para números
      const numericVitalSigns: VitalSigns = {
        temperature: vitalSigns.temperature ? parseFloat(vitalSigns.temperature) : undefined,
        bloodPressure: vitalSigns.bloodPressure || undefined,
        heartRate: vitalSigns.heartRate ? parseInt(vitalSigns.heartRate) : undefined,
        respiratoryRate: vitalSigns.respiratoryRate ? parseInt(vitalSigns.respiratoryRate) : undefined,
        oxygenSaturation: vitalSigns.oxygenSaturation ? parseInt(vitalSigns.oxygenSaturation) : undefined,
        weight: vitalSigns.weight ? parseFloat(vitalSigns.weight) : undefined,
        height: vitalSigns.height ? parseFloat(vitalSigns.height) : undefined
      };

      const updatedAttendance = await attendanceService.update(attendance.id, {
        ...attendance,
        vitalSigns: numericVitalSigns,
        symptoms,
        diagnosis,
        prescription,
        observations
      });

      setAttendance(updatedAttendance);
      setLastSaved(new Date());
      toast.success('Atendimento salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar atendimento:', error);
      toast.error('Erro ao salvar atendimento. Por favor, tente novamente.');
    }
  };

  // Auto-save a cada 30 segundos quando houver mudanças
  useEffect(() => {
    if (!scheduleId || !attendance) return;

    console.log('Configurando auto-save para o atendimento:', scheduleId);
    const timer = setInterval(() => {
      console.log('Executando auto-save...');
      handleSave();
    }, 30000);

    return () => {
      console.log('Limpando timer de auto-save');
      clearInterval(timer);
    };
  }, [handleSave, scheduleId, attendance]);

  // Monitora mudanças nos campos
  useEffect(() => {
    console.log('Campos atualizados:', {
      symptoms,
      diagnosis,
      observations
    });
  }, [symptoms, diagnosis, observations]);

  const handleSalvar = async () => {
    if (!attendance) return;
    await handleSave();
    alert('Atendimento salvo com sucesso!');
  };

  const handleFinalizar = async () => {
    setShowFinalizeModal(true);
  };

  const handleFinalizarAtendimento = async () => {
    if (!attendance?.id) return;

    try {
      // Primeiro salva os dados atuais do atendimento
      await handleSave();
      
      // Depois finaliza o atendimento usando o ID do atendimento
      const finishedAttendance = await attendanceService.complete(attendance.id);
      setAttendance(finishedAttendance);
      
      toast.success('Atendimento finalizado com sucesso!');
      
      // Aguarda um breve momento para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate('/schedule');
      }, 1500);
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error);
      toast.error('Erro ao finalizar atendimento. Por favor, tente novamente.');
    }
  };

  const handleCancelar = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!attendance?.id || !cancelReason.trim()) return;

    try {
      setIsCancelling(true);
      const cancelledAttendance = await attendanceService.cancel(attendance.id, cancelReason);
      setAttendance(cancelledAttendance);
      toast.success('Atendimento cancelado com sucesso!');
      
      // Aguarda um breve momento para mostrar a mensagem de sucesso
      setTimeout(() => {
        setShowCancelModal(false);
        navigate('/schedule');
      }, 1500);
    } catch (error) {
      console.error('Erro ao cancelar atendimento:', error);
      toast.error('Erro ao cancelar atendimento. Por favor, tente novamente.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleAddAllergy = async (newAllergies: string[]) => {
    try {
      if (attendance?.patient?.id) {
        let updatedPatient = attendance.patient;
        
        for (const allergy of newAllergies) {
          updatedPatient = await attendanceService.addAllergy(attendance.patient.id, allergy);
        }
        
        setAttendance({
          ...attendance,
          patient: updatedPatient
        });
        
        toast.success(`${newAllergies.length} ${newAllergies.length === 1 ? 'alergia adicionada' : 'alergias adicionadas'} com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao adicionar alergias:', error);
      toast.error('Erro ao adicionar alergias. Por favor, tente novamente.');
    }
  };

  const handleAddMedication = async (medicationInUse: MedicationInUse) => {
    try {
      if (attendance?.patient?.id) {
        // Converter o formato antigo para o novo
        const medication: Medication = {
          id: '',
          userId: attendance.patient.id,
          attendanceId: null,
          name: medicationInUse.nome,
          dosage: medicationInUse.dosagem,
          frequency: medicationInUse.frequencia,
          duration: null,
          instructions: medicationInUse.instrucoes,
          startDate: new Date(medicationInUse.dataInicio),
          endDate: medicationInUse.dataFim ? new Date(medicationInUse.dataFim) : null,
          active: medicationInUse.status === 'ativo',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const updatedPatient = await attendanceService.addMedication(attendance.patient.id, medication);
        setAttendance({
          ...attendance,
          patient: updatedPatient
        });
        toast.success('Medicamento adicionado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao adicionar medicamento:', error);
      toast.error('Erro ao adicionar medicamento. Por favor, tente novamente.');
    }
  };

  const handleExamRequested = () => {
    if (scheduleId) {
      loadAttendance(scheduleId);
    }
  };

  const handleExamUploaded = () => {
    if (scheduleId) {
      loadAttendance(scheduleId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-600">Carregando atendimento...</p>
        </div>
      </div>
    );
  }

  if (error || !attendance) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
          <h2 className="text-red-800 text-lg font-medium flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Erro
          </h2>
          <p className="text-red-700 mt-2">{error || 'Atendimento não encontrado'}</p>
          <Button 
            variant="outline-primary"
            className="mt-6"
            onClick={() => navigate('/schedule')}
            icon={ChevronLeft}
          >
            Voltar para Agendamentos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/schedule')}
                className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Atendimento Médico</h1>
            </div>
            {lastSaved && (
              <div className="flex items-center text-sm text-gray-500 bg-white px-4 py-2 rounded-md shadow-sm">
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
                    Salvando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Salvo há {formatDistanceToNow(lastSaved, { locale: ptBR })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Informações do Atendimento */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Data</p>
                <p className="font-medium">{format(new Date(attendance.createdAt), "dd 'de' MMMM", { locale: ptBR })}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{attendance.status === 'in_progress' ? 'Em Andamento' : 'Concluído'}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Paciente</p>
                <p className="font-medium">{attendance.patient?.name || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da Esquerda - Informações do Paciente */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card de Informações Pessoais */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start mb-6">
                <div className="flex items-start">
                  {attendance.patient?.profilePicture ? (
                    <img
                      src={attendance.patient.profilePicture}
                      alt={`Foto de ${attendance.patient.name}`}
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{attendance.patient?.name || 'N/A'}</h3>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm text-gray-500">Informações Básicas</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Sexo</p>
                    <p className="font-medium">
                      {attendance.patient?.gender === 'M' ? 'Masculino' : 
                       attendance.patient?.gender === 'F' ? 'Feminino' : 
                       attendance.patient?.gender || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Raça/Etnia</p>
                    <p className="font-medium">{attendance.patient?.raca || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone - TCE</p>
                    <p className="font-medium">
                      <InputMask
                        mask="(99) 9999-9999"
                        maskChar={null}
                        value={attendance.patient?.telefone || ''}
                        disabled
                        className="bg-transparent border-none p-0 font-medium"
                      />
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Celular</p>
                    <p className="font-medium flex items-center">
                      <InputMask
                        mask="(99) 99999-9999"
                        maskChar={null}
                        value={attendance.patient?.celular || ''}
                        disabled
                        className="bg-transparent border-none p-0 font-medium"
                      />
                      {attendance.patient?.celular && (
                        <a
                          href={`https://wa.me/55${attendance.patient.celular.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-green-500 hover:text-green-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </a>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{attendance.patient?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                  onClick={() => navigate(`/medical-records/${attendance.patient?.id}`)}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Prontuário Completo
                </button>
              </div>
            </div>

            {/* Card de Histórico Médico */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Histórico Médico</h2>
              <div className="space-y-6">
                {/* Seção de Alergias */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Informações Clínicas</p>
                    <button
                      onClick={() => setIsAddAllergyModalOpen(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Adicionar Alergia
                    </button>
                  </div>
                  <div className="bg-white rounded-lg">
                    {/* Tipo Sanguíneo - só exibe se estiver definido */}
                    {attendance.patient?.bloodType && (
                      <div className="mb-2">
                        <span className="font-medium">Tipo Sanguíneo: </span>
                        <span>{attendance.patient.bloodType}</span>
                      </div>
                    )}
                    
                    {/* Alergias */}
                    <div>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                          Alergias:
                        </span>
                        {attendance.patient?.allergies && attendance.patient.allergies.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {attendance.patient.allergies.map((allergy, index) => (
                              <div 
                                key={index}
                                className="flex items-center group"
                              >
                                <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-sm">
                                  {allergy}
                                </span>
                                <button
                                  onClick={() => {
                                    if (attendance.patient?.id) {
                                      attendanceService.removeAllergy(attendance.patient.id, allergy)
                                        .then(updatedPatient => {
                                          setAttendance({
                                            ...attendance,
                                            patient: {
                                              ...attendance.patient,
                                              allergies: updatedPatient.allergies || []
                                            }
                                          });
                                          toast.success('Alergia removida com sucesso!');
                                        })
                                        .catch(error => {
                                          console.error('Erro ao remover alergia:', error);
                                          toast.error('Erro ao remover alergia. Por favor, tente novamente.');
                                        });
                                    }
                                  }}
                                  className="hidden group-hover:block ml-1 text-red-500 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">Nenhuma alergia registrada</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seção de Medicamentos em Uso */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Medicamentos em Uso</p>
                    <button
                      onClick={() => setIsAddMedicationModalOpen(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Adicionar
                    </button>
                  </div>
                  <div className="flex items-start">
                    <Pill className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                    <div className="flex-1">
                      <div className="space-y-2">
                        {attendance.patient?.medications && attendance.patient.medications.length > 0 ? (
                          attendance.patient.medications.map((med, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-md">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{med.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {med.dosage} - {med.frequency}
                                  </p>
                                  {med.instructions && (
                                    <p className="text-sm text-gray-600">
                                      {med.instructions}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-500 mt-1">
                                    Início: {new Date(med.startDate).toLocaleDateString()}
                                    {med.endDate && ` - Fim: ${new Date(med.endDate).toLocaleDateString()}`}
                                  </p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  med.active 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {med.active ? 'Ativo' : 'Inativo'}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600">Nenhum medicamento em uso</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seção de Condições Crônicas */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Condições Crônicas</p>
                  <div className="flex items-start">
                    <ActivityIcon className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                    <p className="font-medium">{attendance.patient?.chronicDiseases?.join(', ') || 'Nenhuma'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de Exames Médicos */}
            <Card className="mt-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Exames Médicos</CardTitle>
                  <Button
                    onClick={() => setIsExamRequestModalOpen(true)}
                    variant="outline-primary"
                    size="sm"
                  >
                    Solicitar Exame
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {attendance?.medicalExams && attendance.medicalExams.length > 0 ? (
                  <div className="space-y-4">
                    {attendance.medicalExams.map((exam) => (
                      <div
                        key={exam.id}
                        className="border rounded-lg p-4 flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-medium">{exam.examType}</h4>
                          <p className="text-sm text-gray-500">
                            Solicitado em: {new Date(exam.requestDate).toLocaleDateString()}
                          </p>
                          {exam.laboratory && (
                            <p className="text-sm text-gray-500">
                              Laboratório: {exam.laboratory}
                            </p>
                          )}
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                exam.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : exam.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {exam.status === 'completed'
                                ? 'Concluído'
                                : exam.status === 'pending'
                                ? 'Pendente'
                                : 'Cancelado'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {exam.status === 'completed' && exam.result && (
                            <Button
                              onClick={() => {
                                if (exam.result) {
                                  window.open(exam.result, '_blank');
                                }
                              }}
                              variant="outline-primary"
                              size="sm"
                            >
                              Ver Resultado
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Nenhum exame solicitado
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna da Direita - Atendimento Atual */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de Sinais Vitais */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sinais Vitais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Thermometer className="h-4 w-4 inline mr-2" />
                    Temperatura (°C)
                  </label>
                  <InputMask
                    mask="99.9"
                    maskChar={null}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      vitalSignsErrors.temperature ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={vitalSigns.temperature}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVitalSignsChange('temperature', e.target.value)}
                    placeholder="36.5"
                  />
                  {vitalSignsErrors.temperature && (
                    <p className="text-red-500 text-xs mt-1">{vitalSignsErrors.temperature}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Heart className="h-4 w-4 inline mr-2" />
                    Pressão Arterial
                  </label>
                  <InputMask
                    mask="999/99"
                    maskChar={null}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      vitalSignsErrors.bloodPressure ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={vitalSigns.bloodPressure}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVitalSignsChange('bloodPressure', e.target.value)}
                    placeholder="120/80"
                  />
                  {vitalSignsErrors.bloodPressure && (
                    <p className="text-red-500 text-xs mt-1">{vitalSignsErrors.bloodPressure}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Activity className="h-4 w-4 inline mr-2" />
                    Freq. Cardíaca (bpm)
                  </label>
                  <InputMask
                    mask="999"
                    maskChar={null}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      vitalSignsErrors.heartRate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={vitalSigns.heartRate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVitalSignsChange('heartRate', e.target.value)}
                    placeholder="80"
                  />
                  {vitalSignsErrors.heartRate && (
                    <p className="text-red-500 text-xs mt-1">{vitalSignsErrors.heartRate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Wind className="h-4 w-4 inline mr-2" />
                    Freq. Respiratória (rpm)
                  </label>
                  <InputMask
                    mask="99"
                    maskChar={null}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      vitalSignsErrors.respiratoryRate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={vitalSigns.respiratoryRate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVitalSignsChange('respiratoryRate', e.target.value)}
                    placeholder="16"
                  />
                  {vitalSignsErrors.respiratoryRate && (
                    <p className="text-red-500 text-xs mt-1">{vitalSignsErrors.respiratoryRate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Activity className="h-4 w-4 inline mr-2" />
                    Saturação O2 (%)
                  </label>
                  <InputMask
                    mask="99"
                    maskChar={null}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      vitalSignsErrors.oxygenSaturation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={vitalSigns.oxygenSaturation}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVitalSignsChange('oxygenSaturation', e.target.value)}
                    placeholder="98"
                  />
                  {vitalSignsErrors.oxygenSaturation && (
                    <p className="text-red-500 text-xs mt-1">{vitalSignsErrors.oxygenSaturation}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Weight className="h-4 w-4 inline mr-2" />
                    Peso (kg)
                  </label>
                  <InputMask
                    mask="999.9"
                    maskChar={null}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      vitalSignsErrors.weight ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={vitalSigns.weight}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVitalSignsChange('weight', e.target.value)}
                    placeholder="70.5"
                  />
                  {vitalSignsErrors.weight && (
                    <p className="text-red-500 text-xs mt-1">{vitalSignsErrors.weight}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Ruler className="h-4 w-4 inline mr-2" />
                    Altura (m)
                  </label>
                  <InputMask
                    mask="9.99"
                    maskChar={null}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      vitalSignsErrors.height ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={vitalSigns.height}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVitalSignsChange('height', e.target.value)}
                    placeholder="1.75"
                  />
                  {vitalSignsErrors.height && (
                    <p className="text-red-500 text-xs mt-1">{vitalSignsErrors.height}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Card de Queixa e Sintomas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Queixa e Sintomas</h3>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Descreva os sintomas relatados pelo paciente..."
              />
            </div>

            {/* Card de Diagnóstico */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Diagnóstico</h3>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Digite o diagnóstico..."
              />
            </div>

            {/* Card de Prescrição */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Prescrição</h2>
                <button
                  type="button"
                  onClick={() => setIsPrescriptionModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Receita
                </button>
              </div>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Digite a prescrição médica..."
              />
            </div>

            {/* Card de Observações */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Observações</h3>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Digite observações adicionais..."
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end items-center bg-white rounded-lg shadow-sm p-4 space-x-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => setIsCertificateModalOpen(true)}
              >
                <FileCheck className="h-5 w-5 mr-2" />
                Gerar Atestado
              </button>

              {attendance?.status === 'in_progress' && (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  onClick={handleCancelar}
                  disabled={isCancelling}
                >
                  <Ban className="h-5 w-5 mr-2" />
                  Cancelar
                </button>
              )}

              <button
                type="button"
                className={`inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                  attendance?.status === 'completed'
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-700 bg-gray-50 hover:bg-gray-100 focus:ring-gray-500'
                }`}
                onClick={handleFinalizar}
                disabled={isFinalizingAttendance || attendance?.status !== 'in_progress'}
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                {attendance?.status === 'completed' ? 'Finalizado' : 'Finalizar Atendimento'}
              </button>

              <button
                type="button"
                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                onClick={() => handleSalvar()}
                disabled={isFinalizingAttendance || attendance?.status !== 'in_progress'}
              >
                <Save className="h-5 w-5 mr-2" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>

      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        patientName={attendance.patient?.name || ''}
        doctorName={attendance.doctor?.name || ''}
        doctorCrm={attendance.doctor?.crm || ''}
        prescription={prescription}
        attendanceDate={new Date(attendance.createdAt)}
      />

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        patientName={attendance?.patient?.name || 'Paciente'}
        patientCpf={attendance?.patient?.cpf || ''}
        doctorName={attendance?.doctor?.name || 'Médico'}
        attendanceDate={new Date(attendance?.createdAt)}
        attendanceTime={format(new Date(attendance?.createdAt), 'HH:mm')}
        attendanceId={attendance?.id}
        userId={attendance?.patient?.id}
      />

      {/* Modal de Finalização */}
      {showFinalizeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {finalizationSuccess ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Atendimento Finalizado!
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  O atendimento foi finalizado com sucesso. Você será redirecionado em instantes...
                </p>
                <div className="mx-auto w-8 h-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Finalizar Atendimento</h3>
                <p className="text-gray-600 mb-6">
                  Tem certeza que deseja finalizar este atendimento? Esta ação não poderá ser desfeita.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium disabled:opacity-50"
                    onClick={() => setShowFinalizeModal(false)}
                    disabled={isFinalizingAttendance}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                    onClick={handleFinalizarAtendimento}
                    disabled={isFinalizingAttendance}
                  >
                    {isFinalizingAttendance ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Finalizando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Confirmar Finalização
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cancelar Atendimento</h3>
            <p className="text-gray-600 mb-4">
              Por favor, informe o motivo do cancelamento do atendimento:
            </p>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 sm:text-sm mb-4"
              rows={4}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ex: Paciente não compareceu à consulta"
            />
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium disabled:opacity-50"
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
              >
                Voltar
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
                onClick={handleConfirmCancel}
                disabled={isCancelling || !cancelReason.trim()}
              >
                {isCancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Cancelando...
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4 mr-2" />
                    Confirmar Cancelamento
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modais */}
      <AddAllergyModal
        isOpen={isAddAllergyModalOpen}
        onClose={() => setIsAddAllergyModalOpen(false)}
        onSave={handleAddAllergy}
      />

      <AddMedicationInUseModal
        isOpen={isAddMedicationModalOpen}
        onClose={() => setIsAddMedicationModalOpen(false)}
        onSave={handleAddMedication}
      />

      <ExamRequestModal
        isOpen={isExamRequestModalOpen}
        onClose={() => setIsExamRequestModalOpen(false)}
        attendanceId={attendance?.id ?? ''}
        onExamRequested={handleExamRequested}
      />
    </div>
  );
}

export default AtendimentoPage; 