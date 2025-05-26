import React, { useState, ReactNode, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Calendar, 
  BarChart, 
  Menu,
  Home,
  User,
  FileText as FileIcon,
  Package,
  Settings
} from 'lucide-react';
import { getCurrentUser, UserData as AuthUserData, unformatRole } from '../utils/auth';
import UserMenu from './UserMenu';
import Breadcrumbs from './Breadcrumbs';

interface LayoutProps {
  children?: ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  allowedRoles: string[];
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState<AuthUserData | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserData(user);
    }
  }, []);

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/', icon: Home, allowedRoles: ['Médico', 'Admin', 'Recepcionista'] },
    { name: 'Prontuários', href: '/records', icon: FileText, allowedRoles: ['Médico', 'Admin'] },
    { name: 'Agenda', href: '/schedule', icon: Calendar, allowedRoles: ['Médico', 'Admin', 'Recepcionista'] },
    { name: 'Estoque', href: '/inventory', icon: Package, allowedRoles: ['Médico', 'Admin', 'Recepcionista'] },
    { name: 'Relatórios', href: '/reports', icon: BarChart, allowedRoles: ['Médico', 'Admin'] },
    { name: 'Configurações', href: '/settings', icon: Settings, allowedRoles: ['Médico', 'Admin'] },
    { name: 'Portal do Paciente', href: '/portal-paciente', icon: User, allowedRoles: ['Paciente'] },
  ];

  const isPatientPortal = location.pathname === '/portal-paciente' || location.pathname === '/appointment';
  const userRole = userData?.role || '';

  const filteredNavigation = navigation.filter(item => 
    item.allowedRoles.includes(userRole)
  );

  return (
    <div className="min-h-screen bg-[#F2F6F8] font-roboto">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-[85px] bg-[#2C417A] z-40 pl-64">
        <div className="h-full flex items-center max-w-[1440px] mx-auto">
          <div className="flex-1 flex items-center justify-end px-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-4 text-white hover:text-gray-200 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 z-50 w-64 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out h-screen lg:translate-x-0 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="h-[85px] bg-[#2C417A] flex items-center px-4">
          <div className="flex items-center gap-2">
            <img src="/logo-branca.svg" alt="TCE-Life Logo" className="h-14 w-auto" />
            <div className="flex flex-col">
              <span className="text-white text-xl font-semibold">TCE</span>
              <span className="text-white text-lg">health</span>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="flex-1 bg-white shadow-md border-r border-gray-300">
          <nav className="flex-1 px-2 py-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-[1.1rem] leading-[2.2em] font-roboto text-[#494949] cursor-pointer bg-white rounded-md my-1 relative ${
                    location.pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-[1.5rem] h-[1.5rem] mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`pt-[85px] transition-all duration-200 ${isSidebarOpen ? 'lg:pl-64' : ''}`}>
        <div className="px-4 pr-8 lg:pr-12">
          {children ? children : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default Layout;