'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface PhotoUploadProps {
  bookingId: string
  photoType: 'before' | 'after'
  onUploadComplete: (imageUrl: string) => void
  onUploadError?: (error: string) => void
  disabled?: boolean
  className?: string
}

export default function PhotoUpload({
  bookingId,
  photoType,
  onUploadComplete,
  onUploadError,
  disabled = false,
  className = ''
}: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const selectedFile = files[0]
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        onUploadError?.('Please select an image file')
        return
      }

      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        onUploadError?.('File size must be less than 10MB')
        return
      }

      setFile(selectedFile)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      onUploadError?.('Please select a file to upload')
      return
    }

    setUploading(true)

    try {
      // Get presigned URL
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          bookingId,
          photoType
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get upload URL')
      }

      const { url, fields, uploadUrl } = await response.json()

      // Upload to S3
      const formData = new FormData()
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string)
      })
      formData.append('file', file)

      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3')
      }

      // Call success callback with the uploaded image URL
      onUploadComplete(uploadUrl)
      
      // Reset state
      setFile(null)
      setPreview(null)
      
    } catch (error) {
      console.error('Upload error:', error)
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-sm font-medium text-gray-700">
        {photoType === 'before' ? 'Before Trip Photo' : 'After Trip Photo'}
      </div>
      
      {!preview ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
            id={`photo-upload-${photoType}-${bookingId}`}
          />
          <label
            htmlFor={`photo-upload-${photoType}-${bookingId}`}
            className="cursor-pointer"
          >
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-2">
                <span className="text-blue-600 hover:text-blue-500">Click to upload</span>
                <span className="text-gray-500"> or drag and drop</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 10MB
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={preview}
              alt={`${photoType} trip photo preview`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={handleRemove}
              disabled={uploading}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <Button
            onClick={handleUpload}
            disabled={uploading || disabled}
            className="w-full"
          >
            {uploading ? 'Uploading...' : `Upload ${photoType} Photo`}
          </Button>
        </div>
      )}
    </div>
  )
}