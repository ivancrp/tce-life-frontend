import React, { useState, useEffect } from 'react';
import { Plus, User, Stethoscope, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  specialties: Specialty[];
}

interface Specialty {
  id: string;
  name: string;
  description: string;
}

const UserSpecialty: React.FC = () => {
  console.log('Componente UserSpecialty iniciado');
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log('useEffect executado');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Iniciando busca de dados...');
      const token = localStorage.getItem('token');
      console.log('Token atual:', token);
      
      setIsLoading(true);
      setError(null);

      console.log('Fazendo requisição para /api/specialties/users...');
      const [usersResponse, specialtiesResponse] = await Promise.all([
        api.get('/api/specialties/users'),
        api.get('/api/specialties')
      ]);

      console.log('Resposta de /api/specialties/users:', usersResponse.data);
      console.log('Resposta de /api/specialties:', specialtiesResponse.data);
      
      setUsers(usersResponse.data);
      setSpecialties(specialtiesResponse.data);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      if (error.response) {
        console.error('Detalhes do erro:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      setError('Erro ao carregar dados. Por favor, tente novamente.');
      setIsLoading(false);
    }
  };

  const handleAssignSpecialty = async () => {
    if (!selectedUser || selectedSpecialties.length === 0) {
      setError('Por favor, selecione pelo menos uma especialidade');
      return;
    }

    try {
      console.log('Atribuindo especialidades:', { selectedUser, selectedSpecialties });
      
      const response = await api.post('/specialties/assign', {
        userId: selectedUser.id,
        specialties: selectedSpecialties
      });

      const updatedUser = response.data;
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));

      setIsModalOpen(false);
      setSelectedUser(null);
      setSelectedSpecialties([]);
      setSuccessMessage('Especialidades atribuídas com sucesso!');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Erro ao atribuir especialidades:', err);
      setError('Erro ao atribuir especialidades. Por favor, tente novamente.');
    }
  };

  const handleSpecialtyToggle = (specialtyId: string) => {
    setSelectedSpecialties(prev => {
      if (prev.includes(specialtyId)) {
        return prev.filter(s => s !== specialtyId);
      } else {
        return [...prev, specialtyId];
      }
    });
  };

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setSelectedSpecialties(user.specialties.map(s => s.id));
    setIsModalOpen(true);
    setError(null);
  };

  console.log('Renderizando componente, estado atual:', { isLoading, error, users });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Especialidades dos Usuários</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Papel
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidades
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'MEDICO' ? 'bg-green-100 text-green-800' :
                        user.role === 'SECRETARIA' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'ADMIN' ? 'Administrador' :
                         user.role === 'MEDICO' ? 'Médico' :
                         user.role === 'SECRETARIA' ? 'Secretária' :
                         user.role === 'PACIENTE' ? 'Paciente' :
                         user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex flex-wrap gap-2">
                          {user.specialties?.map((specialty) => (
                            <span
                              key={specialty.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              <Stethoscope className="h-3 w-3 mr-1" />
                              {specialty.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Gerenciar Especialidades
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Atribuição de Especialidade */}
      {isModalOpen && selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Gerenciar Especialidades - {selectedUser.name}
                  </h3>
                  <div className="mt-4">
                    <div className="space-y-4">
                      {specialties.map((specialty) => (
                        <div key={specialty.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`specialty-${specialty.id}`}
                            checked={selectedSpecialties.includes(specialty.id)}
                            onChange={() => handleSpecialtyToggle(specialty.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`specialty-${specialty.id}`} className="ml-3 block text-sm text-gray-900">
                            {specialty.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAssignSpecialty}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSpecialty; 