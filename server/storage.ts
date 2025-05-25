import {
  users,
  institutions,
  permutas,
  messages,
  activities,
  permutaStatusEnum,
  type User,
  type UpsertUser,
  type Institution,
  type InsertInstitution,
  type Permuta,
  type InsertPermuta,
  type Message,
  type InsertMessage,
  type Activity,
  type InsertActivity
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, inArray } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User | undefined>;

  // Institution operations
  getInstitution(id: number): Promise<Institution | undefined>;
  getInstitutions(): Promise<Institution[]>;
  createInstitution(institution: InsertInstitution): Promise<Institution>;
  updateInstitution(id: number, institution: Partial<InsertInstitution>): Promise<Institution | undefined>;
  deleteInstitution(id: number): Promise<boolean>;

  // Permuta operations
  getPermuta(id: number): Promise<Permuta | undefined>;
  getPermutasByUser(userId: string): Promise<Permuta[]>;
  getPermutasByStatus(status: string): Promise<Permuta[]>;
  getPermutas(): Promise<Permuta[]>;
  createPermuta(permuta: InsertPermuta): Promise<Permuta>;
  updatePermutaStatus(id: number, status: string): Promise<Permuta | undefined>;
  deletePermuta(id: number): Promise<boolean>;

  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByUser(userId: string): Promise<Message[]>;
  getUnreadMessagesByUser(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;

  // Activity operations
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Dashboard data
  getDashboardStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Institution operations
  async getInstitution(id: number): Promise<Institution | undefined> {
    const [institution] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, id));
    return institution;
  }

  async getInstitutions(): Promise<Institution[]> {
    return await db.select().from(institutions);
  }

  async createInstitution(institution: InsertInstitution): Promise<Institution> {
    const [newInstitution] = await db
      .insert(institutions)
      .values(institution)
      .returning();
    return newInstitution;
  }

  async updateInstitution(id: number, institution: Partial<InsertInstitution>): Promise<Institution | undefined> {
    const [updatedInstitution] = await db
      .update(institutions)
      .set({ ...institution, updatedAt: new Date() })
      .where(eq(institutions.id, id))
      .returning();
    return updatedInstitution;
  }

  async deleteInstitution(id: number): Promise<boolean> {
    const result = await db
      .delete(institutions)
      .where(eq(institutions.id, id))
      .returning({ id: institutions.id });
    return result.length > 0;
  }

  // Permuta operations
  async getPermuta(id: number): Promise<Permuta | undefined> {
    const [permuta] = await db
      .select()
      .from(permutas)
      .where(eq(permutas.id, id));
    return permuta;
  }

  async getPermutasByUser(userId: string): Promise<Permuta[]> {
    return await db
      .select()
      .from(permutas)
      .where(eq(permutas.userId, userId))
      .orderBy(desc(permutas.createdAt));
  }

  async getPermutasByStatus(status: string): Promise<Permuta[]> {
    return await db
      .select()
      .from(permutas)
      .where(eq(permutas.status, status as any))
      .orderBy(desc(permutas.createdAt));
  }

  async getPermutas(): Promise<Permuta[]> {
    return await db
      .select()
      .from(permutas)
      .orderBy(desc(permutas.createdAt));
  }

  async createPermuta(permuta: InsertPermuta): Promise<Permuta> {
    const [newPermuta] = await db
      .insert(permutas)
      .values(permuta)
      .returning();
    return newPermuta;
  }

  async updatePermutaStatus(id: number, status: string): Promise<Permuta | undefined> {
    const updates: Partial<Permuta> = { 
      status: status as any,
      updatedAt: new Date()
    };
    
    if (status === 'completed') {
      updates.completedAt = new Date();
    }
    
    const [updatedPermuta] = await db
      .update(permutas)
      .set(updates)
      .where(eq(permutas.id, id))
      .returning();
    return updatedPermuta;
  }

  async deletePermuta(id: number): Promise<boolean> {
    const result = await db
      .delete(permutas)
      .where(eq(permutas.id, id))
      .returning({ id: permutas.id });
    return result.length > 0;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id));
    return message;
  }

  async getMessagesByUser(userId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        sql`${messages.receiverId} = ${userId} OR ${messages.senderId} = ${userId}`
      )
      .orderBy(desc(messages.createdAt));
  }

  async getUnreadMessagesByUser(userId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.receiverId, userId),
          eq(messages.isRead, false)
        )
      )
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    const result = await db
      .delete(messages)
      .where(eq(messages.id, id))
      .returning({ id: messages.id });
    return result.length > 0;
  }

  // Activity operations
  async getActivities(limit?: number): Promise<Activity[]> {
    const query = db
      .select()
      .from(activities)
      .orderBy(desc(activities.createdAt));
    
    if (limit) {
      query.limit(limit);
    }
    
    return await query;
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values(activity)
      .returning();
    return newActivity;
  }

  // Dashboard data
  async getDashboardStats(): Promise<any> {
    const totalUsers = await db.select({ count: sql`count(*)` }).from(users);
    
    const activePermutas = await db.select({ count: sql`count(*)` })
      .from(permutas)
      .where(inArray(permutas.status, ['pending', 'analyzing', 'approved']));
    
    const completedPermutas = await db.select({ count: sql`count(*)` })
      .from(permutas)
      .where(eq(permutas.status, 'completed'));
    
    const totalInstitutions = await db.select({ count: sql`count(*)` }).from(institutions);
    
    return {
      totalUsers: Number(totalUsers[0].count),
      activePermutas: Number(activePermutas[0].count),
      completedPermutas: Number(completedPermutas[0].count),
      institutions: Number(totalInstitutions[0].count)
    };
  }
}

export const storage = new DatabaseStorage();
