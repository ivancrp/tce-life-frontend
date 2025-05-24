import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EstoqueMedicamentos from '../pages/EstoqueMedicamentos';
import Records from '../pages/Records';
import PatientRecord from '../pages/PatientRecord';
import Login from '../pages/Login';
import RegisterForm from '../components/RegisterForm';
import PatientPortal from '../pages/PatientPortal';
import Schedule from '../pages/Schedule';
import Settings from '../pages/Settings';
import { AuthService } from '../services/auth.service';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = AuthService.isAuthenticated();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
                path="/portal-paciente"
                element={
                    <PrivateRoute>
                        <PatientPortal />
                    </PrivateRoute>
                }
            />
            <Route
                path="/schedule"
                element={
                    <PrivateRoute>
                        <Schedule />
                    </PrivateRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <PrivateRoute>
                        <Settings />
                    </PrivateRoute>
                }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* Rotas protegidas que requerem autenticação e permissões específicas */}
            <Route
                path="/estoque"
                element={
                    user && ['MEDICO', 'RECEPCIONISTA', 'ADMINISTRADOR'].includes(user.tipo) ? (
                        <EstoqueMedicamentos />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
            <Route
                path="/records"
                element={
                    user && ['MEDICO', 'RECEPCIONISTA', 'ADMINISTRADOR'].includes(user.tipo) ? (
                        <Records />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
            <Route
                path="/medical-records/:id"
                element={
                    user && ['MEDICO', 'RECEPCIONISTA', 'ADMINISTRADOR'].includes(user.tipo) ? (
                        <PatientRecord />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
        </Routes>
    );
};

export default AppRoutes; 