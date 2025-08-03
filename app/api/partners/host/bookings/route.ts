import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { bookings, equipment, users } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user from database
    const user = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get bookings for equipment owned by this host
    const hostBookings = await db.select({
      booking: bookings,
      equipment: {
        title: equipment.title,
        daily_price: equipment.daily_price
      },
      renter: {
        first_name: users.first_name,
        last_name: users.last_name
      }
    })
    .from(bookings)
    .leftJoin(equipment, eq(bookings.equipment_id, equipment.id))
    .leftJoin(users, eq(bookings.guest_id, users.id))
    .where(eq(bookings.host_id, user[0].id))
    .orderBy(desc(bookings.created_at))
    .limit(10);

    // Transform the data with null checks
    const transformedBookings = hostBookings.map(item => ({
      id: item.booking.id,
      renter_name: item.renter ? `${item.renter.first_name} ${item.renter.last_name}` : 'Unknown Renter',
      equipment_title: item.equipment?.title || 'Unknown Equipment',
      start_date: item.booking.start_date,
      end_date: item.booking.end_date,
      total_amount: item.booking.total_price,
      status: item.booking.status
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