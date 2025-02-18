Sistema de Gestão de Acessos - Frontend

📋 Descrição

Sistema web desenvolvido em Vue.js 3 + Quasar para gerenciamento de acessos temporários. Permite o cadastro de usuários, aprovação de novos cadastros por administradores, concessão de permissões com prazos definidos e revogação de acessos quando necessário.

🚀 Tecnologias Utilizadas

Vue.js 3

Quasar Framework 2

Pinia (Gerenciamento de Estado)

Vue Router

Axios

JWT para autenticação

📦 Requisitos

Node.js 16+

NPM ou Yarn

Backend do sistema rodando (porta 3333)

🔧 Instalação e Configuração

Clone o repositório:

git clone [URL_DO_REPOSITORIO]
cd sistema-gestao-acessos-frontend

Instale as dependências:

npm install
# ou
yarn install

Configure o arquivo de ambiente (.env):

VITE_API_URL=http://localhost:3333

Inicie o servidor de desenvolvimento:

npm run dev
# ou
yarn dev

O aplicativo estará disponível em http://localhost:5173

📁 Estrutura do Projeto

src/
├── assets/          # Recursos estáticos
├── components/      # Componentes Vue reutilizáveis
├── pages/          # Páginas/Views do sistema
├── router/         # Configuração das rotas
├── services/       # Serviços e configuração da API
├── stores/         # Stores Pinia (gerenciamento de estado)
└── styles/         # Arquivos de estilo globais

⚙️ Principais Funcionalidades

Autenticação completa com JWT

Gestão de usuários e aprovações

Controle de acessos temporários

Gerenciamento de documentos

Interface responsiva com modo escuro/claro

Monitoramento e logs detalhados

Proteção de rotas e verificação de permissões

🚀 Deploy

npm run build
# ou
yarn build

Os arquivos de build estarão na pasta dist

📝 Licença

Este projeto está sob a licença MIT.

👥 Autor

Itamar Alves Ferreira Junior
