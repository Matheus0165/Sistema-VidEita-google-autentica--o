# Sistema de Ocorrência — MySQL + Docker + Nginx + MinIO

## 1. Rodar tudo de uma vez

Dentro da pasta do projeto:

```bash
docker compose up --build -d
docker compose restart
```

---

## 2. Verificar se subiu

```bash
docker compose ps
```

Você deve ver serviços parecidos com:

```text
mysql     Up
minio     Up
backend   Up
nginx     Up
adminer   Up
```

Para refazer o build:

```bash
docker compose up --build -d
```

Para recriar os containers:

```bash
docker compose up --build --force-recreate -d
```

---

## 3. Acessar o sistema

Site principal:

```text
http://localhost:8080
```

API direta:

```text
http://localhost:3000
```

Adminer, para ver o banco:

```text
http://localhost:8081
```

Painel do MinIO, para ver as imagens:

```text
http://localhost:9001
```

---

## 4. Login do sistema

```text
E-mail: admin@prefeitura.gov.br
Senha: 123456
```

---

## 5. Acesso ao banco pelo Adminer

```text
Sistema: MySQL
Servidor: mysql
Usuário: admin
Senha: admin123
Banco de dados: base_projeto_integrador
```

---

## 6. Acesso ao MinIO

```text
URL: http://localhost:9001
Usuário: admin
Senha: admin12345
Bucket: ocorrencias
```

As imagens novas são salvas no MinIO.

O banco salva apenas o caminho da imagem, por exemplo:

```text
/files/report-123456789.png
```

O site acessa a imagem pelo Nginx:

```text
http://localhost:8080/files/nome-do-arquivo
http://localhost:8080/files/report-1781179584124-580347609.png
```

---

## 7. Comandos úteis

Ver logs de tudo:

```bash
docker compose logs -f
```

Ver logs só do backend:

```bash
docker compose logs -f backend
```

Ver logs só do MySQL:

```bash
docker compose logs -f mysql
```

Ver logs só do MinIO:

```bash
docker compose logs -f minio
```

Ver logs só do Nginx:

```bash
docker compose logs -f nginx
```

Entrar no MySQL pelo terminal:

```bash
docker compose exec mysql mysql -uadmin -padmin123 base_projeto_integrador
```

Ver tabelas:

```sql
SHOW TABLES;
```

Consultar ocorrências:

```sql
SELECT * FROM reports ORDER BY criado_em DESC;
```

Consultar anexos:

```sql
SELECT * FROM report_attachments ORDER BY criado_em DESC;
```

Parar o projeto:

```bash
docker compose down
```

Parar e apagar o banco e o storage para recriar do zero:

```bash
docker compose down -v
docker compose up --build -d
```

Use `down -v` apenas quando quiser resetar tudo, porque ele apaga os volumes do MySQL e do MinIO.

---

## 8. Portas usadas

```text
8080 → site com Nginx
3000 → API Node/Express
3307 → MySQL no notebook
8081 → Adminer
9000 → API S3 do MinIO
9001 → Painel web do MinIO
```

Dentro do Docker, o backend fala com:

```text
MySQL: mysql:3306
MinIO: minio:9000
```

Fora do Docker, se você conectar pelo MySQL Workbench, use:

```text
Host: localhost
Porta: 3307
Usuário: admin
Senha: admin123
Banco: base_projeto_integrador
```

---

## 9. Expor o site com ngrok

Antes de abrir o ngrok, suba o projeto:

```bash
docker compose up --build -d
```

Verifique se o site está abrindo localmente:

```text
http://localhost:8080
```

Instalar o ngrok no WSL/Ubuntu:

```bash
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
  && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
  | sudo tee /etc/apt/sources.list.d/ngrok.list \
  && sudo apt update \
  && sudo apt install ngrok
```

Verificar instalação:

```bash
ngrok version
```

Adicionar token da conta ngrok:

```bash
ngrok config add-authtoken SEU_TOKEN_AQUI
```

Abrir o site online:

```bash
ngrok http 8080
```

Use somente a porta `8080` no ngrok.

Não exponha estas portas:

```text
8081 → Adminer
3307 → MySQL
9001 → Painel do MinIO
9000 → API do MinIO
3000 → Backend direto
```

---

## 10. Aviso do ngrok

No plano gratuito, o ngrok pode mostrar uma tela de aviso antes de abrir o site.

Isso é normal no plano free.

Para remover esse aviso de forma oficial, é necessário usar uma conta paga do ngrok.

---

## 11. Limpar arquivos Zone.Identifier

Listar arquivos:

```bash
find . -name '*:Zone.Identifier' -type f -print
find . -name '*Zone.Identifier' -type f -print
```

Apagar arquivos:

```bash
find . -name '*:Zone.Identifier' -type f -delete
find . -name '*Zone.Identifier' -type f -delete
```

---

## 12. Resumo dos acessos

```text
Site:
http://localhost:8080

API:
http://localhost:3000

Adminer:
http://localhost:8081

MySQL Workbench:
localhost:3307

MinIO:
http://localhost:9001
```

---

## 13. Credenciais principais

Banco MySQL:

```text
Usuário: admin
Senha: admin123
Banco: base_projeto_integrador
```

MinIO:

```text
Usuário: admin
Senha: admin12345
Bucket: ocorrencias
```

Sistema:

```text
E-mail: admin@prefeitura.gov.br
Senha: 123456
```


## Upload de imagens

O sistema aceita imagens JPEG, PNG, WebP, GIF, HEIC e HEIF até 15MB. Arquivos HEIC/HEIF enviados por celular são convertidos para JPG antes de serem salvos no MinIO.


---

## Login com Google Cloud

1. No Google Cloud Console, crie um OAuth Client ID do tipo **Web application**.
2. Em **Authorized JavaScript origins**, adicione os endereços usados no frontend, por exemplo:

```text
http://localhost:8080
https://SEU-LINK.ngrok-free.dev
```

3. Copie o **Client ID** gerado pelo Google.
4. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_GOOGLE_CLIENT_ID=SEU_CLIENT_ID.apps.googleusercontent.com
```

5. No arquivo `backend/.env.docker`, configure o mesmo Client ID:

```env
GOOGLE_CLIENT_ID=SEU_CLIENT_ID.apps.googleusercontent.com
```

6. Recrie o frontend/backend:

```bash
docker compose up --build -d
```

7. Acesse:

```text
http://localhost:8080/entrar
```

O botão do Google aparece quando `VITE_GOOGLE_CLIENT_ID` está configurado.
