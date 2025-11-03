import { getAreaImages } from '@/lib/areas';
import AreaImageHero from './AreaImageHero';

interface AreaImageHeroWrapperProps {
  slug: string;
}

export default async function AreaImageHeroWrapper({ slug }: AreaImageHeroWrapperProps) {
  const images = await getAreaImages(slug);
  
  // Get featured image or first image
  const featuredImage = images.find(img => img.featured) || images[0] || null;
  
  // If no images, show admin link if applicable
  if (!featuredImage) {
    const isAdmin = process.env.ITP_ADMIN === 'true';
    
    if (isAdmin) {
      return (
        <div className="bg-terracotta-50 border-2 border-terracotta-200 rounded-lg p-6 mb-8 text-center">
          <p className="text-terracotta-700 mb-3">No images yet for this area.</p>
          <a
            href={`/admin/areas/${slug}/images`}
            className="inline-block px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition"
          >
            Add Images (Admin)
          </a>
        </div>
      );
    }
    
    return (
      <div className="bg-terracotta-50 border-2 border-terracotta-200 rounded-lg p-4 mb-8 text-center">
        <p className="text-terracotta-600 text-sm">No images yet for this area.</p>
      </div>
    );
  }
  
  return <AreaImageHero image={featuredImage} />;
}
