import { promises as fs } from 'fs';
import path from 'path';
import { parseCSV } from './csv';
import type { Coords } from './geo';
import { haversineKm } from './geo';

export type Affiliate = {
  id: string;
  area_slug: string;
  name: string;
  type?: string;
  partner?: string;
  tracking_url?: string;
  tags?: string[];
  lat?: number;
  lon?: number;
  short_desc?: string;
};

type AffiliateRow = {
  id?: string;
  area_slug: string;
  name: string;
  type?: string;
  partner?: string;
  tracking_url?: string;
  tags?: string;
  lat?: string | number;
  lon?: string | number;
  short_desc?: string;
};

let affiliatesCache: Affiliate[] | null = null;

/**
 * Get all affiliates from data/affiliates.csv if it exists
 * Returns empty array if file doesn't exist
 */
export async function getAffiliates(): Promise<Affiliate[]> {
  if (affiliatesCache) {
    return affiliatesCache;
  }

  try {
    const csvPath = path.join(process.cwd(), 'data', 'affiliates.csv');
    const content = await fs.readFile(csvPath, 'utf-8');
    const rows = parseCSV<AffiliateRow>(content);

    affiliatesCache = rows
      .map((row, idx) => ({
        id: row.id || `aff-${idx}`,
        area_slug: row.area_slug?.trim() || '',
        name: row.name?.trim() || '',
        type: row.type?.trim(),
        partner: row.partner?.trim(),
        tracking_url: row.tracking_url?.trim(),
        tags: row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        lat: row.lat ? parseFloat(String(row.lat)) : undefined,
        lon: row.lon ? parseFloat(String(row.lon)) : undefined,
        short_desc: row.short_desc?.trim(),
      }))
      .filter(aff => aff.area_slug && aff.name);

    return affiliatesCache;
  } catch (error) {
    // File doesn't exist or can't be read - return empty array silently
    affiliatesCache = [];
    return [];
  }
}

/**
 * Get affiliates for a specific area, optionally including nearby ones
 */
export async function getAffiliatesForArea(
  areaSlug: string,
  areaCoords?: Coords,
  includeNearby: boolean = true,
  radiusKm: number = 25
): Promise<Array<Affiliate & { distance?: number }>> {
  const allAffiliates = await getAffiliates();
  
  // Direct matches for this area
  const directMatches = allAffiliates
    .filter(aff => aff.area_slug === areaSlug)
    .map(aff => ({ ...aff, distance: 0 }));

  // If no coords or not including nearby, return direct matches only
  if (!includeNearby || !areaCoords) {
    return directMatches;
  }

  // Find nearby affiliates with coordinates
  const nearby = allAffiliates
    .filter(aff => aff.area_slug !== areaSlug && aff.lat && aff.lon)
    .map(aff => ({
      ...aff,
      distance: haversineKm(areaCoords, { lat: aff.lat!, lon: aff.lon! }),
    }))
    .filter(aff => aff.distance! <= radiusKm);

  // Combine and sort by distance
  return [...directMatches, ...nearby].sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

/**
 * Clear affiliates cache
 */
export function clearAffiliatesCache(): void {
  affiliatesCache = null;
}
