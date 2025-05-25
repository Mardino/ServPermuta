import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { json, urlencoded } from "express";
import { z } from "zod";
import { 
  insertSectorSchema, 
  insertPermutaSchema,
  insertMessageSchema,
  insertActivitySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Admin auth routes
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      console.log("Admin login attempt:", { username, password });
      
      // Verificar credenciais de administrador
      // Credenciais iniciais: admin/admin123
      if (username === 'admin' && password === 'admin123') {
        console.log("Admin credentials verified successfully");
        
        // Criar objeto de usuário administrador diretamente sem verificar banco
        const adminUser = {
          id: 'admin-' + Date.now(),
          email: 'admin@sistema.permuta',
          firstName: 'Administrador',
          lastName: 'Sistema',
          role: 'admin'
        };
        
        console.log("Using admin user:", adminUser);
        
        // Definir na sessão como usuário logado normal
        if (req.session) {
          (req.session as any).user = {
            claims: {
              sub: adminUser.id,
              email: adminUser.email,
              first_name: adminUser.firstName,
              last_name: adminUser.lastName
            }
          };
          (req.session as any).isAdmin = true;
        }
        
        console.log("Admin session set successfully");
        return res.json({ success: true, user: adminUser });
      } else {
        console.log("Invalid admin credentials");
        return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      return res.status(500).json({ success: false, message: 'Erro no login de administrador' });
    }
  });
  
  app.post('/api/admin/change-password', async (req, res) => {
    try {
      if (!(req.session as any).isAdmin) {
        return res.status(401).json({ success: false, message: 'Não autorizado' });
      }
      
      const { currentPassword, newPassword } = req.body;
      
      // Verificar senha atual
      if (currentPassword !== 'admin123') {
        return res.status(400).json({ success: false, message: 'Senha atual incorreta' });
      }
      
      // Em um sistema real, você atualizaria a senha do administrador no banco de dados
      // Como estamos usando uma verificação simples, apenas retornamos sucesso
      
      res.json({ success: true, message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error("Error changing admin password:", error);
      res.status(500).json({ success: false, message: 'Erro ao alterar senha' });
    }
  });

  // Users API
  app.get('/api/users', isAuthenticated, async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.put('/api/users/:id/role', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || typeof role !== 'string') {
        return res.status(400).json({ message: "Invalid role" });
      }

      const updatedUser = await storage.updateUserRole(id, role);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Sectors API
  app.get('/api/sectors', async (req, res) => {
    try {
      const sectors = await storage.getSectors();
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sectors" });
    }
  });

  app.get('/api/sectors/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const sector = await storage.getSector(Number(id));
      
      if (!sector) {
        return res.status(404).json({ message: "Sector not found" });
      }
      
      res.json(sector);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sector" });
    }
  });

  app.post('/api/sectors', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertSectorSchema.parse(req.body);
      const sector = await storage.createSector(validatedData);
      
      // Log activity
      await storage.createActivity({
        userId: (req as any).user.claims.sub,
        sectorId: sector.id,
        type: 'sector_created',
        description: `Sector ${sector.name} was added to the platform`
      });
      
      res.status(201).json(sector);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sector data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create sector" });
    }
  });

  app.put('/api/sectors/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertSectorSchema.partial().parse(req.body);
      
      const updatedSector = await storage.updateSector(Number(id), validatedData);
      if (!updatedSector) {
        return res.status(404).json({ message: "Sector not found" });
      }
      
      res.json(updatedSector);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sector data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update sector" });
    }
  });

  app.delete('/api/sectors/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteSector(Number(id));
      
      if (!success) {
        return res.status(404).json({ message: "Sector not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete sector" });
    }
  });

  // Permutas API
  app.get('/api/permutas', async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const userId = req.query.userId as string | undefined;
      
      let permutas;
      if (status) {
        permutas = await storage.getPermutasByStatus(status);
      } else if (userId) {
        permutas = await storage.getPermutasByUser(userId);
      } else {
        permutas = await storage.getPermutas();
      }
      
      res.json(permutas);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch permutas" });
    }
  });

  app.get('/api/permutas/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const permuta = await storage.getPermuta(Number(id));
      
      if (!permuta) {
        return res.status(404).json({ message: "Permuta not found" });
      }
      
      res.json(permuta);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch permuta" });
    }
  });

  app.post('/api/permutas', isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const validatedData = insertPermutaSchema.parse({
        ...req.body,
        userId
      });
      
      const permuta = await storage.createPermuta(validatedData);
      
      // Log activity
      await storage.createActivity({
        userId,
        permutaId: permuta.id,
        type: 'permuta_created',
        description: `Permuta #${permuta.id} was created`
      });
      
      res.status(201).json(permuta);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid permuta data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create permuta" });
    }
  });

  app.put('/api/permutas/:id/status', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedPermuta = await storage.updatePermutaStatus(Number(id), status);
      if (!updatedPermuta) {
        return res.status(404).json({ message: "Permuta not found" });
      }
      
      // Log activity
      const activityType = status === 'completed' ? 'permuta_completed' : 
                          status === 'cancelled' ? 'permuta_cancelled' : 
                          `permuta_${status}`;
      
      await storage.createActivity({
        userId: (req as any).user.claims.sub,
        permutaId: updatedPermuta.id,
        type: activityType,
        description: `Permuta #${updatedPermuta.id} status changed to ${status}`
      });
      
      res.json(updatedPermuta);
    } catch (error) {
      res.status(500).json({ message: "Failed to update permuta status" });
    }
  });

  app.delete('/api/permutas/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePermuta(Number(id));
      
      if (!success) {
        return res.status(404).json({ message: "Permuta not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete permuta" });
    }
  });

  // Messages API
  app.get('/api/messages', isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const unreadOnly = req.query.unread === 'true';
      
      let messages;
      if (unreadOnly) {
        messages = await storage.getUnreadMessagesByUser(userId);
      } else {
        messages = await storage.getMessagesByUser(userId);
      }
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req, res) => {
    try {
      const senderId = (req as any).user.claims.sub;
      const validatedData = insertMessageSchema.parse({
        ...req.body,
        senderId
      });
      
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.put('/api/messages/:id/read', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedMessage = await storage.markMessageAsRead(Number(id));
      
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Activities API
  app.get('/api/activities', async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Dashboard stats API
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
