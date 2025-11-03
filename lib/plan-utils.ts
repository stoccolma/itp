/**
 * Client-safe utilities for plan management
 * These functions don't require server-side dependencies
 */

import type { POI } from './pois';

export type PlanSlot = {
  id: string;
  time: string;
  title: string;
  type: string;
  poi?: POI;
  distance?: number;
  // Address fields copied from POI when added
  addressLine1?: string;
  locality?: string;
  region?: string;
  postcode?: string;
};

export type Sidequest = {
  id: string;
  poiId: string;
  name: string;
  lat: number;
  lon: number;
  time: string; // HH:MM format
  note?: string;
  distance?: number;
  // Address fields copied from POI when added
  addressLine1?: string;
  locality?: string;
  region?: string;
  postcode?: string;
};

// Earth radius in km
export const R = 6371;

/**
 * Real haversine distance calculation
 */
export function haversineKm(a: {lat:number, lon:number}, b: {lat:number, lon:number}): number {
  const toRad = (x: number) => x * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const la1 = toRad(a.lat);
  const la2 = toRad(b.lat);
  const s = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const WALK_KMH = 4;
const DRIVE_KMH = 35;

/**
 * Real distance badge with accurate walk/drive times
 */
export function distanceBadge(km: number): string {
  const kmr = Math.max(0.1, Math.round(km * 10) / 10);
  const walkMin = Math.round((kmr / WALK_KMH) * 60);
  
  if (kmr <= 1.2) {
    const buckets = [2, 3, 4, 5, 7, 10, 12, 15];
    const best = buckets.reduce((p, c) => 
      Math.abs(c - walkMin) < Math.abs(p - walkMin) ? c : p, buckets[0]
    );
    return `${kmr.toFixed(1)} km • ${best} min walk`;
  }
  
  const driveMin = Math.round((kmr / DRIVE_KMH) * 60);
  const bucket = driveMin <= 5 ? "≈5" : 
                 driveMin <= 8 ? "5–8" : 
                 driveMin <= 12 ? "8–12" : 
                 driveMin <= 20 ? "12–20" : "20+";
  return `${kmr.toFixed(1)} km • ${bucket} min drive`;
}

/**
 * Slot templates
 */
export const SLOT_ORDER = [
  { t: "09:00", key: "coffee", label: "Morning Coffee" },
  { t: "10:30", key: "explore_am", label: "Morning Exploration" },
  { t: "12:30", key: "lunch", label: "Lunch" },
  { t: "15:00", key: "stroll", label: "Afternoon Stroll" },
  { t: "17:30", key: "aperitivo", label: "Aperitivo" },
  { t: "20:00", key: "dinner", label: "Dinner" },
];

/**
 * Tucci short - only use real data from POI
 */
export function tucciShort(poi: POI): string {
  return (poi as any).tucci_short || '';
}

/**
 * Format address from normalized address fields
 * Returns 'line1, locality' format or fallback message
 */
export function formatAddress(item: POI | PlanSlot | Sidequest): string {
  const line1 = item.addressLine1?.trim();
  const locality = item.locality?.trim();
  
  if (line1 && locality) {
    return `${line1}, ${locality}`;
  }
  
  if (line1) {
    return line1;
  }
  
  return 'Address not provided';
}
