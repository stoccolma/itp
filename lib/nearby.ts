import { haversineKm, bboxFromCenter } from './geo';
import { getPOIs } from './pois';
import type { AreaFull } from './areas';
import type { POI } from './pois';

type NearbyOpts = {
  radiusKm: number;
  allowCats?: string[];
  excludeCats?: string[];
  limit?: number;
};

// Simple in-memory cache
const mem = new Map<string, any>();

export async function nearbyPOIs(
  origin: Pick<AreaFull, 'lat' | 'lon' | 'slug'>,
  opts: NearbyOpts
): Promise<Array<POI & { dist: number }>> {
  if (!origin.lat || !origin.lon) return [];

  const key = `${origin.slug}|${opts.radiusKm}|${opts.allowCats || ''}|${opts.excludeCats || ''}|${opts.limit || 0}`;
  if (mem.has(key)) return mem.get(key);

  const pois = await getPOIs();
  const bb = bboxFromCenter(origin.lat, origin.lon, opts.radiusKm);

  // Bounding box pre-filter
  const prelim = pois.filter(
    (p) =>
      p.lat &&
      p.lon &&
      p.lat >= bb.minLat &&
      p.lat <= bb.maxLat &&
      p.lon >= bb.minLon &&
      p.lon <= bb.maxLon
  );

  // Calculate distances and filter by radius
  let out = prelim
    .map((p) => ({
      ...p,
      dist: haversineKm(origin as any, { lat: p.lat!, lon: p.lon! }),
    }))
    .filter((p) => p.dist <= opts.radiusKm)
    .sort((a, b) => a.dist - b.dist);

  // Category filters
  if (opts.allowCats?.length) {
    out = out.filter((p) => {
      const tags = p.tags as any;
      const cats = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : []);
      return cats.some((c: string) => opts.allowCats!.includes(c.toLowerCase()));
    });
  }

  if (opts.excludeCats?.length) {
    out = out.filter((p) => {
      const tags = p.tags as any;
      const cats = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : []);
      return !cats.some((c: string) => opts.excludeCats!.includes(c.toLowerCase()));
    });
  }

  if (opts.limit) out = out.slice(0, opts.limit);

  mem.set(key, out);
  return out;
}

export function distanceBadge(km: number): string {
  const kmr = Math.max(0.1, Math.round(km * 10) / 10);
  const WALK_KMH = 4;
  const DRIVE_KMH = 35;
  const walkMin = Math.round((kmr / WALK_KMH) * 60);

  if (kmr <= 1.2) {
    const b = [2, 3, 4, 5, 7, 10, 12, 15];
    const match = b.reduce(
      (p, c) => (Math.abs(c - walkMin) < Math.abs(p - walkMin) ? c : p),
      b[0]
    );
    return `${kmr.toFixed(1)} km • ${match} min walk`;
  }

  const driveMin = Math.round((kmr / DRIVE_KMH) * 60);
  const bucket =
    driveMin <= 5
      ? '≈5'
      : driveMin <= 8
      ? '5–8'
      : driveMin <= 12
      ? '8–12'
      : driveMin <= 20
      ? '12–20'
      : '20+';
  return `${kmr.toFixed(1)} km • ${bucket} min drive`;
}
