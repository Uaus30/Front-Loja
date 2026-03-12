CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "username" TEXT NOT NULL UNIQUE,
  "password_hash" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

INSERT INTO "users" ("name", "email", "username", "password_hash", "created_at", "updated_at")
VALUES (
  'admin',
  'admin@uaus.com.br',
  'admin',
  '9a34df07ba7d96b5098c30f60394752a:2cf00a21107779fb296d33fac4a3ffe68c63d4f614e676111a27fe95b535d83c8f83d909c4bb8528061170872fb46daa8c9bf97839c399a5bdf9cdd7cf04c30f',
  NOW(),
  NOW()
)
ON CONFLICT ("email") DO NOTHING;
