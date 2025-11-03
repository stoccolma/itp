'use client';

import Link from 'next/link';
import { City } from '@/lib/types';
import { MapPin, ChevronRight } from 'lucide-react';

interface CityCardProps {
  city: City;
}

export default function CityCard({ city }: CityCardProps) {
  return (
    <Link href={`/city/${city.id}`}>
      <div className="bg-white rounded-lg overflow-hidden card-shadow hover:shadow-xl transition-all duration-300 group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={city.imageUrl}
            alt={city.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/70 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
            <div className="flex items-center text-sm opacity-90">
              <MapPin className="w-4 h-4 mr-1" />
              {city.region}
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-espresso-800 text-sm leading-relaxed mb-4">
            {city.description}
          </p>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-espresso-600 uppercase tracking-wide">
              Highlights
            </h4>
            <div className="flex flex-wrap gap-2">
              {city.highlights.slice(0, 4).map((highlight, index) => (
                <span
                  key={index}
                  className="text-xs bg-terracotta-100 text-terracotta-700 px-3 py-1 rounded-full"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center text-gold-600 group-hover:text-gold-700 transition">
            <span className="text-sm font-semibold">Explore {city.name}</span>
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
