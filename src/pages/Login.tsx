import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { setupAuthToken } from '../utils/auth';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import { RiLockPasswordLine } from 'react-icons/ri';

// Declaração para o objeto global do Google
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: any, callback?: () => void) => void;
        };
        oauth2: {
          initCodeClient: (config: any) => any;
          hasGrantedAllScopes: (tokenResponse: any, ...scopes: string[]) => boolean;
        };
      };
    };
  }
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clientId, setClientId] = useState<string>('');
  const googleInitialized = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Pegar o ID do cliente do ambiente
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    setClientId(googleClientId);
    
    // Log para depuração
    console.log('Google Client ID:', googleClientId);
    
    // Tentativa de inicializar a autenticação do Google após um pequeno delay
    // para ter certeza de que o script já foi carregado
    const initTimeout = setTimeout(() => {
      initializeGoogleAuth(googleClientId);
    }, 1000);

    // Verificar periodicamente se o Google Sign-In foi carregado
    const checkInterval = setInterval(() => {
      if (window.google && window.google.accounts && !googleInitialized.current) {
        console.log('Google Sign-In detectado, inicializando...');
        initializeGoogleAuth(googleClientId);
        clearInterval(checkInterval);
      }
    }, 1000);

    return () => {
      clearTimeout(initTimeout);
      clearInterval(checkInterval);
      googleInitialized.current = false;
    };
  }, []);

  // Função para inicializar a autenticação do Google
  const initializeGoogleAuth = (googleClientId: string) => {
    if (!window.google || !window.google.accounts) {
      console.error('Google Accounts não disponível');
      return;
    }

    if (googleInitialized.current) return;

    try {
      if (!googleClientId) {
        console.error('Google Client ID não encontrado no arquivo .env');
        setError('Configuração de autenticação Google inválida. Por favor, entre em contato com o suporte.');
        return;
      }
      
      console.log('Inicializando Google Sign-In com client ID:', googleClientId.substring(0, 10) + '...');
      
      // Adicionar um listener para erros do GSI Logger
      window.addEventListener('error', (e) => {
        const errorMessage = e.message || '';
        if (errorMessage.includes('GSI_LOGGER') && errorMessage.includes('client ID is not found')) {
          console.error('Erro de Client ID do Google:', errorMessage);
          setError('ID do Cliente Google inválido ou não encontrado. Por favor, use login com email/senha.');
        }
      });
      
      // Configuração básica que evita usar FedCM diretamente
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false // Desativar FedCM para evitar o erro de rede
      });

      // Renderizar o botão simples de login do Google
      const buttonContainer = document.getElementById('googleLoginButton');
      if (buttonContainer) {
        window.google.accounts.id.renderButton(
          buttonContainer,
          { 
            type: 'standard', 
            theme: 'filled_blue', 
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: 240,
            logo_alignment: 'left'
          }
        );
        
        console.log('Botão do Google renderizado com sucesso');
      } else {
        console.error('Container para botão do Google não encontrado');
      }

      googleInitialized.current = true;
    } catch (err) {
      console.error('Erro ao inicializar Google Sign-In:', err);
      setError('Falha ao configurar login com Google. Por favor, use o login com email/senha.');
    }
  };

  const handleRedirect = (userRole: string) => {
    // Obter a URL de redirecionamento do estado da localização
    const from = location.state?.from?.pathname;
    
    console.log('Redirecionando usuário:', {
      role: userRole,
      from: from || 'não definido'
    });
    
    // Normalizar o papel do usuário (para evitar problemas de case)
    const normalizedRole = userRole.toLowerCase();
    
    // Redirecionamento baseado na role
    if (normalizedRole.includes('paciente')) {
      console.log('Redirecionando para portal do paciente');
      navigate('/portal-paciente', { replace: true });
    } 
    else if (normalizedRole.includes('médico') || normalizedRole.includes('medico')) {
      console.log('Redirecionando médico para:', from || '/schedule');
      navigate(from || '/schedule', { replace: true });
    }
    else if (normalizedRole.includes('recepcionista')) {
      console.log('Redirecionando recepcionista para:', from || '/schedule');
      navigate(from || '/schedule', { replace: true });
    }
    else if (normalizedRole.includes('admin') || normalizedRole.includes('administrador')) {
      console.log('Redirecionando administrador para:', from || '/settings');
      navigate(from || '/settings', { replace: true });
    }
    else {
      console.log('Papel não reconhecido, redirecionando para página padrão:', from || '/');
      navigate(from || '/', { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setIsLoading(true);

    try {
      // Chamar o serviço de autenticação
      const authResult = await AuthService.login({ email, password });
      console.log('Login bem-sucedido, dados:', authResult);
      
      // Configurar o token para requisições futuras
      await setupAuthToken();
      
      // Redirecionar com base no papel do usuário
      handleRedirect(authResult.user.role);
    } catch (err: any) {
      console.error('Erro detalhado de login:', err);
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCredentialResponse = async (response: any) => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Resposta do Google recebida:', { 
        credential: response.credential ? 'presente' : 'ausente'
      });
      
      if (!response || !response.credential) {
        throw new Error('Resposta do Google inválida');
      }
      
      // Enviando o token ID para nosso backend
      const authResult = await AuthService.loginWithGoogle(response.credential);
      console.log('Login com Google bem-sucedido, dados:', authResult);
      
      // Configurar o token para requisições futuras
      await setupAuthToken();
      
      // Redirecionar com base no papel do usuário
      handleRedirect(authResult.user.role);
    } catch (err: any) {
      console.error('Erro detalhado ao fazer login com Google:', err);
      
      // Tratamento de erros mais específico
      if (err.response && err.response.status === 401) {
        setError(err.response.data?.message || 'Cliente OAuth inválido. Verifique as configurações do projeto.');
      } else if (err.message && err.message.includes('NetworkError')) {
        setError('Erro de rede ao autenticar com Google. Verifique sua conexão com a internet.');
      } else {
        setError(err.message || 'Falha ao autenticar com Google. Tente novamente mais tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com o login manual com Google
  const handleManualGoogleLogin = () => {
    setError('');
    
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      console.error('Google Sign-In API não está disponível');
      setError('Serviço do Google não está disponível. Tente outra forma de login ou recarregue a página.');
      return;
    }
    
    try {
      console.log('Tentando iniciar Google Sign-In manualmente...');
      
      // Desativar o FedCM explicitamente novamente para este prompt
      if (typeof window.google.accounts.id.disableAutoSelect === 'function') {
        window.google.accounts.id.disableAutoSelect();
      }
      
      // Usando o prompt com callback para detectar erros
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          const reason = notification.getNotDisplayedReason();
          console.log('Prompt não exibido, motivo:', reason);
          
          // Tratar razões específicas
          if (reason === 'browser_not_supported') {
            setError('Seu navegador não suporta login com Google. Use email e senha.');
          } else if (reason === 'missing_client_id') {
            setError('ID do cliente Google não configurado corretamente.');
          } else if (reason === 'network_error') {
            setError('Erro de rede ao se comunicar com o Google. Verifique sua conexão.');
          } else if (reason === 'third_party_cookies_blocked') {
            setError('Cookies de terceiros bloqueados. Ajuste as configurações do navegador ou use email/senha.');
          } else {
            setError(`Login com Google não disponível: ${reason}`);
          }
        } else if (notification.isSkippedMoment()) {
          console.log('Momento ignorado, motivo:', notification.getSkippedReason());
        } else if (notification.isDismissedMoment()) {
          console.log('Prompt dispensado, motivo:', notification.getDismissedReason());
        }
      });
    } catch (error) {
      console.error('Erro ao iniciar Google Sign-In manual:', error);
      setError('Não foi possível iniciar autenticação com Google. Tente usar email e senha.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden p-8 transform transition-all duration-300 hover:scale-[1.01]">
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="TCE-Life Logo" 
            className="h-60 mx-auto transform transition-transform duration-300 hover:scale-105"
          />
          <p className="mt-4 text-center text-sm text-gray-600 font-medium">
            Acesse o sistema com suas credenciais
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineMail className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-400"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiLockPasswordLine className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-400"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center px-4 py-3 bg-red-50 rounded-lg border border-red-100 animate-fade-in">
              {error}
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200 ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </div>
              ) : (
                'Entrar com E-mail'
              )}
            </button>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Ou continue com</span>
              </div>
            </div>
            
            {/* Container para o botão do Google renderizado pela API */}
            <div id="googleLoginButton" className="flex justify-center mt-2 transform transition-transform duration-200 hover:scale-[1.02]"></div>
            
            {/* Mensagem informativa sobre login com credenciais */}
            <div className="text-xs text-gray-500 text-center mt-2">
              <p>Em caso de problemas com o login do Google, utilize as credenciais:</p>
              <p className="font-medium mt-1">Email: <span className="text-blue-600">admin@example.com</span></p>
              <p className="font-medium">Senha: <span className="text-blue-600">admin123</span></p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 