export interface CatalogProduct {
  id: string;
  name: string;
  packs: number;
  totalPads: number;
  priceKsh: number;
  badge: string;
  description: string;
  imageSrc: string;
}

/**
 * Catalogue prices are grounded in recorded Binti online sales from May–June 2026:
 * 6 packs KSh 500, 12 packs KSh 900 and 48 packs KSh 2,650.
 * Server-side totals use this catalogue only after explicit catalogue approval;
 * browser totals are display-only.
 */
export const CATALOG: readonly CatalogProduct[] = [
  {
    id: 'mrembo-6',
    name: 'Mrembo 6-Pack Starter Bundle',
    packs: 6,
    totalPads: 48,
    priceKsh: 500,
    badge: 'Starter',
    description: 'A compact Mrembo bundle for first orders and smaller households.',
    imageSrc: '/mrembo-pack-product.png',
  },
  {
    id: 'mrembo-12',
    name: 'Mrembo 12-Pack Comfort Box',
    packs: 12,
    totalPads: 96,
    priceKsh: 900,
    badge: 'Popular choice',
    description: 'A practical multi-pack box for keeping Mrembo care close at hand.',
    imageSrc: '/mrembo-pack-product.png',
  },
  {
    id: 'mrembo-48',
    name: 'Mrembo 48-Pack Bulk Box',
    packs: 48,
    totalPads: 384,
    priceKsh: 2650,
    badge: 'Bulk',
    description: 'Bulk Mrembo supply for approved retail, workplace or community needs.',
    imageSrc: '/mrembo-pack-product.png',
  },
] as const;

export const catalogById = new Map(CATALOG.map((product) => [product.id, product]));
