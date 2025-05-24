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
  Stethoscope
} from 'lucide-react';
import api from '../services/api';

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
        const [pacientesRes, atendimentosRes, estoqueRes] = await Promise.all([
          api.get('/pacientes/dashboard'),
          api.get('/atendimentos/dashboard'),
          api.get('/medicamentos/relatorio')
        ]);

        setData({
          pacientes: pacientesRes.data,
          atendimentos: atendimentosRes.data,
          estoque: {
            total: estoqueRes.data.totalMedicamentos || 0,
            proximosVencimento: estoqueRes.data.medicamentosProximosVencimento?.length || 0,
            estoqueBaixo: estoqueRes.data.medicamentosEstoqueBaixo?.length || 0
          }
        });
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Seção de Pacientes */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Pacientes</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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