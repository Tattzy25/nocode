"use server";

import { neon } from "@neondatabase/serverless";

export interface Equipment {
  id: string
  title: string
  equipment_type: string
  scooter_subtype?: string
  stroller_subtype?: string
  location: string
  daily_price: string
  images: string
  features: string
  brand: string
  model: string
  first_name?: string
  last_name?: string
}

export async function getData(): Promise<Equipment[]> {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`SELECT * FROM equipment WHERE is_active = true LIMIT 6`;
  return data.map(row => ({
    id: String(row.id),
    title: String(row.title),
    equipment_type: String(row.equipment_type),
    scooter_subtype: row.scooter_subtype ? String(row.scooter_subtype) : undefined,
    stroller_subtype: row.stroller_subtype ? String(row.stroller_subtype) : undefined,
    location: String(row.location),
    daily_price: String(row.daily_price),
    images: String(row.images),
    features: String(row.features),
    brand: String(row.brand),
    model: String(row.model),
    first_name: row.first_name ? String(row.first_name) : undefined,
    last_name: row.last_name ? String(row.last_name) : undefined,
  })) as Equipment[];
}