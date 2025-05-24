const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('Script de Diagnóstico do TCE-Life');
console.log('=========================================\n');

// Verifica a estrutura do projeto
console.log('Verificando estrutura do projeto...');

const requiredFiles = [
  './src/main.tsx',
  './App.tsx',
  './src/App.tsx',
  './src/pages/Login.tsx',
  './src/pages/SimpleLogin.tsx',
  './src/contexts/ThemeContext.tsx',
  './index.html'
];

for (const filePath of requiredFiles) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    console.log(`✅ ${filePath} encontrado`);
  } catch (err) {
    console.log(`❌ ${filePath} NÃO encontrado`);
  }
}

console.log('\nVerificando importações...');

// Verifica o main.tsx
try {
  const mainContent = fs.readFileSync('./src/main.tsx', 'utf8');
  console.log('\nConteúdo de src/main.tsx:');
  console.log('-----------------------------------');
  console.log(mainContent);
  console.log('-----------------------------------');
  
  if (mainContent.includes('import App from \'../App\'')) {
    console.log('❌ src/main.tsx importa App do caminho errado: "../App"');
  } else if (mainContent.includes('import App from \'./App\'')) {
    console.log('✅ src/main.tsx importa App do caminho correto: "./App"');
  } else if (mainContent.includes('import { App } from \'../App\'')) {
    console.log('❌ src/main.tsx importa App como exportação nomeada do caminho errado: "../App"');
  } else if (mainContent.includes('import { App } from \'./App\'')) {
    console.log('❌ src/main.tsx importa App como exportação nomeada, mas deveria ser default');
  } else {
    console.log('❓ src/main.tsx parece ter uma importação de App não reconhecida');
  }
} catch (err) {
  console.log('❌ Não foi possível ler src/main.tsx');
}

// Verifica o App.tsx na raiz
try {
  const rootAppContent = fs.readFileSync('./App.tsx', 'utf8');
  console.log('\nApp.tsx na raiz exporta como:');
  if (rootAppContent.includes('export default App')) {
    console.log('✅ export default App');
  } else if (rootAppContent.includes('export function App')) {
    console.log('❌ export function App (deveria ser default)');
  } else {
    console.log('❓ Método de exportação não reconhecido');
  }
} catch (err) {
  console.log('❌ Não foi possível ler App.tsx na raiz');
}

// Verifica o App.tsx na pasta src
try {
  const srcAppContent = fs.readFileSync('./src/App.tsx', 'utf8');
  console.log('\nsrc/App.tsx exporta como:');
  if (srcAppContent.includes('export default App')) {
    console.log('✅ export default App');
  } else if (srcAppContent.includes('export function App')) {
    console.log('❌ export function App (deveria ser default)');
  } else {
    console.log('❓ Método de exportação não reconhecido');
  }
} catch (err) {
  console.log('❌ Não foi possível ler src/App.tsx');
}

console.log('\n=========================================');
console.log('Diagnóstico concluído');
console.log('========================================='); 