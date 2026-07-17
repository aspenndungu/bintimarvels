import { describe, expect, it } from 'vitest';
import { financeSignature } from './finance-handoff';
import { isPrivateNetworkAddress } from '@/lib/network-security';

describe('finance handoff signing', () => {
  it('is deterministic and changes when payload or secret changes', () => {
    const first = financeSignature('{"order":"1"}', 'secret-a');
    expect(first).toMatch(/^[a-f0-9]{64}$/);
    expect(financeSignature('{"order":"1"}', 'secret-a')).toBe(first);
    expect(financeSignature('{"order":"2"}', 'secret-a')).not.toBe(first);
    expect(financeSignature('{"order":"1"}', 'secret-b')).not.toBe(first);
  });

  it('blocks loopback, private, link-local and reserved finance destinations', () => {
    for (const address of ['127.0.0.1', '10.0.0.2', '172.16.0.1', '192.168.1.1', '169.254.169.254', '100.64.0.1', '198.51.100.2', '203.0.113.5', '::1', '::ffff:127.0.0.1', '::ffff:7f00:1', '0:0:0:0:0:ffff:a00:1', '::ffff:a00:1', 'fd00::1', 'fe80::1', '2001:db8::1']) {
      expect(isPrivateNetworkAddress(address), address).toBe(true);
    }
    expect(isPrivateNetworkAddress('8.8.8.8')).toBe(false);
    expect(isPrivateNetworkAddress('2606:4700:4700::1111')).toBe(false);
  });
});
