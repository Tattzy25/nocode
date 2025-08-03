import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

// Export types
export type User = typeof import('./schema').users.$inferSelect;
export type NewUser = typeof import('./schema').users.$inferInsert;

export type Equipment = typeof import('./schema').equipment.$inferSelect;
export type NewEquipment = typeof import('./schema').equipment.$inferInsert;

export type Booking = typeof import('./schema').bookings.$inferSelect;
export type NewBooking = typeof import('./schema').bookings.$inferInsert;

export type Message = typeof import('./schema').messages.$inferSelect;
export type NewMessage = typeof import('./schema').messages.$inferInsert;

export type Availability = typeof import('./schema').availability.$inferSelect;
export type NewAvailability = typeof import('./schema').availability.$inferInsert;

export type Review = typeof import('./schema').reviews.$inferSelect;
export type NewReview = typeof import('./schema').reviews.$inferInsert;

export type EquipmentDocument = typeof import('./schema').equipment_documents.$inferSelect;
export type NewEquipmentDocument = typeof import('./schema').equipment_documents.$inferInsert;