import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Clipboard, AlertTriangle, CheckCircle, Calendar as CalendarIcon, Plus, ChevronRight, User, ArrowRight, FileText, Upload } from 'lucide-react';
import { format, parseISO, isPast, isFuture, isToday, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '../components/Button';
import { scheduleService, Schedule } from '../services/schedule.service';
import { User as UserType } from '../types';
import { getCurrentUser, UserData as AuthUserData } from '../utils/auth';
import AppointmentForm from '../components/AppointmentForm';
import { attendanceService } from '../services/attendance.service';
import PatientLayout from '../components/PatientLayout';
import { doctorService } from '../services/doctor.service';
import AttachExamModal from '../components/AttachExamModal';

interface Doctor {
  id: string;
  name: string;
  email: string;
  role?: {
    id: string;
    name: string;
  };
}

interface ScheduleWithDoctor extends Omit<Schedule, 'doctor'> {
  doctor?: Doctor;
}

const PatientPortal = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<ScheduleWithDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showAttachExamModal, setShowAttachExamModal] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [userData, setUserData] = useState<AuthUserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [medicalExams, setMedicalExams] = useState<any[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const user = getCurrentUser();
      
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (user.role !== 'Paciente') {
        navigate('/');
        return;
      }

      setUserData(user);
      await Promise.all([
        loadSchedules(user.id),
        loadMedicalExams(user.id)
      ]);
    };

    loadUserData();
  }, [navigate]);

  const loadSchedules = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const schedulesData = await scheduleService.getByUserId(userId);
      
      // Buscar dados dos médicos para cada agendamento
      const schedulesWithDoctors = await Promise.all(
        schedulesData.map(async (schedule) => {
          try {
            const doctorData = await doctorService.getById(schedule.doctorId);
            return { ...schedule, doctor: doctorData };
          } catch (error) {
            console.error(`Erro ao carregar dados do médico ${schedule.doctorId}:`, error);
            return schedule;
          }
        })
      );

      setSchedules(schedulesWithDoctors);
    } catch (error: any) {
      console.error('Erro ao carregar agendamentos:', error);
      setError(error.message || 'Erro ao carregar agendamentos');
      
      if (error.message.includes('Sessão expirada')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMedicalExams = async (userId: string) => {
    try {
      setLoadingExams(true);
      const exams = await attendanceService.getMedicalExamsByUserId(userId);
      setMedicalExams(exams);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleFileUpload = async (examId: string, files: FileList) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      
      await attendanceService.uploadExamFiles(examId, formData);
      await loadMedicalExams(userData?.id || '');
    } catch (error) {
      console.error('Erro ao fazer upload dos arquivos:', error);
    }
  };

  const handleAttachExam = (examId: string) => {
    setSelectedExamId(examId);
    setShowAttachExamModal(true);
  };

  const handleSaveExamFiles = async (files: File[]) => {
    if (!selectedExamId) return;

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      await attendanceService.uploadExamFiles(selectedExamId, formData);
      await loadMedicalExams(userData?.id || '');
    } catch (error) {
      console.error('Erro ao fazer upload dos arquivos:', error);
    }
  };

  // Filtra consultas passadas, de hoje e futuras
  const pastAppointments = schedules.filter(schedule => 
    isPast(new Date(schedule.date)) && !isToday(new Date(schedule.date))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const todayAppointments = schedules.filter(schedule => 
    isToday(new Date(schedule.date))
  ).sort((a, b) => a.time.localeCompare(b.time));

  const upcomingAppointments = schedules.filter(schedule => 
    isFuture(new Date(schedule.date)) && !isToday(new Date(schedule.date))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className="text-xs font-medium text-orange-700 bg-orange-50 px-2 py-1 rounded">Pendente</span>;
      case 'confirmed':
        return <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">Confirmado</span>;
      case 'completed':
        return <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">Concluído</span>;
      case 'cancelled':
        return <span className="text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded">Cancelado</span>;
      default:
        return <span className="text-xs font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded">Indefinido</span>;
    }
  };

  const formatAppointmentDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await scheduleService.update(id, { status: 'cancelled' });
      if (userData?.id) {
        loadSchedules(userData.id);
      }
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      alert('Não foi possível cancelar a consulta. Tente novamente mais tarde.');
    }
  };

  const handleScheduleAppointment = () => {
    setShowNewAppointmentModal(true);
  };

  const closeNewAppointmentModal = () => {
    setShowNewAppointmentModal(false);
    if (userData?.id) {
      loadSchedules(userData.id);
    }
  };

  const renderAppointmentCard = (appointment: Schedule) => (
    <div key={appointment.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{appointment.type}</h3>
          <p className="text-sm text-gray-500">
            {formatAppointmentDate(appointment.date)} - {appointment.time}
          </p>
        </div>
        {getStatusBadge(appointment.status)}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-700 mb-2">
          <User className="w-4 h-4 mr-2 text-gray-500" />
          <span>Dr. {appointment.doctorId}</span>
        </div>
        <div className="flex items-center text-sm text-gray-700 mb-2">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          <span>Duração: 30 minutos</span>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
          <button 
            onClick={() => handleCancelAppointment(appointment.id)}
            className="py-1.5 px-3 text-xs rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
          >
            Cancelar Consulta
          </button>
        ) : null}
        
        <button 
          className="py-1.5 px-3 text-xs rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors ml-auto"
          onClick={() => navigate(`/consultas/${appointment.id}`)}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Portal do Paciente</h1>
          <p className="text-gray-600">Bem-vindo(a) {userData?.name || 'ao portal do paciente'}</p>
        </div>

        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cards resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Próxima Consulta */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Próxima Consulta</p>
                <p className="text-base font-semibold text-gray-900">
                  {upcomingAppointments.length > 0 ? formatAppointmentDate(upcomingAppointments[0].date) : 'Nenhuma'}
                </p>
              </div>
            </div>
          </div>

          {/* Consultas Realizadas */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Consultas Realizadas</p>
                <p className="text-base font-semibold text-gray-900">{schedules.filter(schedule => schedule.status === 'completed').length}</p>
              </div>
            </div>
          </div>

          {/* Pendentes Confirmação */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Pendentes Confirmação</p>
                <p className="text-base font-semibold text-gray-900">{schedules.filter(schedule => schedule.status === 'pending').length}</p>
              </div>
            </div>
          </div>

          {/* Botão Agendar */}
          <div className="flex items-center">
            <button
              onClick={handleScheduleAppointment}
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg py-3 px-4 flex items-center justify-center text-sm font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Agendar Nova Consulta
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6 mt-8">
          {/* Próximas Consultas */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <Calendar className="h-5 w-5 text-[#4F46E5] mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Próximas Consultas</h2>
              </div>

              <div className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Você não possui consultas agendadas.
                  </div>
                ) : (
                  upcomingAppointments.map(appointment => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {appointment.type}
                        </span>
                        <span className="text-sm text-gray-500">{formatAppointmentDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <User className="h-4 w-4 mr-2" />
                        <span>Dr. {appointment.doctor?.name || 'Não informado'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Duração: 30 minutos</span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <button 
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-red-600 text-sm hover:text-red-700"
                        >
                          Cancelar
                        </button>
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Histórico de Consultas */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <FileText className="h-5 w-5 text-[#4F46E5] mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Histórico de Consultas</h2>
              </div>

              {pastAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Você ainda não realizou nenhuma consulta.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.map(appointment => (
                    <div key={appointment.id} className="border-b border-gray-100 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{appointment.type}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatAppointmentDate(appointment.date)}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">Dr. {appointment.doctor?.name || 'Não informado'}</p>
                        </div>
                        <button 
                          onClick={() => navigate(`/consultas/${appointment.id}`)}
                          className="text-[#4F46E5] text-sm hover:text-[#4338CA]"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Exames Médicos */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <FileText className="h-5 w-5 text-[#4F46E5] mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Exames Médicos</h2>
              </div>

              {medicalExams.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Nenhum exame encontrado.
                </div>
              ) : (
                <div className="space-y-4">
                  {medicalExams.map((exam: any) => (
                    <div key={exam.id} className="flex items-center justify-between pb-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{exam.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Solicitado em: {format(parseISO(exam.requestDate), "dd/MM/yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleAttachExam(exam.id)}
                          className="text-[#4F46E5] text-sm hover:text-[#4338CA]"
                        >
                          Anexar Exames
                        </button>
                        <span className="text-xs font-medium text-orange-700 bg-orange-50 px-2 py-1 rounded">
                          Pendente
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de agendamento */}
        {showNewAppointmentModal && (
          <AppointmentForm 
            onSubmit={async (data) => {
              try {
                await scheduleService.create({
                  doctorId: data.doctorId,
                  date: data.date,
                  time: data.time,
                  type: data.type,
                  userId: userData?.id || '',
                  notes: ''
                });
                closeNewAppointmentModal();
              } catch (error) {
                console.error('Erro ao criar agendamento:', error);
              }
            }}
            onClose={closeNewAppointmentModal}
          />
        )}

        {/* Modal de anexar exames */}
        {showAttachExamModal && selectedExamId && (
          <AttachExamModal
            examId={selectedExamId}
            onClose={() => {
              setShowAttachExamModal(false);
              setSelectedExamId(null);
            }}
            onSave={handleSaveExamFiles}
          />
        )}
      </div>
    </PatientLayout>
  );
};

export default PatientPortal; 