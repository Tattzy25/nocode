import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // In production, this would filter by the authenticated host ID
    // For demo purposes, we'll return all bookings
    const bookings = await prisma.booking.findMany({
      include: {
        equipment: {
          select: {
            title: true,
            daily_price: true
          }
        },
        renter: {
          select: {
            first_name: true,
            last_name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Transform the data
    const transformedBookings = bookings.map(booking => ({
      id: booking.id,
      renter_name: `${booking.renter.first_name} ${booking.renter.last_name}`,
      equipment_title: booking.equipment.title,
      start_date: booking.start_date.toISOString().split('T')[0],
      end_date: booking.end_date.toISOString().split('T')[0],
      total_amount: booking.total_amount,
      status: booking.status
    }))

    return NextResponse.json({
      success: true,
      bookings: transformedBookings
    })

  } catch (error) {
    console.error('Error fetching host bookings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}