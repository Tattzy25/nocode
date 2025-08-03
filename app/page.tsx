'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Calendar, Shield, Clock, Award, Star, Users, CheckCircle, Zap } from 'lucide-react'
import LocationSearch from '@/components/LocationSearch'
import Link from 'next/link'
import ErrorPopup from '@/components/ErrorPopup'
import { getData, Equipment } from './actions'

export default function HomePage() {
  const [searchLocation, setSearchLocation] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<{name: string, lat: number, lng: number} | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [featuredScooters, setFeaturedScooters] = useState<Equipment[]>([])
  const [featuredStrollers, setFeaturedStrollers] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{
    message: string
    code?: string
    type?: 'error' | 'warning' | 'info'
  } | null>(null)

  const handleSearch = () => {
    if (!selectedLocation) {
      alert('Please select a location first')
      return
    }
    
    const searchParams = new URLSearchParams({
      lat: selectedLocation.lat.toString(),
      lng: selectedLocation.lng.toString(),
      radius: '10'
    })
    
    if (startDate) {
      searchParams.append('startDate', startDate)
    }
    
    if (endDate) {
      searchParams.append('endDate', endDate)
    }
    
    window.location.href = `/search?${searchParams.toString()}`
   }

   useEffect(() => {
     fetchFeaturedEquipment()
   }, [])

  const fetchFeaturedEquipment = async () => {
    try {
      const data = await getData()
      
      if (data && data.length > 0) {
        const scooters = data.filter((item) => item.equipment_type === 'mobility_scooter').slice(0, 3)
        const strollers = data.filter((item) => item.equipment_type === 'baby_stroller').slice(0, 3)
        
        setFeaturedScooters(scooters)
        setFeaturedStrollers(strollers)
      }
    } catch (error) {
      console.error('Error fetching featured equipment:', error)
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
      
      {/* Hero Section - Turo-inspired */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Find the perfect
              <span className="block text-yellow-300">mobility solution</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover thousands of mobility scooters and baby strollers shared by local hosts in your neighborhood
            </p>
          </div>

          {/* Enhanced Search Bar - Turo Style */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-2">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                <div className="lg:col-span-2 p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Where
                  </label>
                  <LocationSearch 
                    onLocationSelect={(location) => {
                      setSelectedLocation(location)
                      setSearchLocation(location.name)
                    }}
                    placeholder="Where are you going?"
                  />
                </div>
                
                <div className="p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Start date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                    />
                  </div>
                </div>

                <div className="p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    End date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-4 pb-4">
                <button 
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-rose-600 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Search className="h-6 w-6 mr-3" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">Equipment available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Cities worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-blue-200">Happy customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Turo-inspired */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why millions choose Scoovio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join the world's largest peer-to-peer mobility rental marketplace trusted by families everywhere
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Fully protected</h3>
              <p className="text-gray-600 leading-relaxed">
                Every rental includes comprehensive insurance coverage, 24/7 customer support, and our Host Guarantee for complete peace of mind.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Trusted community</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with verified local hosts who care about your experience. Read reviews, see ratings, and book with confidence.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <Zap className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Instant booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Book instantly with thousands of available scooters and strollers. Skip the wait and get moving in minutes.
              </p>
            </div>
          </div>

          {/* Additional benefits */}
          <div className="mt-20 bg-gray-50 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  More than just rentals
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Flexible pickup & delivery</h4>
                      <p className="text-gray-600">Choose from contactless pickup or convenient delivery to your location</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Quality guaranteed</h4>
                      <p className="text-gray-600">All equipment is professionally cleaned and inspected before every rental</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">24/7 support</h4>
                      <p className="text-gray-600">Get help whenever you need it with our round-the-clock customer service</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
                <div className="text-5xl font-bold mb-2">4.8★</div>
                <div className="text-xl mb-4">Average rating</div>
                <div className="text-blue-100">Based on 50,000+ reviews from verified renters</div>
              </div>
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
              featuredScooters.map((scooter) => (
                <Link href={`/equipment/${scooter.id}`} key={scooter.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover-card-shadow transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    {(() => {
                      try {
                        const images = scooter.images ? JSON.parse(scooter.images) : [];
                        return images[0] && (
                          <img 
                            src={images[0]} 
                            alt={scooter.title}
                        className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                        );
                      } catch (error) {
                        console.error('Error parsing images for scooter:', scooter.id, error);
                        return null;
                      }
                    })()}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold line-clamp-2">{scooter.title}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.8</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{scooter.location}</p>
                    <p className="text-lg font-bold text-gray-900">${scooter.daily_price}/day</p>
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
              featuredStrollers.map((stroller) => (
                <Link href={`/equipment/${stroller.id}`} key={stroller.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover-card-shadow transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    {(() => {
                      try {
                        const images = stroller.images ? JSON.parse(stroller.images) : [];
                        return images[0] && (
                          <img 
                            src={images[0]} 
                            alt={stroller.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        );
                      } catch (error) {
                        console.error('Error parsing images for stroller:', stroller.id, error);
                        return null;
                      }
                    })()}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold line-clamp-2">{stroller.title}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.8</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{stroller.location}</p>
                    <p className="text-lg font-bold text-gray-900">${stroller.daily_price}/day</p>
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