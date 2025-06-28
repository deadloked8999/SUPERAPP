import { 
  users, guests, shifts, payments,
  type User, type InsertUser, 
  type Guest, type InsertGuest,
  type Shift, type InsertShift,
  type Payment, type InsertPayment
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, code: string): Promise<User | null>;

  // Shifts
  createShift(shift: InsertShift): Promise<Shift>;
  getActiveShift(userId: number): Promise<Shift | undefined>;
  endShift(shiftId: number): Promise<void>;
  getShiftStats(shiftId: number): Promise<{
    totalGuests: number;
    totalRevenue: number;
    totalTables: number;
  }>;

  // Guests
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: number, updates: Partial<Guest>): Promise<Guest | undefined>;
  getGuest(id: number): Promise<Guest | undefined>;
  searchGuestsByName(name: string): Promise<Guest[]>;
  getGuestsByShift(shiftId: number): Promise<Guest[]>;

  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, updates: Partial<Payment>): Promise<Payment | undefined>;
  getPaymentsByGuest(guestId: number): Promise<Payment[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private guests: Map<number, Guest>;
  private shifts: Map<number, Shift>;
  private payments: Map<number, Payment>;
  private currentUserId: number;
  private currentGuestId: number;
  private currentShiftId: number;
  private currentPaymentId: number;

  constructor() {
    this.users = new Map();
    this.guests = new Map();
    this.shifts = new Map();
    this.payments = new Map();
    this.currentUserId = 1;
    this.currentGuestId = 1;
    this.currentShiftId = 1;
    this.currentPaymentId = 1;

    // Add default users for testing
    this.users.set(1, {
      id: 1,
      username: "admin",
      password: "123456",
      role: "ADMIN",
      createdAt: new Date(),
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async authenticateUser(username: string, code: string): Promise<User | null> {
    // Simple auth - check if code matches user password
    const user = await this.getUserByUsername(username);
    if (user && user.password === code) {
      return user;
    }
    // For demo, accept "123456" as valid code for any role
    if (code === "123456") {
      return {
        id: 1,
        username: "demo",
        password: "123456",
        role: "ADMIN",
        createdAt: new Date(),
      };
    }
    return null;
  }

  async createShift(insertShift: InsertShift): Promise<Shift> {
    const id = this.currentShiftId++;
    const shift: Shift = {
      ...insertShift,
      id,
      startTime: new Date(),
    };
    this.shifts.set(id, shift);
    return shift;
  }

  async getActiveShift(userId: number): Promise<Shift | undefined> {
    return Array.from(this.shifts.values()).find(
      (shift) => shift.userId === userId && shift.isActive,
    );
  }

  async endShift(shiftId: number): Promise<void> {
    const shift = this.shifts.get(shiftId);
    if (shift) {
      shift.endTime = new Date();
      shift.isActive = false;
      this.shifts.set(shiftId, shift);
    }
  }

  async getShiftStats(shiftId: number): Promise<{
    totalGuests: number;
    totalRevenue: number;
    totalTables: number;
  }> {
    const guests = Array.from(this.guests.values()).filter(
      (guest) => guest.shiftId === shiftId && guest.status === "confirmed"
    );
    
    const totalGuests = guests.reduce((sum, guest) => sum + guest.count, 0);
    const totalRevenue = guests.reduce((sum, guest) => {
      const deposit = parseFloat(guest.depositAmount || "0");
      return sum + deposit;
    }, 0);
    const totalTables = guests.filter(guest => guest.tableNumber).length;

    return {
      totalGuests,
      totalRevenue,
      totalTables,
    };
  }

  async createGuest(insertGuest: InsertGuest): Promise<Guest> {
    const id = this.currentGuestId++;
    const guest: Guest = {
      ...insertGuest,
      id,
      createdAt: new Date(),
    };
    this.guests.set(id, guest);
    return guest;
  }

  async updateGuest(id: number, updates: Partial<Guest>): Promise<Guest | undefined> {
    const guest = this.guests.get(id);
    if (guest) {
      const updated = { ...guest, ...updates };
      this.guests.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async getGuest(id: number): Promise<Guest | undefined> {
    return this.guests.get(id);
  }

  async searchGuestsByName(name: string): Promise<Guest[]> {
    return Array.from(this.guests.values()).filter(
      (guest) => guest.name?.toLowerCase().includes(name.toLowerCase())
    );
  }

  async getGuestsByShift(shiftId: number): Promise<Guest[]> {
    return Array.from(this.guests.values()).filter(
      (guest) => guest.shiftId === shiftId
    );
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const payment: Payment = {
      ...insertPayment,
      id,
      createdAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: number, updates: Partial<Payment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (payment) {
      const updated = { ...payment, ...updates };
      this.payments.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async getPaymentsByGuest(guestId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.guestId === guestId
    );
  }
}

export const storage = new MemStorage();
