'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, MapPin, Calendar, Star, Filter, Heart, Map, List } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
interface MapLocation {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  price: number;
  type: string;
  image?: string;
  features: string[];
}
import LocationSearch from '@/components/LocationSearch'
import ErrorPopup from '@/components/ErrorPopup'

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
})

export default function SearchPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const searchParams = useSearchParams()
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = searchParams.get('radius') || '10'

  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [currentLocation, setCurrentLocation] = useState<MapLocation | null>(null)
  const [error, setError] = useState<{ message: string; code?: string; type?: 'error' | 'warning' | 'info' } | null>(null)

  useEffect(() => {
    fetchEquipment()
  }, [lat, lng, radius, selectedCategory, priceRange, selectedFeatures])

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      
      if (lat && lng) {
        params.append('lat', lat)
        params.append('lng', lng)
        params.append('radius', radius)
      }
      
      if (selectedCategory !== 'all') params.append('type', selectedCategory)
      if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString())
      if (priceRange[1] < 100) params.append('maxPrice', priceRange[1].toString())
      if (selectedFeatures.length > 0) params.append('features', selectedFeatures.join(','))

      const response = await fetch(`/api/equipment?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch equipment: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setMapLocations(data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        latitude: item.latitude || 34.0522,
        longitude: item.longitude || -118.2437,
        price: item.daily_price,
        type: item.equipment_type,
        image: item.images?.[0],
        features: item.features
      })))
      setResults(data)
    } catch (error) {
      setError({
        message: error instanceof Error ? error.message : 'Failed to load equipment',
        code: 'EQUIPMENT_FETCH_ERROR',
        type: 'error'
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
        autoClose={false}
      />
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  defaultValue="Los Angeles, CA"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  className="pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <span className="text-gray-500">→</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  className="pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button className="text-sm text-primary-600 hover:text-primary-700">Clear all</button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Location</h3>
                <LocationSearch
                  onLocationSelect={(location) => {
                    // Update URL with new location parameters
                    const newUrl = new URL(window.location.href)
                    newUrl.searchParams.set('lat', location.lat.toString())
                    newUrl.searchParams.set('lng', location.lng.toString())
                    newUrl.searchParams.set('radius', '10')
                    window.location.href = newUrl.toString()
                  }}
                />
                
                {lat && lng && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Searching within {radius}km of selected location
                    </p>
                    <button
                      onClick={() => {
                        const newUrl = new URL(window.location.href)
                        newUrl.searchParams.delete('lat')
                        newUrl.searchParams.delete('lng')
                        newUrl.searchParams.delete('radius')
                        window.location.href = newUrl.toString()
                      }}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Clear location filter
                    </button>
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    All items
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="scooter"
                      checked={selectedCategory === 'scooter'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    Mobility scooters
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="stroller"
                      checked={selectedCategory === 'stroller'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    Baby strollers
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price per day</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-medium mb-3">Features</h4>
                <div className="space-y-2">
                  {['foldable', 'lightweight', 'long-range', 'travel-system', 'all-terrain'].map((feature) => (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFeatures([...selectedFeatures, feature])
                          } else {
                            setSelectedFeatures(selectedFeatures.filter(f => f !== feature))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="capitalize">{feature.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                {loading ? 'Loading...' : `${results.length} scooters & strollers available`}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center px-3 py-1 rounded-md text-sm ${
                    viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center px-3 py-1 rounded-md text-sm ${
                    viewMode === 'map' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <Map className="h-4 w-4 mr-1" />
                  Map
                </button>
              </div>
            </div>

            {viewMode === 'map' ? (
              <div className="mb-6">
                <MapComponent
                  locations={mapLocations}
                  showSearch={true}
                  onLocationSelect={setSelectedLocation}
                  className="h-96 rounded-lg shadow-md"
                />
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : results.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-600">No equipment found matching your criteria.</p>
                </div>
              ) : (
                results.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
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
                        <div className="absolute top-2 right-2">
                          <button className="bg-white rounded-full p-2 shadow-md hover:shadow-lg">
                            <Heart className="h-5 w-5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {item.location}
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          4.8 (125 reviews)
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">${item.daily_price}</span>
                          <span className="text-gray-600 text-sm">/day</span>
                        </div>
                        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                          View details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300">
                Load more results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}