'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import type { AreaImage } from '@/lib/areas';
import Image from 'next/image';

interface AreaImageHeroProps {
  image: AreaImage | null;
}

export default function AreaImageHero({ image }: AreaImageHeroProps) {
  const { settings } = useAccessibility();

  // If text-only mode is enabled, show placeholder
  if (settings.textOnly) {
    return (
      <div className="bg-primary-100 border-2 border-primary-200 rounded-lg p-8 mb-8">
        <p className="text-center text-primary-600 text-sm">
          Image omitted in Text-Only mode.
        </p>
      </div>
    );
  }

  // If no image, don't render anything
  if (!image) {
    return null;
  }

  return (
    <div className="relative w-full mb-8 overflow-hidden rounded-lg border-2 border-primary-200 bg-primary-100">
      <div className="relative w-full aspect-[21/9] md:aspect-[16/7]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
        />
        
        {/* Accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-50"></div>
      </div>

      {/* Caption & Credit */}
      {(image.caption || image.credit) && (
        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 border-t border-primary-200">
          {image.caption && (
            <p className="text-sm text-primary-900 mb-1">{image.caption}</p>
          )}
          {image.credit && (
            <p className="text-xs text-primary-600">
              {image.source_url ? (
                <a 
                  href={image.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold-600 transition"
                >
                  Photo: {image.credit}
                </a>
              ) : (
                `Photo: ${image.credit}`
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
