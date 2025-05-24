import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EstoqueMedicamentos from '../pages/EstoqueMedicamentos';
import Records from '../pages/Records';
import PatientRecord from '../pages/PatientRecord';

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return (
        <Routes>
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