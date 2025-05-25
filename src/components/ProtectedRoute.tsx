import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import Layout from './Layout';
import { AuthService } from '../services/auth.service';
import { setupAuthToken, getCurrentUser, TOKEN_KEY, USER_KEY } from '../utils/auth';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  console.log('ProtectedRoute iniciado', { allowedRoles });
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Verificando autenticação...');
        // Verificar se existe o token no localStorage
        const token = localStorage.getItem(TOKEN_KEY);
        const user = localStorage.getItem(USER_KEY);
        
        console.log('Dados de autenticação:', { 
          hasToken: !!token, 
          hasUser: !!user,
          path: location.pathname
        });
        
        if (!token || !user) {
          console.log('Dados de autenticação incompletos');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // Configurar o token para requisições
        setupAuthToken();
        
        // Em desenvolvimento, podemos assumir autenticação local
        if (process.env.NODE_ENV === 'development') {
          console.log('Ambiente de desenvolvimento: assumindo autenticação local');
          const userData = JSON.parse(user);
          setUserRole(userData.role);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // Em produção, verificar com o servidor
        try {
          const isValid = await AuthService.verifyToken();
          console.log('Token validado pelo servidor:', isValid);
          const userData = JSON.parse(user);
          setUserRole(userData.role);
          setIsAuthenticated(isValid);
        } catch (error: any) {
          console.error('Erro ao verificar token:', error);
          
          // Em caso de erro de rede, confiar no token local
          if (error.message?.includes('Network Error')) {
            console.log('Erro de rede ao verificar token, confiando no token local');
            const userData = JSON.parse(user);
            setUserRole(userData.role);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isLoading) {
    console.log('Carregando...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Usuário não autenticado, redirecionando para /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar se o usuário tem o papel necessário
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Regra específica para pacientes tentando acessar configurações
    if (userRole === 'Paciente' && location.pathname.includes('/settings')) {
      console.log('Paciente tentando acessar configurações, redirecionando para página inicial');
      return <Navigate to="/" replace />;
    }
    // Se for paciente tentando acessar outras rotas restritas
    if (userRole === 'Paciente') {
      console.log('Paciente tentando acessar rota restrita, redirecionando para portal do paciente');
      return <Navigate to="/portal-paciente" replace />;
    }
    // Outros papéis não autorizados
    console.log('Usuário não autorizado, redirecionando para página inicial');
    return <Navigate to="/" replace />;
  }

  // Se estiver no Portal do Paciente, não usar o Layout padrão
  if (location.pathname === '/portal-paciente') {
    return <>{children || <Outlet />}</>;
  }

  // Para outras rotas protegidas, usar o Layout padrão
  console.log('Usuário autenticado, renderizando rota protegida');
  return (
    <Layout>
      {children || <Outlet />}
    </Layout>
  );
};

export default ProtectedRoute; 