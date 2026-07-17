function parseIPv4(value: string) {
  const parts = value.split('.');
  if (parts.length !== 4 || parts.some((part) => !/^\d{1,3}$/.test(part))) return null;
  const octets = parts.map(Number);
  return octets.every((part) => part >= 0 && part <= 255) ? octets : null;
}

function mappedIPv4(value: string) {
  const normalized = value.toLowerCase().replace(/^\[|\]$/g, '').split('%')[0];
  const dotted = normalized.match(/^(?:::ffff:|0:0:0:0:0:ffff:)(\d+\.\d+\.\d+\.\d+)$/);
  if (dotted && parseIPv4(dotted[1])) return dotted[1];
  const hexadecimal = normalized.match(/^(?:::ffff:|0:0:0:0:0:ffff:)([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (!hexadecimal) return null;
  const high = Number.parseInt(hexadecimal[1], 16);
  const low = Number.parseInt(hexadecimal[2], 16);
  return `${high >>> 8}.${high & 255}.${low >>> 8}.${low & 255}`;
}

export function isPrivateNetworkAddress(address: string) {
  const value = address.toLowerCase().replace(/^\[|\]$/g, '').split('%')[0];
  const mapped = mappedIPv4(value);
  if (mapped) return isPrivateNetworkAddress(mapped);
  const ipv4 = parseIPv4(value);
  if (ipv4) {
    const [a, b] = ipv4;
    return a === 0 || a === 10 || a === 127 || a >= 224
      || (a === 100 && b >= 64 && b <= 127)
      || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && (b === 0 || b === 168))
      || (a === 198 && (b === 18 || b === 19 || b === 51))
      || (a === 203 && b === 0);
  }
  if (value.includes(':')) {
    return value === '::' || value === '::1' || /^f[cd]/.test(value)
      || /^fe[89ab]/.test(value) || value.startsWith('ff') || value.startsWith('2001:db8');
  }
  return false;
}

export function isApprovedPublicHttpsUrl(rawUrl: string, allowedHosts: string[]) {
  try {
    const endpoint = new URL(rawUrl);
    const hostname = endpoint.hostname.replace(/^\[|\]$/g, '').toLowerCase();
    return endpoint.protocol === 'https:'
      && !endpoint.username && !endpoint.password && !endpoint.search && !endpoint.hash
      && allowedHosts.map((item) => item.toLowerCase()).includes(endpoint.host.toLowerCase())
      && hostname !== 'localhost' && !hostname.endsWith('.local')
      && !isPrivateNetworkAddress(hostname);
  } catch {
    return false;
  }
}
