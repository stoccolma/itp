# CSV Integration for Area Data & Planner

Complete integration of `areas.csv` and `areas_story.csv` into the planner system with SSR support.

## Overview

This system merges two CSV files to create a unified dataset for area pages and the day planner:
- **areas.csv**: Base metadata (coordinates, region, tags, type)
- **areas_story.csv**: Narrative content (descriptions, Tucci-style stories)

## Data Structure

### areas.csv Format
```csv
id,name,lat,lon,region,tags,area_type
noto,Noto,36.8919,15.0708,Sicily,baroque,architecture,unesco,city
```

**Columns:**
- `id`: Unique identifier (auto-generated from name if missing)
- `name`: Display name (used for matching with stories)
- `lat`: Latitude coordinate (required for mapping/planning)
- `lon`: Longitude coordinate (required for mapping/planning)
- `region`: Geographic region (e.g., "Sicily")
- `tags`: Comma-separated keywords (e.g., "baroque,architecture,unesco")
- `area_type`: Classification (e.g., "city", "town", "village")

### areas_story.csv Format
```csv
name,short_desc,tucci_story
Noto,"Baroque jewel of southeastern Sicily","Full narrative description..."
```

**Columns:**
- `name`: Must match name in areas.csv (case-insensitive)
- `short_desc`: Brief tagline/subtitle
- `tucci_story`: Full narrative description (Tucci-style storytelling)

## Merged Data Model

```typescript
type AreaFull = {
  id: string;           // From areas.csv
  name: string;         // From areas.csv
  slug: string;         // Auto-generated kebab-case
  lat?: number;         // From areas.csv
  lon?: number;         // From areas.csv
  region?: string;      // From areas.csv
  tags?: string[];      // Parsed from areas.csv
  area_type?: string;   // From areas.csv
  short_desc?: string;  // From areas_story.csv
  tucci_story?: string; // From areas_story.csv
  hasCoords: boolean;   // Computed flag
};
```

## API Functions

### `getFullAreas(): Promise<AreaFull[]>`
Returns all areas with merged data from both CSVs.
- Cached in memory for performance
- Sorted by order in areas.csv
- Auto-merges by normalized name matching

```typescript
import { getFullAreas } from '@/lib/areas';

const areas = await getFullAreas();
// Returns all 6 Sicilian cities with full data
```

### `getAreaData(slug: string): Promise<AreaFull | null>`
Get single area by slug.

```typescript
import { getAreaData } from '@/lib/areas';

const noto = await getAreaData('noto');
// Returns full Noto data or null if not found
```

### `clearAreasCache(): void`
Clear in-memory cache (useful for development).

```typescript
import { clearAreasCache } from '@/lib/areas';

clearAreasCache(); // Forces re-read from CSV on next request
```

## Pages & Components

### Area Detail Page
**Location:** `/app/areas/[slug]/page.tsx`

Displays:
- Hero image (if available)
- Area name and subtitle
- Coordinates badge
- Tags as pills
- Full Tucci story
- Region information
- Image gallery

**Usage:**
- Visit `/areas/noto` to see Noto's page
- Visit `/areas/palermo` for Palermo
- Returns 404 for unknown slugs

### Debug Dashboard
**Location:** `/app/debug/areas/page.tsx`

Features:
- Statistics overview (total areas, with coords, with stories)
- Full data table with:
  - Name and slug
  - Region
  - Tags (first 3 + count)
  - Coordinates validation (✅/❌)
  - Story validation (✅/❌)
  - Description validation (✅/❌)
- Action buttons:
  - "View" → Go to area page
  - "Plan" → Go to planner (if has coords)

**Access:** http://localhost:3000/debug/areas

## Validation Script

**Location:** `scripts/validate_areas.js`

Run with:
```bash
node scripts/validate_areas.js
```

**Checks:**
- Duplicate area names
- Missing coordinates
- Missing stories
- Orphaned stories (story without area)
- Data consistency

**Output:**
```
📊 SUMMARY
Total Areas: 6
Total Stories: 6
With Coordinates: 6 ✅
Without Coordinates: 0 ⚠️

📋 DETAILED AREA LIST
1. Noto
   Region: Sicily
   Coords: 36.8919, 15.0708 ✅
   Story: Yes ✅
   Tags: 1 tag(s)
...
✅ VALIDATION PASSED
```

## Integration Points

