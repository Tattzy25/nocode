import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { bookings, equipment, users } from '@/lib/db/schema';
import { eq, and, gte, lte, between } from 'drizzle-orm';
import { z } from 'zod';

const bookingSchema = z.object({
  equipment_id: z.string().uuid(),
  start_date: z.string().date(),
  end_date: z.string().date(),
  guest_message: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    // Get user
    const user = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get equipment and check availability
    const equipmentItem = await db.select().from(equipment).where(eq(equipment.id, validatedData.equipment_id)).limit(1);
    if (!equipmentItem.length) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    // Check if equipment belongs to the user trying to book
    if (equipmentItem[0].host_id === user[0].id) {
      return NextResponse.json({ error: 'Cannot book your own equipment' }, { status: 400 });
    }

    // Calculate total price
    const startDate = new Date(validatedData.start_date);
    const endDate = new Date(validatedData.end_date);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * equipmentItem[0].daily_price;

    // Create booking
    const newBooking = await db.insert(bookings).values({
      guest_id: user[0].id,
      equipment_id: validatedData.equipment_id,
      host_id: equipmentItem[0].host_id,
      start_date: validatedData.start_date,
      end_date: validatedData.end_date,
      total_price: totalPrice,
      guest_message: validatedData.guest_message,
    }).returning();

    return NextResponse.json(newBooking[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'guest' or 'host'
    const status = searchParams.get('status');

    const user = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let query;
    if (type === 'guest') {
      query = db.select({
        booking: bookings,
        equipment: equipment,
        host: {
          id: users.id,
          first_name: users.first_name,
          last_name: users.last_name,
          avatar_url: users.avatar_url,
        }
      })
      .from(bookings)
      .leftJoin(equipment, eq(bookings.equipment_id, equipment.id))
      .leftJoin(users, eq(bookings.host_id, users.id))
      .where(eq(bookings.guest_id, user[0].id));
    } else if (type === 'host') {
      query = db.select({
        booking: bookings,
        equipment: equipment,
        guest: {
          id: users.id,
          first_name: users.first_name,
          last_name: users.last_name,
          avatar_url: users.avatar_url,
        }
      })
      .from(bookings)
      .leftJoin(equipment, eq(bookings.equipment_id, equipment.id))
      .leftJoin(users, eq(bookings.guest_id, users.id))
      .where(eq(bookings.host_id, user[0].id));
    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    if (status) {
      query = query.where(eq(bookings.status, status as any));
    }

    const results = await query;
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}