/**
 * Server-side plan generation utilities
 * Uses fs-based POI loading - NOT safe for client-side use
 */

import type { AreaFull } from './areas';
import type { POI } from './pois';
import { getPOIsNearLocation } from './pois';
import { haversineKm, SLOT_ORDER, type PlanSlot } from './plan-utils';

// Re-export types for convenience
export type { PlanSlot, Sidequest } from './plan-utils';

// Re-export client-safe utilities
export { haversineKm, distanceBadge, formatAddress, tucciShort, SLOT_ORDER, R } from './plan-utils';

/**
 * Intelligent tag-based slot selection
 */
export function pickByTags(
  origin: {lat: number, lon: number}, 
  pois: POI[], 
  maxDistKm: number = 30
): Record<string, POI & {dist: number}> {
  const norm = (s: string) => (s || "").toLowerCase();
  
  const withDist = pois
    .filter(p => p.lat && p.lon)
    .map(p => ({
      ...p,
      dist: haversineKm(origin, {lat: p.lat!, lon: p.lon!})
    }))
    .filter(p => p.dist <= maxDistKm)
    .sort((a, b) => a.dist - b.dist);

  const want: Record<string, string[]> = {
    coffee: ["coffee", "bar", "cafe", "pasticceria", "bakery"],
    explore_am: ["museum", "church", "castle", "historic", "view", "market"],
    lunch: ["restaurant", "trattoria", "osteria", "seafood"],
    stroll: ["park", "promenade", "beach", "view", "garden"],
    aperitivo: ["bar", "wine", "enoteca", "cocktail"],
    dinner: ["restaurant", "trattoria", "pizzeria", "dinner"]
  };

  const chosen: Record<string, POI & {dist: number}> = {};
  const used = new Set<string>();

  for (const s of SLOT_ORDER) {
    const tags = want[s.key];
    const poiTags = (p: POI) => Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
    const pick = withDist.find(p => 
      !used.has(p.id) && tags.some(tag => poiTags(p).includes(tag))
    ) || withDist.find(p => !used.has(p.id));
    
    if (pick) {
      used.add(pick.id);
      chosen[s.key] = pick;
    }
  }

  return chosen;
}

/**
 * Generate a 1-day plan for an area
 */
export async function generateDayPlan(
  area: AreaFull,
  nearbyAreas: AreaFull[],
  dateISO: string
): Promise<PlanSlot[]> {
  if (!area.lat || !area.lon) {
    return [];
  }

  const centerCoords = { lat: area.lat, lon: area.lon };
  let nearbyPOIs = await getPOIsNearLocation(centerCoords, 30);

  // Fallback to nearby areas if no POIs
  if (nearbyPOIs.length === 0) {
    nearbyPOIs = nearbyAreas
      .filter(a => a.slug !== area.slug && a.lat && a.lon)
      .map(a => {
        const distance = haversineKm(centerCoords, { lat: a.lat!, lon: a.lon! });
        return {
          id: a.slug,
          name: a.name,
          lat: a.lat,
          lon: a.lon,
          tags: a.tags,
          distance,
        };
      })
      .filter(a => a.distance <= 40)
      .sort((a, b) => a.distance - b.distance) as Array<POI & { distance: number }>;
  }

  // Use intelligent tag matching
  const chosen = pickByTags(centerCoords, nearbyPOIs, 30);

  // Build slots
  const slots: PlanSlot[] = [];
  for (const slotTemplate of SLOT_ORDER) {
    const poi = chosen[slotTemplate.key];
    if (poi) {
      slots.push({
        id: `slot-${slotTemplate.t}`,
        time: slotTemplate.t,
        title: slotTemplate.label,
        type: slotTemplate.key,
        poi: poi,
        distance: poi.dist,
      });
    }
  }

  return slots;
}
