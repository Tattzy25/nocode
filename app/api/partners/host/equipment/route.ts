import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { equipment, bookings } from '@/lib/db/schema';
import { eq, count, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // In production, this would filter by the authenticated host ID
    // For demo purposes, we'll return all equipment as "host equipment"
    
    // Get equipment with booking counts
    const equipmentWithBookings = await db.select({
      id: equipment.id,
      title: equipment.title,
      daily_price: equipment.daily_price,
      location: equipment.location,
      status: equipment.is_active,
      images: equipment.images,
      equipment_type: equipment.equipment_type,
      bookings_count: sql<number>`COALESCE(${count(bookings.id)}, 0)`.as('bookings_count')
    })
    .from(equipment)
    .leftJoin(bookings, eq(equipment.id, bookings.equipment_id))
    .groupBy(equipment.id)
    .orderBy(sql`${equipment.created_at} DESC`);

    // Transform the data to match expected format
    const transformedEquipment = equipmentWithBookings.map(item => ({
      id: item.id,
      title: item.title,
      type: item.equipment_type,
      daily_price: item.daily_price,
      location: item.location,
      bookings_count: item.bookings_count,
      status: item.status ? 'active' : 'inactive',
      images: item.images || []
    }));

    return NextResponse.json({
      success: true,
      equipment: transformedEquipment
    });

  } catch (error) {
    console.error('Error fetching host equipment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment' },
      { status: 500 }
    );
  }
}