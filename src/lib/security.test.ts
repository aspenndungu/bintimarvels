import { describe, expect, it } from 'vitest';
import { maskPhone, redactSecrets, safeEqual } from './security';

describe('security helpers', () => {
  it('redacts nested secrets', () => {
    expect(redactSecrets({ token: 'x', nested: { passkey: 'y', amount: 500 } })).toEqual({
      token: '[REDACTED]', nested: { passkey: '[REDACTED]', amount: 500 },
    });
  });
  it('masks customer phones in routine output', () => expect(maskPhone('254712345678')).toBe('25471***678'));
  it('compares callback tokens safely', () => {
    expect(safeEqual('abc', 'abc')).toBe(true);
    expect(safeEqual('abc', 'abd')).toBe(false);
    expect(safeEqual('short', 'longer')).toBe(false);
  });
});
