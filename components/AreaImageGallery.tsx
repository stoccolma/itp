'use client';

import { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import type { AreaImage } from '@/lib/areas';
import Image from 'next/image';
import { X } from 'lucide-react';

interface AreaImageGalleryProps {
  images: AreaImage[];
}

export default function AreaImageGallery({ images }: AreaImageGalleryProps) {
  const { settings } = useAccessibility();
  const [selectedImage, setSelectedImage] = useState<AreaImage | null>(null);

  // Filter out featured image (shown in hero)
  const galleryImages = images.filter(img => !img.featured);

  // If text-only mode or no images, don't render
  if (settings.textOnly || galleryImages.length === 0) {
    return null;
  }

  const openLightbox = (image: AreaImage) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary-900 mb-6">Gallery</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image) => (
            <button
              key={image.id}
              onClick={() => openLightbox(image)}
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-primary-200 bg-primary-100 hover:border-gold-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
              aria-label={`View larger: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="relative max-w-6xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="object-contain w-full h-full"
                priority
              />
            </div>

            {/* Caption & Credit in lightbox */}
            {(selectedImage.caption || selectedImage.credit) && (
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                {selectedImage.caption && (
                  <p className="text-base mb-2">{selectedImage.caption}</p>
                )}
                {selectedImage.credit && (
                  <p className="text-sm opacity-80">
                    {selectedImage.source_url ? (
                      <a 
                        href={selectedImage.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-gold-400 transition underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Photo: {selectedImage.credit}
                      </a>
                    ) : (
                      `Photo: ${selectedImage.credit}`
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
