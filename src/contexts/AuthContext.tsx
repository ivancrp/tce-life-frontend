import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export type TipoUsuario = 'MEDICO' | 'RECEPCIONISTA' | 'ADMINISTRADOR' | 'PACIENTE';

interface User {
    id: string;
    nome: string;
    tipo: TipoUsuario;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (token: string) => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('@TCE:token');
        if (token) {
            api.defaults.headers.authorization = `Bearer ${token}`;
            // Aqui você pode fazer uma chamada para a API para obter os dados do usuário
            // Por enquanto, vamos apenas decodificar o token
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    id: payload.id,
                    nome: payload.nome,
                    tipo: payload.tipo,
                });
            } catch (error) {
                localStorage.removeItem('@TCE:token');
            }
        }
        setLoading(false);
    }, []);

    const signIn = (token: string) => {
        localStorage.setItem('@TCE:token', token);
        api.defaults.headers.authorization = `Bearer ${token}`;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({
                id: payload.id,
                nome: payload.nome,
                tipo: payload.tipo,
            });
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
        }
    };

    const signOut = () => {
        localStorage.removeItem('@TCE:token');
        api.defaults.headers.authorization = '';
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}; 