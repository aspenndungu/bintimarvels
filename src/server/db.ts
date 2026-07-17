import postgres from 'postgres';

let client: ReturnType<typeof postgres> | null = null;

export function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured.');
  const parsed = new URL(url);
  const localPlaintext = process.env.DATABASE_SSL_MODE === 'disable' && ['127.0.0.1', 'localhost', '::1'].includes(parsed.hostname);
  if (process.env.DATABASE_SSL_MODE === 'disable' && !localPlaintext) throw new Error('Unencrypted database connections are allowed only on loopback.');
  client ??= postgres(url, {
    max: 3,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: process.env.NODE_ENV === 'production' && !localPlaintext ? 'require' : undefined,
    transform: { undefined: null },
  });
  return client;
}
