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
  CheckCircle2
} from 'lucide-react';
import Button from '../components/Button';
import { attendanceService, Attendance } from '../services/attendance.service';
import PrescriptionModal from '../components/PrescriptionModal';
import CertificateModal from '../components/CertificateModal';

export function AtendimentoPage() {
  const { id: scheduleId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [modalProntuarioAberto, setModalProntuarioAberto] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizingAttendance, setIsFinalizingAttendance] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [finalizationSuccess, setFinalizationSuccess] = useState(false);

  // Estados para todos os campos do atendimento
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [observations, setObservations] = useState('');
  const [vitalSigns, setVitalSigns] = useState({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: ''
  });

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
    setVitalSigns(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função de salvamento
  const saveAttendance = useCallback(async () => {
    if (!attendance) return;
    
    try {
      console.log('Iniciando salvamento automático:', {
        symptoms,
        diagnosis,
        prescription,
        observations,
        vitalSigns,
        attendanceId: attendance.id
      });

      setIsSaving(true);
      
      // Converter sinais vitais para números onde necessário
      const convertedVitalSigns = {
        temperature: vitalSigns.temperature ? parseFloat(vitalSigns.temperature) : undefined,
        bloodPressure: vitalSigns.bloodPressure,
        heartRate: vitalSigns.heartRate ? parseInt(vitalSigns.heartRate) : undefined,
        respiratoryRate: vitalSigns.respiratoryRate ? parseInt(vitalSigns.respiratoryRate) : undefined,
        oxygenSaturation: vitalSigns.oxygenSaturation ? parseInt(vitalSigns.oxygenSaturation) : undefined,
        weight: vitalSigns.weight ? parseFloat(vitalSigns.weight) : undefined,
        height: vitalSigns.height ? parseFloat(vitalSigns.height) : undefined
      };

      const updatedAttendance = await attendanceService.update(attendance.id, {
        symptoms,
        diagnosis,
        prescription,
        observations,
        vitalSigns: convertedVitalSigns,
        status: attendance.status
      });
      
      console.log('Atendimento salvo com sucesso:', updatedAttendance);
      setAttendance(updatedAttendance);
      setLastSaved(new Date());
    } catch (error: any) {
      console.error('Erro ao salvar atendimento:', error);
      alert('Erro ao salvar atendimento: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  }, [attendance, symptoms, diagnosis, prescription, observations, vitalSigns]);

  // Auto-save a cada 30 segundos quando houver mudanças
  useEffect(() => {
    if (!attendance) return;

    console.log('Configurando auto-save para o atendimento:', attendance.id);
    const timer = setInterval(() => {
      console.log('Executando auto-save...');
      saveAttendance();
    }, 30000);

    return () => {
      console.log('Limpando timer de auto-save');
      clearInterval(timer);
    };
  }, [saveAttendance]);

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
    await saveAttendance();
    alert('Atendimento salvo com sucesso!');
  };

  const handleFinalizar = async () => {
    setShowFinalizeModal(true);
  };

  const handleConfirmFinalize = async () => {
    if (!attendance) return;
    
    try {
      setIsFinalizingAttendance(true);
      
      // Primeiro salva os dados atuais do atendimento
      await saveAttendance();
      
      // Depois finaliza o atendimento
      const finishedAttendance = await attendanceService.complete(attendance.id);
      setAttendance(finishedAttendance);
      
      // Mostra feedback de sucesso no modal
      setFinalizationSuccess(true);
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate('/schedule');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao finalizar atendimento:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao finalizar atendimento.';
      alert(errorMessage);
      setShowFinalizeModal(false);
    } finally {
      setIsFinalizingAttendance(false);
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Paciente</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Nome Completo</p>
                    <p className="font-medium">{attendance.patient?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Data de Nascimento</p>
                    <p className="font-medium">
                      {attendance.patient?.dateOfBirth ? 
                        format(new Date(attendance.patient.dateOfBirth), 'dd/MM/yyyy') : 
                        'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-medium">{attendance.patient?.phone || 'N/A'}</p>
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
            </div>

            {/* Card de Histórico Médico */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico Médico</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Alergias</p>
                    <p className="font-medium">{attendance.patient?.allergies?.join(', ') || 'Nenhuma'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Pill className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Medicamentos em Uso</p>
                    <p className="font-medium">{attendance.patient?.medications?.join(', ') || 'Nenhum'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <ActivityIcon className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Condições Crônicas</p>
                    <p className="font-medium">{attendance.patient?.chronicDiseases?.join(', ') || 'Nenhuma'}</p>
                  </div>
                </div>
              </div>
            </div>
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
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={vitalSigns.temperature}
                    onChange={(e) => handleVitalSignsChange('temperature', e.target.value)}
                    placeholder="36.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Heart className="h-4 w-4 inline mr-2" />
                    Pressão Arterial
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={vitalSigns.bloodPressure}
                    onChange={(e) => handleVitalSignsChange('bloodPressure', e.target.value)}
                    placeholder="120/80"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Activity className="h-4 w-4 inline mr-2" />
                    Freq. Cardíaca (bpm)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={vitalSigns.heartRate}
                    onChange={(e) => handleVitalSignsChange('heartRate', e.target.value)}
                    placeholder="80"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Wind className="h-4 w-4 inline mr-2" />
                    Freq. Respiratória (rpm)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={vitalSigns.respiratoryRate}
                    onChange={(e) => handleVitalSignsChange('respiratoryRate', e.target.value)}
                    placeholder="16"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Activity className="h-4 w-4 inline mr-2" />
                    Saturação O2 (%)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={vitalSigns.oxygenSaturation}
                    onChange={(e) => handleVitalSignsChange('oxygenSaturation', e.target.value)}
                    placeholder="98"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Weight className="h-4 w-4 inline mr-2" />
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={vitalSigns.weight}
                    onChange={(e) => handleVitalSignsChange('weight', e.target.value)}
                    placeholder="70.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Ruler className="h-4 w-4 inline mr-2" />
                    Altura (m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={vitalSigns.height}
                    onChange={(e) => handleVitalSignsChange('height', e.target.value)}
                    placeholder="1.75"
                  />
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Prescrição</h3>
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
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <Button
                  variant="outline-primary"
                  icon={FileText}
                  onClick={() => setModalProntuarioAberto(true)}
                >
                  Prontuário Completo
                </Button>
                <Button
                  variant="outline-success"
                  icon={FileCheck}
                  onClick={() => setIsCertificateModalOpen(true)}
                >
                  Gerar Atestado
                </Button>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                  onClick={handleFinalizar}
                  disabled={isFinalizingAttendance || attendance?.status === 'completed'}
                >
                  {attendance?.status === 'completed' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      Atendimento Finalizado
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Finalizar Atendimento
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                  onClick={() => handleSalvar()}
                  disabled={isFinalizingAttendance || attendance?.status === 'completed'}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        patientName={attendance.patient?.name || 'Paciente'}
      />

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        patientName={attendance.patient?.name || 'Paciente'}
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
                    onClick={handleConfirmFinalize}
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
    </div>
  );
}

export default AtendimentoPage; 