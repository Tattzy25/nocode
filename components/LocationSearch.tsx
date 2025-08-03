'use client'

import { useState, useEffect } from 'react'
import { MapPin, Search, LocateFixed } from 'lucide-react'
import dynamic from 'next/dynamic'
import { MapLocation, mapboxGeocode } from '@/lib/mapbox'
import ErrorPopup from './ErrorPopup'

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
})

interface LocationSearchProps {
  onLocationSelect: (location: MapLocation) => void
  showMap?: boolean
}

export default function LocationSearch({ onLocationSelect, showMap = false }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [error, setError] = useState<{ message: string; code?: string } | null>(null)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const results = await mapboxGeocode(query)
      setSuggestions(results)
    } catch (error) {
      setError({
        message: error instanceof Error ? error.message : 'Failed to search location',
        code: 'LOCATION_SEARCH_ERROR'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = (location: MapLocation) => {
    setSelectedLocation(location)
    setSearchQuery(location.title)
    setSuggestions([])
    onLocationSelect(location)
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError({
        message: 'Geolocation is not supported by your browser',
        code: 'GEOLOCATION_NOT_SUPPORTED'
      })
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const location = await mapboxGeocode(`${longitude},${latitude}`)
          if (location.length > 0) {
            const userLoc = {
              id: 'user-location',
              title: 'Your Location',
              description: 'Current location',
              latitude,
              longitude,
              price: 0,
              type: 'location'
            }
            setUserLocation(userLoc)
            handleLocationSelect({
              id: 'user-location',
              title: location[0].place_name,
              description: 'Current location',
              latitude: latitude,
              longitude: longitude,
              price: 0,
              type: 'location'
            })
          }
        } catch (error) {
          setError({
            message: error instanceof Error ? error.message : 'Failed to get location details',
            code: 'REVERSE_GEOCODE_ERROR'
          })
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        setError({
          message: 'Unable to access your location. Please check your browser settings.',
          code: `GEOLOCATION_${error.code}`
        })
        setLoading(false)
      }
    )
  }

  return (
    <>
      <ErrorPopup 
        error={error}
        onClose={() => setError(null)}
      />
      <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="ml-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            title="Use current location"
          >
            <LocateFixed className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect({
                  id: suggestion.id || `suggestion-${index}`,
                  title: suggestion.place_name || suggestion.title,
                  description: suggestion.description,
                  latitude: suggestion.center ? suggestion.center[1] : suggestion.latitude,
                  longitude: suggestion.center ? suggestion.center[0] : suggestion.longitude,
                  price: 0,
                  type: 'search'
                })
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm">{suggestion.place_name || suggestion.title}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showMap && selectedLocation && (
        <div className="mt-4">
          <MapComponent
            locations={selectedLocation ? [selectedLocation] : []}
            showSearch={false}
            className="h-64 rounded-lg shadow-md"
            center={[selectedLocation.longitude, selectedLocation.latitude]}
          />
        </div>
      )}

      {userLocation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <MapPin className="inline h-4 w-4 mr-1" />
            Searching near your current location
          </p>
        </div>
      )}
    </div>
  )
}