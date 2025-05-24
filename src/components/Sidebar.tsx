import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart2,
  Calendar,
  Settings,
  User,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { getUserRole } from '../utils/auth';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const userRole = getUserRole();
  
  // Links de navegação baseados no papel do usuário
  const getNavLinks = () => {
    // Links para pacientes
    if (userRole === 'Paciente') {
      return [
       { to: '/', icon: <LayoutDashboard />, text: 'Portal do Paciente' },
        { to: '/minhas-consultas', icon: <Calendar />, text: 'Minhas Consultas' },
        { to: '/historico-medico', icon: <FileText />, text: 'Histórico Médico' },
        { to: '/settings/profile', icon: <User />, text: 'Meu Perfil' },
      ];
    }
    
    // Links para médicos
    if (userRole === 'Médico') {
      return [
        { to: '/', icon: <LayoutDashboard />, text: 'Dashboard' },
        { to: '/schedule', icon: <Calendar />, text: 'Agenda' },
        { to: '/atendimento', icon: <Stethoscope />, text: 'Atendimento' },
        { to: '/records', icon: <FileText />, text: 'Prontuários' },
        { to: '/reports', icon: <BarChart2 />, text: 'Relatórios' },
        { to: '/settings/profile', icon: <User />, text: 'Perfil' },
      ];
    }
    
    // Links para administradores
    if (userRole === 'Administrador') {
      return [
        { to: '/', icon: <LayoutDashboard />, text: 'Dashboard' },
        { to: '/users', icon: <Users />, text: 'Usuários' },
        { to: '/settings', icon: <Settings />, text: 'Configurações' },
        { to: '/reports', icon: <BarChart2 />, text: 'Relatórios' },
      ];
    }
    
    // Links para atendentes
    if (userRole === 'Atendente') {
      return [
        { to: '/', icon: <LayoutDashboard />, text: 'Dashboard' },
        { to: '/schedule', icon: <Calendar />, text: 'Agenda' },
        { to: '/settings/profile', icon: <User />, text: 'Perfil' },
      ];
    }
    
    // Links padrão (caso a role não seja reconhecida)
    return [
      { to: '/', icon: <LayoutDashboard />, text: 'Dashboard' },
      { to: '/schedule', icon: <Calendar />, text: 'Agenda' },
      { to: '/records', icon: <FileText />, text: 'Prontuários' },
      { to: '/settings/profile', icon: <User />, text: 'Perfil' },
    ];
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">TCE-Life</h1>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {getNavLinks().map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-[1.2rem] font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <span className="mr-4 text-[1.2rem]">{link.icon}</span>
              <span className="text-[1.2rem]">{link.text}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 