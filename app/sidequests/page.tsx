'use client';

import POICard from '@/components/POICard';
import { Bookmark } from 'lucide-react';

export default function SidequestsPage() {
  const sidequests: any[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-terracotta-50 to-terracotta-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Bookmark className="w-8 h-8 text-gold-600" />
            <h1 className="text-4xl font-bold text-espresso-900">Sidequests</h1>
          </div>
          <p className="text-lg text-espresso-700">
            Places you've marked to explore. When you're ready, add them to your day plans.
          </p>
        </div>

        {sidequests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg card-shadow">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-espresso-900 mb-4">No sidequests yet</h2>
            <p className="text-espresso-600 mb-6">
              As you explore cities, bookmark places that catch your eye.
              <br />
              They'll appear here for easy access.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sidequests.map((item) => (
              <POICard key={item.poi.id} poi={item.poi} showActions={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
