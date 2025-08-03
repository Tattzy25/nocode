'use client';

import { useState, useEffect, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl';
import { MapPin, DollarSign, Star } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG, MapLocation, mapboxGeocode } from '@/lib/mapbox';
import ErrorPopup from './ErrorPopup';

interface MapComponentProps {
  locations?: MapLocation[];
  center?: [number, number];
  zoom?: number;
  showSearch?: boolean;
  onLocationSelect?: (location: MapLocation) => void;
  interactive?: boolean;
  className?: string;
}

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

export default function MapComponent({
  locations = [],
  center = MAPBOX_CONFIG.center,
  zoom = MAPBOX_CONFIG.zoom,
  showSearch = false,
  onLocationSelect,
  interactive = true,
  className = 'h-96',
}: MapComponentProps) {
  const [viewState, setViewState] = useState<ViewState>({
    longitude: center[0],
    latitude: center[1],
    zoom: zoom,
  });
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await mapboxGeocode(query);
      setSearchResults(results);
    } catch (error) {
      setError({
        message: error instanceof Error ? error.message : 'Failed to search location',
        code: 'MAPBOX_SEARCH_ERROR'
      });
    }
  };

  const handleSearchSelect = (result: any) => {
    const [longitude, latitude] = result.center;
    setViewState({
      longitude,
      latitude,
      zoom: 12,
    });
    setSearchResults([]);
    setSearchQuery(result.place_name);
  };

  const getUserLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setViewState({
            longitude,
            latitude,
            zoom: 12,
          });
        },
        (error) => {
          setError({
            message: 'Unable to access your location. Please check your browser settings.',
            code: `GEOLOCATION_${error.code}`
          });
        }
      );
    } else {
      setError({
        message: 'Geolocation is not supported by your browser',
        code: 'GEOLOCATION_NOT_SUPPORTED'
      });
    }
  }, []);

  useEffect(() => {
    if (locations.length > 0 && !center) {
      const firstLocation = locations[0];
      setViewState({
        longitude: firstLocation.longitude,
        latitude: firstLocation.latitude,
        zoom: 11,
      });
    }
  }, [locations, center]);



  return (
    <div className="relative">
      <ErrorPopup 
        error={error}
        onClose={() => setError(null)}
      />
      {showSearch && (
        <div className="absolute top-4 left-4 z-10 w-80">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={getUserLocation}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              title="Use my location"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchSelect(result)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="text-sm font-medium">{result.place_name}</div>
                  <div className="text-xs text-gray-500">{result.properties?.category || 'Location'}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={MAPBOX_CONFIG.style}
        mapboxAccessToken={MAPBOX_CONFIG.accessToken}
        style={{ width: '100%', height: className }}
        interactive={interactive}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-right"
          onGeolocate={(e) => {
            const { latitude, longitude } = e.coords;
            setUserLocation([longitude, latitude]);
          }}
        />

        {locations.map((location) => (
          <Marker
            key={location.id}
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="bottom"
            onClick={() => {
              setSelectedLocation(location);
              if (onLocationSelect) {
                onLocationSelect(location);
              }
            }}
          >
            <div className="relative cursor-pointer">
              <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-primary-700 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white rounded-lg shadow-lg p-2 text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                <div className="font-semibold">{location.title}</div>
                {location.price && (
                  <div className="text-primary-600 font-bold">${location.price}/day</div>
                )}
              </div>
            </div>
          </Marker>
        ))}

        {selectedLocation && (
          <Popup
            longitude={selectedLocation.longitude}
            latitude={selectedLocation.latitude}
            anchor="top"
            onClose={() => setSelectedLocation(null)}
            closeButton={true}
          >
            <div className="p-4 max-w-sm">
              {selectedLocation.image && (
                <img
                  src={selectedLocation.image}
                  alt={selectedLocation.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              )}
              <h3 className="font-semibold text-lg mb-1">{selectedLocation.title}</h3>
              {selectedLocation.description && (
                <p className="text-sm text-gray-600 mb-2">{selectedLocation.description}</p>
              )}
              <div className="flex items-center justify-between">
                {selectedLocation.price && (
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-primary-600 mr-1" />
                    <span className="font-bold text-primary-600">${selectedLocation.price}/day</span>
                  </div>
                )}
                {selectedLocation.type && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {selectedLocation.type}
                  </span>
                )}
              </div>
            </div>
          </Popup>
        )}

        {userLocation && (
          <Marker
            longitude={userLocation[0]}
            latitude={userLocation[1]}
            anchor="center"
          >
            <div className="relative">
              <div className="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </Marker>
        )}
      </Map>
    </div>
  );
}