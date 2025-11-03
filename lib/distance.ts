/**
 * Distance and walk time utilities for contextual POI distances
 */

import { haversineKm, type Coords } from './geo';

const WALK_SPEED_KMH = 4.8; // 4.8 km/h = 80 meters/min
const METERS_PER_MIN = 80;

/**
 * Calculate distance from context (previous POI, city center, or nearest main stop)
 */
export function contextualDistance(
  poiCoords: Coords,
  context: {
    previousPOI?: Coords;
    cityCenter?: Coords;
    nearestMainStop?: Coords;
    mode: 'planner' | 'sidequest' | 'standalone';
  }
): number {
  // Priority: previous POI > nearest main stop > city center
  const anchor = context.previousPOI || context.nearestMainStop || context.cityCenter;
  
  if (!anchor) {
    return 0;
  }
  
  return haversineKm(anchor, poiCoords);
}

/**
 * Convert distance to walk time in minutes
 */
export function distanceToWalkMinutes(distanceKm: number): number {
  return Math.round((distanceKm / WALK_SPEED_KMH) * 60);
}

/**
 * Format walk time naturally with clamping
 */
export function formatWalkTime(minutes: number, fromName?: string): string {
  // Clamp very short walks
  if (minutes < 5) {
    return fromName 
      ? `2-3 min walk from ${fromName}`
      : '2-3 min walk';
  }
  
  // Suggest transit for long walks
  if (minutes > 25) {
    return fromName
      ? `Transit advised from ${fromName}`
      : 'Transit advised';
  }
  
  // Normal walking time
  return fromName
    ? `${minutes} min walk from ${fromName}`
    : `${minutes} min walk`;
}

/**
 * Format distance with walk time
 */
export function formatDistanceWithTime(distanceKm: number, fromName?: string): string {
  const minutes = distanceToWalkMinutes(distanceKm);
  const distanceStr = distanceKm < 1 
    ? `${Math.round(distanceKm * 1000)}m`
    : `${distanceKm.toFixed(1)}km`;
  
  return `${distanceStr} • ${formatWalkTime(minutes, fromName)}`;
}

/**
 * Get anchor name for display
 */
export function getAnchorName(
  context: {
    previousPOIName?: string;
    cityName?: string;
    nearestMainStopName?: string;
  }
): string {
  return context.previousPOIName || context.nearestMainStopName || context.cityName || 'here';
}
