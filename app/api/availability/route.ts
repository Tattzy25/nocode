import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { availability, equipment } from '@/lib/db/schema';
import { eq, and, between } from 'drizzle-orm';
import { z } from 'zod';

const availabilitySchema = z.object({
  equipment_id: z.string().uuid(),
  date: z.string().date(),
  is_available: z.boolean().optional().default(true),
  price_override: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = availabilitySchema.parse(body);

    // Verify user owns the equipment
    const user = await db.select().from(equipment).where(eq(equipment.host_id, userId as any)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'Equipment not found or not owned by user' }, { status: 404 });
    }

    // Check if availability already exists for this date
    const existingAvailability = await db.select()
      .from(availability)
      .where(
        and(
          eq(availability.equipment_id, validatedData.equipment_id),
          eq(availability.date, validatedData.date)
        )
      )
      .limit(1);

    let result;
    if (existingAvailability.length > 0) {
      // Update existing availability
      result = await db.update(availability)
        .set({
          is_available: validatedData.is_available,
          price_override: validatedData.price_override?.toString(),
        })
        .where(eq(availability.id, existingAvailability[0].id))
        .returning();
    } else {
      // Create new availability
      result = await db.insert(availability).values({
        equipment_id: validatedData.equipment_id,
        date: validatedData.date,
        is_available: validatedData.is_available,
        price_override: validatedData.price_override?.toString(),
      }).returning();
    }

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error setting availability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const equipmentId = searchParams.get('equipment_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (!equipmentId) {
      return NextResponse.json({ error: 'Equipment ID is required' }, { status: 400 });
    }

    let query = db.select().from(availability).where(eq(availability.equipment_id, equipmentId));

    if (startDate && endDate) {
      query = query.where(between(availability.date, startDate, endDate));
    }

    const availabilityData = await query;
    return NextResponse.json(availabilityData);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Batch update availability
export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { equipment_id, date_range, is_available, price_override } = z.object({
      equipment_id: z.string().uuid(),
      date_range: z.object({
        start_date: z.string().date(),
        end_date: z.string().date(),
      }),
      is_available: z.boolean().optional().default(true),
      price_override: z.number().optional(),
    }).parse(body);

    // Verify user owns the equipment
    const user = await db.select().from(equipment).where(eq(equipment.host_id, userId as any)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'Equipment not found or not owned by user' }, { status: 404 });
    }

    const start = new Date(date_range.start_date);
    const end = new Date(date_range.end_date);
    const dates = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }

    const results = [];
    for (const date of dates) {
      // Check if availability already exists
      const existing = await db.select()
        .from(availability)
        .where(
          and(
            eq(availability.equipment_id, equipment_id),
            eq(availability.date, date)
          )
        )
        .limit(1);

      let result;
      if (existing.length > 0) {
        result = await db.update(availability)
          .set({
            is_available,
            price_override: price_override?.toString(),
          })
          .where(eq(availability.id, existing[0].id))
          .returning();
      } else {
        result = await db.insert(availability).values({
          equipment_id,
          date,
          is_available,
          price_override: price_override?.toString(),
        }).returning();
      }
      results.push(result[0]);
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating availability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}