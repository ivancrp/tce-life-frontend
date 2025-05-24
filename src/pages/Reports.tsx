import React from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Activity,
  Download
} from 'lucide-react';

const Reports = () => {
  const reports = [
    {
      id: 1,
      title: 'Atendimentos por Mês',
      icon: BarChart2,
      description: 'Visualize o número de consultas realizadas mensalmente'
    },
    {
      id: 2,
      title: 'Análise de Diagnósticos',
      icon: TrendingUp,
      description: 'Estatísticas dos diagnósticos mais frequentes'
    },
    {
      id: 3,
      title: 'Demografia de Pacientes',
      icon: Users,
      description: 'Distribuição de idade e gênero dos pacientes'
    },
    {
      id: 4,
      title: 'Indicadores de Desempenho',
      icon: Activity,
      description: 'Métricas de eficiência e qualidade do atendimento'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-lg font-medium text-gray-900 truncate">
                        {report.title}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500">
                        {report.description}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between text-sm">
                  <button className="font-medium text-blue-600 hover:text-blue-500">
                    Visualizar
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-gray-700">
                    <Download className="w-4 h-4 mr-1" />
                    Exportar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder for charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Consultas por Período</h3>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-500">
            Gráfico de consultas será implementado aqui
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição de Diagnósticos</h3>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-500">
            Gráfico de diagnósticos será implementado aqui
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;