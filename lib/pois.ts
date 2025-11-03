import { promises as fs } from 'fs';
import path from 'path';
import { parseCSV } from './csv';
import type { Coords } from './geo';
import { haversineKm } from './geo';
import { shouldUseBase44POI } from './config';
import {
  getPOIsFromBase44,
  getPOIsNearFromBase44,
  getPOIsForAreaFromBase44,
  clearBase44Cache
} from './pois-base44';

export type POI = {
  id: string;
  name: string;
  area_slug?: string;
  lat?: number;
  lon?: number;
  address?: string; // Legacy field, kept for backward compatibility
  // Normalized address fields
  addressLine1?: string;
  locality?: string;
  region?: string;
  postcode?: string;
  tags?: string[];
  short_desc?: string;
  timing?: string;
  category?: string;
};

type POIRow = {
  id?: string;
  name: string;
  main?: string; // Maps to area_slug
  area_slug?: string;
  lat?: string | number;
  lon?: string | number;
  address?: string;
  address_line1?: string;
  locality?: string;
  region?: string;
  postcode?: string;
  tags?: string;
  short_desc?: string;
  timing?: string;
  category?: string;
  tucci_story?: string;
  source_url?: string;
  sub?: string;
};

let poisCache: POI[] | null = null;

/**
 * Get all POIs from CSV file (legacy backend)
 */
async function getPOIsFromCSV(): Promise<POI[]> {
  if (poisCache) {
    return poisCache;
  }

  try {
    const csvPath = path.join(process.cwd(), 'data', 'pois.csv');
    const content = await fs.readFile(csvPath, 'utf-8');
    const rows = parseCSV<POIRow>(content);

    poisCache = rows
      .map((row, idx) => ({
        id: row.id || `poi-${idx}`,
        name: row.name?.trim() || '',
        area_slug: (row.area_slug || row.main)?.trim().toLowerCase(), // Handle both column names
        lat: row.lat ? parseFloat(String(row.lat)) : undefined,
        lon: row.lon ? parseFloat(String(row.lon)) : undefined,
        address: row.address?.trim(),
        addressLine1: row.address_line1?.trim(),
        locality: row.locality?.trim(),
        region: row.region?.trim(),
        postcode: row.postcode?.trim(),
        tags: row.tags ? row.tags.split(';').map(t => t.trim()).filter(Boolean) : [], // Changed from , to ;
        short_desc: row.short_desc?.trim(),
        timing: row.timing?.trim(),
        category: row.category?.trim(),
      }))
      .filter(poi => poi.name && poi.lat && poi.lon); // Only include POIs with coordinates

    return poisCache;
  } catch (error) {
    // File doesn't exist or can't be read - return empty array silently
    poisCache = [];
    return [];
  }
}

/**
 * Get POIs near a specific location from CSV
 */
async function getPOIsNearFromCSV(
  center: Coords,
  radiusKm: number = 25
): Promise<Array<POI & { distance: number }>> {
  const allPOIs = await getPOIsFromCSV();
  
  const nearby = allPOIs
    .filter(poi => poi.lat && poi.lon)
    .map(poi => ({
      ...poi,
      distance: haversineKm(center, { lat: poi.lat!, lon: poi.lon! }),
    }))
    .filter(poi => poi.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);

  return nearby;
}

/**
 * Get POIs for a specific area slug from CSV
 */
async function getPOIsForAreaFromCSV(areaSlug: string): Promise<POI[]> {
  const allPOIs = await getPOIsFromCSV();
  return allPOIs.filter(poi => poi.area_slug === areaSlug);
}

/**
 * Unified POI interface - switches between CSV and Base44 based on configuration
 */

/**
 * Get all POIs (uses configured backend with fallback to CSV)
 */
export async function getPOIs(): Promise<POI[]> {
  if (shouldUseBase44POI()) {
    try {
      console.log('🌐 Using Base44 POI backend');
      return await getPOIsFromBase44();
    } catch (error) {
      console.warn('⚠️  Base44 POI fetch failed, falling back to CSV:', error);
      return await getPOIsFromCSV();
    }
  }
  
  console.log('📁 Using CSV POI backend');
  return await getPOIsFromCSV();
}

/**
 * Get POIs near a specific location (uses configured backend with fallback to CSV)
 */
export async function getPOIsNearLocation(
  center: Coords,
  radiusKm: number = 25
): Promise<Array<POI & { distance: number }>> {
  if (shouldUseBase44POI()) {
    try {
      console.log('🌐 Using Base44 nearby POI backend');
      return await getPOIsNearFromBase44({
        lat: center.lat,
        lon: center.lon,
        radiusKm
      });
    } catch (error) {
      console.warn('⚠️  Base44 nearby POI fetch failed, falling back to CSV:', error);
      return await getPOIsNearFromCSV(center, radiusKm);
    }
  }
  
  console.log('📁 Using CSV nearby POI backend');
  return await getPOIsNearFromCSV(center, radiusKm);
}

/**
 * Get POIs for a specific area slug (uses configured backend with fallback to CSV)
 */
export async function getPOIsForArea(areaSlug: string): Promise<POI[]> {
  if (shouldUseBase44POI()) {
    try {
      console.log('🌐 Using Base44 area POI backend');
      return await getPOIsForAreaFromBase44(areaSlug);
    } catch (error) {
      console.warn('⚠️  Base44 area POI fetch failed, falling back to CSV:', error);
      return await getPOIsForAreaFromCSV(areaSlug);
    }
  }
  
  console.log('📁 Using CSV area POI backend');
  return await getPOIsForAreaFromCSV(areaSlug);
}

/**
 * Clear POIs cache (clears both CSV and Base44 caches)
 */
export function clearPOIsCache(): void {
  poisCache = null;
  if (shouldUseBase44POI()) {
    clearBase44Cache();
  }
}
