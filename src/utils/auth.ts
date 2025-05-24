import axios from 'axios';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string; // URL da imagem do avatar (opcional)
  imageUrl?: string; // Mantido para compatibilidade
  specialty?: string; // Para médicos
  department?: string; // Para administradores
  birthDate?: string; // Para pacientes
}

export const TOKEN_KEY = '@TCE:token';
export const USER_KEY = '@TCE:user';

// Mapeamento de roles do backend para o frontend
const ROLE_MAPPING: { [key: string]: string } = {
  'MEDICO': 'Médico',
  'ADMIN': 'Admin',
  'SECRETARIA': 'Recepcionista',
  'PACIENTE': 'Paciente'
};

// Mapeamento inverso (frontend para backend)
const REVERSE_ROLE_MAPPING: { [key: string]: string } = {
  'Médico': 'MEDICO',
  'Admin': 'ADMIN',
  'Recepcionista': 'SECRETARIA',
  'Paciente': 'PACIENTE'
};

/**
 * Converte a role do backend para o formato do frontend
 */
export function formatRole(role: string): string {
  return ROLE_MAPPING[role] || role;
}

/**
 * Converte a role do frontend para o formato do backend
 */
export function unformatRole(role: string): string {
  return REVERSE_ROLE_MAPPING[role] || role;
}

/**
 * Verifica se o usuário está autenticado
 * @returns boolean indicando se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);
  return token !== null && user !== null;
}

/**
 * Obtém o usuário atual do localStorage
 * @returns UserData | null
 */
export function getCurrentUser(): UserData | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    // Formata a role para exibição
    if (user.role) {
      user.role = formatRole(user.role);
    }
    return user;
  } catch (error) {
    console.error('Erro ao parsear dados do usuário:', error);
    return null;
  }
}

/**
 * Verifica o papel do usuário atual
 * @returns string com o papel do usuário ou null
 */
export function getUserRole(): string | null {
  const user = getCurrentUser();
  if (!user) {
    console.log('Nenhum usuário autenticado');
    return null;
  }
  console.log('Papel do usuário:', user.role);
  return user.role;
}

/**
 * Define o token e os dados do usuário no localStorage
 * @param token Token JWT
 * @param userData Dados do usuário
 */
export async function setAuthData(token: string, userData: UserData): Promise<void> {
  try {
    console.log('Salvando dados de autenticação:', { token: token ? 'presente' : 'ausente', userData });
    
    if (!token) {
      throw new Error('Token de autenticação não fornecido');
    }
    
    // Formata a role para exibição
    const formattedUserData = {
      ...userData,
      role: formatRole(userData.role)
    };
    
    // Salvar dados no localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(formattedUserData));
    
    // Configurar o token para requisições futuras
    setupAuthToken();
    
    console.log('Dados de autenticação salvos e token configurado com sucesso');
  } catch (error) {
    console.error('Erro ao salvar dados de autenticação:', error);
    throw new Error('Falha ao salvar dados de autenticação');
  }
}

/**
 * Realiza logout do usuário
 */
export function logout(): void {
  console.log('Realizando logout do usuário');
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  
  // Limpa o cabeçalho de autorização para futuras requisições
  delete axios.defaults.headers.common['Authorization'];
  
  console.log('Logout concluído, dados de autenticação removidos');
}

/**
 * Configura o token de autenticação para requisições
 */
export function setupAuthToken(): void {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    console.log('Configurando token de autenticação para requisições');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('Removendo token de autenticação das requisições');
    delete axios.defaults.headers.common['Authorization'];
  }
}

/**
 * Verifica se o usuário é um paciente
 * @returns boolean indicando se o usuário é um paciente
 */
export function isPatient(): boolean {
  const role = getUserRole();
  const isPatient = role === 'Paciente';
  console.log('Verificação de paciente:', { role, isPatient });
  return isPatient;
}

/**
 * Verifica se o usuário é um médico
 * @returns boolean indicando se o usuário é um médico
 */
export function isDoctor(): boolean {
  const role = getUserRole();
  return role === 'Médico';
}

/**
 * Verifica se o usuário é um administrador
 * @returns boolean indicando se o usuário é um administrador
 */
export function isAdmin(): boolean {
  const role = getUserRole();
  return role === 'Admin';
} 