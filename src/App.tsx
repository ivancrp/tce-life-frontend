import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SchedulePage from './pages/Schedule';
import { AtendimentoPage } from './pages/Atendimento';
import Settings from './pages/Settings';
import Appointment from './pages/Appointment';
import ProtectedRoute from './components/ProtectedRoute';
import Records from './pages/Records';
import Reports from './pages/Reports';
import Inventory from './pages/Inventory';
import PatientPortal from './pages/PatientPortal';
import UserSpecialty from './pages/Settings/UserSpecialty';
import SpecialtySettings from './pages/Settings/Specialty';
import LDAPSettings from './pages/Settings/LDAPConfig';
import PatientRecord from './pages/PatientRecord';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import theme from './theme';
import AppRoutes from './routes';

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
    { path: '/atendimento/:id', element: <AtendimentoPage /> },
    { path: '/portal-paciente', element: <PatientPortal /> },
  ];

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/appointment" element={<Appointment />} />
            
            {/* Rotas protegidas */}
            <Route element={<ProtectedRoute />}>
              {protectedRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Route>
          </Routes>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App; 