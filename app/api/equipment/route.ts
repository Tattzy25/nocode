import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { equipment, users, availability } from '@/lib/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { z } from 'zod';

const equipmentSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  equipment_type: z.enum(['mobility_scooter', 'baby_stroller']),
  scooter_subtype: z.enum(['lightweight', 'standard', 'heavy_duty', 'xl']).optional(),
  stroller_subtype: z.enum(['single', 'double', 'single_jogger', 'double_jogger']).optional(),
  brand: z.string().min(2).max(50),
  model: z.string().min(2).max(50),
  year: z.number().min(2000).max(new Date().getFullYear()).optional(),
  daily_price: z.number().min(1).max(1000),
  location: z.string().min(5).max(200),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  features: z.array(z.string()).max(10),
  images: z.array(z.string().url()).min(1).max(10),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = equipmentSchema.parse(body);

    // Get user from database
    const user = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate subtype based on equipment type
    if (validatedData.equipment_type === 'mobility_scooter' && !validatedData.scooter_subtype) {
      return NextResponse.json({ error: 'Scooter subtype is required for mobility scooters' }, { status: 400 });
    }
    if (validatedData.equipment_type === 'baby_stroller' && !validatedData.stroller_subtype) {
      return NextResponse.json({ error: 'Stroller subtype is required for baby strollers' }, { status: 400 });
    }

    const newEquipment = await db.insert(equipment).values({
      host_id: user[0].id,
      ...validatedData,
      daily_price: validatedData.daily_price.toString(),
      latitude: validatedData.latitude?.toString(),
      longitude: validatedData.longitude?.toString(),
      verification_documents: [],
      is_verified: false,
      is_active: true,
    }).returning();

    // Create availability for next 365 days
    const today = new Date();
    const availabilityData = [];
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      availabilityData.push({
        equipment_id: newEquipment[0].id,
        date: date.toISOString().split('T')[0],
        is_available: true,
      });
    }

    await db.insert(availability).values(availabilityData);

    return NextResponse.json(newEquipment[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating equipment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Fixed GET function with proper error handling and JSON response
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const subtype = searchParams.get('subtype');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const features = searchParams.get('features');
    const limit = searchParams.get('limit');

    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');

    let conditions = [eq(equipment.is_active, true)];

    // Location-based filtering
    if (lat && lng && radius) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusNum = parseFloat(radius);
      
      const earthRadius = 6371;
      const maxLat = latNum + (radiusNum / earthRadius) * (180 / Math.PI);
      const minLat = latNum - (radiusNum / earthRadius) * (180 / Math.PI);
      const maxLng = lngNum + (radiusNum / earthRadius) * (180 / Math.PI) / Math.cos(latNum * Math.PI / 180);
      const minLng = lngNum - (radiusNum / earthRadius) * (180 / Math.PI) / Math.cos(latNum * Math.PI / 180);

      conditions.push(
        gte(equipment.latitude, minLat.toString()),
        lte(equipment.latitude, maxLat.toString()),
        gte(equipment.longitude, minLng.toString()),
        lte(equipment.longitude, maxLng.toString())
      );
    }

    if (type) {
      conditions.push(eq(equipment.equipment_type, type as any));
    }
    if (subtype) {
      if (type === 'mobility_scooter') {
        conditions.push(eq(equipment.scooter_subtype, subtype as any));
      } else if (type === 'baby_stroller') {
        conditions.push(eq(equipment.stroller_subtype, subtype as any));
      }
    }
    if (location) {
      conditions.push(sql`${equipment.location} ILIKE ${`%${location}%`}`);
    }
    if (minPrice) {
      conditions.push(gte(equipment.daily_price, minPrice));
    }
    if (maxPrice) {
      conditions.push(lte(equipment.daily_price, maxPrice));
    }
    if (features) {
      const featureList = features.split(',');
      conditions.push(sql`${equipment.features} && ${featureList}`);
    }

    let query = db.select().from(equipment).where(and(...conditions));
    
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum) as any;
      }
    }

    const results = await query;
    
    // Always return a proper JSON response with equipment array
    return NextResponse.json({ 
      equipment: results,
      total: results.length 
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      equipment: [],
      total: 0
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}