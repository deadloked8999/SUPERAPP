import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { insertGuestSchema, insertShiftSchema, insertPaymentSchema } from "@shared/schema";
import authRouter from "../auth";
import { getUserByUsername } from "../db.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Настройка сессий
  app.use(session({
    secret: process.env.SESSION_SECRET || 'superapp-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 часа
    }
  }));

  // Подключаем маршруты аутентификации
  app.use("/api/auth", authRouter);

  // GET endpoint для проверки кода аутентификации
  app.get("/api/verify-code", async (req, res) => {
    try {
      const { username, code } = req.query;
      
      if (!username || !code) {
        return res.status(400).json({ 
          ok: false, 
          message: "Username и code обязательны" 
        });
      }

      // Убираем @ из username если есть
      const cleanUsername = typeof username === 'string' && username.startsWith('@') 
        ? username.slice(1) 
        : username;

      const user = await getUserByUsername(cleanUsername);

      // Логируем сравнение кода
      console.log("Проверка кода:", user?.code, "введён:", code);

      // Приводим оба значения к строке для корректного сравнения
      if (!user || String(user.code) !== String(code)) {
        return res.json({ ok: false });
      }

      return res.json({ ok: true });
    } catch (error) {
      console.error("❌ Ошибка проверки кода:", error);
      return res.status(500).json({ ok: false, message: "Внутренняя ошибка сервера" });
    }
  });

  // Старый маршрут аутентификации (для обратной совместимости)
  app.post("/api/auth", async (req, res) => {
    try {
      const { code } = req.body;
      const user = await storage.authenticateUser("demo", code);
      
      if (user) {
        res.json({ success: true, user });
      } else {
        res.status(401).json({ success: false, message: "Invalid code" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  // Shifts
  app.post("/api/shifts", async (req, res) => {
    try {
      const shiftData = insertShiftSchema.parse(req.body);
      const shift = await storage.createShift(shiftData);
      res.json(shift);
    } catch (error) {
      res.status(400).json({ error: "Invalid shift data" });
    }
  });

  app.get("/api/shifts/active/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const shift = await storage.getActiveShift(userId);
      res.json(shift || null);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.put("/api/shifts/:id/end", async (req, res) => {
    try {
      const shiftId = parseInt(req.params.id);
      await storage.endShift(shiftId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/shifts/:id/stats", async (req, res) => {
    try {
      const shiftId = parseInt(req.params.id);
      const stats = await storage.getShiftStats(shiftId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Guests
  app.post("/api/guests", async (req, res) => {
    try {
      const guestData = insertGuestSchema.parse(req.body);
      const guest = await storage.createGuest(guestData);
      res.json(guest);
    } catch (error) {
      res.status(400).json({ error: "Invalid guest data" });
    }
  });

  app.put("/api/guests/:id", async (req, res) => {
    try {
      const guestId = parseInt(req.params.id);
      const updates = req.body;
      const guest = await storage.updateGuest(guestId, updates);
      
      if (guest) {
        res.json(guest);
      } else {
        res.status(404).json({ error: "Guest not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/guests/search", async (req, res) => {
    try {
      const { name } = req.query;
      if (!name || typeof name !== "string") {
        res.status(400).json({ error: "Name parameter required" });
        return;
      }
      
      const guests = await storage.searchGuestsByName(name);
      res.json(guests);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Payments
  app.post("/api/payments", async (req, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: "Invalid payment data" });
    }
  });

  app.put("/api/payments/:id", async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const updates = req.body;
      const payment = await storage.updatePayment(paymentId, updates);
      
      if (payment) {
        res.json(payment);
      } else {
        res.status(404).json({ error: "Payment not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
