import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://bintimarvels.com';
  const routes = ['', '/shop', '/our-story', '/binti-charity', '/binti-circles', '/delivery', '/contact', '/privacy', '/terms', '/returns', '/consent', '/data-request'];
  return routes.map((route) => ({ url: `${base}${route}`, changeFrequency: route === '' || route === '/shop' ? 'weekly' : 'monthly', priority: route === '' ? 1 : route === '/shop' ? .9 : .7 }));
}
