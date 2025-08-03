export const MAPBOX_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-118.2437, 34.0522] as [number, number], // Los Angeles
  zoom: 10,
  maxZoom: 18,
  minZoom: 3,
};

export interface MapLocation {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  price?: number;
  type?: string;
  image?: string;
  features?: string[];
}

export interface GeocodeResult {
  place_name: string;
  center: [number, number];
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

export const formatLocation = (location: MapLocation) => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [location.longitude, location.latitude],
  },
  properties: {
    id: location.id,
    title: location.title,
    description: location.description,
    price: location.price,
    type: location.type,
    image: location.image,
    features: location.features,
  },
});

export const createGeoJSONSource = (locations: MapLocation[]) => ({
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: locations.map(formatLocation),
  },
});

// Search Box API interfaces for better hotel/theme park search
export interface SearchSuggestion {
  name: string;
  name_preferred?: string;
  mapbox_id: string;
  feature_type: string;
  address?: string;
  full_address?: string;
  place_formatted: string;
  context: {
    country?: { name: string; country_code: string };
    region?: { name: string; region_code: string };
    place?: { name: string };
    locality?: { name: string };
    neighborhood?: { name: string };
  };
  poi_category?: string[];
  poi_category_ids?: string[];
  distance?: number;
  eta?: number;
}

export interface SearchBoxResult {
  suggestions: SearchSuggestion[];
  attribution: string;
}

export interface RetrieveResult {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    name: string;
    name_preferred?: string;
    mapbox_id: string;
    feature_type: string;
    address?: string;
    full_address?: string;
    place_formatted: string;
    context: any;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    poi_category?: string[];
    poi_category_ids?: string[];
  };
}

// Enhanced search using Search Box API for hotels, theme parks, and tourist attractions
export const searchBoxSuggest = async (
  query: string, 
  sessionToken: string,
  options: {
    proximity?: [number, number];
    country?: string;
    poiCategories?: string[];
    limit?: number;
  } = {}
): Promise<SearchBoxResult> => {
  if (!MAPBOX_CONFIG.accessToken) {
    throw new Error('Mapbox access token is required');
  }

  const params = new URLSearchParams({
    q: query,
    access_token: MAPBOX_CONFIG.accessToken,
    session_token: sessionToken,
    language: 'en',
    limit: (options.limit || 8).toString(),
    types: 'poi,address,place,locality,neighborhood'
  });

  // Add proximity for better local results
  if (options.proximity) {
    params.append('proximity', `${options.proximity[0]},${options.proximity[1]}`);
  }

  // Focus on US locations (can be made configurable)
  if (options.country) {
    params.append('country', options.country);
  }

  // Filter by POI categories for hotels, theme parks, etc.
  if (options.poiCategories && options.poiCategories.length > 0) {
    params.append('poi_category', options.poiCategories.join(','));
  }

  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/suggest?${params}`
  );

  if (!response.ok) {
    throw new Error(`Search Box API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const searchBoxRetrieve = async (
  mapboxId: string,
  sessionToken: string
): Promise<RetrieveResult> => {
  if (!MAPBOX_CONFIG.accessToken) {
    throw new Error('Mapbox access token is required');
  }

  const params = new URLSearchParams({
    access_token: MAPBOX_CONFIG.accessToken,
    session_token: sessionToken
  });

  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?${params}`
  );

  if (!response.ok) {
    throw new Error(`Retrieve API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

// Utility to generate session tokens for billing optimization
export const generateSessionToken = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Legacy geocoding function (keeping for backward compatibility)
export const mapboxGeocode = async (query: string): Promise<GeocodeResult[]> => {
  if (!MAPBOX_CONFIG.accessToken) {
    throw new Error('Mapbox access token is required');
  }

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${MAPBOX_CONFIG.accessToken}&limit=5`
  );

  if (!response.ok) {
    throw new Error(`Failed to geocode location: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.features;
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  if (!MAPBOX_CONFIG.accessToken) {
    throw new Error('Mapbox access token is required');
  }

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_CONFIG.accessToken}&limit=1`
  );

  if (!response.ok) {
    throw new Error(`Failed to reverse geocode: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.features || data.features.length === 0) {
    throw new Error('No location found for the given coordinates');
  }
  return data.features[0].place_name;
};