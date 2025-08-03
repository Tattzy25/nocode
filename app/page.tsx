'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Calendar, Shield, Clock, Award, Star } from 'lucide-react'
import LocationSearch from '@/components/LocationSearch'
import Link from 'next/link'
import ErrorPopup from '@/components/ErrorPopup'

interface Equipment {
  id: string
  title: string
  type: string
  subtype: string
  location: string
  daily_price: number
  images: string[]
  features: string[]
}

export default function HomePage() {
  const [searchLocation, setSearchLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [featuredScooters, setFeaturedScooters] = useState<Equipment[]>([])
  const [featuredStrollers, setFeaturedStrollers] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ message: string; code?: string } | null>(null)

  useEffect(() => {
    fetchFeaturedEquipment()
  }, [])

  const fetchFeaturedEquipment = async () => {
    try {
      const response = await fetch('/api/equipment?limit=6')
      const data = await response.json()
      
      if (data.equipment) {
        const scooters = data.equipment.filter((item: Equipment) => item.type === 'scooter').slice(0, 3)
        const strollers = data.equipment.filter((item: Equipment) => item.type === 'stroller').slice(0, 3)
        
        setFeaturedScooters(scooters)
        setFeaturedStrollers(strollers)
      }
    } catch (error) {
      setError({
        message: error instanceof Error ? error.message : 'Failed to load featured equipment',
        code: 'FEATURED_FETCH_ERROR'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <ErrorPopup 
        error={error}
        onClose={() => setError(null)}
      />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Rent the perfect mobility solution
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              From mobility scooters to baby strollers, find exactly what you need from trusted local hosts
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Where
                  </label>
                  <LocationSearch 
                    onLocationSelect={(location) => {
                      // Redirect to search page with location parameters
                      window.location.href = `/search?lat=${location.latitude}&lng=${location.longitude}&radius=10`
                    }}
                    showMap={true}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Until
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <button className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 flex items-center justify-center">
                  <Search className="h-5 w-5 mr-2" />
                  Search scooters & strollers
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why choose Scoovio?
            </h2>
            <p className="text-lg text-gray-600">
              The world's largest peer-to-peer mobility rental marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fully insured</h3>
              <p className="text-gray-600">
                Every rental includes liability insurance and 24/7 roadside assistance
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible pickup</h3>
              <p className="text-gray-600">
                Choose from hundreds of convenient pickup locations or get delivery to your door
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality guaranteed</h3>
              <p className="text-gray-600">
                All scooters and strollers are thoroughly cleaned and inspected before every rental
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scooters */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured mobility scooters</h2>
            <Link href="/search?category=scooter" className="text-primary-600 hover:text-primary-700 font-medium">
              View all scooters →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredScooters.map((item) => (
                <Link href={`/equipment/${item.id}`} key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover-card-shadow transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    {item.images && item.images[0] && (
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold line-clamp-2">{item.title}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.8</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{item.location}</p>
                    <p className="text-lg font-bold text-gray-900">${item.daily_price}/day</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Strollers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Popular baby strollers</h2>
            <Link href="/search?category=stroller" className="text-primary-600 hover:text-primary-700 font-medium">
              View all strollers →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredStrollers.map((item) => (
                <Link href={`/equipment/${item.id}`} key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover-card-shadow transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    {item.images && item.images[0] && (
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold line-clamp-2">{item.title}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.8</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{item.location}</p>
                    <p className="text-lg font-bold text-gray-900">${item.daily_price}/day</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Become a Host CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Earn extra income with your mobility equipment
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            List your scooter or stroller and start earning money when you're not using it
          </p>
          <Link 
            href="/host"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Start hosting today
          </Link>
        </div>
      </section>
    </div>
  )
}