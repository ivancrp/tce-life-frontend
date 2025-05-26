import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  AlertCircle,
  Package,
  AlertTriangle,
  Box,
  TrendingUp,
  Calendar,
  Activity,
  UserPlus,
  Clock,
  Stethoscope,
  AlertOctagon
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import Breadcrumbs from '../components/Breadcrumbs';

interface DashboardData {
  pacientes: {
    total: number;
    novos: number;
    agendados: number;
  };
  atendimentos: {
    hoje: number;
    semana: number;
    especialidades: {
      nome: string;
      quantidade: number;
    }[];
  };
  estoque: {
    total: number;
    proximosVencimento: number;
    estoqueBaixo: number;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    pacientes: {
      total: 0,
      novos: 0,
      agendados: 0
    },
    atendimentos: {
      hoje: 0,
      semana: 0,
      especialidades: []
    },
    estoque: {
      total: 0,
      proximosVencimento: 0,
      estoqueBaixo: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [pacientesRes, atendimentosRes, estoqueRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/attendance/stats'),
          api.get('/medicamentos/relatorio')
        ]);

        setData({
          pacientes: {
            total: pacientesRes.data.totalPacientes || 0,
            novos: pacientesRes.data.novosPacientes || 0,
            agendados: pacientesRes.data.consultasAgendadas || 0
          },
          atendimentos: {
            hoje: atendimentosRes.data.atendimentosHoje || 0,
            semana: atendimentosRes.data.atendimentosSemana || 0,
            especialidades: atendimentosRes.data.especialidades || []
          },
          estoque: {
            total: estoqueRes.data.totalMedicamentos || 0,
            proximosVencimento: estoqueRes.data.medicamentosProximosVencimento?.length || 0,
            estoqueBaixo: estoqueRes.data.medicamentosEstoqueBaixo?.length || 0
          }
        });
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        setError('Não foi possível carregar os dados do dashboard');
        toast.error('Erro ao carregar dados do dashboard. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Atualiza os dados a cada 5 minutos
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <AlertOctagon className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ops! Algo deu errado</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Seção de Pacientes */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Pacientes</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-gray-500 text-sm">Total de Pacientes</p>
                    <p className="text-2xl font-semibold text-gray-900">{data.pacientes.total}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                    <UserPlus className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-gray-500 text-sm">Novos Pacientes (Mês)</p>
                    <p className="text-2xl font-semibold text-gray-900">{data.pacientes.novos}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-gray-500 text-sm">Consultas Agendadas</p>
                    <p className="text-2xl font-semibold text-gray-900">{data.pacientes.agendados}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Atendimentos */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Atendimentos</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Por Especialidade</h3>
              <div className="space-y-4">
                {data.atendimentos.especialidades.map((esp, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(esp.quantidade / data.atendimentos.semana) * 100}%` }}
                      ></div>
                    </div>
                    <div className="min-w-[150px] ml-4">
                      <p className="text-sm text-gray-600">{esp.nome}</p>
                      <p className="text-sm font-medium text-gray-900">{esp.quantidade} pacientes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
                      <Activity className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5">
                      <p className="text-gray-500 text-sm">Atendimentos Hoje</p>
                      <p className="text-2xl font-semibold text-gray-900">{data.atendimentos.hoje}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-pink-100 rounded-full p-3">
                      <Stethoscope className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="ml-5">
                      <p className="text-gray-500 text-sm">Total na Semana</p>
                      <p className="text-2xl font-semibold text-gray-900">{data.atendimentos.semana}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Estoque */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Estoque</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                    <Box className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-gray-500 text-sm">Total em Estoque</p>
                    <p className="text-2xl font-semibold text-gray-900">{data.estoque.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <button 
                  onClick={() => navigate('/inventory')}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  Ver detalhes
                </button>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-gray-500 text-sm">Próximos do Vencimento</p>
                    <p className="text-2xl font-semibold text-yellow-600">{data.estoque.proximosVencimento}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <button 
                  onClick={() => navigate('/inventory?filter=expiring')}
                  className="text-yellow-600 hover:text-yellow-900 text-sm font-medium"
                >
                  Ver detalhes
                </button>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-gray-500 text-sm">Estoque Baixo</p>
                    <p className="text-2xl font-semibold text-red-600">{data.estoque.estoqueBaixo}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <button 
                  onClick={() => navigate('/inventory?filter=low')}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 