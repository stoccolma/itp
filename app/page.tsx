import { getFullAreas } from '@/lib/areas';
import { getPOIs } from '@/lib/pois';
import { generateDayPlan } from '@/lib/plan';
import { haversineKm } from '@/lib/geo';
import { getCityIntro } from '@/lib/cities';
import OneLinePlanner from '@/components/OneLinePlanner';
import SimplePlannerLayout from '@/components/SimplePlannerLayout';
import ItaloMapWrapper from './components/ItaloMapWrapper';
import SicilyFooter from './components/SicilyFooter';
import DestinationStory from './components/DestinationStory';
import { StoryPreview } from '@/components/StoryPreview';
import { QuoteBand } from '@/components/QuoteBand';
import { EditorialFooter } from '@/components/EditorialFooter';
import { getFeaturedStories } from '@/lib/editorial';
import Link from 'next/link';

type PageProps = {
  searchParams: Promise<{
    from?: string;
    date?: string;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const areas = await getFullAreas();
  const params = await searchParams;
  
  const from = params.from;
  const date = params.date;
  const canStart = Boolean(from && date);
  const currentArea = canStart ? areas.find(a => a.slug === from) : null;
  
  // Get featured stories for Editorial Hero
  const featuredStories = await getFeaturedStories(3);
  
  // Get city intro text
  const cityIntro = from ? getCityIntro(from) : null;

  // Generate day plan server-side
  const dayPlan = canStart && currentArea 
    ? await generateDayPlan(currentArea, areas, date!)
    : [];

  // Generate spots for rail server-side
  let spotsItems: Array<{ id: string; name: string; dist: number }> = [];
  if (canStart && currentArea && currentArea.lat && currentArea.lon) {
    const centerCoords = { lat: currentArea.lat, lon: currentArea.lon };
    const allPOIs = await getPOIs();
    
    const nearbyPOIs = allPOIs
      .filter(poi => poi.lat && poi.lon)
      .map(poi => ({
        id: poi.id,
        name: poi.name,
        dist: haversineKm(centerCoords, { lat: poi.lat!, lon: poi.lon! }),
      }))
      .filter(p => p.dist <= 30)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 12);

    // Fallback to nearby areas if no POIs
    spotsItems = nearbyPOIs.length > 0 
      ? nearbyPOIs 
      : areas
          .filter(a => a.slug !== from && a.lat && a.lon)
          .map(a => ({
            id: a.slug,
            name: a.name,
            dist: haversineKm(centerCoords, { lat: a.lat!, lon: a.lon! }),
          }))
          .filter(a => a.dist <= 40)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 12);
  }

  return (
    <>
      {/* Planner Section - Top of page */}
      <section id="planner" className="container-editorial py-12 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-heading mb-3">
            Plan your day
          </h1>
          <p className="text-lg md:text-xl text-[var(--ink)]/70">
            Pick a city and date to build your itinerary. The map appears when you're ready.
          </p>
        </div>

        {/* One-line planner with subtle card */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4 md:p-6">
            <OneLinePlanner />
            <p className="text-xs text-[var(--ink)]/50 text-center mt-3 italic">
              Currently limited to Sicily itineraries.
            </p>
          </div>
        </div>

        {/* Map Section - Only show when planning */}
        {canStart && (
          <div className="max-w-7xl mx-auto mt-8" data-map-section>
            <div className="w-full h-[60vh] rounded-xl overflow-hidden border border-[color-mix(in_oklab,var(--ink)_15%,transparent)]">
              <ItaloMapWrapper 
                areas={areas
                  .filter(a => a.lat && a.lon)
                  .map(a => ({
                    id: a.slug,
                    name: a.name,
                    lon: a.lon!,
                    lat: a.lat!
                  }))}
              />
            </div>
          </div>
        )}
      </section>

      {/* Divider before featured stories */}
      {!canStart && <div className="section-divider" />}

      {/* Featured Stories - Only show when not planning */}
      {!canStart && (
        <section className="container-editorial py-12 md:py-16">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-heading text-3xl md:text-4xl tracking-tight">
              Featured Stories
            </h2>
            <Link
              href="/magazine"
              className="font-mono text-sm text-[var(--accent)] hover:opacity-70 transition-opacity"
            >
              All Stories →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {featuredStories.map((story) => (
              <StoryPreview key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}

      {/* Divider before planner layout */}
      {canStart && <div className="section-divider" />}

      {/* Two-Pane Planner Layout */}
      {canStart && currentArea && (
        <div className="container-editorial py-12">
          <SimplePlannerLayout
            initialSlots={dayPlan}
            dateISO={date!}
            areaName={currentArea.name}
            nearbyPlaces={spotsItems}
          />

          {/* Destination Story */}
          <div className="mt-8">
            <DestinationStory
              areaName={currentArea.name}
              citySlug={currentArea.slug}
              introText={cityIntro?.intro}
            />
          </div>
        </div>
      )}
      
      {canStart ? <SicilyFooter /> : <EditorialFooter />}
    </>
  );
}
