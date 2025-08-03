import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { bookings, equipment, users } from '@/lib/db/schema'
import { eq, count, desc } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams
    const timezone = searchParams.get('timezone') || 'UTC'

    // Get the user from database
    const user = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get backend calculations
    const [totalBookingsResult, totalListingsResult] = await Promise.all([
      db.select({ count: count() })
        .from(bookings)
        .where(eq(bookings.guest_id, user[0].id)),
      
      db.select({ count: count() })
        .from(equipment)
        .where(eq(equipment.host_id, user[0].id))
    ]);
    
    // Get user's bookings with equipment details
    const userBookings = await db.select({
      booking: bookings,
      equipment: equipment,
      host: {
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        avatar_url: users.avatar_url,
      }
    })
    .from(bookings)
    .leftJoin(equipment, eq(bookings.equipment_id, equipment.id))
    .leftJoin(users, eq(equipment.host_id, users.id))
    .where(eq(bookings.guest_id, user[0].id))
    .orderBy(desc(bookings.created_at));

    const total_bookings = totalBookingsResult[0]?.count || 0
    const total_listings = totalListingsResult[0]?.count || 0

    // Transform the data with timezone handling
    const transformedBookings = userBookings.map(item => ({
      id: item.booking.id,
      equipment_title: item.equipment?.title || 'Unknown Equipment',
      equipment_image: item.equipment?.images?.[0] || '/placeholder.jpg',
      location: item.equipment?.location || 'Unknown Location',
      start_date: item.booking.start_date,
      end_date: item.booking.end_date,
      start_date_local: new Date(item.booking.start_date).toLocaleString('en-US', { timeZone: timezone }),
      end_date_local: new Date(item.booking.end_date).toLocaleString('en-US', { timeZone: timezone }),
      total_amount: item.booking.total_price,
      status: item.booking.status,
      timezone: timezone,
      host: item.host
    }))

    // Separate upcoming and past bookings
    const now = new Date()
    const upcoming = transformedBookings.filter(b => new Date(b.start_date) > now)
    const past = transformedBookings.filter(b => new Date(b.end_date) < now)

    return NextResponse.json({
      success: true,
      upcoming,
      past,
      total_bookings,
      total_listings
    })

  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
