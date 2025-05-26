import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircle, LogOut, ChevronDown, Settings } from 'lucide-react';
import { getCurrentUser, logout } from '../utils/auth';
import Modal from './Modal';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const userData = getCurrentUser();

  // Função para extrair apenas os dois primeiros nomes
  const getFirstTwoNames = (fullName: string | undefined): string => {
    if (!fullName) return '';
    const names = fullName.split(' ');
    return names.slice(0, 2).join(' ');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Log para debug dos dados do usuário
  useEffect(() => {
    if (userData) {
      console.log('Dados do usuário no UserMenu:', {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        profilePicture: userData.profilePicture,
        imageUrl: userData.imageUrl
      });
    }
  }, [userData]);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsOpen(false);
  };

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true);
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Erro ao carregar imagem do perfil:', {
      src: e.currentTarget.src,
      naturalWidth: e.currentTarget.naturalWidth,
      naturalHeight: e.currentTarget.naturalHeight,
      error: e
    });
    setImageError(true);
  };

  // Determinar a URL da imagem do perfil
  const profileImageUrl = userData?.profilePicture || userData?.imageUrl;

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-2 max-w-xs bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-2 py-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Abrir menu do usuário</span>
        <img
          className="h-8 w-8 rounded-full"
          src={profileImageUrl}
          alt=""
        />
        <span className="text-sm font-medium text-gray-700">{getFirstTwoNames(userData?.name)}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2">
            <p className="text-sm text-gray-900">{userData?.name}</p>
            <p className="text-xs text-gray-500">{userData?.role}</p>
          </div>
          <div className="border-t border-gray-100">
            <Link
              to="/settings/profile"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Configurações
            </Link>
            <button
              onClick={handleLogoutClick}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4 inline mr-2" />
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Logout */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirmar Saída"
        message="Tem certeza que deseja sair do sistema? Você precisará fazer login novamente para acessar."
      />
    </div>
  );
};

export default UserMenu; 