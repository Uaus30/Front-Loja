# Configuração do Projeto Uaus!

Este documento contém o passo a passo para configurar o projeto localmente, subir para o GitHub e hospedar no Vercel/Railway.

## 1. Configuração no PC Local (Windows/Linux)

### Pré-requisitos:
- **Node.js** (versão 20 ou superior) instalado.
- **Git** instalado.
- Um banco de dados **PostgreSQL** (pode ser local ou no Railway).

### Passos:
1. **Clone o repositório:**
   ```bash
   git clone <url-do-seu-repositorio>
   cd uaus-store
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:
   ```env
   DATABASE_URL=sua_url_do_postgresql_aqui
   SESSION_SECRET=uma_chave_aleatoria_segura
   ```

4. **Prepare o banco de dados:**
   ```bash
   npm run db:push
   ```

5. **Inicie o projeto:**
   ```bash
   npm run dev
   ```
   O site estará disponível em `http://localhost:5000`.

---

## 2. Como subir para o GitHub

1. Crie um novo repositório vazio no [GitHub](https://github.com/new).
2. No seu terminal (dentro da pasta do projeto):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <url-do-repositorio-que-voce-criou>
   git push -u origin main
   ```

---

## 3. Hospedagem do Banco de Dados (Railway)

1. Crie uma conta no [Railway.app](https://railway.app/).
2. Clique em **"New Project"** -> **"Provision PostgreSQL"**.
3. Após criar, vá na aba **"Variables"** e copie a **`DATABASE_URL`**. Você usará esta URL no Vercel.

---

## 4. Hospedagem do Frontend (Vercel)

1. Crie uma conta no [Vercel](https://vercel.com/).
2. Clique em **"Add New"** -> **"Project"**.
3. Importe o seu repositório do GitHub.
4. Em **"Environment Variables"**, adicione as seguintes chaves:
   - `DATABASE_URL`: (A URL que você copiou do Railway)
   - `SESSION_SECRET`: (Uma senha qualquer para as sessões)
5. Clique em **"Deploy"**.

**Nota:** Como este projeto utiliza uma API integrada (Express + Vite), a Vercel detectará automaticamente as configurações. Se houver necessidade de ajustes finos para rotas de API, o arquivo `vercel.json` pode ser necessário (já incluído no projeto se compatível).
