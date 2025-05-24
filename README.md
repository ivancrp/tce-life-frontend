# TCE-Life Frontend

Interface de usuário para o sistema TCE-Life.

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Configure as variáveis de ambiente copiando o arquivo `.env.example` para `.env` e ajustando conforme necessário
4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Configuração da Autenticação com Google

Para que a autenticação com Google funcione corretamente no frontend, siga estas etapas:

### 1. Configuração das Variáveis de Ambiente

Certifique-se de que o arquivo `.env` contém a seguinte variável com o ID do cliente OAuth do Google:

```
VITE_GOOGLE_CLIENT_ID=seu-id-do-cliente-aqui
```

### 2. Configuração no Google Cloud Console

Para o frontend funcionar corretamente com a autenticação do Google, é necessário:

1. Adicionar o domínio da aplicação frontend às "Origens JavaScript autorizadas" no console do Google Cloud
   - Para desenvolvimento: `http://localhost:5173`
   - Para produção: seu domínio de produção

### 3. Verificação da Configuração

Para verificar se a configuração está correta:

1. Verifique o Console do navegador ao tentar fazer login com o Google
2. Certifique-se de que não há erros relacionados a "client_id" ou "origem não autorizada"
3. Se ocorrer o erro "OAuth client was not found", verifique se o ID do cliente no `.env` está correto e se o domínio está autorizado

## Resolução de Problemas Comuns

### Erro: "OAuth client was not found"

Este erro geralmente ocorre quando:

1. **ID do Cliente incorreto**: Verifique se o ID do cliente no arquivo `.env` está correto e corresponde ao valor no Google Cloud Console
2. **Domínio não autorizado**: Certifique-se de que a URL que você está usando (como `http://localhost:5173`) está configurada nas "Origens JavaScript autorizadas" no Google Cloud Console
3. **HTTPS vs HTTP**: O Google OAuth é sensível a protocolo, então certifique-se de que está usando o protocolo correto conforme configurado
4. **Variável de ambiente não carregada**: Verifique se o Vite está lendo a variável de ambiente corretamente usando `console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)` em algum componente

### Erro: "Popup closed by user"

Este erro ocorre quando o usuário fecha a janela de autenticação do Google antes de completar o processo. Não é um erro de configuração.

### Erro: "Invalid parameter value for redirect_uri"

Este erro ocorre quando a URI de redirecionamento não corresponde às configuradas no console do Google. Verifique a configuração das URIs de redirecionamento.

## Comandos Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila o projeto para produção
- `npm run preview`: Visualiza a compilação de produção localmente

## Autenticação com Google

### Configuração do Google OAuth 2.0

Para habilitar o login com Google, você precisa obter um Client ID do Google:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou use um projeto existente
3. Navegue até "APIs e Serviços" > "Credenciais"
4. Clique em "Criar Credenciais" > "ID do Cliente OAuth"
5. Selecione "Aplicativo Web" como tipo de aplicativo
6. Dê um nome para o seu aplicativo (ex: "TCE-Life Dev")
7. Em "Origens JavaScript autorizadas", adicione:
   ```
   http://localhost:5173
   ```
8. Em "URIs de redirecionamento autorizados", adicione:
   ```
   http://localhost:5173
   ```
9. Clique em "Criar"
10. Copie o Client ID gerado

### Configuração do `.env.local`

Abra o arquivo `.env.local` e adicione seu Client ID:

```
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui
```

### Problemas comuns e soluções

#### O botão do Google não aparece

- Verifique se você configurou corretamente o Client ID no arquivo `.env.local`
- Verifique o console do navegador para erros específicos
- Certifique-se de que está rodando a aplicação na mesma origem que você configurou no Google Cloud Console (http://localhost:5173)

#### Erro ao renderizar botão do Google

- O Client ID configurado pode ser inválido
- Pode haver um problema de bloqueio de cookies ou rastreadores no navegador
- Tente usar o login simples (/simple-login) como alternativa

#### Problema de CORS com a API do Google

- Certifique-se de que a origem do seu aplicativo está corretamente configurada no Google Cloud Console
- Verifique se não há extensões do navegador bloqueando requisições

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em http://localhost:5173

## Rotas

- `/login` - Página de login completa com suporte ao Google OAuth
- `/simple-login` - Página de login simplificada (útil para testes)
- `/dashboard` - Página inicial após login
- `/settings` - Configurações do usuário

## Login para testes

Durante o desenvolvimento, você pode usar as seguintes credenciais para login:

- Email: `admin@example.com`
- Senha: `password`

## Build para produção

```bash
npm run build
```

## Estrutura do projeto

```
src/
  ├── components/      # Componentes reutilizáveis
  ├── contexts/        # Contextos React
  ├── pages/           # Páginas da aplicação
  ├── services/        # Serviços (API, etc.)
  ├── styles/          # Estilos globais
  ├── types/           # Definições de tipos
  ├── utils/           # Funções utilitárias
  ├── App.tsx          # Componente principal
  └── main.tsx         # Ponto de entrada
``` 