import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';

// Area data types
export type AreaBase = {
  id: string;
  name: string;
  lat?: number;
  lon?: number;
  region?: string;
  tags?: string[];
  area_type?: string;
};

export type AreaStory = {
  name: string;
  short_desc?: string;
  tucci_story?: string;
};

export type AreaFull = {
  id: string;
  name: string;
  slug: string;
  short_desc?: string;
  tucci_story?: string;
  lat?: number;
  lon?: number;
  region?: string;
  tags?: string[];
  area_type?: string;
  hasCoords: boolean;
};

// Image types
export type AreaImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  source_url?: string;
  featured?: boolean;
  order?: number;
};

export type AreaImagesManifest = {
  slug: string;
  images: AreaImage[];
  updatedAt: string;
};

/**
 * Get images for a specific area slug
 * Returns empty array if manifest doesn't exist
 */
export async function getAreaImages(slug: string): Promise<AreaImage[]> {
  try {
    const manifestPath = path.join(process.cwd(), 'data', 'areas_images', `${slug}.json`);
    const data = await fs.readFile(manifestPath, 'utf-8');
    const manifest: AreaImagesManifest = JSON.parse(data);
    
    // Sort by order (ascending), then featured (descending)
    return manifest.images.sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      const featuredA = a.featured ? 1 : 0;
      const featuredB = b.featured ? 1 : 0;
      return featuredB - featuredA;
    });
  } catch (error) {
    // Return empty array if file doesn't exist or other errors
    return [];
  }
}

/**
 * Get the featured image for an area, or the first image if none is featured
 */
export async function getFeaturedAreaImage(slug: string): Promise<AreaImage | null> {
  const images = await getAreaImages(slug);
  if (images.length === 0) return null;
  
  const featured = images.find(img => img.featured);
  return featured || images[0];
}

/**
 * Read area images manifest
 */
export async function readAreaImagesManifest(slug: string): Promise<AreaImagesManifest | null> {
  try {
    const manifestPath = path.join(process.cwd(), 'data', 'areas_images', `${slug}.json`);
    const data = await fs.readFile(manifestPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Write area images manifest
 */
export async function writeAreaImagesManifest(manifest: AreaImagesManifest): Promise<void> {
  const manifestPath = path.join(process.cwd(), 'data', 'areas_images', `${manifest.slug}.json`);
  manifest.updatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
}

/**
 * Ensure area directory exists in public/areas
 */
export async function ensureAreaDirectory(slug: string): Promise<string> {
  const areaDir = path.join(process.cwd(), 'public', 'areas', slug);
  await fs.mkdir(areaDir, { recursive: true });
  return areaDir;
}

/**
 * Convert string to slug (kebab-case)
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Normalize name for matching (strip diacritics, lowercase, trim)
 */
export function normalizeName(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Parse areas.csv - base metadata
 */
async function parseAreasBaseData(): Promise<AreaBase[]> {
  try {
    const csvPath = path.join(process.cwd(), 'data', 'areas.csv');
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    
    const result = Papa.parse<any>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase()
    });
    
    return result.data.map((row: any) => ({
      id: row.id || slugify(row.name || ''),
      name: (row.name || '').trim(),
      lat: row.lat ? parseFloat(row.lat) : undefined,
      lon: row.lon ? parseFloat(row.lon) : undefined,
      region: row.region?.trim(),
      tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
      area_type: row.area_type?.trim()
    })).filter(area => area.name); // Filter out empty entries
  } catch (error) {
    console.error('Error parsing areas.csv:', error);
    return [];
  }
}

/**
 * Parse areas_story.csv - narrative content
 */
async function parseAreasStoryData(): Promise<AreaStory[]> {
  try {
    const csvPath = path.join(process.cwd(), 'data', 'areas_story.csv');
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    
    const result = Papa.parse<any>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase()
    });
    
    return result.data.map((row: any) => ({
      name: (row.name || '').trim(),
      short_desc: row.short_desc?.trim(),
      tucci_story: row.tucci_story?.trim()
    })).filter(area => area.name);
  } catch (error) {
    console.error('Error parsing areas_story.csv:', error);
    return [];
  }
}

// Cache for merged areas data
let cachedAreas: AreaFull[] | null = null;

/**
 * Get all areas with merged data from both CSVs
 */
export async function getFullAreas(): Promise<AreaFull[]> {
  // Return cached data if available
  if (cachedAreas) {
    return cachedAreas;
  }
  
  const baseData = await parseAreasBaseData();
  const storyData = await parseAreasStoryData();
  
  // Create a map of stories by normalized name for fast lookup
  const storyMap = new Map<string, AreaStory>();
  const unmatchedStories: string[] = [];
  
  storyData.forEach(story => {
    const normalizedName = normalizeName(story.name);
    storyMap.set(normalizedName, story);
  });
  
  // Track which stories were matched
  const matchedStories = new Set<string>();
  
  // Merge data
  cachedAreas = baseData.map(base => {
    const normalizedName = normalizeName(base.name);
    const story = storyMap.get(normalizedName);
    
    if (story) {
      matchedStories.add(normalizedName);
    }
    
    return {
      id: base.id,
      name: base.name,
      slug: slugify(base.name),
      short_desc: story?.short_desc,
      tucci_story: story?.tucci_story,
      lat: base.lat,
      lon: base.lon,
      region: base.region,
      tags: base.tags,
      area_type: base.area_type,
      hasCoords: !!(base.lat && base.lon)
    };
  });
  
  // Log unmatched stories for debugging
  storyData.forEach(story => {
    const normalizedName = normalizeName(story.name);
    if (!matchedStories.has(normalizedName)) {
      unmatchedStories.push(story.name);
    }
  });
  
  if (unmatchedStories.length > 0) {
    console.warn('Unmatched stories (check name spelling in CSVs):', unmatchedStories);
  }
  
  return cachedAreas;
}

/**
 * Get single area data by slug
 */
export async function getAreaData(slug: string): Promise<AreaFull | null> {
  const areas = await getFullAreas();
  return areas.find(area => area.slug === slug) || null;
}

/**
 * Clear cached areas data (useful for development/testing)
 */
export function clearAreasCache(): void {
  cachedAreas = null;
}
