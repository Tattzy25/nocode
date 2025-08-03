'use client'

import { useState, useEffect } from 'react'
import { Calendar, DollarSign, TrendingUp, Clock, Star, MessageCircle, Settings, Plus, Eye, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import ErrorPopup from '@/components/ErrorPopup'

interface Equipment {
  id: string
  title: string
  type: string
  daily_price: number
  location: string
  bookings_count: number
  status: string
  images: string[]
}

interface Booking {
  id: string
  renter_name: string
  equipment_title: string
  start_date: string
  end_date: string
  total_amount: number
  status: string
}

interface Stats {
  totalEarnings: number
  thisMonth: number
  activeListings: number
  upcomingTrips: number
  rating: number
  totalReviews: number
}

export default function HostDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<Stats>({
    totalEarnings: 0,
    thisMonth: 0,
    activeListings: 0,
    upcomingTrips: 0,
    rating: 4.8,
    totalReviews: 0
  })
  const [listings, setListings] = useState<Equipment[]>([])
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ message: string; code?: string } | null>(null)

  useEffect(() => {
    fetchHostData()
  }, [])

  const fetchHostData = async () => {
    try {
      // Fetch host equipment
      const equipmentResponse = await fetch('/api/host/equipment')
      const equipmentData = await equipmentResponse.json()
      setListings(equipmentData.equipment || [])

      // Fetch host bookings
      const bookingsResponse = await fetch('/api/host/bookings')
      const bookingsData = await bookingsResponse.json()
      setRecentBookings(bookingsData.bookings || [])

      // Calculate stats
      const totalEarnings = (equipmentData.equipment || []).reduce((sum: number, item: Equipment) => 
        sum + (item.bookings_count * item.daily_price), 0)
      
      setStats({
        totalEarnings: totalEarnings,
        thisMonth: Math.floor(totalEarnings * 0.3), // Mock this month
        activeListings: equipmentData.equipment?.length || 0,
        upcomingTrips: (bookingsData.bookings || []).filter((b: Booking) => b.status === 'confirmed').length,
        rating: 4.8,
        totalReviews: 47
      })

    } catch (error) {
      setError({
        message: error instanceof Error ? error.message : 'Failed to load host dashboard data',
        code: 'HOST_DASHBOARD_ERROR'
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteListing = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await fetch(`/api/equipment/${id}`, { method: 'DELETE' })
        fetchHostData()
      } catch (error) {
        setError({
          message: error instanceof Error ? error.message : 'Failed to delete listing',
          code: 'DELETE_LISTING_ERROR'
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                </div>
              ))}
            </div>
          </div>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your listings and track your earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This month</p>
                <p className="text-2xl font-bold text-gray-900">${stats.thisMonth}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-lg p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active listings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-lg p-3">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'listings', label: 'My Listings', icon: Settings },
                { id: 'bookings', label: 'Bookings', icon: Clock }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent bookings</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {recentBookings.length === 0 ? (
                      <div className="px-6 py-8 text-center">
                        <p className="text-gray-600">No bookings yet</p>
                      </div>
                    ) : (
                      recentBookings.map((booking) => (
                        <div key={booking.id} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gray-300 rounded-full mr-3"></div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{booking.renter_name}</p>
                                <p className="text-sm text-gray-500">{booking.equipment_title}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">${booking.total_amount}</p>
                              <p className="text-sm text-gray-500">{booking.start_date} - {booking.end_date}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/host/listings/new" className="border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50">
                      <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium">Add new listing</p>
                    </Link>
                    <button className="border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50">
                      <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium">Message guests</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">My Listings</h3>
                    <Link href="/host/listings/new" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {listings.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No listings yet. Start earning by adding your first equipment!</p>
                      <Link href="/host/listings/new" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
                        Add Your First Listing
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {listings.map((listing) => (
                        <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-200 rounded mr-4 relative overflow-hidden">
                              {listing.images && listing.images[0] && (
                                <img 
                                  src={listing.images[0]} 
                                  alt={listing.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{listing.title}</h4>
                              <p className="text-sm text-gray-600">${listing.daily_price}/day • {listing.bookings_count} bookings</p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {listing.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Link href={`/equipment/${listing.id}`} className="text-blue-600 hover:text-blue-800">
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link href={`/host/listings/${listing.id}/edit`} className="text-green-600 hover:text-green-800">
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button onClick={() => deleteListing(listing.id)} className="text-red-600 hover:text-red-800">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentBookings.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <p className="text-gray-600">No bookings yet</p>
                    </div>
                  ) : (
                    recentBookings.map((booking) => (
                      <div key={booking.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-300 rounded-full mr-3"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{booking.renter_name}</p>
                              <p className="text-sm text-gray-500">{booking.equipment_title}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">${booking.total_amount}</p>
                            <p className="text-sm text-gray-500">{booking.start_date} - {booking.end_date}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Occupancy rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response rate</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '95%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}