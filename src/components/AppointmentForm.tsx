import React, { useState, useEffect } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { doctorService, Doctor } from '../services/doctor.service';
import { scheduleService } from '../services/schedule.service';
import { getCurrentUser, unformatRole } from '../utils/auth';

interface AppointmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSuccess, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [selectedType, setSelectedType] = useState<string>('Consulta Regular');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      setLoadingMessage('Carregando lista de médicos...');
      setError(null);
      
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          throw new Error('Usuário não autenticado');
        }
        
        console.log('Buscando médicos com usuário:', currentUser);
        const doctorsData = await doctorService.getAll();
        console.log('Médicos encontrados:', doctorsData);
        
        if (doctorsData.length === 0) {
          setError('Não há médicos disponíveis no momento.');
        } else {
          setDoctors(doctorsData);
        }
      } catch (error: any) {
        console.error('Erro ao buscar médicos:', error);
        
        if (error.message.includes('Sessão expirada')) {
          window.location.href = '/login';
          return;
        }
        
        setError(error.message || 'Não foi possível carregar a lista de médicos. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    };

    fetchDoctors();
  }, []);

  const availableTimes = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const appointmentTypes = [
    'Consulta Regular',
    'Primeira Consulta',
    'Retorno',
    'Exame'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!selectedDoctor || !selectedDate || !selectedTime || !selectedType) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setLoadingMessage('Agendando consulta...');
      
      // Obter usuário atual
      const currentUser = getCurrentUser();
      console.log('Dados do usuário atual:', currentUser);
      
      if (!currentUser || !currentUser.id) {
        throw new Error('Usuário não encontrado. Por favor, faça login novamente.');
      }

      // Validar se o ID tem o formato correto (UUID)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(currentUser.id)) {
        console.error('ID do usuário inválido:', currentUser.id);
        throw new Error('Sessão inválida. Por favor, faça login novamente.');
      }

      // Converter a role para o formato do backend
      const backendRole = unformatRole(currentUser.role);
      console.log('Role convertida para o backend:', backendRole);
      
      const isoDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      ).toISOString();
      
      const scheduleData = {
        userId: currentUser.id,
        doctorId: selectedDoctor,
        date: new Date(isoDate),
        time: selectedTime,
        type: selectedType,
        status: 'pending' as const,
        notes: 'Agendado via portal do paciente'
      };

      console.log('Enviando agendamento com dados:', scheduleData);
      
      await scheduleService.create(scheduleData);
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao agendar consulta:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        console.error('Detalhes do erro:', { status, data });
        
        if (status === 401) {
          window.location.href = '/login';
          return;
        }
        
        setError(data.message || 'Erro ao agendar consulta. Verifique os dados e tente novamente.');
      } else {
        setError(error.message || 'Ocorreu um erro ao agendar a consulta. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
      setLoadingMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loadingMessage && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
          {loadingMessage}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Médico
        </label>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-sm text-gray-500 py-2">
            Nenhum médico disponível no momento.
          </div>
        ) : (
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Selecione um médico</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.role.name}
              </option>
            ))}
          </select>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Consulta
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          {appointmentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data
        </label>
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(parseISO(e.target.value))}
          min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Horário
        </label>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          {availableTimes.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Agendando...
            </span>
          ) : (
            'Agendar Consulta'
          )}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm; 