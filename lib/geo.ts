/**
 * Geographic utilities for map projection and distance calculations
 */

export type Coords = {
  lat: number;
  lon: number;
};

/**
 * Haversine distance calculation in kilometers
 */
export function haversineKm(p1: Coords, p2: Coords): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(p2.lat - p1.lat);
  const dLon = toRad(p2.lon - p1.lon);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

/**
 * Simple Web Mercator projection (lat/lon to x/y)
 */
export function mercatorProject(lat: number, lon: number): { x: number; y: number } {
  const x = lon;
  const y = Math.log(Math.tan(Math.PI / 4 + toRad(lat) / 2)) * 180 / Math.PI;
  return { x, y };
}

/**
 * Calculate bounding box from multiple coordinates
 */
export function getBoundingBox(coords: Coords[]): {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
} {
  if (coords.length === 0) {
    return { minLat: 0, maxLat: 0, minLon: 0, maxLon: 0 };
  }
  
  let minLat = coords[0].lat;
  let maxLat = coords[0].lat;
  let minLon = coords[0].lon;
  let maxLon = coords[0].lon;
  
  for (const coord of coords) {
    minLat = Math.min(minLat, coord.lat);
    maxLat = Math.max(maxLat, coord.lat);
    minLon = Math.min(minLon, coord.lon);
    maxLon = Math.max(maxLon, coord.lon);
  }
  
  return { minLat, maxLat, minLon, maxLon };
}

/**
 * Estimate walking time (4 km/h)
 */
export function walkingMinutes(distanceKm: number): number {
  return Math.round((distanceKm / 4) * 60);
}

/**
 * Estimate driving time (35 km/h average local speed)
 */
export function drivingMinutes(distanceKm: number): number {
  return Math.round((distanceKm / 35) * 60);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Format time estimate for display
 */
export function formatTimeEstimate(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

/**
 * Calculate bounding box from a center point and radius
 */
export function bboxFromCenter(lat: number, lon: number, radiusKm: number): {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
} {
  const d = radiusKm / 111; // Approximate degrees (1 degree ≈ 111 km)
  return {
    minLat: lat - d,
    maxLat: lat + d,
    minLon: lon - d,
    maxLon: lon + d,
  };
}
