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