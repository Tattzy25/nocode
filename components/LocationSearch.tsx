'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, Loader2, Navigation } from 'lucide-react'
import { ErrorPopup } from './ErrorPopup'

interface LocationSuggestion {
  id: string
  place_name: string
  center: [number, number]
  place_type: string[]
  properties: {
    short_code?: string
  }
}

interface LocationSearchProps {
  onLocationSelect: (location: { name: string; lat: number; lng: number }) => void
  placeholder?: string
  className?: string
}

export default function LocationSearch({ 
  onLocationSelect, 
  placeholder = "Where are you going?",
  className = ""
}: LocationSearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchLocations = async (searchQuery: string) => {
    if (!searchQuery.trim() || !MAPBOX_TOKEN) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Enhanced search with multiple types and better parameters
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
        new URLSearchParams({
          access_token: MAPBOX_TOKEN,
          limit: '8',
          types: 'country,region,postcode,district,place,locality,neighborhood,address,poi',
          language: 'en',
          autocomplete: 'true'
        })
      )

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`)
      }

      const data = await response.json()
      setSuggestions(data.features || [])
      setShowSuggestions(true)
    } catch (err) {
      console.error('Location search error:', err)
      setError('Failed to search locations. Please try again.')
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.length > 2) {
      searchLocations(value)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const [lng, lat] = suggestion.center
    setQuery(suggestion.place_name)
    setSuggestions([])
    setShowSuggestions(false)
    onLocationSelect({
      name: suggestion.place_name,
      lat,
      lng
    })
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setIsGettingLocation(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Reverse geocoding to get location name
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
            new URLSearchParams({
              access_token: MAPBOX_TOKEN!,
              types: 'address,poi,place,locality'
            })
          )

          if (response.ok) {
            const data = await response.json()
            const locationName = data.features[0]?.place_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            setQuery(locationName)
            onLocationSelect({
              name: locationName,
              lat: latitude,
              lng: longitude
            })
          } else {
            throw new Error('Failed to get location name')
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err)
          const locationName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          setQuery(locationName)
          onLocationSelect({
            name: locationName,
            lat: latitude,
            lng: longitude
          })
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        setIsGettingLocation(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location services.')
            break
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.')
            break
          case error.TIMEOUT:
            setError('Location request timed out.')
            break
          default:
            setError('An unknown error occurred while getting location.')
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-500" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
          style={{ color: '#111827' }} // Ensure text is always dark
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {isLoading && (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin mr-3" />
          )}
          
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="mr-3 p-1 text-gray-500 hover:text-primary-600 disabled:opacity-50"
            title="Use current location"
          >
            {isGettingLocation ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Navigation className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left text-gray-900 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.place_name}
                  </div>
                  {suggestion.place_type && (
                    <div className="text-xs text-gray-500 capitalize">
                      {suggestion.place_type.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Error popup */}
      {error && (
        <ErrorPopup
          message={error}
          type="error"
          onClose={() => setError(null)}
          autoClose={5000}
        />
      )}
    </div>
  )
}