### For Day Planner
```typescript
import { getFullAreas } from '@/lib/areas';

// Get all areas for city selector
const areas = await getFullAreas();
const areasWithCoords = areas.filter(a => a.hasCoords);

// Use in dropdown
<select>
  {areasWithCoords.map(area => (
    <option key={area.id} value={area.slug}>
      {area.name} - {area.region}
    </option>
  ))}
</select>
```

### For Map Component
```typescript
import { getAreaData } from '@/lib/areas';

const area = await getAreaData(slug);
if (area?.hasCoords) {
  // Render map with pin at area.lat, area.lon
  <Map center={[area.lat, area.lon]} />
}
```

### For Nearby POIs (25-30km radius)
```typescript
// Calculate distance using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find nearby areas
const currentArea = await getAreaData(slug);
const allAreas = await getFullAreas();
const nearby = allAreas.filter(area => 
  area.hasCoords && 
  area.id !== currentArea.id &&
  getDistance(currentArea.lat!, currentArea.lon!, area.lat!, area.lon!) <= 30
);
```

## Performance Considerations

### Caching
- Data is cached in memory after first read
- Cache persists until server restart
- Use `clearAreasCache()` to force reload

### SSR Benefits
- Data fetched server-side
- No loading states needed
- SEO-friendly (full HTML rendered)
- Fast initial page load

### Optimization Tips
```typescript
// ✅ Good: Fetch once, use multiple times
const areas = await getFullAreas();
const noto = areas.find(a => a.slug === 'noto');
const nearby = areas.filter(a => a.hasCoords);

// ❌ Avoid: Multiple reads
const noto = await getAreaData('noto');
const areas = await getFullAreas();
const palermo = await getAreaData('palermo');
```

## Adding New Areas

### 1. Add to areas.csv
```csv
ragusa,Ragusa,36.9272,14.7256,Sicily,baroque,unesco,history,city
```

### 2. Add to areas_story.csv
```csv
Ragusa,"Upper and lower baroque twin cities","Narrative description here..."
```

### 3. Validate
```bash
node scripts/validate_areas.js
```

### 4. Create image manifest (optional)
```json
{
  "slug": "ragusa",
  "images": [],
  "updatedAt": "2025-10-24T12:00:00.000Z"
}
```

### 5. Test
- Visit `/debug/areas` to verify
- Visit `/areas/ragusa` to see page
- Check map shows coordinates

## Planner Integration Checklist

- [x] CSV parsing and merging
- [x] Area data types defined
- [x] Library functions created
- [x] Debug dashboard built
- [x] Area pages updated
- [x] Validation script working
- [ ] City selector in planner
- [ ] Map component integration
- [ ] Distance calculations
- [ ] Itinerary pre-fill
- [ ] POI radius search

## Troubleshooting

### Areas not showing
- Check CSV files exist in `data/` folder
- Run validation script to check format
- Clear cache: `clearAreasCache()`
- Check browser console for errors

### Coordinates not working
- Verify lat/lon are numbers in CSV
- Check validation script output
- Ensure no typos in coordinates
- Test with `/debug/areas` page

### Stories not matching
- Names must match exactly (case-insensitive)
- Check for extra spaces in names
- Run validation to find mismatches
- Use lowercase, trimmed comparison

### Cache not updating
- Restart dev server
- Call `clearAreasCache()` in code
- Check file save timestamps
- Use hard refresh in browser

## Sample Queries

### Get all cities with baroque architecture
```typescript
const areas = await getFullAreas();
const baroque = areas.filter(a => 
  a.tags?.includes('baroque')
);
```

### Get areas within 50km of Noto
```typescript
const noto = await getAreaData('noto');
const all = await getFullAreas();
const nearby = all.filter(a =>
  a.hasCoords &&
  getDistance(noto.lat!, noto.lon!, a.lat!, a.lon!) <= 50
);
```

### Get areas by region
```typescript
const areas = await getFullAreas();
const sicily = areas.filter(a => a.region === 'Sicily');
```

## Future Enhancements

- [ ] Add more regions beyond Sicily
- [ ] POI data in separate CSV
- [ ] Restaurant/hotel affiliates CSV
- [ ] Multi-day itinerary builder
- [ ] Export itinerary as PDF
- [ ] Share itinerary via link
- [ ] Weather API integration
- [ ] Real-time distance/time via Google Maps API

---

**Version:** 1.0.0  
**Last Updated:** October 24, 2025  
**Dependencies:** papaparse, @types/papaparse
