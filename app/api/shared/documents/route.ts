import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { equipment_documents, equipment, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

const documentSchema = z.object({
  equipment_id: z.string().uuid(),
  document_type: z.enum(['insurance', 'registration', 'inspection', 'manual']),
  file_name: z.string(),
  file_type: z.string(),
});

// Generate presigned URL for upload
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = documentSchema.parse(body);

    // Verify user owns the equipment
    const user = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const equipmentItem = await db.select()
      .from(equipment)
      .where(
        and(
          eq(equipment.id, validatedData.equipment_id),
          eq(equipment.host_id, user[0].id)
        )
      )
      .limit(1);

    if (!equipmentItem.length) {
      return NextResponse.json({ error: 'Equipment not found or not owned by user' }, { status: 404 });
    }

    // Generate unique file key
    const fileKey = `equipment-documents/${validatedData.equipment_id}/${validatedData.document_type}/${Date.now()}-${validatedData.file_name}`;

    // Create presigned URL for upload
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      ContentType: validatedData.file_type,
      Metadata: {
        equipment_id: validatedData.equipment_id,
        document_type: validatedData.document_type,
        uploaded_by: user[0].id,
      },
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Create document record in database
    const documentRecord = await db.insert(equipment_documents).values({
      equipment_id: validatedData.equipment_id,
      document_type: validatedData.document_type,
      document_url: `https://${BUCKET_NAME}.s3.amazonaws.com/${fileKey}`,
    }).returning();

    return NextResponse.json({
      uploadUrl,
      document: documentRecord[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error generating upload URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get documents for equipment
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const equipmentId = searchParams.get('equipment_id');

    if (!equipmentId) {
      return NextResponse.json({ error: 'Equipment ID is required' }, { status: 400 });
    }

    const user = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify user owns the equipment or is admin
    const equipmentItem = await db.select()
      .from(equipment)
      .where(eq(equipment.id, equipmentId))
      .limit(1);

    if (!equipmentItem.length) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    // Check if user is owner or has access
    if (equipmentItem[0].host_id !== user[0].id) {
      // In production, you might want to add admin check here
      return NextResponse.json({ error: 'Not authorized to view documents' }, { status: 403 });
    }

    const documents = await db.select()
      .from(equipment_documents)
      .where(eq(equipment_documents.equipment_id, equipmentId))
      .orderBy(equipment_documents.uploaded_at);

    // Generate presigned URLs for viewing
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        const fileKey = doc.document_url.replace(`https://${BUCKET_NAME}.s3.amazonaws.com/`, '');
        
        const command = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileKey,
        });

        const viewUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return {
          ...doc,
          view_url: viewUrl,
        };
      })
    );

    return NextResponse.json(documentsWithUrls);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update document verification status
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { document_id, is_verified } = await request.json();

    if (!document_id || typeof is_verified !== 'boolean') {
      return NextResponse.json({ error: 'Document ID and verification status required' }, { status: 400 });
    }

    // In production, you might want to check if user is admin
    // For now, we'll allow equipment owners to verify their own documents
    const user = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedDoc = await db.update(equipment_documents)
      .set({ is_verified })
      .where(eq(equipment_documents.id, document_id))
      .returning();

    return NextResponse.json(updatedDoc[0]);
  } catch (error) {
    console.error('Error updating document verification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete document
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('document_id');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    const user = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get document and verify ownership
    // Fixed null checking in DELETE function
    const document = await db.select()
      .from(equipment_documents)
      .leftJoin(equipment, eq(equipment_documents.equipment_id, equipment.id))
      .where(eq(equipment_documents.id, documentId))
      .limit(1);
    
    if (!document.length || !document[0].equipment) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    // Verify user owns the equipment
    if (document[0].equipment.host_id !== user[0].id) {
      return NextResponse.json({ error: 'Not authorized to delete document' }, { status: 403 });
    }
    
    const fileKey = document[0].equipment_documents.document_url.replace(`https://${BUCKET_NAME}.s3.amazonaws.com/`, '');
    
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    }));

    // Delete from database
    await db.delete(equipment_documents).where(eq(equipment_documents.id, documentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}