import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // For demo purposes, return some sample saved items
    const savedItems = await prisma.equipment.findMany({
      select: {
        id: true,
        title: true,
        daily_price: true,
        location: true,
        images: true,
        type: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 6
    })

    // Transform the data
    const transformedItems = savedItems.map(item => ({
      id: item.id,
      title: item.title,
      daily_price: item.daily_price,
      location: item.location,
      image: item.images?.[0] || '/placeholder.jpg',
      type: item.type
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