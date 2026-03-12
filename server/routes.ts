import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage.js";
import { api } from "../shared/routes.js";
import { insertProductSchema } from "../shared/schema.js";
import { z } from "zod";
import nodemailer from "nodemailer";
import crypto from "crypto";

const TOKEN_COOKIE = "admin_token";
const TOKEN_TTL_SECONDS = 60 * 60 * 12;

const loginSchema = z.object({
  login: z.string().min(1, "Informe email ou login"),
  password: z.string().min(1, "Informe a senha"),
});

const adminUserPayloadSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  username: z.string().min(3, "Login deve ter ao menos 3 caracteres"),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
});

const updateAdminUserPayloadSchema = adminUserPayloadSchema.partial();

function getTokenSecret() {
  return process.env.AUTH_TOKEN_SECRET ?? "uaus-default-secret-change-me";
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, passwordHash: string): boolean {
  const [salt, hash] = passwordHash.split(":");
  if (!salt || !hash) return false;
  const calculated = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(calculated, "hex"));
}

function createAuthToken(userId: number): string {
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getTokenSecret())
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

function verifyAuthToken(token: string): { userId: number; exp: number } | null {
  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return null;

  const expectedSignature = crypto
    .createHmac("sha256", getTokenSecret())
    .update(payloadPart)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signaturePart), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf-8"));
    if (typeof payload.userId !== "number" || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(req: Request) {
  const header = req.headers.cookie;
  if (!header) return {} as Record<string, string>;
  return header.split(";").reduce((acc, entry) => {
    const [rawKey, ...rest] = entry.trim().split("=");
    acc[rawKey] = decodeURIComponent(rest.join("="));
    return acc;
  }, {} as Record<string, string>);
}

function getCookieSettings() {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = isProduction ? "None" : "Lax";
  const secure = isProduction ? "; Secure" : "";
  return { sameSite, secure };
}

function setAuthCookie(res: Response, token: string) {
  const { sameSite, secure } = getCookieSettings();
  res.setHeader(
    "Set-Cookie",
    `${TOKEN_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${TOKEN_TTL_SECONDS}; SameSite=${sameSite}${secure}`,
  );
}

function clearAuthCookie(res: Response) {
  const { sameSite, secure } = getCookieSettings();
  res.setHeader("Set-Cookie", `${TOKEN_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=${sameSite}${secure}`);
}

async function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const cookies = parseCookies(req);
  const token = cookies[TOKEN_COOKIE];

  if (!token) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    clearAuthCookie(res);
    return res.status(401).json({ message: "Sessão expirada" });
  }

  const user = await storage.findAdminUserById(payload.userId);
  if (!user) {
    clearAuthCookie(res);
    return res.status(401).json({ message: "Usuário inválido" });
  }

  (req as Request & { adminUserId?: number }).adminUserId = user.id;
  next();
}

