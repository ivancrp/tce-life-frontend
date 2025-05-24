import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UserRole = 'Médico' | 'Paciente' | 'Administrador';

interface UserSelectionProps {
  onSelect: (role: UserRole) => void;
  selectedRole: UserRole | null;
}

const UserSelection: React.FC<UserSelectionProps> = ({ onSelect, selectedRole }) => {
  return (
    <div className="space-y-4 mb-6">
      <p className="text-sm font-medium text-gray-700">Selecione o tipo de usuário:</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onSelect('Médico')}
          className={`flex items-center justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium ${
            selectedRole === 'Médico'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Médico
        </button>
        <button
          type="button"
          onClick={() => onSelect('Paciente')}
          className={`flex items-center justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium ${
            selectedRole === 'Paciente'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Paciente
        </button>
        <button
          type="button"
          onClick={() => onSelect('Administrador')}
          className={`flex items-center justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium ${
            selectedRole === 'Administrador'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Administrador
        </button>
      </div>
    </div>
  );
};

const SimpleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  const getUserData = (role: UserRole) => {
    switch (role) {
      case 'Médico':
        return {
          id: 'med-001',
          name: 'Dr. João Silva',
          role: 'Médico',
          email: 'joao.silva@tce-life.com',
          specialty: 'Clínica Geral'
        };
      case 'Paciente':
        return {
          id: 'pac-001',
          name: 'Ana Oliveira',
          role: 'Paciente',
          email: 'ana.oliveira@email.com',
          birthDate: '1985-04-15'
        };
      case 'Administrador':
        return {
          id: 'adm-001',
          name: 'Carlos Rocha',
          role: 'Administrador',
          email: 'carlos.rocha@tce-life.com',
          department: 'TI'
        };
      default:
        return {
          id: 'test-001',
          name: 'Usuário Teste',
          role: 'Médico'
        };
    }
  };

  const handleLogin = async () => {
    if (!selectedRole) {
      alert('Por favor, selecione um tipo de usuário');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular login
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Obter dados do usuário baseado na função selecionada
      const userData = getUserData(selectedRole);
      
      // Armazenar token e dados do usuário no localStorage
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirecionar para o dashboard ou área adequada
      if (selectedRole === 'Paciente') {
        navigate('/appointment', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">TCE-Life</h1>
        <p className="text-gray-600 mt-2">Login Simplificado</p>
      </div>
      
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <UserSelection onSelect={setSelectedRole} selectedRole={selectedRole} />
        
        <button
          onClick={handleLogin}
          disabled={isLoading || !selectedRole}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </div>
  );
};

export default SimpleLogin; 