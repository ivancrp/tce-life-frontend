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
      <header className="fixed top-0 left-0 right-0 h-[85px] bg-[#2C417A] z-50">
        <div className="h-full flex items-center max-w-[1440px] mx-auto">
          <div className="w-64 px-4 flex items-center border-r border-[#3D529B] h-full">
            <img src="/logo-branca.svg" alt="TCE-Life Logo" className="h-12 w-auto" />
            <span className="text-white text-xl font-semibold ml-3">TCE-health</span>
          </div>
          
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
        className={`fixed top-[85px] left-0 z-40 w-64 bg-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out h-[calc(100vh-85px)] shadow-md border-r border-gray-300 lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
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
        <div className="max-w-[1440px] mx-auto">
          {/* Breadcrumbs */}
          <div className="px-4 py-2">
            <Breadcrumbs />
          </div>
          
          {/* Page content */}
          <div className="px-4">
            {children ? children : <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;