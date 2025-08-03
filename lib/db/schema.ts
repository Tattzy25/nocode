import { pgTable, uuid, text, boolean, decimal, timestamp, date, array, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerk_id: text('clerk_id').unique().notNull(),
  email: text('email').unique().notNull(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  phone: text('phone'),
  avatar_url: text('avatar_url'),
  is_host: boolean('is_host').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const equipment = pgTable('equipment', {
  id: uuid('id').primaryKey().defaultRandom(),
  host_id: uuid('host_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  equipment_type: text('equipment_type', { enum: ['mobility_scooter', 'baby_stroller'] }).notNull(),
  scooter_subtype: text('scooter_subtype', { enum: ['lightweight', 'standard', 'heavy_duty', 'xl'] }),
  stroller_subtype: text('stroller_subtype', { enum: ['single', 'double', 'single_jogger', 'double_jogger'] }),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  year: integer('year'),
  daily_price: decimal('daily_price', { precision: 10, scale: 2 }).notNull(),
  location: text('location').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  features: text('features').array().notNull().default([]),
  images: text('images').array().notNull().default([]),
  verification_documents: text('verification_documents').array().notNull().default([]),
  is_verified: boolean('is_verified').default(false),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const availability = pgTable('availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  equipment_id: uuid('equipment_id').notNull().references(() => equipment.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  is_available: boolean('is_available').default(true),
  price_override: decimal('price_override', { precision: 10, scale: 2 }),
  created_at: timestamp('created_at').defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  guest_id: uuid('guest_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  equipment_id: uuid('equipment_id').notNull().references(() => equipment.id, { onDelete: 'cascade' }),
  host_id: uuid('host_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  total_price: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: text('status', { enum: ['pending', 'confirmed', 'cancelled', 'completed'] }).default('pending'),
  guest_message: text('guest_message'),
  host_notes: text('host_notes'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  booking_id: uuid('booking_id').references(() => bookings.id, { onDelete: 'cascade' }),
  sender_id: uuid('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  receiver_id: uuid('receiver_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  is_read: boolean('is_read').default(false),
  created_at: timestamp('created_at').defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  booking_id: uuid('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  reviewer_id: uuid('reviewer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  equipment_id: uuid('equipment_id').notNull().references(() => equipment.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull().check('rating >= 1 AND rating <= 5'),
  comment: text('comment'),
  created_at: timestamp('created_at').defaultNow(),
});

export const equipment_documents = pgTable('equipment_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  equipment_id: uuid('equipment_id').notNull().references(() => equipment.id, { onDelete: 'cascade' }),
  document_type: text('document_type').notNull(), // 'insurance', 'registration', 'inspection', 'manual'
  document_url: text('document_url').notNull(),
  is_verified: boolean('is_verified').default(false),
  uploaded_at: timestamp('uploaded_at').defaultNow(),
});