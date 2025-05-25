import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Account type enum
export const accountTypeEnum = pgEnum('account_type', [
  'free',
  'pro_i',
  'pro_ii',
  'premium'
]);

// User storage table.
// This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"),
  accountType: accountTypeEnum("account_type").default("free"),
  accountExpiresAt: timestamp("account_expires_at"),
  passwordHash: varchar("password_hash"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Sectors table
export const sectors = pgTable("sectors", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: varchar("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSectorSchema = createInsertSchema(sectors).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertSector = z.infer<typeof insertSectorSchema>;
export type Sector = typeof sectors.$inferSelect;

// Permuta status enum
export const permutaStatusEnum = pgEnum('permuta_status', [
  'pending',
  'analyzing',
  'approved',
  'completed',
  'rejected',
  'cancelled'
]);

// Permutas table
export const permutas = pgTable("permutas", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  fromSectorId: integer("from_sector_id").notNull().references(() => sectors.id),
  toSectorId: integer("to_sector_id").notNull().references(() => sectors.id),
  status: permutaStatusEnum("status").notNull().default('pending'),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertPermutaSchema = createInsertSchema(permutas).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true
});

export type InsertPermuta = z.infer<typeof insertPermutaSchema>;
export type Permuta = typeof permutas.$inferSelect;

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Activity table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  permutaId: integer("permuta_id").references(() => permutas.id),
  sectorId: integer("sector_id").references(() => sectors.id),
  type: varchar("type").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
