import { getAreaImages } from '@/lib/areas';
import AreaImageGallery from './AreaImageGallery';

interface AreaImageGalleryWrapperProps {
  slug: string;
}

export default async function AreaImageGalleryWrapper({ slug }: AreaImageGalleryWrapperProps) {
  const images = await getAreaImages(slug);
  
  // Filter out featured image (shown in hero)
  const galleryImages = images.filter(img => !img.featured);
  
  // If no gallery images, don't render anything
  if (galleryImages.length === 0) {
    return null;
  }
  
  return <AreaImageGallery images={galleryImages} />;
}
