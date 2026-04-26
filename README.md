# Barbini Admin - Painel Web de Gestao de Orcamentos

O **Barbini Admin** e uma aplicacao web desenvolvida para complementar o ecossistema do projeto Barbini, oferecendo um **painel administrativo** para gestao de **clientes, produtos e orcamentos**.

A proposta do sistema e permitir que administradores e gestores acompanhem os dados cadastrados, consultem orcamentos, criem novos registros e visualizem indicadores gerenciais em um ambiente web simples, funcional e preparado para nuvem.

> Projeto desenvolvido como parte do **Projeto Integrado** do curso de ADS, com foco em Desenvolvimento Web, Banco de Dados, Computacao em Nuvem e Boas Praticas de Arquitetura.

---

## Sumario
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura Visao Geral](#arquitetura-visao-geral)
- [Design System](#design-system)
- [Cloud e Banco de Dados](#cloud-e-banco-de-dados)
- [Como Executar](#como-executar)
- [Deploy no Google Cloud Run](#deploy-no-google-cloud-run)
- [Testes e Qualidade](#testes-e-qualidade)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Futuras Melhorias](#futuras-melhorias)
- [Autor](#autor)

---

## Funcionalidades
- **Autenticacao Administrativa**: Login com e-mail e senha, utilizando token JWT.
- **Dashboard Gerencial**:
  - Total de clientes.
  - Total de produtos.
  - Total de orcamentos.
  - Valor total orcado.
  - Indicadores por status.
- **Gestao de Clientes**:
  - Cadastro de clientes.
  - Edicao de dados.
  - Visualizacao.
  - Exclusao com confirmacao.
- **Gestao de Produtos**:
  - Cadastro de produtos e servicos.
  - Edicao de preco, unidade, descricao e status.
  - Filtro por status ativo/inativo.
  - Exclusao com confirmacao.
- **Gestao de Orcamentos**:
  - Listagem com filtros por cliente, numero, data e status.
  - Criacao de orcamentos com multiplos itens.
  - Edicao de orcamentos existentes.
  - Calculo automatico de subtotal, desconto e total final.
  - Visualizacao detalhada com dados do cliente e itens do orcamento.
- **Persistencia em Nuvem**: Dados armazenados em PostgreSQL no Google Cloud SQL.
- **Preparacao para Deploy**: Projeto configurado para Google Cloud Run e Secret Manager.

---

## Tecnologias
- **React** -> Biblioteca para construcao da interface web.
- **TypeScript** -> Tipagem estatica no frontend e backend.
- **Vite** -> Ferramenta de build e ambiente de desenvolvimento frontend.
- **Node.js** -> Runtime do backend.
- **Express** -> Framework HTTP para a API REST.
- **PostgreSQL** -> Banco de dados relacional.
- **pg** -> Cliente PostgreSQL para Node.js.
- **Zod** -> Validacao de dados de entrada.
- **JWT** -> Autenticacao por token.
- **bcryptjs** -> Hash de senhas.
- **Recharts** -> Graficos do dashboard.
- **Lucide React** -> Biblioteca de icones.
- **Google Cloud Run** -> Hospedagem da aplicacao em container.
- **Google Cloud SQL** -> Banco PostgreSQL gerenciado.
- **Google Secret Manager** -> Armazenamento seguro de credenciais.

---

## Arquitetura Visao Geral
O projeto utiliza uma arquitetura em camadas, separando responsabilidades entre interface, API, regras de negocio e acesso a dados.

- **Frontend (React)**: Telas, navegacao, formularios e consumo da API.
- **API (Express)**: Rotas HTTP, middlewares e autenticacao.
- **Controllers**: Entrada das requisicoes e retorno das respostas.
- **Services**: Regras de negocio, validacoes de fluxo e orquestracao.
- **Repositories**: Acesso ao PostgreSQL com SQL parametrizado.
- **Database Scripts**: Migration e seed para criacao e popularizacao inicial do banco.

Principais entidades:

- **User**: Usuario administrador.
- **Client**: Cliente cadastrado no sistema.
- **Product**: Produto ou servico usado nos orcamentos.
- **Quotation**: Orcamento.
- **QuotationItem**: Item individual do orcamento.

---

## Design System
A identidade visual foi baseada no rascunho desenvolvido no Figma, mantendo a linguagem visual do ecossistema Barbini.

- **Cor Primaria**: `#F80A0A` - Vermelho Barbini.
- **Cor Secundaria**: `#D24A46`.
- **Fundo**: `#FAF9F6` - Off-white.
- **Superficie**: `#FFFDFD`.
- **Texto Principal**: `#000000`.
- **Texto Secundario**: `#6B7280`.
- **Componentes**: Cards, tabelas, formularios, modal de confirmacao e menu lateral administrativo.

---

## Cloud e Banco de Dados
O projeto foi preparado para uso com Google Cloud:

- **Cloud Run** para hospedar a aplicacao web e a API em um unico servico.
- **Cloud SQL PostgreSQL** para persistencia dos dados.
- **Secret Manager** para armazenar:
  - `barbini-database-url`
  - `barbini-jwt-secret`
- **Cloud SQL Socket** no Cloud Run, evitando dependencia de IP publico autorizado.

Documentacao de deploy:

```text
docs/deploy-cloud-run.md
```

---

## Como Executar

### Pre-requisitos
- **Node.js 22+**
- **pnpm** via Corepack
- **PostgreSQL** local ou Cloud SQL

### Instalar dependencias
```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
```

### Configurar variaveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/barbini_admin
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true
JWT_SECRET=troque-este-segredo
PORT=8080
NODE_ENV=development
VITE_API_URL=http://localhost:8080/api
```

Para teste local com Cloud SQL via IP publico e SSL:

```env
DATABASE_URL=postgresql://barbini-user:SenhaTemp123!@34.39.132.168:5432/barbini_admin
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
JWT_SECRET=troque-este-segredo-local
PORT=8080
NODE_ENV=development
VITE_API_URL=http://localhost:8080/api
```

### Executar migration
```bash
pnpm run db:migrate
```

### Executar seed
```bash
pnpm run db:seed
```

Credencial inicial:

- E-mail: `admin@barbini.com`
- Senha: `admin123`

### Subir a aplicacao
```bash
pnpm run dev
```

URLs locais:

```text
Frontend: http://localhost:5173
API: http://localhost:8080/api
Health Check: http://localhost:8080/api/health
```

---

## Deploy no Google Cloud Run

O passo a passo completo esta em:

```text
docs/deploy-cloud-run.md
```

Comando principal:

```bash
gcloud run deploy barbini-admin \
  --source . \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --port 8080 \
  --add-cloudsql-instances barbini-admin:southamerica-east1:barbini-admin-db \
  --set-secrets DATABASE_URL=barbini-database-url:latest,JWT_SECRET=barbini-jwt-secret:latest \
  --set-env-vars NODE_ENV=production,DB_SSL=false
```

Testar deploy:

```bash
SERVICE_URL=$(gcloud run services describe barbini-admin --region southamerica-east1 --format='value(status.url)')
curl "$SERVICE_URL/api/health"
```

---

## Testes e Qualidade
Validacoes realizadas durante o desenvolvimento:

```bash
pnpm run build:api
```

```bash
tsc --noEmit
```

```bash
tsc -p server/tsconfig.json --noEmit
```

Fluxos testados:

- Conexao com PostgreSQL no Cloud SQL.
- Execucao de migration.
- Execucao de seed.
- Login com usuario administrador.
- Consulta autenticada do dashboard.
- Leitura de clientes, produtos e orcamentos.

---

## Estrutura do Projeto
```text
barbini-admin/
├─ database/
│  ├─ schema.sql          # Estrutura do banco PostgreSQL
│  ├─ migrate.ts          # Script de migration
│  └─ seed.ts             # Script de dados iniciais
├─ docs/
│  └─ deploy-cloud-run.md # Guia de deploy no Google Cloud Run
├─ server/
│  ├─ src/
│  │  ├─ config/          # Configuracoes de ambiente
│  │  ├─ controllers/     # Controllers HTTP
│  │  ├─ lib/             # Conexao com banco e utilitarios HTTP
│  │  ├─ middleware/      # Autenticacao JWT
│  │  ├─ repositories/    # SQL e acesso a dados
│  │  ├─ routes/          # Rotas da API
│  │  ├─ schemas/         # Validacoes Zod
│  │  ├─ services/        # Regras de negocio
│  │  └─ index.ts         # Entrada da API
│  └─ tsconfig.json
├─ src/
│  ├─ app/
│  │  ├─ api/             # Cliente HTTP e tipos
│  │  ├─ components/      # Componentes reutilizaveis
│  │  ├─ context/         # Estado global da aplicacao
│  │  ├─ pages/           # Telas do painel
│  │  └─ routes.tsx       # Rotas do frontend
│  ├─ styles/             # Estilos globais e tema
│  └─ main.tsx
├─ Dockerfile
├─ package.json
└─ README.md
```

---

## Futuras Melhorias
- **Exportacao para PDF**: Gerar documento de orcamento para envio ao cliente.
- **Controle de Usuarios**: Cadastro de multiplos administradores ou vendedores.
- **Perfis e Permissoes**: Diferenciar acesso de gestor, administrador e vendedor.
- **Auditoria**: Historico de alteracoes em clientes, produtos e orcamentos.
- **Relatorios Avancados**: Indicadores por periodo, cliente e status.
- **Pipeline CI/CD**: Automatizar deploy no Cloud Run a partir do GitHub.

---

## Autor
**Marcelo Henrique Pacobello** - **RA: 24001795**

- LinkedIn: [https://www.linkedin.com/in/marcelo-henrique-pacobello/](https://www.linkedin.com/in/marcelo-henrique-pacobello/)
- GitHub: [https://github.com/CeloHelp](https://github.com/CeloHelp)
