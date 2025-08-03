import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // For demo purposes, we'll return all bookings as "user bookings"
    const bookings = await prisma.booking.findMany({
      include: {
        equipment: {
          select: {
            title: true,
            daily_price: true,
            images: true,
            location: true
          }
        }
      },
      orderBy: {
        start_date: 'desc'
      }
    })

    // Transform the data
    const transformedBookings = bookings.map(booking => ({
      id: booking.id,
      equipment_title: booking.equipment.title,
      equipment_image: booking.equipment.images?.[0] || '/placeholder.jpg',
      location: booking.equipment.location,
      start_date: booking.start_date.toISOString().split('T')[0],
      end_date: booking.end_date.toISOString().split('T')[0],
      total_amount: booking.total_amount,
      status: booking.status
    }))

    // Separate upcoming and past bookings
    const now = new Date()
    const upcoming = transformedBookings.filter(b => new Date(b.start_date) > now)
    const past = transformedBookings.filter(b => new Date(b.end_date) < now)

    return NextResponse.json({
      success: true,
      upcoming,
      past
    })

  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}