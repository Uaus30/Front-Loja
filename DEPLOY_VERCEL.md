# Deploy no Vercel + domínio `uaus.com.br`

Este projeto foi preparado para rodar no Vercel com:
- **Frontend estático (Vite)** servido a partir de `dist/public`.
- **API Node/Express serverless** em `api/[...path].ts`.
- **Banco PostgreSQL no Railway** via `DATABASE_URL`.

## 1) Antes de publicar

1. Garanta que o banco no Railway está ativo.
2. Copie a variável `DATABASE_URL` do Railway.
3. (Opcional, mas recomendado) gere uma chave para `SESSION_SECRET`.

## 2) Subir no GitHub

```bash
git add .
git commit -m "Configura projeto para deploy no Vercel"
git push
```

## 3) Criar projeto no Vercel

1. Acesse [https://vercel.com](https://vercel.com) e faça login.
2. Clique em **Add New → Project**.
3. Importe este repositório.
4. Em **Framework Preset**, pode deixar como **Other** (ou detectado automaticamente).

## 4) Definir variáveis de ambiente

No Vercel, em **Project Settings → Environment Variables**, adicione:

- `DATABASE_URL` = string de conexão PostgreSQL do Railway.
- `SESSION_SECRET` = valor aleatório forte.
- (Se for usar envio de e-mail com SMTP) variáveis de SMTP recomendadas.

> Importante: o projeto continuará consumindo o banco do Railway porque a API no Vercel usa `DATABASE_URL` diretamente.

## 5) Deploy

1. Clique em **Deploy**.
2. Após concluir, teste:
   - Página inicial.
   - Lista de produtos.
   - Formulário de contato.

## 6) Configurar domínio `uaus.com.br`

1. No painel da Vercel, vá em **Project Settings → Domains**.
2. Adicione:
   - `uaus.com.br`
   - `www.uaus.com.br`
3. No seu provedor DNS (Registro.br/Cloudflare/etc), configure:
   - **Apex** `@` → **A record** para `76.76.21.21` (padrão Vercel).
   - **www** → **CNAME** para `cname.vercel-dns.com`.
4. Volte ao Vercel e aguarde validação (status “Valid Configuration”).
5. Defina `uaus.com.br` como domínio principal (Set as Primary).
6. Ative redirecionamento de `www` para raiz (ou vice-versa, conforme preferir).

## 7) Pós-deploy (checagens)

- Verifique logs em **Vercel → Functions** para chamadas `/api/*`.
- Faça um teste real de cadastro de mensagem de contato.
- Confirme no Railway se os dados estão sendo gravados.
- Se necessário, rode migrações (`npm run db:push`) apontando para o mesmo `DATABASE_URL`.

## Observações

- O fallback SPA está configurado no `vercel.json`.
- As rotas de API continuam em `/api/*`.
- Se trocar credenciais de banco no Railway, atualize também no Vercel.
