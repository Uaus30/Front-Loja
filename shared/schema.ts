import { pgTable, text, serial, timestamp, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  isPromotion: boolean("is_promotion").default(false),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminUsers = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, createdAt: true });

export const insertAdminUserSchema = createInsertSchema(adminUsers)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    email: z.string().email("E-mail inválido"),
    username: z.string().min(3, "Login deve ter ao menos 3 caracteres"),
    passwordHash: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
    name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  });

export const updateAdminUserSchema = insertAdminUserSchema.partial().extend({
  passwordHash: z.string().min(8, "Senha deve ter ao menos 8 caracteres").optional(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type UpdateAdminUser = z.infer<typeof updateAdminUserSchema>;

export type CreateContactMessageRequest = InsertContactMessage;
export type ContactMessageResponse = ContactMessage;

export type ProductResponse = Product;
export type ProductsListResponse = Product[];
