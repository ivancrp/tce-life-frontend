import React, { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import UserMenu from './UserMenu';

interface PatientLayoutProps {
  children?: ReactNode;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F2F6F8] font-roboto">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-[85px] bg-[#2C417A] z-50">
        <div className="h-full flex items-center max-w-[1440px] mx-auto px-4">
          <div className="flex items-center">
            <img src="/logo-branca.svg" alt="TCE-Life Logo" className="h-12 w-auto" />
            <span className="text-white text-xl font-semibold ml-3">TCE-health</span>
          </div>
          
          <div className="flex-1 flex items-center justify-end">
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="pt-[85px]">
        <div className="max-w-[1440px] mx-auto">
          {/* Page content */}
          <div className="px-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLayout; 