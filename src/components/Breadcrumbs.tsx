import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const routeLabels: { [key: string]: string } = {
  'settings': 'Configurações',
  'user-specialty': 'Especialidades de Usuários',
  'specialty': 'Especialidades',
  'ldap': 'Configuração LDAP',
  'schedule': 'Agenda',
  'pacientes': 'Pacientes',
  'reports': 'Relatórios',
  'inventory': 'Inventário',
  'atendimento': 'Atendimento',
  'portal-paciente': 'Portal do Paciente',
  'medical-records': 'Prontuário'
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Se estiver na página inicial, não mostra o breadcrumb
  if (pathnames.length === 0) {
    return null;
  }

  // Tratamento especial para a rota de prontuário médico
  const isMedicalRecord = pathnames[0] === 'medical-records' && pathnames.length > 1;
  const processedPathnames = isMedicalRecord ? ['records', 'Prontuário'] : pathnames;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link
        to="/"
        className="hover:text-blue-600 transition-colors duration-200"
      >
        Início
      </Link>

      {processedPathnames.map((value, index) => {
        // Para prontuário médico, ajusta os links
        const to = isMedicalRecord && index === 1 
          ? location.pathname // Mantém o URL atual para o prontuário
          : `/${processedPathnames.slice(0, index + 1).join('/')}`;
        
        const isLast = index === processedPathnames.length - 1;
        // Se o valor for 'records', usa o label 'Pacientes'
        const label = value === 'records' ? 'Pacientes' : (routeLabels[value] || value);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900">{label}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-blue-600 transition-colors duration-200"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs; 