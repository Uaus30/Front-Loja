-- Cria tabela de usuários administrativos
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Usuário padrão: admin@uaus.com.br / admin / senha Uaus@2026
-- Hash gerado com scrypt no padrão "salt:hash"
INSERT INTO admin_users (name, email, username, password_hash)
VALUES (
  'admin',
  'admin@uaus.com.br',
  'admin',
  'a1f1f80d8b3de1bf84fae34df85b4b86:402d14620ba4fb94c67ca3050b691333d45e329df88ce5960379dea3261028866c0bf6a8441589cdd63d432d9ddcadfd851d7b5d5b96ff1449766e71c2ee7d7b'
)
ON CONFLICT (email) DO NOTHING;
