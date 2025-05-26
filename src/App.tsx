import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SchedulePage from './pages/Schedule';
import { AtendimentoPage } from './pages/Atendimento';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import Records from './pages/Records';
import Reports from './pages/Reports';
import Inventory from './pages/Inventory';
import PatientPortal from './pages/PatientPortal';
import UserSpecialty from './pages/Settings/UserSpecialty';
import SpecialtySettings from './pages/Settings/Specialty';
import LDAPSettings from './pages/Settings/LDAPConfig';
import UserProfile from './pages/Settings/UserProfile';
import PatientRecord from './pages/PatientRecord';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import theme from './theme';
import AppRoutes from './routes';
import SimpleLogin from './pages/SimpleLogin';
import NewConsultation from './pages/NewConsultation';
import EstoqueMedicamentos from './pages/EstoqueMedicamentos';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const protectedRoutes = [
    { path: '/', element: <Dashboard /> },
    { path: '/schedule', element: <SchedulePage /> },
    { path: '/records', element: <Records /> },
    { path: '/medical-records/:id', element: <PatientRecord /> },
    { path: '/inventory', element: <Inventory /> },
    { path: '/reports', element: <Reports /> },
    { path: '/settings', element: <Settings /> },
    { path: '/settings/user-specialty', element: <UserSpecialty /> },
    { path: '/settings/specialty', element: <SpecialtySettings /> },
    { path: '/settings/ldap', element: <LDAPSettings /> },
    { path: '/settings/profile', element: <UserProfile /> },
    { path: '/atendimento/:id', element: <AtendimentoPage /> },
  ];

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/simple-login" element={<SimpleLogin />} />
            <Route path="/new-consultation" element={<NewConsultation />} />
            
            {/* Portal do Paciente */}
            <Route path="/portal-paciente" element={
              <ProtectedRoute allowedRoles={['Paciente']}>
                <PatientPortal />
              </ProtectedRoute>
            } />
            
            {/* Rotas protegidas */}
            <Route element={<ProtectedRoute />}>
              {protectedRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Route>
          </Routes>
          <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            aria-label="Notificações do sistema"
          />
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App; 