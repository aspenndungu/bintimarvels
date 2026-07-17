import { describe, expect, it, vi } from 'vitest';
import { startCheckout } from './orders';

vi.mock('./db', () => ({ database: () => { throw new Error('database should be injected in integration tests'); } }));

describe('checkout launch gate', () => {
  it('refuses to start commerce until explicitly enabled', async () => {
    process.env.COMMERCE_ENABLED = 'false';
    const paymentClient = { submitOrder: vi.fn() } as never;
    await expect(startCheckout({} as never, paymentClient)).rejects.toThrow(/not yet enabled/);
    expect((paymentClient as { submitOrder: ReturnType<typeof vi.fn> }).submitOrder).not.toHaveBeenCalled();
  });
});
