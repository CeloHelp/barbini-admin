# Deploy no Google Cloud Run

Dados usados neste projeto:

- Project ID: `barbini-admin`
- Regiao: `southamerica-east1`
- Instancia Cloud SQL: `barbini-admin:southamerica-east1:barbini-admin-db`
- Servico Cloud Run: `barbini-admin`
- Secrets: `barbini-database-url`, `barbini-jwt-secret`

## 1. Configurar projeto

```bash
gcloud config set project barbini-admin
```

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com
```

## 2. Atualizar o secret DATABASE_URL para Cloud Run

Use socket Unix do Cloud SQL dentro do Cloud Run:

```bash
printf 'postgresql://barbini-user:SenhaTemp123!@localhost/barbini_admin?host=/cloudsql/barbini-admin:southamerica-east1:barbini-admin-db' | gcloud secrets versions add barbini-database-url --data-file=-
```

## 3. Permissoes da service account do Cloud Run

```bash
PROJECT_NUMBER=$(gcloud projects describe barbini-admin --format='value(projectNumber)')
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
echo "$SERVICE_ACCOUNT"
```

Permitir acesso ao Cloud SQL:

```bash
gcloud projects add-iam-policy-binding barbini-admin \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/cloudsql.client"
```

Permitir acesso aos secrets:

```bash
gcloud projects add-iam-policy-binding barbini-admin \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"
```

## 4. Deploy

Rode na raiz do projeto:

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

## 5. Verificar deploy

```bash
SERVICE_URL=$(gcloud run services describe barbini-admin --region southamerica-east1 --format='value(status.url)')
echo "$SERVICE_URL"
```

```bash
curl "$SERVICE_URL/api/health"
```

```bash
curl -X POST "$SERVICE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barbini.com","password":"admin123"}'
```

## 6. Logs e diagnostico

Logs em tempo real:

```bash
gcloud run services logs tail barbini-admin --region southamerica-east1
```

Ultimo build:

```bash
BUILD_ID=$(gcloud builds list --limit 1 --format='value(ID)')
gcloud builds log "$BUILD_ID"
```

Conferir Cloud SQL anexado:

```bash
gcloud run services describe barbini-admin \
  --region southamerica-east1 \
  --format='value(metadata.annotations.run.googleapis.com/cloudsql-instances)'
```

Conferir secrets:

```bash
gcloud secrets versions access latest --secret=barbini-database-url
gcloud secrets versions access latest --secret=barbini-jwt-secret
```

Erros comuns:

- Servico nao sobe: veja logs do Cloud Run e confira se a API escuta `process.env.PORT`.
- Cloud SQL falha: confirme `roles/cloudsql.client`, `--add-cloudsql-instances` e formato socket na `DATABASE_URL`.
- Secret falha: confirme `roles/secretmanager.secretAccessor` e nomes dos secrets.
- Build falha: veja logs do Cloud Build e confirme se `pnpm-lock.yaml` foi enviado.
- IAM falha no deploy: a conta que roda o deploy precisa de permissoes para Cloud Run, Cloud Build e usar a service account.
