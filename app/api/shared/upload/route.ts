import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filename, contentType, bookingId, photoType } = await request.json()

    if (!filename || !contentType || !bookingId || !photoType) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate photo type
    if (!['before', 'after'].includes(photoType)) {
      return Response.json({ error: 'Invalid photo type. Must be "before" or "after"' }, { status: 400 })
    }

    // Validate content type
    if (!contentType.startsWith('image/')) {
      return Response.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    const client = new S3Client({ region: process.env.AWS_REGION })
    
    // Create a structured key for the S3 object
    const key = `bookings/${bookingId}/${photoType}/${userId}-${uuidv4()}-${filename}`

    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Conditions: [
        ['content-length-range', 0, 10485760], // up to 10 MB
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': contentType,
      },
      Expires: 600, // 10 minutes
    })

    return Response.json({ 
      url, 
      fields, 
      key,
      uploadUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    })
  } catch (error) {
    console.error('S3 Upload Error:', error)
    return Response.json({ error: 'Failed to create upload URL' }, { status: 500 })
  }
}