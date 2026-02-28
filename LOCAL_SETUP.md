# Como Rodar o Projeto Localmente

Siga estes passos para executar o site "Uaus!" no seu computador.

## Pré-requisitos
1. **Node.js**: Certifique-se de ter o Node.js instalado (versão 18 ou superior).
2. **PostgreSQL**: Você precisará de um banco de dados Postgres instalado e rodando.

## Passos para Configuração

### 1. Instalar Dependências
Como o projeto possui um arquivo `package-lock.json`, o ideal é usar o `npm` para manter a consistência das versões, mas você pode usar o `yarn` se preferir.
```bash
npm install
# ou
yarn install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo chamado `.env` na raiz do projeto e adicione a URL de conexão do seu banco de dados PostgreSQL:
```env
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco
```

### 3. Sincronizar o Banco de Dados
Este comando criará as tabelas necessárias no seu banco de dados:
```bash
npm run db:push
# ou
yarn db:push
```

### 4. Executar o Projeto

#### Modo de Desenvolvimento (Recomendado para alterações)
Este comando inicia o servidor backend e o frontend simultaneamente com recarregamento automático:
```bash
npm run dev
# ou
yarn dev
```

#### Modo de Produção
Se você já executou o `build`, pode rodar a versão otimizada:
```bash
npm start
# ou
yarn start
```

## Solução de Problemas Comuns
- **Erro de Conexão com o Banco**: Verifique se o PostgreSQL está rodando e se a URL no `.env` está correta. O projeto **não funciona** sem uma conexão válida com o banco de dados.
- **Porta em Uso**: O projeto tenta rodar na porta 5000 por padrão. Certifique-se de que ela está livre.
- **Comando não encontrado**: Se o comando `npm run dev` falhar dizendo que `tsx` não foi encontrado, certifique-se de que o `npm install` terminou com sucesso.
