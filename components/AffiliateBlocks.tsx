import { getFullAreas } from '@/lib/areas';
import { getAffiliatesForArea } from '@/lib/affiliates';
import { ExternalLink } from 'lucide-react';

interface AffiliateBlocksProps {
  areaSlug: string;
}

export default async function AffiliateBlocks({ areaSlug }: AffiliateBlocksProps) {
  const areas = await getFullAreas();
  const currentArea = areas.find(a => a.slug === areaSlug);
  
  // Get affiliates for this area
  const areaCoords = currentArea?.lat && currentArea?.lon 
    ? { lat: currentArea.lat, lon: currentArea.lon }
    : undefined;
  
  const affiliates = await getAffiliatesForArea(areaSlug, areaCoords, true, 30);
  
  // Limit to top 6 affiliates
  const topAffiliates = affiliates.slice(0, 6);
  
  if (topAffiliates.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 card-shadow mb-8">
        <h2 className="text-2xl font-bold text-espresso-900 mb-4">Local Recommendations</h2>
        <p className="text-center text-espresso-600">No local offers yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 card-shadow mb-8">
      <h2 className="text-2xl font-bold text-espresso-900 mb-2">Local Recommendations</h2>
      <p className="text-sm text-espresso-600 mb-6">
        Curated local experiences supporting independent businesses
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topAffiliates.map((affiliate) => (
          <div
            key={affiliate.id}
            className="border-2 border-terracotta-200 rounded-lg p-4 hover:border-gold-400 hover:shadow-md transition"
          >
            <div className="mb-3">
              <h3 className="font-bold text-espresso-900 mb-1">{affiliate.name}</h3>
              {affiliate.type && (
                <span className="text-xs px-2 py-1 bg-terracotta-100 text-terracotta-700 rounded">
                  {affiliate.type}
                </span>
              )}
            </div>
            
            {affiliate.short_desc && (
              <p className="text-sm text-espresso-700 mb-3">{affiliate.short_desc}</p>
            )}
            
            {affiliate.distance !== undefined && affiliate.distance > 0 && (
              <p className="text-xs text-espresso-600 mb-3">
                {affiliate.distance.toFixed(1)} km away
              </p>
            )}
            
            {affiliate.partner && (
              <p className="text-xs text-gold-700 mb-3">
                Partner: {affiliate.partner}
              </p>
            )}
            
            {affiliate.tracking_url && (
              <a
                href={affiliate.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition"
              >
                <span>Book</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-terracotta-50 border border-terracotta-200 rounded-lg">
        <p className="text-sm text-espresso-700">
          <strong>Supporting local:</strong> These recommendations help independent businesses thrive while giving you authentic experiences.
        </p>
      </div>
    </div>
  );
}
