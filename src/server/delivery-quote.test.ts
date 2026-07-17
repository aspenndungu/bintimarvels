import { afterEach, describe, expect, it } from 'vitest';
import { resolveDeliveryQuote } from './delivery-quote';

const delivery = {
  source: 'map_pin' as const,
  formattedAddress: 'ABC Plaza main gate',
  landmark: 'ABC Plaza main gate',
  destinationType: 'doorstep' as const,
  latitude: -1.2921,
  longitude: 36.7849,
};

const previous = {
  mapsTestMode: process.env.MAPS_TEST_MODE,
  rateApproved: process.env.DELIVERY_RATE_CARD_APPROVED,
};

afterEach(() => {
  if (previous.mapsTestMode === undefined) delete process.env.MAPS_TEST_MODE;
  else process.env.MAPS_TEST_MODE = previous.mapsTestMode;
  if (previous.rateApproved === undefined) delete process.env.DELIVERY_RATE_CARD_APPROVED;
  else process.env.DELIVERY_RATE_CARD_APPROVED = previous.rateApproved;
});

describe('delivery quote approval gate', () => {
  it('suppresses planning rates until the rate card is approved', async () => {
    process.env.MAPS_TEST_MODE = 'true';
    process.env.DELIVERY_RATE_CARD_APPROVED = 'false';
    await expect(resolveDeliveryQuote(delivery)).resolves.toMatchObject({ feeKsh: null, manualQuote: true });
  });

  it('returns the configured price only after approval', async () => {
    process.env.MAPS_TEST_MODE = 'true';
    process.env.DELIVERY_RATE_CARD_APPROVED = 'true';
    await expect(resolveDeliveryQuote(delivery)).resolves.toMatchObject({ feeKsh: 250, manualQuote: false });
  });
});
