import type { DeliveryLocation } from '@/lib/commerce';
import { deliveryFeeForDistance } from '@/lib/commerce';
import { resolvePlace, routeFromWarehouse } from './google-maps';

export type ResolvedDeliveryQuote = {
  source: 'google_place' | 'map_pin';
  placeId: string | null;
  formattedAddress: string;
  landmark: string;
  destinationType: 'doorstep' | 'drop_off';
  latitude: number;
  longitude: number;
  distanceMeters: number;
  durationSeconds: number;
  travelMode: 'TWO_WHEELER' | 'DRIVE';
  feeKsh: number | null;
  bandLabel: string;
  manualQuote: boolean;
  tariffVersion: string;
};

export const DELIVERY_TARIFF_VERSION = 'preview-distance-bands-2026-07';

export async function resolveDeliveryQuote(delivery: DeliveryLocation): Promise<ResolvedDeliveryQuote> {
  const place = delivery.source === 'google_place' ? await resolvePlace(delivery.placeId, delivery.sessionToken) : {
    placeId: null,
    formattedAddress: delivery.formattedAddress,
    latitude: delivery.latitude,
    longitude: delivery.longitude,
  };
  const route = await routeFromWarehouse({ latitude: place.latitude, longitude: place.longitude });
  const price = deliveryFeeForDistance(route.distanceMeters);
  const approved = process.env.DELIVERY_RATE_CARD_APPROVED === 'true';
  return {
    source: delivery.source,
    placeId: place.placeId,
    formattedAddress: place.formattedAddress,
    landmark: delivery.landmark ?? '',
    destinationType: delivery.destinationType,
    latitude: place.latitude,
    longitude: place.longitude,
    distanceMeters: route.distanceMeters,
    durationSeconds: route.durationSeconds,
    travelMode: route.travelMode,
    feeKsh: approved ? price.feeKsh : null,
    bandLabel: price.bandLabel,
    manualQuote: !approved || price.manualQuote,
    tariffVersion: DELIVERY_TARIFF_VERSION,
  };
}
