'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Star, Heart, MessageCircle, CreditCard } from 'lucide-react'
import ErrorPopup from '@/components/ErrorPopup'

interface Booking {
  id: string
  equipment_title: string
  equipment_image: string
  location: string
  start_date: string
  end_date: string
  total_amount: number
  status: string
}

interface SavedItem {
  id: string
  title: string
  location: string
  daily_price: number
  image: string
  type: string
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [upcomingTrips, setUpcomingTrips] = useState<Booking[]>([])
  const [pastTrips, setPastTrips] = useState<Booking[]>([])
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ message: string; code?: string } | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, savedRes] = await Promise.all([
        fetch('/api/user/bookings'),
        fetch('/api/user/saved')
      ])

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setUpcomingTrips(bookingsData.upcoming || [])
        setPastTrips(bookingsData.past || [])
      }

      if (savedRes.ok) {
        const savedData = await savedRes.json()
        setSavedItems(savedData.saved || [])
      }
    } catch (error) {
      setError({
        message: error instanceof Error ? error.message : 'Failed to load dashboard data',
        code: 'DASHBOARD_FETCH_ERROR'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorPopup 
        error={error}
        onClose={() => setError(null)}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My trips</h1>
            <p className="text-gray-600 mt-2">Manage your bookings and track your rental history</p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'upcoming', label: 'Upcoming', count: upcomingTrips.length },
                  { id: 'past', label: 'Past', count: pastTrips.length },
                  { id: 'saved', label: 'Saved', count: savedItems.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              {upcomingTrips.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming trips</h3>
                  <p className="text-gray-600">Start exploring equipment to rent!</p>
                </div>
              )}
              {upcomingTrips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex">
                    <div className="w-64 h-48 bg-gray-200 flex-shrink-0">
                      <img src={trip.equipment_image} alt={trip.equipment_title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{trip.equipment_title}</h3>
                          <div className="flex items-center mt-1 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {trip.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${trip.total_amount}</p>
                          <p className="text-sm text-gray-500">Total</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{trip.start_date} - {trip.end_date}</span>
                        <span className="ml-4 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {trip.status}
                        </span>
                      </div>

                      <div className="mt-4 flex space-x-3">
                        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                          View trip details
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                          <MessageCircle className="h-4 w-4 inline mr-1" />
                          Message host
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'past' && (
            <div className="space-y-6">
              {pastTrips.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No past trips</h3>
                  <p className="text-gray-600">Your completed rentals will appear here.</p>
                </div>
              )}
              {pastTrips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex">
                    <div className="w-64 h-48 bg-gray-200 flex-shrink-0">
                      <img src={trip.equipment_image} alt={trip.equipment_title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{trip.equipment_title}</h3>
                          <div className="flex items-center mt-1 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {trip.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${trip.total_amount}</p>
                          <p className="text-sm text-gray-500">Total</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{trip.start_date} - {trip.end_date}</span>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center mb-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">Leave a review</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedItems.length === 0 && !loading && (
                <div className="text-center py-12 col-span-full">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved items</h3>
                  <p className="text-gray-600">Save equipment you like to easily find them later.</p>
                </div>
              )}
              {savedItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      {item.location}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-lg font-bold text-gray-900">${item.daily_price}</span>
                        <span className="text-sm text-gray-500">/day</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.type}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}