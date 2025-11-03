import { NextRequest } from 'next/server';
import { getPOIs } from '@/lib/pois';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bboxParam = searchParams.get('bbox');
  const catParam = searchParams.get('cat');
  
  try {
    const allPOIs = await getPOIs();
    
    let filtered = allPOIs;
    
    // Filter by bbox if provided (format: minLon,minLat,maxLon,maxLat)
    if (bboxParam) {
      const [minLon, minLat, maxLon, maxLat] = bboxParam.split(',').map(Number);
      if (minLon && minLat && maxLon && maxLat) {
        filtered = filtered.filter(poi => 
          poi.lat && poi.lon &&
          poi.lat >= minLat && poi.lat <= maxLat &&
          poi.lon >= minLon && poi.lon <= maxLon
        );
      }
    }
    
    // Filter by categories if provided
    if (catParam) {
      const categories = catParam.split(',').map(c => c.trim().toLowerCase());
      filtered = filtered.filter(poi => 
        poi.category && categories.includes(poi.category.toLowerCase())
      );
    }
    
    // Convert to GeoJSON FeatureCollection
    const features = filtered
      .filter(poi => poi.lat && poi.lon)
      .map(poi => ({
        type: 'Feature' as const,
        id: poi.id,
        geometry: {
          type: 'Point' as const,
          coordinates: [poi.lon!, poi.lat!]
        },
        properties: {
          id: poi.id,
          name: poi.name,
          category: poi.category,
          area_slug: poi.area_slug,
          address: poi.address,
          address_line1: poi.addressLine1,
          locality: poi.locality,
          region: poi.region,
          postcode: poi.postcode,
          short_desc: poi.short_desc,
          timing: poi.timing,
          tags: poi.tags,
        }
      }));
    
    const geojson = {
      type: 'FeatureCollection' as const,
      features
    };
    
    return Response.json(geojson);
  } catch (error) {
    console.error('Error fetching POIs:', error);
    return Response.json({ error: 'Failed to fetch POIs' }, { status: 500 });
  }
}
