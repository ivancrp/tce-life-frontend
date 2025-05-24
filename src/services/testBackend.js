// Arquivo para teste de conexão com o backend
// Execute com: node testBackend.js
// Certifique-se de que o backend esteja rodando

const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function testBackendConnection() {
  console.log('Testando conexão com o backend...');
  
  try {
    // Teste geral de conexão
    console.log(`Tentando acessar ${API_URL}`);
    const response = await axios.get(API_URL);
    console.log('Resposta do servidor:', response.status, response.statusText);
    console.log('Dados:', response.data);
    
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o backend:');
    
    if (error.response) {
      // Servidor respondeu com código de erro
      console.error('  Status:', error.response.status);
      console.error('  Dados:', error.response.data);
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('  Sem resposta do servidor. Verifique se o backend está rodando.');
    } else {
      // Erro na configuração da requisição
      console.error('  Erro:', error.message);
    }
    
    console.error('\nDicas de solução:');
    console.error('1. Verifique se o backend está rodando em http://localhost:3001');
    console.error('2. Verifique se a API está exposta em /api');
    console.error('3. Verifique se o CORS está configurado corretamente no backend');
    console.error('4. Verifique se as portas não estão bloqueadas por firewall');
    
    return false;
  }
}

// Executar o teste
testBackendConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Conexão com o backend bem-sucedida!');
    } else {
      console.log('\n❌ Falha na conexão com o backend!');
    }
  }); 