import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { equipment } from '@/lib/db/schema'

export async function GET() {
  try {
    // For demo purposes, return some sample saved items
    const savedItems = await db.select({
      id: equipment.id,
      title: equipment.title,
      daily_price: equipment.daily_price,
      location: equipment.location,
      images: equipment.images,
      equipment_type: equipment.equipment_type
    })
    .from(equipment)
    .orderBy(equipment.created_at)
    .limit(6)

    // Transform the data
    const transformedItems = savedItems.map(item => ({
      id: item.id,
      title: item.title,
      daily_price: item.daily_price,
      location: item.location,
      image: item.images?.[0] || '/placeholder.jpg',
      type: item.equipment_type
    }))

    return NextResponse.json({
      success: true,
      saved: transformedItems
    })

  } catch (error) {
    console.error('Error fetching saved items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch saved items' },
      { status: 500 }
    )
  }
}