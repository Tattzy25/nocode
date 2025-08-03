'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Star, MapPin, Calendar, Users, Shield, Clock, Check, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { MapLocation } from '@/lib/mapbox'
import ErrorPopup from '@/components/ErrorPopup'

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
})

interface Equipment {
  id: string
  title: string
  description: string
  type: string
  subtype: string
  location: string
  daily_price: number
  weekly_price: number
  monthly_price: number
  images: string[]
  features: string[]
  specifications: Record<string, string>
  host: {
    name: string
    avatar?: string
    rating: number
    total_reviews: number
    member_since: string
  }
  availability: Array<{
    date: string
    available: boolean
  }>
}

export default function EquipmentDetailPage() {
  const params = useParams()
  const equipmentId = params.id as string
  
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [error, setError] = useState<{ message: string; code?: string } | null>(null)

  useEffect(() => {
    fetchEquipment()
  }, [equipmentId])

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`/api/equipment/${equipmentId}`)
      const data = await response.json()
      setEquipment(data.equipment || data)
    } catch (error) {
      setError({
        message: error instanceof Error ? error.message : 'Failed to fetch equipment details',
        code: 'EQUIPMENT_FETCH_ERROR'
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !equipment) return 0
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    if (days <= 0) return 0
    
    let price = equipment.daily_price * days
    
    if (days >= 7 && equipment.weekly_price) {
      price = equipment.weekly_price * Math.ceil(days / 7)
    }
    
    if (days >= 30 && equipment.monthly_price) {
      price = equipment.monthly_price * Math.ceil(days / 30)
    }
    
    return price
  }

  const handleBooking = () => {
    if (!startDate || !endDate) {
      setError({
        message: 'Please select rental dates before proceeding',
        code: 'BOOKING_VALIDATION_ERROR'
      })
      return
    }
    
    setError({
      message: `Booking request sent for ${equipment?.title} from ${startDate} to ${endDate}. Total: $${calculateTotalPrice()}`,
      code: 'BOOKING_SUCCESS'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
              </div>
              <div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Location</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center text-gray-700 mb-2">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{equipment.location}</span>
              </div>
            </div>
            <MapComponent
              locations={[{
                id: equipment.id,
                title: equipment.title,
                description: equipment.description,
                latitude: equipment.latitude || 34.0522,
                longitude: equipment.longitude || -118.2437,
                price: equipment.daily_price,
                type: equipment.equipment_type,
                image: equipment.images?.[0],
                features: equipment.features
              }]}
              showSearch={false}
              className="h-64 rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Equipment not found</h1>
          <Link href="/search" className="text-primary-600 hover:text-primary-700">
            Back to search
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <ErrorPopup 
        error={error}
        onClose={() => setError(null)}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/search" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="relative h-96">
                  {equipment.images && equipment.images[selectedImage] ? (
                    <img
                      src={equipment.images[selectedImage]}
                      alt={equipment.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
                
                {equipment.images && equipment.images.length > 1 && (
                  <div className="flex space-x-2 p-4">
                    {equipment.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 rounded overflow-hidden border-2 ${
                          selectedImage === index ? 'border-primary-600' : 'border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${equipment.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Title and Description */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{equipment.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-1" />
                {equipment.location}
              </div>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600">{equipment.host?.rating || 4.8} ({equipment.host?.total_reviews || 125} reviews)</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{equipment.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.features?.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                )) || (
                  <div className="text-gray-500">No features listed</div>
                )}
              </div>
            </div>

            {/* Specifications */}
            {equipment.specifications && Object.keys(equipment.specifications).length > 0 && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
                <div className="space-y-3">
                  {Object.entries(equipment.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-gray-900 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Host Info */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Hosted by {equipment.host?.name || 'Anonymous'}</h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {equipment.host?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                      {equipment.host?.rating || 4.8} ({equipment.host?.total_reviews || 125} reviews)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Member since {equipment.host?.member_since || '2023'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg sticky top-4">
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">${equipment.daily_price}</span>
                  <span className="text-gray-600 ml-1">/day</span>
                </div>
                {equipment.weekly_price && (
                  <div className="text-sm text-gray-600">
                    ${equipment.weekly_price}/week • ${equipment.monthly_price}/month
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {startDate && endDate && (
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Total</span>
                    <span className="font-semibold">${calculateTotalPrice()}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700"
              >
                Request to book
              </button>

              <div className="mt-4 text-center">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-1" />
                  <span>You won't be charged yet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}