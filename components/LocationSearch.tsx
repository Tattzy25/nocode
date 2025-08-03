'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, Loader2, Navigation } from 'lucide-react'
import ErrorPopup from './ErrorPopup'
import { searchBoxSuggest, searchBoxRetrieve, generateSessionToken, SearchSuggestion } from '../lib/mapbox'

interface LocationSearchProps {
  onLocationSelect: (location: { name: string; lat: number; lng: number }) => void
  placeholder?: string
  className?: string
  focusOnHotels?: boolean
  focusOnThemeParks?: boolean
  focusOnTouristAttractions?: boolean
}

export default function LocationSearch({ 
  onLocationSelect, 
  placeholder = "Where are you going?",
  className = "",
  focusOnHotels = false,
  focusOnThemeParks = false,
  focusOnTouristAttractions = false
}: LocationSearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [sessionToken] = useState(() => generateSessionToken())
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

  const getPOICategories = (): string[] => {
    const categories: string[] = []
    
    if (focusOnHotels) {
      categories.push('accommodation', 'lodging')
    }
    
    if (focusOnThemeParks) {
      categories.push('amusement_park', 'theme_park', 'entertainment')
    }
    
    if (focusOnTouristAttractions) {
      categories.push('tourist_attraction', 'museum', 'landmark', 'zoo', 'aquarium')
    }
    
    return categories
  }

  const searchLocations = async (searchQuery: string) => {
    if (!searchQuery.trim() || !MAPBOX_TOKEN) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const poiCategories = getPOICategories()
      
      const result = await searchBoxSuggest(searchQuery, sessionToken, {
        proximity: [-118.2437, 34.0522], // Default to LA area
        country: 'US',
        poiCategories: poiCategories.length > 0 ? poiCategories : undefined,
        limit: 8
      })

      setSuggestions(result.suggestions || [])
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

  const handleSuggestionClick = async (suggestion: SearchSuggestion) => {
    try {
      setIsLoading(true)
      
      // Retrieve full details including coordinates
      const details = await searchBoxRetrieve(suggestion.mapbox_id, sessionToken)
      
      const [lng, lat] = details.geometry.coordinates
      const displayName = suggestion.name_preferred || suggestion.name
      
      setQuery(displayName)
      setSuggestions([])
      setShowSuggestions(false)
      
      onLocationSelect({
        name: displayName,
        lat,
        lng
      })
    } catch (err) {
      console.error('Error retrieving location details:', err)
      setError('Failed to get location details. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
          // Use reverse geocoding to get location name
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

  const formatSuggestionDisplay = (suggestion: SearchSuggestion) => {
    const name = suggestion.name_preferred || suggestion.name
    const categories = suggestion.poi_category || []
    const isHotel = categories.some(cat => cat.includes('accommodation') || cat.includes('lodging') || cat.includes('hotel'))
    const isThemePark = categories.some(cat => cat.includes('amusement') || cat.includes('theme') || cat.includes('entertainment'))
    const isTouristAttraction = categories.some(cat => cat.includes('tourist') || cat.includes('attraction') || cat.includes('museum'))
    
    let typeIcon = '📍'
    if (isHotel) typeIcon = '🏨'
    else if (isThemePark) typeIcon = '🎢'
    else if (isTouristAttraction) typeIcon = '🎯'
    
    return { name, typeIcon, address: suggestion.place_formatted }
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
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="mr-3 p-1 text-gray-500 hover:text-blue-600 disabled:opacity-50"
            title="Use current location"
          >
            {isGettingLocation ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Navigation className="h-5 w-5" />
            )}
          </button>
          
          {isLoading && (
            <div className="mr-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => {
            const { name, typeIcon, address } = formatSuggestionDisplay(suggestion)
            return (
              <button
                key={suggestion.mapbox_id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start">
                  <span className="text-lg mr-3 flex-shrink-0">{typeIcon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {name}
                    </div>
                    {address && (
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {address}
                      </div>
                    )}
                    {suggestion.poi_category && suggestion.poi_category.length > 0 && (
                      <div className="text-xs text-blue-600 mt-1">
                        {suggestion.poi_category.slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Error popup */}
      {error && (
        <ErrorPopup
          error={{
            message: error,
            type: 'error'
          }}
          onClose={() => setError(null)}
          autoClose={true}
          duration={5000}
        />
      )}
    </div>
  )
}