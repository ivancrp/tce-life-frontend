import { getCurrentUser, unformatRole, TOKEN_KEY } from '../utils/auth';
import { FormControl, Select, MenuItem, CircularProgress, Button, TextField, Alert, Typography, IconButton } from '@mui/material';
import { CalendarMonth, MedicalServices, Person, AccessTime, Category, Close, Assignment } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { doctorService, Doctor } from '../services/doctor.service';
import { scheduleService } from '../services/schedule.service';
import { specialtyService, Specialty } from '../services/specialty.service';

interface AppointmentFormProps {
  onSubmit: (data: {
    doctorId: string;
    date: Date;
    time: string;
    type: string;
  }) => Promise<void>;
  onClose: () => void;
}

const availableTimes = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00'
];

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [loadingDoctors, setLoadingDoctors] = useState<boolean>(false);
  const [loadingSpecialties, setLoadingSpecialties] = useState<boolean>(false);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  // Carregar especialidades
  useEffect(() => {
    const loadSpecialties = async () => {
      setLoadingSpecialties(true);
      setLoadingMessage('Carregando lista de especialidades...');
      setError(null);

      try {
        const currentUser = getCurrentUser();
        const token = localStorage.getItem(TOKEN_KEY);
        
        if (!currentUser || !token) {
          console.error('Usuário não autenticado ou token ausente');
          window.location.href = '/login';
          return;
        }

        console.log('Buscando especialidades...');
        const specialtiesData = await specialtyService.getAll();
        console.log('Especialidades encontradas:', specialtiesData);
        
        if (specialtiesData.length === 0) {
          setError('Não há especialidades disponíveis no momento.');
        } else {
          setSpecialties(specialtiesData);
        }
      } catch (error: any) {
        console.error('Erro ao buscar especialidades:', error);
        
        if (error.message?.includes('Sessão expirada') || error.message?.includes('não autenticado')) {
          window.location.href = '/login';
          return;
        }
        
        setError(error.message || 'Não foi possível carregar a lista de especialidades. Tente novamente mais tarde.');
      } finally {
        setLoadingSpecialties(false);
        setLoadingMessage('');
      }
    };

    loadSpecialties();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!selectedSpecialty) return;

      setLoadingDoctors(true);
      setLoadingMessage('Carregando lista de médicos...');
      setError(null);

      try {
        const currentUser = getCurrentUser();
        const token = localStorage.getItem(TOKEN_KEY);
        
        if (!currentUser || !token) {
          console.error('Usuário não autenticado ou token ausente');
          window.location.href = '/login';
          return;
        }
        
        const doctorsData = await doctorService.getAll();
        console.log('Médicos retornados:', doctorsData);
        
        if (doctorsData.length === 0) {
          setError('Não há médicos disponíveis no momento.');
        } else {
          // Temporariamente mostrando todos os médicos
          setFilteredDoctors(doctorsData);
          setDoctors(doctorsData);
        }
      } catch (error: any) {
        console.error('Erro ao buscar médicos:', error);
        
        if (error.message?.includes('Sessão expirada') || error.message?.includes('não autenticado')) {
          window.location.href = '/login';
          return;
        }
        
        setError(error.message || 'Não foi possível carregar a lista de médicos. Tente novamente mais tarde.');
      } finally {
        setLoadingDoctors(false);
        setLoadingMessage('');
      }
    };

    fetchDoctors();
  }, [selectedSpecialty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação dos campos
    if (!selectedSpecialty) {
      setError('Por favor, selecione uma especialidade.');
      return;
    }
    
    if (!selectedDoctor) {
      setError('Por favor, selecione um médico.');
      return;
    }

    if (!selectedDate) {
      setError('Por favor, selecione uma data.');
      return;
    }

    if (!selectedTime) {
      setError('Por favor, selecione um horário.');
      return;
    }

    if (!selectedType) {
      setError('Por favor, selecione um tipo de consulta.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const currentUser = getCurrentUser();
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (!currentUser || !token) {
        throw new Error('Usuário não autenticado');
      }
      
      await onSubmit({
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        type: selectedType
      });
      onClose();
    } catch (error: any) {
      console.error('Erro ao agendar consulta:', error);
      
      if (error.message?.includes('Sessão expirada') || error.message?.includes('não autenticado')) {
        window.location.href = '/login';
        return;
      }
      
      setError(error.message || 'Ocorreu um erro ao agendar a consulta. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[500px] rounded-lg overflow-hidden">
        <div className="bg-[#4263EB] px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-lg font-medium">Nova Consulta</h2>
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <div>
            <div className="flex items-center gap-2 mb-2">
              <MedicalServices className="w-5 h-5 text-[#4263EB]" />
              <Typography variant="body2" color="textSecondary">
                Especialidade
              </Typography>
            </div>
            <FormControl fullWidth>
              <Select
                value={selectedSpecialty || ''}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value);
                  setSelectedDoctor('');
                }}
                displayEmpty
                sx={{
                  height: '42px',
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4263EB',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4263EB',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Selecione uma especialidade
                </MenuItem>
                {specialties.map((specialty) => (
                  <MenuItem key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Person className="w-5 h-5 text-[#4263EB]" />
              <Typography variant="body2" color="textSecondary">
                Médico
              </Typography>
            </div>
            <FormControl fullWidth>
              <Select
                value={selectedDoctor || ''}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                displayEmpty
                disabled={!selectedSpecialty || loadingDoctors}
                sx={{
                  height: '42px',
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4263EB',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4263EB',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Selecione um médico
                </MenuItem>
                {filteredDoctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <CalendarMonth className="w-5 h-5 text-[#4263EB]" />
              <Typography variant="body2" color="textSecondary">
                Data
              </Typography>
            </div>
            <TextField
              type="date"
              fullWidth
              value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setSelectedDate(parseISO(e.target.value))}
              inputProps={{
                min: format(addDays(new Date(), 1), 'yyyy-MM-dd')
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '42px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E5E7EB',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4263EB',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4263EB',
                },
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <AccessTime className="w-5 h-5 text-[#4263EB]" />
              <Typography variant="body2" color="textSecondary">
                Horário
              </Typography>
            </div>
            <FormControl fullWidth>
              <Select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                displayEmpty
                sx={{
                  height: '42px',
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4263EB',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4263EB',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Selecione um horário
                </MenuItem>
                {availableTimes.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Assignment className="w-5 h-5 text-[#4263EB]" />
              <Typography variant="body2" color="textSecondary">
                Tipo
              </Typography>
            </div>
            <FormControl fullWidth>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                displayEmpty
                sx={{
                  height: '42px',
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4263EB',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4263EB',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Selecione o tipo de consulta
                </MenuItem>
                <MenuItem value="Primeira Consulta">Primeira Consulta</MenuItem>
                <MenuItem value="Retorno">Retorno</MenuItem>
                <MenuItem value="Exame">Exame</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={onClose}
              disabled={isSubmitting}
              variant="text"
              sx={{
                color: '#6B7280',
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                },
              }}
            >
              CANCELAR
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="contained"
              sx={{
                backgroundColor: '#4263EB',
                '&:hover': {
                  backgroundColor: '#3B5BDB',
                },
                '&:disabled': {
                  backgroundColor: '#93A5FF',
                },
              }}
            >
              {isSubmitting ? 'AGENDANDO...' : 'AGENDAR'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm; 