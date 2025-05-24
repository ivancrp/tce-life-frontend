import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Clipboard, AlertTriangle, CheckCircle, Calendar as CalendarIcon, Plus, ChevronRight, User, ArrowRight } from 'lucide-react';
import { format, parseISO, isPast, isFuture, isToday, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '../components/Button';
import { scheduleService, Schedule } from '../services/schedule.service';
import { User as UserType } from '../types';
import { getCurrentUser, UserData as AuthUserData } from '../utils/auth';
import AppointmentForm from '../components/AppointmentForm';

const PatientPortal = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [userData, setUserData] = useState<AuthUserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar autenticação e papel do usuário
    const user = getCurrentUser();
    console.log('Dados do usuário no PatientPortal:', user);
    
    if (!user) {
      console.log('Usuário não autenticado, redirecionando para login');
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Paciente') {
      console.log('Usuário não é um paciente, redirecionando para dashboard');
      navigate('/');
      return;
    }

    setUserData(user);
    loadSchedules(user.id);
  }, [navigate]);

  const loadSchedules = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userId) {
        console.error('ID do usuário não fornecido');
        setError('Erro ao identificar usuário. Por favor, faça login novamente.');
        setSchedules([]);
        return;
      }
      
      console.log('Buscando agendamentos para o usuário:', userId);
      const data = await scheduleService.getByUserId(userId);
      console.log('Agendamentos encontrados:', data);
      setSchedules(data);
    } catch (error: any) {
      console.error('Erro ao carregar agendamentos:', error);
      setError(error.message || 'Erro ao carregar agendamentos');
      setSchedules([]);
      
      // Se o erro for de autenticação, redirecionar para login
      if (error.message.includes('Sessão expirada')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
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
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pendente</span>;
      case 'confirmed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Confirmado</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Concluído</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Cancelado</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Indefinido</span>;
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Calendar className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <p className="text-sm text-blue-700">Próxima Consulta</p>
            <p className="font-semibold text-blue-900">
              {upcomingAppointments.length > 0 
                ? format(new Date(upcomingAppointments[0].date), 'dd/MM/yyyy')
                : 'Nenhuma agendada'}
            </p>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <CheckCircle className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <p className="text-sm text-green-700">Consultas Realizadas</p>
            <p className="font-semibold text-green-900">
              {pastAppointments.length}
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <AlertTriangle className="h-6 w-6 text-yellow-700" />
          </div>
          <div>
            <p className="text-sm text-yellow-700">Pendentes de Confirmação</p>
            <p className="font-semibold text-yellow-900">
              {schedules.filter(s => s.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      {/* Botão de nova consulta */}
      <div className="flex justify-end mb-6">
        <Button 
          variant="primary" 
          size="md"
          icon={Plus}
          onClick={handleScheduleAppointment}
        >
          Agendar Nova Consulta
        </Button>
      </div>

      {/* Consultas de hoje */}
      {todayAppointments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-600" />
            Consultas de Hoje
          </h2>
          <div className="space-y-4">
            {todayAppointments.map(renderAppointmentCard)}
          </div>
        </div>
      )}

      {/* Próximas Consultas */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-600" />
          Próximas Consultas
        </h2>
        
        {upcomingAppointments.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500">Você não possui consultas futuras agendadas.</p>
            <button 
              onClick={handleScheduleAppointment}
              className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Agendar agora
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map(renderAppointmentCard)}
          </div>
        )}
      </div>

      {/* Histórico de consultas */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-blue-600" />
          Histórico de Consultas
        </h2>
        
        {pastAppointments.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500">Você ainda não realizou nenhuma consulta.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastAppointments.slice(0, 3).map(renderAppointmentCard)}
            
            {pastAppointments.length > 3 && (
              <button 
                onClick={() => navigate('/historico-consultas')}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mt-2"
              >
                Ver histórico completo
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            )}
          </div>
        )}
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
    </div>
  );
};

export default PatientPortal; 