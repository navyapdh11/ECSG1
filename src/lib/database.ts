import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const DB_PATH = process.env.NODE_ENV === 'production'
  ? '/tmp/ecsg1-bookings.db'
  : path.join(process.cwd(), 'data', 'ecsg1-bookings.db');

let dbInstance: Database.Database | null = null;

function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  // Ensure data directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  dbInstance = new Database(DB_PATH);

  // Initialize tables
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_phone TEXT,
      services TEXT NOT NULL,
      total_amount INTEGER NOT NULL,
      currency TEXT DEFAULT 'usd',
      status TEXT DEFAULT 'pending',
      stripe_session_id TEXT,
      stripe_payment_intent_id TEXT,
      booking_date TEXT,
      booking_time TEXT,
      address TEXT,
      special_instructions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(user_email);
    CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
    CREATE INDEX IF NOT EXISTS idx_bookings_stripe ON bookings(stripe_session_id);
  `);

  return dbInstance;
}

export interface BookingRecord {
  id: string;
  user_email: string;
  user_name: string;
  user_phone?: string;
  services: string; // JSON string
  total_amount: number; // cents
  currency: string;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'refunded';
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  booking_date: string;
  booking_time: string;
  address: string; // JSON string
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export function createBooking(data: {
  user_email: string;
  user_name: string;
  user_phone?: string;
  services: Array<{ name: string; price: number; quantity: number }>;
  total_amount: number;
  booking_date: string;
  booking_time: string;
  address: { street: string; city: string; state: string; zipCode: string; country: string };
  special_instructions?: string;
}): BookingRecord {
  const db = getDb();
  const id = uuidv4();
  const stmt = db.prepare(`
    INSERT INTO bookings (
      id, user_email, user_name, user_phone, services, total_amount,
      booking_date, booking_time, address, special_instructions
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    data.user_email,
    data.user_name,
    data.user_phone || null,
    JSON.stringify(data.services),
    data.total_amount,
    data.booking_date,
    data.booking_time,
    JSON.stringify(data.address),
    data.special_instructions || null
  );

  return getBookingById(id)!;
}

export function getBookingById(id: string): BookingRecord | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM bookings WHERE id = ?');
  return stmt.get(id) as BookingRecord | null;
}

export function getBookingsByEmail(email: string): BookingRecord[] {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM bookings WHERE user_email = ? ORDER BY created_at DESC');
  return stmt.all(email) as BookingRecord[];
}

export function updateBookingStatus(id: string, status: BookingRecord['status'], updates?: Record<string, unknown>): BookingRecord | null {
  const db = getDb();
  const fields = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
  const values: unknown[] = [status];

  if (updates) {
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  values.push(id);
  const stmt = db.prepare(`UPDATE bookings SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);

  return getBookingById(id);
}
