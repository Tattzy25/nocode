import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { messages, users, bookings } from '@/lib/db/schema';
import { eq, or, and, desc } from 'drizzle-orm';
import { z } from 'zod';

const messageSchema = z.object({
  receiver_id: z.string().uuid(),
  booking_id: z.string().uuid().optional(),
  content: z.string().min(1).max(1000),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = messageSchema.parse(body);

    // Get sender user
    const sender = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!sender.length) {
      return NextResponse.json({ error: 'Sender user not found' }, { status: 404 });
    }

    // If booking_id is provided, verify the user is part of the booking
    if (validatedData.booking_id) {
      const booking = await db.select().from(bookings).where(eq(bookings.id, validatedData.booking_id)).limit(1);
      if (!booking.length) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }
      
      // Check if user is either guest or host
      if (booking[0].guest_id !== sender[0].id && booking[0].host_id !== sender[0].id) {
        return NextResponse.json({ error: 'Not authorized to message about this booking' }, { status: 403 });
      }
    }

    const newMessage = await db.insert(messages).values({
      booking_id: validatedData.booking_id,
      sender_id: sender[0].id,
      receiver_id: validatedData.receiver_id,
      content: validatedData.content,
    }).returning();

    // Get the complete message with sender info
    const messageWithSender = await db.select({
      message: messages,
      sender: {
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        avatar_url: users.avatar_url,
      }
    })
    .from(messages)
    .leftJoin(users, eq(messages.sender_id, users.id))
    .where(eq(messages.id, newMessage[0].id));

    return NextResponse.json(messageWithSender[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationWith = searchParams.get('conversation_with');
    const bookingId = searchParams.get('booking_id');

    const user = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let query;
    
    if (conversationWith) {
      // Get conversation with specific user
      query = db.select({
        message: messages,
        sender: {
          id: users.id,
          first_name: users.first_name,
          last_name: users.last_name,
          avatar_url: users.avatar_url,
        },
        receiver: {
          id: users.id,
          first_name: users.first_name,
          last_name: users.last_name,
          avatar_url: users.avatar_url,
        }
      })
      .from(messages)
      .leftJoin(users, eq(messages.sender_id, users.id))
      .where(
        or(
          and(
            eq(messages.sender_id, user[0].id),
            eq(messages.receiver_id, conversationWith)
          ),
          and(
            eq(messages.sender_id, conversationWith),
            eq(messages.receiver_id, user[0].id)
          )
        )
      )
      .orderBy(desc(messages.created_at));
    } else if (bookingId) {
      // Get messages for specific booking
      query = db.select({
        message: messages,
        sender: {
          id: users.id,
          first_name: users.first_name,
          last_name: users.last_name,
          avatar_url: users.avatar_url,
        },
        receiver: {
          id: users.id,
          first_name: users.first_name,
          last_name: users.last_name,
          avatar_url: users.avatar_url,
        }
      })
      .from(messages)
      .leftJoin(users, eq(messages.sender_id, users.id))
      .where(eq(messages.booking_id, bookingId))
      .orderBy(desc(messages.created_at));
    } else {
      // Get all conversations with latest message
      const conversations = await db.execute({
        sql: `
          SELECT 
            m.*,
            u1.first_name as sender_first_name,
            u1.last_name as sender_last_name,
            u1.avatar_url as sender_avatar,
            u2.first_name as receiver_first_name,
            u2.last_name as receiver_last_name,
            u2.avatar_url as receiver_avatar
          FROM messages m
          JOIN users u1 ON m.sender_id = u1.id
          JOIN users u2 ON m.receiver_id = u2.id
          WHERE m.sender_id = ? OR m.receiver_id = ?
          ORDER BY m.created_at DESC
        `,
        params: [user[0].id, user[0].id]
      });

      // Group by conversation
      const groupedConversations = new Map();
      conversations.rows.forEach((msg: any) => {
        const otherUserId = msg.sender_id === user[0].id ? msg.receiver_id : msg.sender_id;
        if (!groupedConversations.has(otherUserId)) {
          groupedConversations.set(otherUserId, {
            lastMessage: msg,
            otherUser: msg.sender_id === user[0].id ? {
              id: msg.receiver_id,
              first_name: msg.receiver_first_name,
              last_name: msg.receiver_last_name,
              avatar_url: msg.receiver_avatar
            } : {
              id: msg.sender_id,
              first_name: msg.sender_first_name,
              last_name: msg.sender_last_name,
              avatar_url: msg.sender_avatar
            }
          });
        }
      });

      return NextResponse.json(Array.from(groupedConversations.values()));
    }

    const messagesData = await query;
    return NextResponse.json(messagesData);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Mark messages as read
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message_ids } = await request.json();
    if (!Array.isArray(message_ids) || message_ids.length === 0) {
      return NextResponse.json({ error: 'Invalid message_ids' }, { status: 400 });
    }

    const user = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await db.update(messages)
      .set({ is_read: true })
      .where(
        and(
          eq(messages.receiver_id, user[0].id),
          messages.id.in(message_ids)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}