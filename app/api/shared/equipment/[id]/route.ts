import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { equipment, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const equipmentId = params.id

    if (!equipmentId) {
      return NextResponse.json(
        { error: 'Equipment ID is required' },
        { status: 400 }
      )
    }

    const equipmentData = await db
      .select({
        id: equipment.id,
        title: equipment.title,
        description: equipment.description,
        type: equipment.type,
        subtype: equipment.subtype,
        location: equipment.location,
        daily_price: equipment.daily_price,
        weekly_price: equipment.weekly_price,
        monthly_price: equipment.monthly_price,
        images: equipment.images,
        features: equipment.features,
        specifications: equipment.specifications,
        host_id: equipment.host_id,
        created_at: equipment.created_at,
        updated_at: equipment.updated_at,
      })
      .from(equipment)
      .where(eq(equipment.id, equipmentId))
      .limit(1)

    if (equipmentData.length === 0) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      )
    }

    const equipmentItem = equipmentData[0]

    // Get host information
    const hostData = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        created_at: users.created_at,
      })
      .from(users)
      .where(eq(users.id, equipmentItem.host_id))
      .limit(1)

    const host = hostData[0]

    // Mock additional data for demo
    const responseData = {
      ...equipmentItem,
      host: {
        name: host?.name || 'Anonymous Host',
        rating: 4.8,
        total_reviews: 125,
        member_since: host?.created_at?.getFullYear() || 2023,
      },
      availability: [
        { date: '2024-01-15', available: true },
        { date: '2024-01-16', available: true },
        { date: '2024-01-17', available: false },
        { date: '2024-01-18', available: true },
        { date: '2024-01-19', available: true },
        { date: '2024-01-20', available: true },
      ]
    }

    return NextResponse.json({ equipment: responseData })
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    )
  }
}