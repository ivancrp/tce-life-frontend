import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Calendar as CalendarIcon, ChevronLeft, ChevronRight, FileText, Menu } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isToday, isSameDay, addWeeks, subWeeks, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Layout from '../components/Layout';

interface DoctorType {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Consulta {
  id: string;
  data: string;
  hora: string;
  medico: string;
  especialidade: string;
  status: string;
  diagnostico?: string;
  prescricao?: string;
}

interface UserData {
  name: string;
  role?: string;
  id?: string;
}

const doctors: DoctorType[] = [
  {
    id: '1',
    name: 'Dra. Ana Silva',
    specialty: 'Clínica Geral',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '2',
    name: 'Dr. Carlos Mendes',
    specialty: 'Cardiologia',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '3',
    name: 'Dra. Juliana Costa',
    specialty: 'Pediatria',
    image: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    id: '4',
    name: 'Dr. Ricardo Santos',
    specialty: 'Ortopedia',
    image: 'https://randomuser.me/api/portraits/men/29.jpg'
  }
];

// Gera horários disponíveis (exemplo)
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 17;
  
  for (let hour = startHour; hour <= endHour; hour++) {
    // Adiciona slots de 30 minutos
    const available = Math.random() > 0.3; // 70% de chance de estar disponível
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      available
    });
    
    const available2 = Math.random() > 0.3;
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:30`,
      available: available2
    });
  }
  
  return slots;
};

const Appointment = () => {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generateTimeSlots());
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [reason, setReason] = useState('');
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [cpf, setCpf] = useState('');
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [mostrarConsultas, setMostrarConsultas] = useState(false);
  const [erro, setErro] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  
  useEffect(() => {
    // Obter dados do usuário do localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        
        // Carregar consultas automaticamente se for um paciente logado
        if (parsedUser.role === 'Paciente') {
          setMostrarConsultas(true);
          setConsultas(consultasMock);
        }
      }
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
    }
  }, []);
  
  // Calcular os dias da semana atual
  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const endOfCurrentWeek = endOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek });
  
  // Navegar para a próxima semana
  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
    setTimeSlots(generateTimeSlots()); // Gera novos horários
  };
  
  // Navegar para a semana anterior
  const prevWeek = () => {
    if (isSameDay(startOfCurrentWeek, startOfWeek(new Date(), { weekStartsOn: 0 })) || 
        startOfCurrentWeek > startOfWeek(new Date(), { weekStartsOn: 0 })) {
      setCurrentWeek(subWeeks(currentWeek, 1));
      setTimeSlots(generateTimeSlots()); // Gera novos horários
    }
  };
  
  // Selecionar um dia
  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setTimeSlots(generateTimeSlots()); // Gera novos horários para o dia selecionado
    setSelectedTime(null); // Limpa o horário selecionado
  };
  
  // Selecionar um médico
  const selectDoctor = (doctor: DoctorType) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };
  
  // Selecionar um horário
  const selectTime = (time: string) => {
    setSelectedTime(time);
  };
  
  // Avançar para o motivo da consulta
  const goToReasonStep = () => {
    if (selectedTime) {
      setStep(3);
    }
  };
  
  // Confirmar agendamento
  const confirmAppointment = () => {
    if (reason.trim().length > 0) {
      // Simulação de envio para API
      console.log('Agendamento confirmado:', {
        doctor: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        reason
      });
      
      // Exibir confirmação
      setAppointmentBooked(true);
      
      // Em um caso real, enviaria para API
      // Após o agendamento bem-sucedido, redirecionar ou mostrar mensagem de sucesso
      setTimeout(() => {
        // Redefinir formulário após 3 segundos
        setSelectedDoctor(null);
        setSelectedDate(new Date());
        setSelectedTime(null);
        setReason('');
        setStep(1);
        setAppointmentBooked(false);
      }, 3000);
    }
  };
  
  // Formatar a data
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };
  
  // Exibir a semana
  const formatWeek = () => {
    return `${format(startOfCurrentWeek, "dd/MM", { locale: ptBR })} - ${format(endOfCurrentWeek, "dd/MM", { locale: ptBR })}`;
  };

  // Mock de dados para simular consultas
  const consultasMock: Consulta[] = [
    {
      id: '1',
      data: '2024-03-15',
      hora: '14:30',
      medico: 'Dra. Maria Silva',
      especialidade: 'Clínica Geral',
      status: 'Realizada',
      diagnostico: 'Gripe',
      prescricao: 'Dipirona 500mg - 1 comprimido a cada 6 horas'
    },
    {
      id: '2',
      data: '2024-03-20',
      hora: '10:00',
      medico: 'Dr. João Santos',
      especialidade: 'Cardiologia',
      status: 'Agendada'
    }
  ];

  const buscarConsultas = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpf.length !== 11) {
      setErro('CPF inválido. Digite os 11 números do CPF.');
      return;
    }
    setErro('');
    setConsultas(consultasMock);
    setMostrarConsultas(true);
  };

  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho com informações do usuário */}
          {userData && userData.role === 'Paciente' && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Bem-vindo(a), {userData.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Portal do Paciente
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Portal do Paciente</h1>
            <p className="mt-2 text-gray-600">
              Consulte suas informações médicas e histórico de atendimentos
            </p>
          </div>

          {!userData?.role || userData.role !== 'Paciente' ? (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <form onSubmit={buscarConsultas} className="space-y-4">
                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                    CPF
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="cpf"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
                      maxLength={11}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Digite seu CPF (apenas números)"
                    />
                  </div>
                  {erro && <p className="mt-2 text-sm text-red-600">{erro}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Buscar Consultas
                </button>
              </form>
            </div>
          ) : null}

          {mostrarConsultas && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Suas Consultas</h1>
              </div>
              {consultas.length > 0 ? (
                consultas.map((consulta) => (
                  <div
                    key={consulta.id}
                    className="bg-white rounded-lg shadow-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-700">
                          {new Date(consulta.data).toLocaleDateString()}
                        </span>
                        <Clock className="h-5 w-5 text-blue-500 ml-4" />
                        <span className="text-gray-700">{consulta.hora}</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          consulta.status === 'Realizada'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {consulta.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Médico:</span> {consulta.medico}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Especialidade:</span> {consulta.especialidade}
                      </p>
                      {consulta.status === 'Realizada' && (
                        <>
                          <p className="text-gray-700">
                            <span className="font-medium">Diagnóstico:</span> {consulta.diagnostico}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Prescrição:</span> {consulta.prescricao}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <p className="text-gray-500">Nenhuma consulta encontrada.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Appointment;