import { db } from "./db";
import {
  products,
  contactMessages,
  type InsertProduct,
  type ProductResponse,
  type InsertContactMessage,
  type ContactMessageResponse
} from "../shared/schema";

export interface IStorage {
  getProducts(): Promise<ProductResponse[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessageResponse>;
  createProduct(product: InsertProduct): Promise<ProductResponse>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<ProductResponse[]> {
    return await db.select().from(products);
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessageResponse> {
    const [created] = await db.insert(contactMessages).values(message).returning();
    return created;
  }

  async createProduct(product: InsertProduct): Promise<ProductResponse> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();