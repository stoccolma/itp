/**
 * Base44 POI Integration
 * Provides POI data from Base44 RAG-POI API
 */

import { BASE44_API_URL, BASE44_API_KEY } from './config';
import type { POI } from './pois';
import type { Coords } from './geo';

// Simple in-memory cache with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const age = Date.now() - entry.timestamp;
  if (age > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Fetch POIs from Base44 API with optional filters
 */
export async function getPOIsFromBase44(params?: {
  city?: string;
  zone?: string;
  category?: string;
  lat?: number;
  lon?: number;
  radiusKm?: number;
}): Promise<POI[]> {
  const cacheKey = `pois:${JSON.stringify(params || {})}`;
  const cached = getCached<POI[]>(cacheKey);
  if (cached) {
    console.log('📦 Base44 POIs from cache:', cacheKey);
    return cached;
  }

  try {
    const url = new URL(`${BASE44_API_URL}/list`);
    
    if (params?.city) url.searchParams.set('city', params.city);
    if (params?.zone) url.searchParams.set('zone', params.zone);
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.lat !== undefined) url.searchParams.set('lat', params.lat.toString());
    if (params?.lon !== undefined) url.searchParams.set('lon', params.lon.toString());
    if (params?.radiusKm) url.searchParams.set('radiusKm', params.radiusKm.toString());

    console.log('🌐 Fetching POIs from Base44:', url.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${BASE44_API_KEY}`,
        'Content-Type': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Base44 API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const pois: POI[] = Array.isArray(data.pois) ? data.pois : data;

    setCache(cacheKey, pois);
    console.log(`✅ Fetched ${pois.length} POIs from Base44`);
    
    return pois;
  } catch (error) {
    console.error('❌ Base44 POI fetch failed:', error);
    throw error;
  }
}

/**
 * Get POIs near a specific location from Base44 API
 */
export async function getPOIsNearFromBase44(params: {
  lat: number;
  lon: number;
  radiusKm?: number;
  categories?: string[];
}): Promise<Array<POI & { distance: number }>> {
  const { lat, lon, radiusKm = 25, categories } = params;
  const cacheKey = `nearby:${lat},${lon}:${radiusKm}:${categories?.join(',')}`;
  
  const cached = getCached<Array<POI & { distance: number }>>(cacheKey);
  if (cached) {
    console.log('📦 Base44 nearby POIs from cache:', cacheKey);
    return cached;
  }

  try {
    const url = new URL(`${BASE44_API_URL}/nearby`);
    url.searchParams.set('lat', lat.toString());
    url.searchParams.set('lon', lon.toString());
    url.searchParams.set('radiusKm', radiusKm.toString());
    if (categories && categories.length > 0) {
      url.searchParams.set('categories', categories.join(','));
    }

    console.log('🌐 Fetching nearby POIs from Base44:', url.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${BASE44_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Base44 API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const pois: Array<POI & { distance: number }> = Array.isArray(data.pois) ? data.pois : data;

    setCache(cacheKey, pois);
    console.log(`✅ Fetched ${pois.length} nearby POIs from Base44`);
    
    return pois;
  } catch (error) {
    console.error('❌ Base44 nearby POI fetch failed:', error);
    throw error;
  }
}

/**
 * Get POIs for a specific area from Base44 API
 */
export async function getPOIsForAreaFromBase44(areaSlug: string): Promise<POI[]> {
  const cacheKey = `area:${areaSlug}`;
  const cached = getCached<POI[]>(cacheKey);
  if (cached) {
    console.log('📦 Base44 area POIs from cache:', cacheKey);
    return cached;
  }

  try {
    // Try to use area slug as a zone/city filter
    const pois = await getPOIsFromBase44({ city: areaSlug });
    setCache(cacheKey, pois);
    return pois;
  } catch (error) {
    console.error(`❌ Base44 area POI fetch failed for ${areaSlug}:`, error);
    throw error;
  }
}

/**
 * Clear the Base44 POI cache
 */
export function clearBase44Cache(): void {
  cache.clear();
  console.log('🗑️  Base44 cache cleared');
}
