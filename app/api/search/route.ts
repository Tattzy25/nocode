import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { equipment, users } from '@/lib/db/schema';
import { eq, and, or, ilike, between, inArray, gte, lte } from 'drizzle-orm';
import { z } from 'zod';

const searchSchema = z.object({
  query: z.string().optional(),
  equipment_type: z.enum(['mobility_scooter', 'baby_stroller']).optional(),
  scooter_subtype: z.enum(['lightweight', 'standard', 'heavy_duty', 'xl']).optional(),
  stroller_subtype: z.enum(['single', 'double', 'single_jogger', 'double_jogger']).optional(),
  min_price: z.coerce.number().min(0).optional(),
  max_price: z.coerce.number().min(0).optional(),
  location: z.string().optional(),
  features: z.array(z.string()).optional(),
  brand: z.string().optional(),
  min_year: z.coerce.number().optional(),
  max_year: z.coerce.number().optional(),
  sort_by: z.enum(['price_asc', 'price_desc', 'newest', 'rating']).default('newest'),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate search parameters
    const params = searchSchema.parse({
      query: searchParams.get('query') || undefined,
      equipment_type: searchParams.get('equipment_type') || undefined,
      scooter_subtype: searchParams.get('scooter_subtype') || undefined,
      stroller_subtype: searchParams.get('stroller_subtype') || undefined,
      min_price: searchParams.get('min_price') || undefined,
      max_price: searchParams.get('max_price') || undefined,
      location: searchParams.get('location') || undefined,
      features: searchParams.get('features')?.split(',').filter(f => f.trim()) || undefined,
      brand: searchParams.get('brand') || undefined,
      min_year: searchParams.get('min_year') || undefined,
      max_year: searchParams.get('max_year') || undefined,
      sort_by: searchParams.get('sort_by') || 'newest',
      limit: searchParams.get('limit') || 20,
      offset: searchParams.get('offset') || 0,
    });

    let query = db.select({
      equipment: equipment,
      host: {
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        avatar_url: users.avatar_url,
        is_host: users.is_host,
      }
    })
    .from(equipment)
    .leftJoin(users, eq(equipment.host_id, users.id))
    .where(eq(equipment.is_active, true));

    const conditions = [];

    // Text search in title, description, brand, model
    if (params.query) {
      conditions.push(
        or(
          ilike(equipment.title, `%${params.query}%`),
          ilike(equipment.description, `%${params.query}%`),
          ilike(equipment.brand, `%${params.query}%`),
          ilike(equipment.model, `%${params.query}%`)
        )
      );
    }

    // Equipment type filter
    if (params.equipment_type) {
      conditions.push(eq(equipment.equipment_type, params.equipment_type));
    }

    // Subtype filters
    if (params.scooter_subtype) {
      conditions.push(eq(equipment.scooter_subtype, params.scooter_subtype));
    }

    if (params.stroller_subtype) {
      conditions.push(eq(equipment.stroller_subtype, params.stroller_subtype));
    }

    // Price range filter
    if (params.min_price !== undefined) {
      conditions.push(gte(equipment.daily_price, params.min_price.toString()));
    }

    if (params.max_price !== undefined) {
      conditions.push(lte(equipment.daily_price, params.max_price.toString()));
    }

    // Location filter
    if (params.location) {
      conditions.push(ilike(equipment.location, `%${params.location}%`));
    }

    // Brand filter
    if (params.brand) {
      conditions.push(ilike(equipment.brand, `%${params.brand}%`));
    }

    // Year range filter
    if (params.min_year) {
      conditions.push(gte(equipment.year, params.min_year));
    }

    if (params.max_year) {
      conditions.push(lte(equipment.year, params.max_year));
    }

    // Features filter
    if (params.features && params.features.length > 0) {
      params.features.forEach(feature => {
        conditions.push(ilike(equipment.features, `%${feature}%`));
      });
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    switch (params.sort_by) {
      case 'price_asc':
        query = query.orderBy(equipment.daily_price);
        break;
      case 'price_desc':
        query = query.orderBy(equipment.daily_price);
        break;
      case 'newest':
        query = query.orderBy(equipment.created_at);
        break;
      case 'rating':
        // TODO: Add rating field to equipment table
        query = query.orderBy(equipment.created_at);
        break;
    }

    // Apply pagination
    query = query.limit(params.limit).offset(params.offset);

    const results = await query;

    // Get total count for pagination
    const countQuery = db.select({ count: sql<number>`count(*)` })
      .from(equipment)
      .where(eq(equipment.is_active, true));

    let countConditions = [...conditions];
    if (countConditions.length > 0) {
      countQuery = countQuery.where(and(...countConditions));
    }

    const totalCount = await countQuery;

    return NextResponse.json({
      equipment: results,
      pagination: {
        total: totalCount[0]?.count || 0,
        limit: params.limit,
        offset: params.offset,
        has_more: (params.offset + params.limit) < (totalCount[0]?.count || 0),
      },
      filters: params,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error searching equipment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper endpoint to get search suggestions
export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();
    
    let suggestions;
    switch (type) {
      case 'brands':
        suggestions = await db.select({ brand: equipment.brand })
          .from(equipment)
          .groupBy(equipment.brand)
          .orderBy(equipment.brand);
        break;
      case 'locations':
        suggestions = await db.select({ location: equipment.location })
          .from(equipment)
          .groupBy(equipment.location)
          .orderBy(equipment.location);
        break;
      case 'features':
        const features = await db.select({ features: equipment.features })
          .from(equipment);
        const allFeatures = new Set();
        features.forEach(f => {
          f.features.forEach(feature => allFeatures.add(feature));
        });
        suggestions = Array.from(allFeatures);
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}