import { getFeaturedAreaImage, getAreaImages, getAreaData } from '@/lib/areas';
import AreaImageHero from '@/components/AreaImageHero';
import AreaImageGallery from '@/components/AreaImageGallery';
import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch area data
  const areaData = await getAreaData(slug);
  
  // 404 if area not found
  if (!areaData) {
    notFound();
  }
  
  // Fetch images
  const featuredImage = await getFeaturedAreaImage(slug);
  const allImages = await getAreaImages(slug);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Image */}
        <AreaImageHero image={featuredImage} />

        {/* Area Content */}
        <div className="bg-white rounded-lg p-8 mb-8 card-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-primary-900 mb-2">
                {areaData.name}
              </h1>
              {areaData.short_desc && (
                <p className="text-xl text-primary-600 italic">
                  {areaData.short_desc}
                </p>
              )}
            </div>
            {areaData.hasCoords && (
              <div className="flex items-center gap-2 text-sm text-primary-600 bg-primary-50 px-3 py-2 rounded">
                <MapPin className="w-4 h-4" />
                <span>{areaData.lat?.toFixed(4)}, {areaData.lon?.toFixed(4)}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {areaData.tags && areaData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {areaData.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gold-100 text-gold-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Tucci Story */}
          {areaData.tucci_story && (
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-primary-900 mt-8 mb-4">Story</h2>
              <p className="text-primary-800 leading-relaxed whitespace-pre-line">
                {areaData.tucci_story}
              </p>
            </div>
          )}

          {/* Region Info */}
          {areaData.region && (
            <div className="mt-6 pt-6 border-t border-primary-200">
              <span className="text-sm text-primary-600">
                Region: <strong>{areaData.region}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Image Gallery */}
        <AreaImageGallery images={allImages} />

        {/* Placeholder sections */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg p-8 card-shadow">
            <h2 className="text-2xl font-bold text-primary-900 mb-4">Map</h2>
            <p className="text-primary-700">Map component would go here</p>
          </div>

          <div className="bg-white rounded-lg p-8 card-shadow">
            <h2 className="text-2xl font-bold text-primary-900 mb-4">Day Planner</h2>
            <p className="text-primary-700">Day planner component would go here</p>
          </div>

          <div className="bg-white rounded-lg p-8 card-shadow">
            <h2 className="text-2xl font-bold text-primary-900 mb-4">Affiliates</h2>
            <p className="text-primary-700">Affiliates component would go here</p>
          </div>

          <div className="bg-white rounded-lg p-8 card-shadow">
            <h2 className="text-2xl font-bold text-primary-900 mb-4">Sidequests</h2>
            <p className="text-primary-700">Sidequests component would go here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
