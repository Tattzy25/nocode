'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Calendar, MapPin, Clock, Camera, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PhotoUpload from '@/components/PhotoUpload'
import ErrorPopup from '@/components/ErrorPopup'

interface TripDetails {
  id: string
  equipment_title: string
  equipment_image: string
  location: string
  start_date: string
  end_date: string
  total_amount: number
  status: string
  host_name: string
  host_phone?: string
  pickup_instructions?: string
  before_photo_url?: string
  after_photo_url?: string
  trip_started: boolean
  trip_completed: boolean
}

interface ErrorState {
  message: string
  code: string
}

export default function TripPage() {
  const params = useParams()
  const { user } = useUser()
  const [trip, setTrip] = useState<TripDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorState | null>(null)
  const [tripStarted, setTripStarted] = useState(false)
  const [beforePhotoUploaded, setBeforePhotoUploaded] = useState(false)
  const [afterPhotoUploaded, setAfterPhotoUploaded] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchTripDetails()
    }
  }, [params.id])

  const fetchTripDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/bookings/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch trip details')
      }

      const data = await response.json()
      setTrip(data)
      setTripStarted(data.trip_started || false)
      setBeforePhotoUploaded(!!data.before_photo_url)
      setAfterPhotoUploaded(!!data.after_photo_url)
    } catch (error) {
      setError({
        message: 'Failed to load trip details. Please try again.',
        code: 'FETCH_ERROR'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStartTrip = async () => {
    if (!beforePhotoUploaded) {
      setError({
        message: 'Please upload a "before" photo to start your trip.',
        code: 'PHOTO_REQUIRED'
      })
      return
    }

    try {
      const response = await fetch(`/api/bookings/${params.id}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to start trip')
      }

      setTripStarted(true)
      setError({
        message: 'Trip started successfully! Enjoy your rental.',
        code: 'SUCCESS'
      })
    } catch (error) {
      setError({
        message: 'Failed to start trip. Please try again.',
        code: 'START_TRIP_ERROR'
      })
    }
  }

  const handleCompleteTrip = async () => {
    if (!afterPhotoUploaded) {
      setError({
        message: 'Please upload an "after" photo to complete your trip.',
        code: 'PHOTO_REQUIRED'
      })
      return
    }

    try {
      const response = await fetch(`/api/bookings/${params.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to complete trip')
      }

      setTrip(prev => prev ? { ...prev, trip_completed: true, status: 'completed' } : null)
      setError({
        message: 'Trip completed successfully! Thank you for using Scoovio.',
        code: 'SUCCESS'
      })
    } catch (error) {
      setError({
        message: 'Failed to complete trip. Please try again.',
        code: 'COMPLETE_TRIP_ERROR'
      })
    }
  }

  const handleBeforePhotoUpload = (imageUrl: string) => {
    setTrip(prev => prev ? { ...prev, before_photo_url: imageUrl } : null)
    setBeforePhotoUploaded(true)
    setError({
      message: 'Before photo uploaded successfully!',
      code: 'SUCCESS'
    })
  }

  const handleAfterPhotoUpload = (imageUrl: string) => {
    setTrip(prev => prev ? { ...prev, after_photo_url: imageUrl } : null)
    setAfterPhotoUploaded(true)
    setError({
      message: 'After photo uploaded successfully!',
      code: 'SUCCESS'
    })
  }

  const handlePhotoError = (errorMessage: string) => {
    setError({
      message: errorMessage,
      code: 'UPLOAD_ERROR'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip not found</h1>
          <p className="text-gray-600">The trip you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    )
  }

  const isToday = new Date().toDateString() === new Date(trip.start_date).toDateString()
  const canStartTrip = isToday && !tripStarted && beforePhotoUploaded
  const canCompleteTrip = tripStarted && !trip.trip_completed && afterPhotoUploaded

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorPopup 
        error={error}
        onClose={() => setError(null)}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex">
            <div className="w-80 h-64 bg-gray-200 flex-shrink-0">
              <img src={trip.equipment_image} alt={trip.equipment_title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{trip.equipment_title}</h1>
                  <div className="flex items-center mt-2 text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {trip.location}
                  </div>
                  <div className="flex items-center mt-1 text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {trip.start_date} - {trip.end_date}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${trip.total_amount}</p>
                  <p className="text-sm text-gray-500">Total</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                    trip.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    trip.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    trip.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trip.status}
                  </span>
                </div>
              </div>

              {/* Host Information */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Host Information</h3>
                <p className="text-sm text-gray-600">Host: {trip.host_name}</p>
                {trip.host_phone && (
                  <p className="text-sm text-gray-600">Phone: {trip.host_phone}</p>
                )}
                {trip.pickup_instructions && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Pickup Instructions:</p>
                    <p className="text-sm text-gray-600">{trip.pickup_instructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trip Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Trip Status</h2>
          
          <div className="space-y-4">
            {/* Step 1: Before Photo */}
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                beforePhotoUploaded ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {beforePhotoUploaded ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Camera className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Take "Before" Photo</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Take a photo of the equipment before starting your trip
                </p>
                {!beforePhotoUploaded && (
                  <PhotoUpload
                    bookingId={trip.id}
                    photoType="before"
                    onUploadComplete={handleBeforePhotoUpload}
                    onUploadError={handlePhotoError}
                    disabled={trip.trip_completed}
                  />
                )}
                {trip.before_photo_url && (
                  <div className="mt-2">
                    <img 
                      src={trip.before_photo_url} 
                      alt="Before photo" 
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Start Trip */}
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                tripStarted ? 'bg-green-100' : beforePhotoUploaded ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {tripStarted ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Start Trip</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {isToday ? 'Start your rental period' : 'Available on rental start date'}
                </p>
                {!tripStarted && (
                  <Button
                    onClick={handleStartTrip}
                    disabled={!canStartTrip}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {!isToday ? 'Not available yet' : 
                     !beforePhotoUploaded ? 'Upload before photo first' : 
                     'Start Trip'}
                  </Button>
                )}
                {tripStarted && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Trip started</span>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: After Photo */}
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                afterPhotoUploaded ? 'bg-green-100' : tripStarted ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {afterPhotoUploaded ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Camera className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Take "After" Photo</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Take a photo when returning the equipment
                </p>
                {tripStarted && !afterPhotoUploaded && (
                  <PhotoUpload
                    bookingId={trip.id}
                    photoType="after"
                    onUploadComplete={handleAfterPhotoUpload}
                    onUploadError={handlePhotoError}
                    disabled={trip.trip_completed}
                  />
                )}
                {trip.after_photo_url && (
                  <div className="mt-2">
                    <img 
                      src={trip.after_photo_url} 
                      alt="After photo" 
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Step 4: Complete Trip */}
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                trip.trip_completed ? 'bg-green-100' : afterPhotoUploaded ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <CheckCircle className={`h-5 w-5 ${trip.trip_completed ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Complete Trip</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Finalize your rental and leave a review
                </p>
                {!trip.trip_completed && (
                  <Button
                    onClick={handleCompleteTrip}
                    disabled={!canCompleteTrip}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {!tripStarted ? 'Start trip first' :
                     !afterPhotoUploaded ? 'Upload after photo first' :
                     'Complete Trip'}
                  </Button>
                )}
                {trip.trip_completed && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Trip completed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important</h3>
              <div className="mt-1 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>You must upload a "before" photo to start your trip</li>
                  <li>You must upload an "after" photo to complete your trip</li>
                  <li>Without proper photos, your trip cannot be processed and refunds may not be available</li>
                  <li>Contact your host if you have any issues during pickup or return</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}