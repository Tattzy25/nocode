import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ProfileImageProps {
  userId: string
  size?: number
  className?: string
  fallback?: string
}

export default function ProfileImage({ 
  userId, 
  size = 40, 
  className = '', 
  fallback = '/default-avatar.png' 
}: ProfileImageProps) {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!userId) {
      setImageUrl(fallback)
      setLoading(false)
      return
    }

    // Lazy-load profile image from CDN
    const cdnUrl = `https://cdn.clerk.com/users/${userId}/profile.jpg`
    
    const img = new window.Image()
    img.onload = () => {
      setImageUrl(cdnUrl)
      setLoading(false)
    }
    img.onerror = () => {
      setError(true)
      setImageUrl(fallback)
      setLoading(false)
    }
    img.src = cdnUrl

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [userId, fallback])

  if (loading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse rounded-full ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <Image
      src={imageUrl}
      alt="Profile"
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      loading="lazy"
      onError={() => {
        if (!error) {
          setError(true)
          setImageUrl(fallback)
        }
      }}
    />
  )
}