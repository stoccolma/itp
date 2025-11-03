import { getPOIs } from '../lib/pois';
import { haversineKm } from '../lib/geo';
import { promises as fs } from 'fs';
import path from 'path';

const HOME_BOUNDS: [[number, number], [number, number]] = [
  [11.956065, 36.554132],
  [15.779451, 38.397087]
];

interface ValidationResult {
  valid: Array<{
    id: string;
    name: string;
    lat: number;
    lon: number;
    category?: string;
  }>;
  invalid: Array<{
    id: string;
    reason: string;
    data: any;
  }>;
  outOfBounds: Array<{
    id: string;
    name: string;
    lat: number;
    lon: number;
    reason: string;
  }>;
  duplicates: Array<{
    type: 'id' | 'location';
    items: Array<{
      id: string;
      name: string;
      lat?: number;
      lon?: number;
    }>;
  }>;
  categoryIssues: Array<{
    id: string;
    name: string;
    original: string;
    normalized: string;
  }>;
}

const CATEGORY_ALIASES: Record<string, string> = {
  'caffè': 'cafe',
  'caffe': 'cafe',
  'bar': 'cafe',
  'ristorante': 'restaurant',
  'trattoria': 'restaurant',
  'osteria': 'restaurant',
  'pizzeria': 'restaurant',
  'gelateria': 'gelato',
  'pasticceria': 'pastry',
  'museo': 'museum',
  'chiesa': 'church',
  'cattedrale': 'church',
  'spiaggia': 'beach',
};

function normalizeCategory(category?: string): string | undefined {
  if (!category) return undefined;
  const trimmed = category.trim().toLowerCase();
  return CATEGORY_ALIASES[trimmed] || trimmed;
}

function isInBounds(lat: number, lon: number): boolean {
  const [[minLon, minLat], [maxLon, maxLat]] = HOME_BOUNDS;
  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
}

function getBoundsReason(lat: number, lon: number): string {
  const [[minLon, minLat], [maxLon, maxLat]] = HOME_BOUNDS;
  const reasons: string[] = [];
  
  if (lat < minLat) reasons.push('too far south');
  if (lat > maxLat) reasons.push('too far north');
  if (lon < minLon) reasons.push('too far west');
  if (lon > maxLon) reasons.push('too far east');
  
  return reasons.join(', ') || 'out of Sicily bounds';
}

async function validatePOIs(): Promise<ValidationResult> {
  const pois = await getPOIs();
  
  const result: ValidationResult = {
    valid: [],
    invalid: [],
    outOfBounds: [],
    duplicates: [],
    categoryIssues: [],
  };

  // Schema validation
  const seenIds = new Map<string, any>();
  const locations = new Map<string, Array<{ id: string; name: string; lat: number; lon: number }>>();
  
  for (const poi of pois) {
    // Validate required fields
    if (!poi.id || typeof poi.id !== 'string') {
      result.invalid.push({
        id: poi.id || 'unknown',
        reason: 'Missing or invalid id',
        data: poi,
      });
      continue;
    }
    
    if (!poi.name || typeof poi.name !== 'string') {
      result.invalid.push({
        id: poi.id,
        reason: 'Missing or invalid name',
        data: poi,
      });
      continue;
    }
    
    if (poi.lat === undefined || typeof poi.lat !== 'number' || isNaN(poi.lat)) {
      result.invalid.push({
        id: poi.id,
        reason: 'Missing or invalid lat',
        data: poi,
      });
      continue;
    }
    
    if (poi.lon === undefined || typeof poi.lon !== 'number' || isNaN(poi.lon)) {
      result.invalid.push({
        id: poi.id,
        reason: 'Missing or invalid lon',
        data: poi,
      });
      continue;
    }
    
    if (poi.category !== undefined && typeof poi.category !== 'string') {
      result.invalid.push({
        id: poi.id,
        reason: 'Invalid category type',
        data: poi,
      });
      continue;
    }

    // Check for duplicate IDs
    if (seenIds.has(poi.id)) {
      const existing = seenIds.get(poi.id);
      const existingDup = result.duplicates.find(
        d => d.type === 'id' && d.items.some(item => item.id === poi.id)
      );
      
      if (!existingDup) {
        result.duplicates.push({
          type: 'id',
          items: [
            { id: existing.id, name: existing.name, lat: existing.lat, lon: existing.lon },
            { id: poi.id, name: poi.name, lat: poi.lat, lon: poi.lon },
          ],
        });
      } else {
        existingDup.items.push({ id: poi.id, name: poi.name, lat: poi.lat, lon: poi.lon });
      }
    } else {
      seenIds.set(poi.id, poi);
    }

    // Check bounds
    if (!isInBounds(poi.lat, poi.lon)) {
      result.outOfBounds.push({
        id: poi.id,
        name: poi.name,
        lat: poi.lat,
        lon: poi.lon,
        reason: getBoundsReason(poi.lat, poi.lon),
      });
    }

    // Track locations for duplicate detection (within 5 meters)
    const locationKey = `${poi.lat.toFixed(5)},${poi.lon.toFixed(5)}`;
    if (!locations.has(locationKey)) {
      locations.set(locationKey, []);
    }
    locations.get(locationKey)!.push({
      id: poi.id,
      name: poi.name,
      lat: poi.lat,
      lon: poi.lon,
    });

    // Check category normalization
    if (poi.category) {
      const normalized = normalizeCategory(poi.category);
      if (normalized !== poi.category.trim().toLowerCase()) {
        result.categoryIssues.push({
          id: poi.id,
          name: poi.name,
          original: poi.category,
          normalized: normalized || '',
        });
      }
    }

    // Add to valid if all checks pass
    result.valid.push({
      id: poi.id,
      name: poi.name,
      lat: poi.lat,
      lon: poi.lon,
      category: poi.category,
    });
  }

  // Check for location duplicates (within 5 meters)
  for (const [, pois] of locations) {
    if (pois.length > 1) {
      // Check if any are actually within 5 meters
      for (let i = 0; i < pois.length; i++) {
        for (let j = i + 1; j < pois.length; j++) {
          const distance = haversineKm(
            { lat: pois[i].lat, lon: pois[i].lon },
            { lat: pois[j].lat, lon: pois[j].lon }
          ) * 1000; // Convert to meters
          
          if (distance <= 5) {
            const existingDup = result.duplicates.find(
              d => d.type === 'location' && 
                   (d.items.some(item => item.id === pois[i].id) || 
                    d.items.some(item => item.id === pois[j].id))
            );
            
            if (!existingDup) {
              result.duplicates.push({
                type: 'location',
                items: [pois[i], pois[j]],
              });
            } else if (!existingDup.items.some(item => item.id === pois[j].id)) {
              existingDup.items.push(pois[j]);
            }
          }
        }
      }
    }
  }

  return result;
}

