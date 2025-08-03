import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // In production, this would filter by the authenticated host ID
    // For demo purposes, we'll return all equipment as "host equipment"
    const equipment = await prisma.equipment.findMany({
      include: {
        bookings: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to include bookings count
    const transformedEquipment = equipment.map(item => ({
      id: item.id,
      title: item.title,
      type: item.type,
      daily_price: item.daily_price,
      location: item.location,
      bookings_count: item.bookings.filter(b => b.status === 'confirmed').length,
      status: item.status,
      images: item.images || []
    }))

    return NextResponse.json({
      success: true,
      equipment: transformedEquipment
    })

  } catch (error) {
    console.error('Error fetching host equipment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment' },
      { status: 500 }
    )
  }
}