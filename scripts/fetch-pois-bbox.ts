import { promises as fs } from 'fs';
import path from 'path';

const SICILY_BBOX = {
  minLon: 11.956065,
  minLat: 36.554132,
  maxLon: 15.779451,
  maxLat: 38.397087
};

interface Feature {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    id: string;
    name: string;
    category?: string;
    area_slug?: string;
    address?: string;
    short_desc?: string;
    timing?: string;
    tags?: string[];
  };
}

interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

function parseArgs() {
  const args = process.argv.slice(2);
  let bbox: string | null = null;
  let categories: string[] = [];
  
  for (const arg of args) {
    if (arg.startsWith('--bbox=')) {
      bbox = arg.split('=')[1];
    } else if (arg.startsWith('--cat=')) {
      categories = arg.split('=')[1].split(',').map(c => c.trim());
    }
  }
  
  return { bbox, categories };
}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function fetchPOIs(bbox: string, categories?: string[]): Promise<FeatureCollection> {
  const catParam = categories && categories.length > 0 ? `&cat=${categories.join(',')}` : '';
  const url = `http://localhost:3000/api/pois?bbox=${bbox}${catParam}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      throw new Error('Dev server not reachable. Please start it with: pnpm dev');
    }
    throw error;
  }
}

function generateSicilyGrid(gridSize: number = 0.5): string[] {
  const bboxes: string[] = [];
  const { minLon, minLat, maxLon, maxLat } = SICILY_BBOX;
  
  for (let lon = minLon; lon < maxLon; lon += gridSize) {
    for (let lat = minLat; lat < maxLat; lat += gridSize) {
      const bbox = `${lon},${lat},${Math.min(lon + gridSize, maxLon)},${Math.min(lat + gridSize, maxLat)}`;
      bboxes.push(bbox);
    }
  }
  
  return bboxes;
}

function deduplicateFeatures(features: Feature[]): Feature[] {
  const seenIds = new Set<string>();
  const deduplicated: Feature[] = [];
  
  for (const feature of features) {
    // Skip if we've seen this ID
    if (seenIds.has(feature.id)) {
      continue;
    }
    
    // Check for proximity duplicates (within 5 meters)
    const [lon, lat] = feature.geometry.coordinates;
    let isDuplicate = false;
    
    for (const existing of deduplicated) {
      const [existingLon, existingLat] = existing.geometry.coordinates;
      const distance = haversineMeters(lat, lon, existingLat, existingLon);
      
      if (distance <= 5) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      seenIds.add(feature.id);
      deduplicated.push(feature);
    }
  }
  
  return deduplicated;
}

function countByCategory(features: Feature[]): Record<string, number> {
  const counts: Record<string, number> = {};
  
  for (const feature of features) {
    const category = feature.properties.category || 'uncategorized';
    counts[category] = (counts[category] || 0) + 1;
  }
  
  return counts;
}

async function main() {
  console.log('🔍 Fetching POIs from API...\n');
  
  const { bbox, categories } = parseArgs();
  
  let allFeatures: Feature[] = [];
  
  if (bbox) {
    console.log(`📍 Fetching bbox: ${bbox}`);
    if (categories.length > 0) {
      console.log(`🏷️  Categories: ${categories.join(', ')}`);
    }
    
    const result = await fetchPOIs(bbox, categories);
    allFeatures = result.features;
  } else {
    console.log('🗺️  No bbox provided, fetching Sicily grid (~0.5 deg tiles)...\n');
    const bboxes = generateSicilyGrid(0.5);
    
    console.log(`  Fetching ${bboxes.length} tiles...`);
    
    for (let i = 0; i < bboxes.length; i++) {
      process.stdout.write(`\r  Progress: ${i + 1}/${bboxes.length} tiles`);
      const result = await fetchPOIs(bboxes[i], categories);
      allFeatures.push(...result.features);
    }
    
    console.log('\n');
  }
  
  console.log(`📦 Fetched ${allFeatures.length} features (before deduplication)`);
  
  // Deduplicate
  const deduplicated = deduplicateFeatures(allFeatures);
  console.log(`✨ Deduplicated to ${deduplicated.length} unique features`);
  console.log(`   (removed ${allFeatures.length - deduplicated.length} duplicates)\n`);
  
  // Count by category
  const categoryCounts = countByCategory(deduplicated);
  
  console.log('📊 Features by category:');
  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1]);
  
  for (const [category, count] of sortedCategories) {
    console.log(`   ${category.padEnd(20)} ${count}`);
  }
  
  // Create output
  const featureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features: deduplicated
  };
  
  // Write to /tmp
  const tmpDir = process.platform === 'win32' ? process.env.TEMP || 'C:\\tmp' : '/tmp';
  
  const jsonPath = path.join(tmpDir, 'pois_cache.json');
  const geojsonPath = path.join(tmpDir, 'pois_cache.geojson');
  
  await fs.writeFile(jsonPath, JSON.stringify(featureCollection, null, 2));
  await fs.writeFile(geojsonPath, JSON.stringify(featureCollection, null, 2));
  
  console.log(`\n📄 Wrote ${jsonPath}`);
  console.log(`📄 Wrote ${geojsonPath}\n`);
  
  console.log('✅ Done!\n');
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
