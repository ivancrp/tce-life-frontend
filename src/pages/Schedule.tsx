import React, { useState, useEffect } from 'react';
import { format, startOfToday, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, addMonths, subMonths, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Search, 
  Plus,
  FileText,
  Bell,
  Calendar as CalendarLucide,
  X,
  Stethoscope,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { scheduleService, Schedule as ScheduleType } from '../services/schedule.service';
import { attendanceService } from '../services/attendance.service';
import Button from '../components/Button';
import { TOKEN_KEY } from '../utils/auth';
import Breadcrumbs from '../components/Breadcrumbs';

type ViewType = 'day' | 'week' | 'month';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
}

export function SchedulePage() {
  const [view, setView] = useState<ViewType>('week');
  const [currentDate, setCurrentDate] = useState<Date>(startOfToday());
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ScheduleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleType | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const navigate = useNavigate();

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30'
  ];

  useEffect(() => {
    loadSchedules();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [schedules, currentDate, searchTerm, view]);

  // Funções de navegação no calendário
  const navigateDate = (direction: 'prev' | 'next') => {
    if (view === 'day') {
      setCurrentDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
    } else if (view === 'week') {
      setCurrentDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
    }
  };

  // Obter dias baseado na visualização
  const getDaysToShow = () => {
    if (view === 'day') {
      return [currentDate];
    } else if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
  };

  async function loadSchedules() {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        return;
      }
      
      const data = await scheduleService.getAll();
      const formattedData = data.map(schedule => ({
        ...schedule,
        date: new Date(schedule.date)
      }));
      
      setSchedules(formattedData);
      filterSchedules();
    } catch (error: any) {
      setError(error.message || 'Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  }

  function filterSchedules() {
    let filtered = schedules;
    
    // Filtrar por período
    filtered = filtered.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      if (view === 'day') {
        return isSameDay(scheduleDate, currentDate);
      } else if (view === 'week') {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        const end = endOfWeek(currentDate, { weekStartsOn: 1 });
        return scheduleDate >= start && scheduleDate <= end;
      } else {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        return scheduleDate >= start && scheduleDate <= end;
      }
    });
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(schedule => {
        const patientName = schedule.user?.name || schedule.patientName || '';
        const doctorName = schedule.doctor?.name || schedule.doctorName || '';
        return patientName.toLowerCase().includes(searchLower) ||
               doctorName.toLowerCase().includes(searchLower);
      });
    }
    
    setFilteredSchedules(filtered);
  }

  const getScheduleColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-emerald-50 border-l-4 border-emerald-500';
      case 'pending': return 'bg-amber-50 border-l-4 border-amber-500';
      case 'cancelled': return 'bg-red-50 border-l-4 border-red-500';
      case 'completed': return 'bg-blue-50 border-l-4 border-blue-500';
      case 'in_progress': return 'bg-purple-50 border-l-4 border-purple-500';
      case 'confirmed': return 'bg-green-100 border-green-500';
      case 'pending': return 'bg-yellow-100 border-yellow-500';
      case 'cancelled': return 'bg-red-100 border-red-500';
      case 'completed': return 'bg-blue-100 border-blue-500';
      case 'in_progress': return 'bg-purple-100 border-purple-500';
      default: return 'bg-gray-100 border-gray-500';
    }
  };

  const handleScheduleClick = (schedule: ScheduleType) => {
    setSelectedSchedule(schedule);
    setShowDetailsModal(true);
  };

  const handleStartAttendance = async (scheduleId: string) => {
    try {
      console.log('Iniciando atendimento para scheduleId:', scheduleId);
      setLoading(true);
      
      // Verificar token
      const token = localStorage.getItem(TOKEN_KEY);
      console.log('Token presente:', !!token);
      
      try {
        const attendance = await attendanceService.startAttendance(scheduleId);
        console.log('Atendimento iniciado com sucesso:', attendance);
      } catch (error: any) {
        // Se o erro for 400 (já existe atendimento), apenas continua para a página
        if (error.response?.status !== 400) {
          throw error;
        }
      }

      navigate(`/atendimento/${scheduleId}`);
      setShowDetailsModal(false);
    } catch (error: any) {
      console.error('Erro detalhado ao iniciar atendimento:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      const errorMessage = error.response?.data?.message || 'Erro ao iniciar atendimento.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Carregando agenda...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={() => { setError(null); loadSchedules(); }}>
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Agenda Médica</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar agendamentos..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Filter className="h-5 w-5 text-gray-600" />
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <span>Novo Agendamento</span>
              </button>
            </div>
          </div>

          {/* Calendar Controls */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => navigateDate('prev')}
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <span className="text-lg font-medium">
                  {format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => navigateDate('next')}
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="flex gap-2">
                <button 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    view === 'day' 
                      ? 'text-white bg-blue-600 border-transparent' 
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setView('day')}
                >
                  Dia
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    view === 'week' 
                      ? 'text-white bg-blue-600 border-transparent' 
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setView('week')}
                >
                  Semana
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    view === 'month' 
                      ? 'text-white bg-blue-600 border-transparent' 
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setView('month')}
                >
                  Mês
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-lg">
              {/* Days header */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-4 text-sm font-medium text-gray-500 border-r"></div>
                {getDaysToShow().map((day) => (
                  <div
                    key={day.toString()}
                    className="p-4 text-center border-r last:border-r-0"
                  >
                    <div className="text-sm font-medium text-gray-900 uppercase">
                      {format(day, 'EEE', { locale: ptBR })}
                    </div>
                    <div className="text-2xl font-semibold text-gray-600">
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              <div className="divide-y">
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-8">
                    <div className="p-4 text-sm text-gray-500 border-r">
                      {time}
                    </div>
                    {getDaysToShow().map((day) => {
                      const daySchedules = filteredSchedules.filter(
                        schedule => 
                          isSameDay(new Date(schedule.date), day) && 
                          schedule.time === time
                      );
                      
                      return (
                        <div
                          key={day.toString()}
                          className="p-2 border-r last:border-r-0 min-h-[80px] relative"
                        >
                          {daySchedules.map((schedule) => (
                            <div
                              key={schedule.id}
                              onClick={() => handleScheduleClick(schedule)}
                              className={`
                                cursor-pointer
                                p-2 rounded-lg mb-2
                                ${getScheduleColor(schedule.status)}
                              `}
                            >
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium truncate">
                                    {schedule.user?.name || schedule.patientName}
                                  </span>
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {schedule.duration || 30}min
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {schedule.type === 'primeira_consulta' ? 'Primeira Consulta' :
                                   schedule.type === 'retorno' ? 'Retorno' :
                                   schedule.type === 'consulta_regular' ? 'Consulta Regular' :
                                   schedule.type}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Detalhes do Agendamento */}
        {showDetailsModal && selectedSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-xl font-medium">Detalhes do Agendamento</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <CalendarLucide className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-900">
                    {format(new Date(selectedSchedule.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                  <Clock className="h-5 w-5 text-gray-500 ml-4" />
                  <span className="text-gray-900">{selectedSchedule.time}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Paciente: </span>
                    <span className="text-gray-900">{selectedSchedule.user?.name || selectedSchedule.patientName}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Médico: </span>
                    <span className="text-gray-900">{selectedSchedule.doctor?.name || selectedSchedule.doctorName}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Tipo: </span>
                    <span className="text-gray-900">
                      {selectedSchedule.type === 'primeira_consulta' ? 'Primeira Consulta' :
                       selectedSchedule.type === 'retorno' ? 'Retorno' :
                       selectedSchedule.type === 'consulta_regular' ? 'Consulta Regular' :
                       selectedSchedule.type}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Status: </span>
                    <span className={`
                      px-2 py-1 rounded-full text-sm
                      ${selectedSchedule.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedSchedule.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        selectedSchedule.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        selectedSchedule.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {selectedSchedule.status === 'pending' ? 'Pendente' :
                       selectedSchedule.status === 'confirmed' ? 'Confirmado' :
                       selectedSchedule.status === 'cancelled' ? 'Cancelado' :
                       selectedSchedule.status === 'in_progress' ? 'Em Atendimento' :
                       'Concluído'}
                    </span>
                  </div>

                  {selectedSchedule.notes && (
                    <div>
                      <span className="font-medium">Observações: </span>
                      <span className="text-gray-900">{selectedSchedule.notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  {selectedSchedule.status !== 'completed' && 
                   selectedSchedule.status !== 'cancelled' && 
                   selectedSchedule.status !== 'in_progress' && (
                    <button
                      onClick={() => handleStartAttendance(selectedSchedule.id)}
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Stethoscope className="h-5 w-5 mr-2" />
                      Realizar Atendimento
                    </button>
                  )}
                  
                  {selectedSchedule.status === 'in_progress' && (
                    <button
                      onClick={() => navigate(`/atendimento/${selectedSchedule.id}`)}
                      className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      <Stethoscope className="h-5 w-5 mr-2" />
                      Continuar Atendimento
                    </button>
                  )}
                  
                  <button
                    onClick={() => navigate(`/medical-records/${selectedSchedule.userId}`)}
                    className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Ver Prontuário
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SchedulePage;