# Barbini Admin

Painel administrativo full stack para gestao de clientes, produtos e orcamentos.

## Stack

- React + Vite
- Node.js + Express
- PostgreSQL com SQL simples via `pg`
- JWT para autenticacao
- Preparado para Google Cloud Run + Cloud SQL

## Desenvolvimento local

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Credencial seed:

- E-mail: `admin@barbini.com`
- Senha: `admin123`

## Scripts

- `npm run dev`: API e frontend em modo desenvolvimento.
- `npm run build`: build do frontend e backend.
- `npm start`: executa o backend compilado e serve o frontend em `dist/public`.
- `npm run db:migrate`: cria/atualiza o schema PostgreSQL.
- `npm run db:seed`: popula dados iniciais.

## Google Cloud

O deploy deve acontecer em fase separada. A configuracao esperada e:

- Cloud Run para o container da aplicacao.
- Cloud SQL PostgreSQL para o banco.
- Secret Manager para `DATABASE_URL` e `JWT_SECRET`.
- Conexao Cloud Run -> Cloud SQL via instancia anexada ao servico.

Exemplo conceitual:

```bash
gcloud run deploy barbini-admin \
  --source . \
  --region southamerica-east1 \
  --add-cloudsql-instances PROJECT_ID:southamerica-east1:INSTANCE_NAME \
  --set-secrets DATABASE_URL=barbini-database-url:latest,JWT_SECRET=barbini-jwt-secret:latest
```
