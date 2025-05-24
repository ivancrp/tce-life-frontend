console.log('===============================================');
console.log('TCE-Life - Sistema de Gestão Médica');
console.log('===============================================');
console.log('URLs disponíveis:');
console.log('- Login principal: http://localhost:5173/login');
console.log('- Login simplificado: http://localhost:5173/simple-login');
console.log('  (Use admin@example.com / password para login de teste)');
console.log('===============================================');
console.log('Problemas no login com Google?');
console.log('1. Verifique o console do navegador para erros');
console.log('2. Certifique-se que o VITE_GOOGLE_CLIENT_ID está configurado no .env.local');
console.log('3. Use o login simplificado para testes enquanto resolve problemas do Google Auth');
console.log('===============================================');

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

console.log('Iniciando aplicação React...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemento root não encontrado');
}

console.log('Elemento root encontrado, criando root do React...');
const root = createRoot(rootElement);

console.log('Renderizando aplicação...');
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('Aplicação renderizada com sucesso!');
