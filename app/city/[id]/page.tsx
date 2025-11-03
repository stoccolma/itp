import { cities, pois } from '@/lib/data';
import { notFound } from 'next/navigation';
import POICard from '@/components/POICard';
import { MapPin } from 'lucide-react';

export function generateStaticParams() {
  return cities.map((city) => ({
    id: city.id,
  }));
}

export default async function CityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const city = cities.find((c) => c.id === id);
  
  if (!city) {
    notFound();
  }

  const cityPOIs = pois.filter((poi) => poi.city === city.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-terracotta-50 to-terracotta-100">
      {/* Hero */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={city.imageUrl}
          alt={city.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-900 via-espresso-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg opacity-90">{city.region}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{city.name}</h1>
            <p className="text-xl leading-relaxed opacity-95 font-serif max-w-3xl">
              {city.description}
            </p>
          </div>
        </div>
      </div>

      {/* POIs */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-espresso-900 mb-8">
          Places to Discover
        </h2>
        <div className="space-y-6">
          {cityPOIs.map((poi) => (
            <POICard key={poi.id} poi={poi} />
          ))}
        </div>

        {cityPOIs.length === 0 && (
          <div className="text-center py-12 text-espresso-600">
            <p className="text-lg">More places coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
