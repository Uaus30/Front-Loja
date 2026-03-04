import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage.js";
import { api } from "../shared/routes.js";
import { z } from "zod";
import nodemailer from "nodemailer";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "uaus30@gmail.com",
      pass: "xgjz eqso jxug sopk",
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });

  app.get(api.products.list.path, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.contact.create.path, async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      const message = await storage.createContactMessage(input);
      
      // Send real email
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
          <p>${input.message.replace(/\n/g, '<br>')}</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to uaus30@gmail.com`);
      } catch (mailErr) {
        console.error("Error sending email:", mailErr);
        // We still return 201 because the message was saved in DB
      }
      
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed data
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
      }
    ];

    for (const product of seedProducts) {
      await storage.createProduct(product);
    }
    console.log("Database seeded with example products.");
  }
}