async function main() {
  console.log('🔍 Validating POIs...\n');
  
  const result = await validatePOIs();
  
  // Print summary table
  console.log('╔════════════════════════════════════════╗');
  console.log('║          POI Validation Report         ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  console.log(`✅ Valid POIs:           ${result.valid.length}`);
  console.log(`❌ Invalid POIs:         ${result.invalid.length}`);
  console.log(`🌍 Out of Bounds:        ${result.outOfBounds.length}`);
  console.log(`🔁 Duplicates:           ${result.duplicates.length}`);
  console.log(`📝 Category Issues:      ${result.categoryIssues.length}\n`);
  
  // Show details if there are issues
  if (result.invalid.length > 0) {
    console.log('\n❌ Invalid POIs:');
    result.invalid.forEach(item => {
      console.log(`  - ${item.id}: ${item.reason}`);
    });
  }
  
  if (result.outOfBounds.length > 0) {
    console.log('\n🌍 Out of Bounds POIs:');
    result.outOfBounds.slice(0, 10).forEach(item => {
      console.log(`  - ${item.id} (${item.name}): ${item.reason} [${item.lat}, ${item.lon}]`);
    });
    if (result.outOfBounds.length > 10) {
      console.log(`  ... and ${result.outOfBounds.length - 10} more`);
    }
  }
  
  if (result.duplicates.length > 0) {
    console.log('\n🔁 Duplicate POIs:');
    result.duplicates.slice(0, 5).forEach(dup => {
      console.log(`  - ${dup.type} duplicate:`);
      dup.items.forEach(item => {
        console.log(`    • ${item.id} (${item.name})`);
      });
    });
    if (result.duplicates.length > 5) {
      console.log(`  ... and ${result.duplicates.length - 5} more duplicate groups`);
    }
  }
  
  if (result.categoryIssues.length > 0) {
    console.log('\n📝 Category Normalization Suggestions:');
    result.categoryIssues.slice(0, 10).forEach(item => {
      console.log(`  - ${item.id}: "${item.original}" → "${item.normalized}"`);
    });
    if (result.categoryIssues.length > 10) {
      console.log(`  ... and ${result.categoryIssues.length - 10} more`);
    }
  }

  // Write reports to /tmp
  const tmpDir = process.platform === 'win32' ? process.env.TEMP || 'C:\\tmp' : '/tmp';
  
  // JSON report
  const jsonPath = path.join(tmpDir, 'poi_report.json');
  await fs.writeFile(jsonPath, JSON.stringify(result, null, 2));
  console.log(`\n📄 JSON report written to: ${jsonPath}`);
  
  // CSV report
  const csvRows: string[] = [
    'type,id,name,lat,lon,reason,category'
  ];
  
  result.valid.forEach(poi => {
    csvRows.push(`valid,${poi.id},"${poi.name}",${poi.lat},${poi.lon},,${poi.category || ''}`);
  });
  
  result.invalid.forEach(item => {
    csvRows.push(`invalid,${item.id},,"",,"${item.reason}",`);
  });
  
  result.outOfBounds.forEach(item => {
    csvRows.push(`out_of_bounds,${item.id},"${item.name}",${item.lat},${item.lon},"${item.reason}",`);
  });
  
  result.duplicates.forEach(dup => {
    dup.items.forEach(item => {
      csvRows.push(`duplicate_${dup.type},${item.id},"${item.name}",${item.lat || ''},${item.lon || ''},,`);
    });
  });
  
  const csvPath = path.join(tmpDir, 'poi_report.csv');
  await fs.writeFile(csvPath, csvRows.join('\n'));
  console.log(`📄 CSV report written to: ${csvPath}\n`);
  
  // Exit with error code if there are issues
  const hasIssues = result.invalid.length > 0 || result.duplicates.length > 0;
  
  if (hasIssues) {
    console.log('❌ Validation failed!\n');
    process.exit(1);
  } else {
    console.log('✅ All POIs validated successfully!\n');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('Error running validation:', error);
  process.exit(1);
});
