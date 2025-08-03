import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { bookings, equipment } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    // For demo purposes, we'll return all bookings as "user bookings"
    const userBookings = await db.select({
      id: bookings.id,
      start_date: bookings.start_date,
      end_date: bookings.end_date,
      total_price: bookings.total_price,
      status: bookings.status,
      equipment: {
        title: equipment.title,
        daily_price: equipment.daily_price,
        images: equipment.images,
        location: equipment.location
      }
    })
    .from(bookings)
    .leftJoin(equipment, eq(bookings.equipment_id, equipment.id))
    .orderBy(bookings.start_date)

    // Transform the data
    const transformedBookings = userBookings.map(booking => ({
      id: booking.id,
      equipment_title: booking.equipment?.title || 'Unknown Equipment',
      equipment_image: booking.equipment?.images?.[0] || '/placeholder.jpg',
      location: booking.equipment?.location || 'Unknown Location',
      start_date: booking.start_date,
      end_date: booking.end_date,
      total_amount: booking.total_price,
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