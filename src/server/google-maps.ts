type PlaceSuggestion = { placeId: string; text: string; mainText: string; secondaryText: string };
export type ResolvedPlace = { placeId: string; formattedAddress: string; latitude: number; longitude: number };
export type DeliveryRoute = { distanceMeters: number; durationSeconds: number; travelMode: 'TWO_WHEELER' | 'DRIVE' };

const PLACES_BASE = 'https://places.googleapis.com/v1';
const ROUTES_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';

function mapsConfig() {
  if (process.env.MAPS_TEST_MODE === 'true' && process.env.NODE_ENV !== 'production') return { test: true as const, key: '', origin: { latitude: -1.3001, longitude: 36.8001 } };
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const latitude = Number(process.env.WAREHOUSE_LAT);
  const longitude = Number(process.env.WAREHOUSE_LNG);
  if (!key || !Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error('Delivery maps are not configured.');
  return { test: false as const, key, origin: { latitude, longitude } };
}

async function googleFetch(url: string, init: RequestInit, timeoutMs = 8_000) {
  const response = await fetch(url, { ...init, redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) throw new Error(`Google Maps request failed with HTTP ${response.status}.`);
  return response;
}

export async function autocompletePlaces(input: string, sessionToken: string): Promise<PlaceSuggestion[]> {
  const query = input.trim();
  if (query.length < 3 || query.length > 160 || sessionToken.length < 16 || sessionToken.length > 80) return [];
  const config = mapsConfig();
  if (config.test) return [{ placeId: 'test-place-kilimani', text: `${query}, Nairobi, Kenya`, mainText: query, secondaryText: 'Nairobi, Kenya' }];
  const response = await googleFetch(`${PLACES_BASE}/places:autocomplete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': config.key,
      'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat',
    },
    body: JSON.stringify({ input: query, sessionToken, includedRegionCodes: ['ke'], languageCode: 'en' }),
  });
  const data = await response.json() as { suggestions?: Array<{ placePrediction?: { placeId?: string; text?: { text?: string }; structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } } } }> };
  return (data.suggestions ?? []).flatMap(({ placePrediction }) => placePrediction?.placeId && placePrediction.text?.text ? [{
    placeId: placePrediction.placeId,
    text: placePrediction.text.text,
    mainText: placePrediction.structuredFormat?.mainText?.text ?? placePrediction.text.text,
    secondaryText: placePrediction.structuredFormat?.secondaryText?.text ?? '',
  }] : []).slice(0, 5);
}

export async function resolvePlace(placeId: string, sessionToken?: string): Promise<ResolvedPlace> {
  if (!/^[A-Za-z0-9_-]{8,300}$/.test(placeId)) throw new Error('Invalid place selection.');
  const config = mapsConfig();
  if (config.test) return { placeId, formattedAddress: 'Kilimani, Nairobi, Kenya', latitude: -1.2921, longitude: 36.7849 };
  const url = new URL(`${PLACES_BASE}/places/${encodeURIComponent(placeId)}`);
  if (sessionToken) url.searchParams.set('sessionToken', sessionToken);
  const response = await googleFetch(url.toString(), {
    headers: { 'X-Goog-Api-Key': config.key, 'X-Goog-FieldMask': 'id,formattedAddress,location' },
  });
  const data = await response.json() as { id?: string; formattedAddress?: string; location?: { latitude?: number; longitude?: number } };
  const latitude = data.location?.latitude;
  const longitude = data.location?.longitude;
  if (!data.id || !data.formattedAddress || !Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error('Google Maps returned an incomplete place.');
  return { placeId: data.id, formattedAddress: data.formattedAddress, latitude: latitude as number, longitude: longitude as number };
}

async function requestRoute(destination: { latitude: number; longitude: number }, travelMode: 'TWO_WHEELER' | 'DRIVE'): Promise<DeliveryRoute> {
  const config = mapsConfig();
  if (config.test) return { distanceMeters: 9_800, durationSeconds: 1_200, travelMode };
  const response = await googleFetch(ROUTES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': config.key,
      'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration',
    },
    body: JSON.stringify({
      origin: { location: { latLng: config.origin } },
      destination: { location: { latLng: destination } },
      travelMode,
      routingPreference: 'TRAFFIC_UNAWARE',
      languageCode: 'en-US',
      units: 'METRIC',
    }),
  });
  const data = await response.json() as { routes?: Array<{ distanceMeters?: number; duration?: string }> };
  const route = data.routes?.[0];
  const durationSeconds = Number(route?.duration?.replace(/s$/, ''));
  if (!Number.isInteger(route?.distanceMeters) || !Number.isFinite(durationSeconds)) throw new Error('No delivery route was found.');
  return { distanceMeters: route!.distanceMeters!, durationSeconds, travelMode };
}

export async function routeFromWarehouse(destination: { latitude: number; longitude: number }): Promise<DeliveryRoute> {
  if (!Number.isFinite(destination.latitude) || !Number.isFinite(destination.longitude) || destination.latitude < -90 || destination.latitude > 90 || destination.longitude < -180 || destination.longitude > 180) throw new Error('Invalid delivery coordinates.');
  try {
    return await requestRoute(destination, 'TWO_WHEELER');
  } catch (error) {
    if (error instanceof Error && /No delivery route|HTTP 400|HTTP 404/.test(error.message)) return requestRoute(destination, 'DRIVE');
    throw error;
  }
}
