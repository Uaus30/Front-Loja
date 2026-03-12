import { db } from "./db.js";
import { eq, or } from "drizzle-orm";
import {
  products,
  contactMessages,
  adminUsers,
  type InsertProduct,
  type ProductResponse,
  type InsertContactMessage,
  type ContactMessageResponse,
  type AdminUser,
} from "../shared/schema.js";

export interface IStorage {
  getProducts(): Promise<ProductResponse[]>;
  getProductById(id: number): Promise<ProductResponse | null>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessageResponse>;
  createProduct(product: InsertProduct): Promise<ProductResponse>;
  updateProduct(id: number, product: InsertProduct): Promise<ProductResponse | null>;
  deleteProduct(id: number): Promise<boolean>;
  listAdminUsers(): Promise<Omit<AdminUser, "passwordHash">[]>;
  findAdminUserByLogin(login: string): Promise<AdminUser | null>;
  findAdminUserById(id: number): Promise<AdminUser | null>;
  createAdminUser(user: {
    name: string;
    email: string;
    username: string;
    passwordHash: string;
  }): Promise<Omit<AdminUser, "passwordHash">>;
  updateAdminUser(
    id: number,
    user: Partial<{
      name: string;
      email: string;
      username: string;
      passwordHash: string;
    }>,
  ): Promise<Omit<AdminUser, "passwordHash"> | null>;
  deleteAdminUser(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<ProductResponse[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<ProductResponse | null> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product ?? null;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessageResponse> {
    const [created] = await db.insert(contactMessages).values(message).returning();
    return created;
  }

  async createProduct(product: InsertProduct): Promise<ProductResponse> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async updateProduct(id: number, product: InsertProduct): Promise<ProductResponse | null> {
    const [updated] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updated ?? null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning({ id: products.id });
    return result.length > 0;
  }

  async listAdminUsers(): Promise<Omit<AdminUser, "passwordHash">[]> {
    return db
      .select({
        id: adminUsers.id,
        name: adminUsers.name,
        email: adminUsers.email,
        username: adminUsers.username,
        createdAt: adminUsers.createdAt,
        updatedAt: adminUsers.updatedAt,
      })
      .from(adminUsers);
  }

  async findAdminUserByLogin(login: string): Promise<AdminUser | null> {
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(or(eq(adminUsers.email, login), eq(adminUsers.username, login)));
    return user ?? null;
  }

  async findAdminUserById(id: number): Promise<AdminUser | null> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user ?? null;
  }

  async createAdminUser(user: {
    name: string;
    email: string;
    username: string;
    passwordHash: string;
  }): Promise<Omit<AdminUser, "passwordHash">> {
    const [created] = await db
      .insert(adminUsers)
      .values({ ...user, updatedAt: new Date() })
      .returning({
        id: adminUsers.id,
        name: adminUsers.name,
        email: adminUsers.email,
        username: adminUsers.username,
        createdAt: adminUsers.createdAt,
        updatedAt: adminUsers.updatedAt,
      });
    return created;
  }

  async updateAdminUser(
    id: number,
    user: Partial<{
      name: string;
      email: string;
      username: string;
      passwordHash: string;
    }>,
  ): Promise<Omit<AdminUser, "passwordHash"> | null> {
    const [updated] = await db
      .update(adminUsers)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(adminUsers.id, id))
      .returning({
        id: adminUsers.id,
        name: adminUsers.name,
        email: adminUsers.email,
        username: adminUsers.username,
        createdAt: adminUsers.createdAt,
        updatedAt: adminUsers.updatedAt,
      });

    return updated ?? null;
  }

  async deleteAdminUser(id: number): Promise<boolean> {
    const result = await db.delete(adminUsers).where(eq(adminUsers.id, id)).returning({ id: adminUsers.id });
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
