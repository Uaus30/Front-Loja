import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

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
        name: "Fone de Ouvido Bluetooth",
        description: "Fone de ouvido sem fio com cancelamento de ruído.",
        price: "29.90",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop",
        isPromotion: true,
      },
      {
        name: "Cabo USB-C Rápido",
        description: "Cabo de carregamento rápido para smartphones.",
        price: "15.00",
        imageUrl: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=300&auto=format&fit=crop",
        isPromotion: false,
      },
      {
        name: "Capa Protetora Transparente",
        description: "Capa de silicone de alta resistência.",
        price: "10.00",
        imageUrl: "https://images.unsplash.com/photo-1541560052-5e137f229371?q=80&w=300&auto=format&fit=crop",
        isPromotion: true,
      },
      {
        name: "Suporte Veicular",
        description: "Suporte para celular ideal para carro.",
        price: "25.00",
        imageUrl: "https://images.unsplash.com/photo-1621259182978-fbf93132e53d?q=80&w=300&auto=format&fit=crop",
        isPromotion: false,
      }
    ];

    for (const product of seedProducts) {
      await storage.createProduct(product);
    }
    console.log("Database seeded with example products.");
  }
}