'use client';

import { POI } from '@/lib/types';
import { MapPin, Clock, DollarSign, Plus } from 'lucide-react';
import { useState } from 'react';

interface POICardProps {
  poi: POI;
  showActions?: boolean;
}

export default function POICard({ poi, showActions = true }: POICardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getTypeColor = (type: string) => {
    const colors = {
      restaurant: 'bg-terracotta-500',
      cafe: 'bg-gold-500',
      attraction: 'bg-sage-500',
      shop: 'bg-terracotta-400',
      activity: 'bg-sage-400',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden card-shadow hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-1 rounded text-white ${getTypeColor(poi.type)}`}>
                {getTypeLabel(poi.type)}
              </span>
              <span className="text-xs text-espresso-600">{poi.priceRange}</span>
            </div>
            <h3 className="text-xl font-bold text-espresso-900 mb-1">{poi.name}</h3>
            <div className="flex items-center text-sm text-espresso-600">
              <MapPin className="w-4 h-4 mr-1" />
              {poi.address.split(',')[0]}
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="mb-4">
          <p className={`text-lg leading-relaxed text-espresso-800 ${!showFullDescription && 'line-clamp-3'}`}>
            {poi.detailedDescription}
          </p>
          {poi.detailedDescription.length > 200 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-sm text-gold-600 hover:text-gold-700 mt-2 font-semibold"
            >
              {showFullDescription ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-espresso-600 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {poi.timing}
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            {poi.priceRange}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {poi.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                // This would open a date picker in a real app
                alert('Date picker would open here to add to a specific day');
              }}
              className="w-full bg-gold-400 hover:bg-gold-500 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add to Day Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
