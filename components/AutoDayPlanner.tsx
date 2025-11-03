import { getFullAreas } from '@/lib/areas';
import { generateDayPlan } from '@/lib/plan';
import { Clock, MapPin, Car, FootprintsIcon } from 'lucide-react';

interface AutoDayPlannerProps {
  areaSlug: string;
  dateISO: string;
}

export default async function AutoDayPlanner({ areaSlug, dateISO }: AutoDayPlannerProps) {
  const areas = await getFullAreas();
  const currentArea = areas.find(a => a.slug === areaSlug);
  
  if (!currentArea) {
    return (
      <div className="bg-white rounded-lg p-6 card-shadow mb-8">
        <h2 className="text-2xl font-bold text-espresso-900 mb-4">Day Planner</h2>
        <p className="text-center text-espresso-600">Area not found.</p>
      </div>
    );
  }

  // Generate the day plan
  const slots = await generateDayPlan(currentArea, areas, dateISO);

  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 card-shadow mb-8">
        <h2 className="text-2xl font-bold text-espresso-900 mb-4">Day Planner</h2>
        <p className="text-center text-espresso-600">
          No nearby places found. Planning features require location coordinates.
        </p>
      </div>
    );
  }

  // Format date for display
  const dateObj = new Date(dateISO + 'T12:00:00');
  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg p-6 card-shadow mb-8">
      <h2 className="text-2xl font-bold text-espresso-900 mb-2">Day Planner</h2>
      <p className="text-terracotta-600 mb-6">{dateFormatted}</p>
      
      <div 
        className="space-y-4"
        role="status"
        aria-live="polite"
        aria-label="Your personalized day plan"
      >
        {slots.map((slot) => {
          return (
            <div
              key={slot.id}
              className="border-l-4 border-gold-400 bg-terracotta-50 rounded-r-lg p-4 hover:bg-terracotta-100 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-espresso-700" />
                    <span className="font-bold text-espresso-900">{slot.time}</span>
                    <span className="text-sm px-2 py-1 bg-gold-100 text-gold-800 rounded">
                      {slot.title}
                    </span>
                  </div>
                  
                  {slot.poi && (
                    <p className="text-espresso-800 mb-2">{slot.poi.name}</p>
                  )}
                  
                  {slot.distance !== undefined && slot.distance > 0 && (
                    <div className="flex items-center gap-4 text-sm text-espresso-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{slot.distance.toFixed(1)} km</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {slot.distance !== undefined && slot.distance > 0 && (
                  <div className="text-right text-sm text-espresso-600">
                    {slot.distance < 2 ? (
                      <div className="flex items-center gap-1">
                        <FootprintsIcon className="w-4 h-4" />
                        <span>Walk</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Car className="w-4 h-4" />
                        <span>Drive</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gold-50 border border-gold-200 rounded-lg">
        <p className="text-sm text-espresso-700">
          <strong>Note:</strong> This is a suggested itinerary based on nearby places. Feel free to adjust times and activities to match your pace.
        </p>
      </div>
    </div>
  );
}