function sanitizePgError(err: unknown) {
  if (typeof err === "object" && err && "code" in err && (err as { code?: string }).code === "23505") {
    return "Já existe usuário com este e-mail ou login";
  }
  return "Internal server error";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "uaus30@gmail.com",
      pass: "xgjz eqso jxug sopk",
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  app.get(api.products.list.path, async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.contact.create.path, async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      const message = await storage.createContactMessage(input);

      const mailOptions = {
        from: `"Site Uaus!" <uaus30@gmail.com>`,
        to: "uaus30@gmail.com",
        subject: `Nova mensagem de contato: ${input.name}`,
        text: `Nome: ${input.name}\nE-mail: ${input.email}\nTelefone: ${input.phone}\n\nMensagem:\n${input.message}`,
        html: `
          <h3>Nova mensagem de contato recebida pelo site</h3>
          <p><strong>Nome:</strong> ${input.name}</p>
          <p><strong>E-mail:</strong> ${input.email}</p>
          <p><strong>Telefone:</strong> ${input.phone}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${input.message.replace(/\n/g, "<br>")}</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.error("Error sending email:", mailErr);
      }

      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/auth/login", async (req, res) => {
    try {
      const input = loginSchema.parse(req.body);
      const user = await storage.findAdminUserByLogin(input.login);
      if (!user || !verifyPassword(input.password, user.passwordHash)) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = createAuthToken(user.id);
      setAuthCookie(res, token);
      res.json({
        user: { id: user.id, name: user.name, email: user.email, username: user.username },
        expiresInSeconds: TOKEN_TTL_SECONDS,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/auth/logout", (_req, res) => {
    clearAuthCookie(res);
    res.status(204).send();
  });

  app.get("/api/admin/auth/me", requireAdminAuth, async (req, res) => {
    const user = await storage.findAdminUserById((req as Request & { adminUserId?: number }).adminUserId!);
    if (!user) return res.status(401).json({ message: "Não autenticado" });

    res.json({ id: user.id, name: user.name, email: user.email, username: user.username });
  });

  app.get("/api/admin/stats", requireAdminAuth, async (_req, res) => {
    const products = await storage.getProducts();
    const total = products.length;
    const promotions = products.filter((p) => p.isPromotion).length;

    res.json({
      totalProducts: total,
      promotionalProducts: promotions,
      mockMonthlyVisits: [1200, 1500, 1280, 1700, 2300, 2600],
      mockConversionRate: [2.1, 2.4, 2.0, 3.1, 3.4, 3.8],
    });
  });

  app.get("/api/admin/products", requireAdminAuth, async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post("/api/admin/products", requireAdminAuth, async (req, res) => {
    try {
      const product = insertProductSchema.parse(req.body);
      const created = await storage.createProduct(product);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/products/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const product = insertProductSchema.parse(req.body);
      const updated = await storage.updateProduct(id, product);
      if (!updated) return res.status(404).json({ message: "Produto não encontrado" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/admin/products/:id", requireAdminAuth, async (req, res) => {
    const id = Number(req.params.id);
    const deleted = await storage.deleteProduct(id);
    if (!deleted) return res.status(404).json({ message: "Produto não encontrado" });
    return res.status(204).send();
  });

  app.get("/api/admin/users", requireAdminAuth, async (_req, res) => {
    const users = await storage.listAdminUsers();
    res.json(users);
  });

  app.post("/api/admin/users", requireAdminAuth, async (req, res) => {
    try {
      const payload = adminUserPayloadSchema.parse(req.body);
      const created = await storage.createAdminUser({
        ...payload,
        passwordHash: hashPassword(payload.password),
      });
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      return res.status(400).json({ message: sanitizePgError(err) });
    }
  });

  app.put("/api/admin/users/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const payload = updateAdminUserPayloadSchema.parse(req.body);
      const updateData: Record<string, string> = {};
      if (payload.name) updateData.name = payload.name;
      if (payload.email) updateData.email = payload.email;
      if (payload.username) updateData.username = payload.username;
      if (payload.password) updateData.passwordHash = hashPassword(payload.password);

      const updated = await storage.updateAdminUser(id, updateData);
      if (!updated) return res.status(404).json({ message: "Usuário não encontrado" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      return res.status(400).json({ message: sanitizePgError(err) });
    }
  });

  app.delete("/api/admin/users/:id", requireAdminAuth, async (req, res) => {
    const id = Number(req.params.id);
    const deleted = await storage.deleteAdminUser(id);
    if (!deleted) return res.status(404).json({ message: "Usuário não encontrado" });
    res.status(204).send();
  });

  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    const seedProducts = [
      {
        name: "Fone de Ouvido Bluetooth Premium",
        description: "Fone de ouvido sem fio com cancelamento de ruído e bateria de longa duração.",
        price: "29.90",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
        isPromotion: true,
      },
      {
        name: "Cabo USB-C Reforçado",
        description: "Cabo de carregamento rápido com acabamento em nylon trançado.",
        price: "19.90",
        imageUrl: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=600&auto=format&fit=crop",
        isPromotion: false,
      },
      {
        name: "Capa Protetora Anti-Impacto",
        description: "Capa de alta resistência com bordas reforçadas para máxima proteção.",
        price: "15.00",
        imageUrl: "https://images.unsplash.com/photo-1541560052-5e137f229371?q=80&w=600&auto=format&fit=crop",
        isPromotion: true,
      },
      {
        name: "Suporte Veicular Magnético",
        description: "Suporte para celular prático e seguro para usar no painel do carro.",
        price: "25.00",
        imageUrl: "https://images.unsplash.com/photo-1621259182978-fbf93132e53d?q=80&w=600&auto=format&fit=crop",
        isPromotion: false,
      },
      {
        name: "Carregador de Parede Turbo",
        description: "Carregador ultra rápido com 2 saídas USB e proteção térmica.",
        price: "30.00",
        imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop",
        isPromotion: true,
      },
      {
        name: "Adaptador Bluetooth P2",
        description: "Transforme seu som antigo em Bluetooth com este adaptador prático.",
        price: "20.00",
        imageUrl: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=600&auto=format&fit=crop",
        isPromotion: false,
      },
      {
        name: "Pau de Selfie com Tripé",
        description: "Controle bluetooth e ajuste de ângulo para as melhores fotos.",
        price: "29.90",
        imageUrl: "https://images.unsplash.com/photo-1522273400909-fd1a8f77637e?q=80&w=600&auto=format&fit=crop",
        isPromotion: false,
      },
      {
        name: "Caixa de Som à Prova d'Água",
        description: "Pequena, potente e resistente a água. Perfeita para o banho.",
        price: "29.90",
        imageUrl: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?q=80&w=600&auto=format&fit=crop",
        isPromotion: true,
      },
    ];

    for (const product of seedProducts) {
      await storage.createProduct(product);
    }
  }

  const users = await storage.listAdminUsers();
  if (users.length === 0) {
    await storage.createAdminUser({
      name: "admin",
      email: "admin@uaus.com.br",
      username: "admin",
      passwordHash: hashPassword("Uaus@2026"),
    });
  }
}
