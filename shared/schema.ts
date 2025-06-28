import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shifts = pgTable("shifts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  isActive: boolean("is_active").default(true),
});

export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  name: text("name"),
  phone: text("phone"),
  count: integer("count").notNull(),
  hasReservation: boolean("has_reservation").default(false),
  visitedBefore: boolean("visited_before").default(false),
  tableNumber: text("table_number"),
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }),
  paymentMethod: text("payment_method"),
  paymentType: text("payment_type"),
  ticketInfo: text("ticket_info"), // JSON string
  status: text("status").default("pending"), // pending, confirmed, declined
  declineReason: text("decline_reason"),
  shiftId: integer("shift_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  guestId: integer("guest_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: text("method").notNull(), // cash, card, combo, crypto
  cashAmount: decimal("cash_amount", { precision: 10, scale: 2 }),
  cardAmount: decimal("card_amount", { precision: 10, scale: 2 }),
  status: text("status").default("pending"), // pending, confirmed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertShiftSchema = createInsertSchema(shifts).omit({
  id: true,
  startTime: true,
});

export const insertGuestSchema = createInsertSchema(guests).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertShift = z.infer<typeof insertShiftSchema>;
export type Shift = typeof shifts.$inferSelect;
export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type Guest = typeof guests.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
