'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import DayPlanner from '@/components/DayPlanner';
import NearbyList from '@/components/NearbyList';
import SidequestsList from '@/components/SidequestsList';

interface SimplePlannerLayoutProps {
  initialSlots: any[];
  dateISO: string;
  areaName: string;
  nearbyPlaces: Array<{ id: string; name: string; dist: number }>;
}

export default function SimplePlannerLayout({
  initialSlots,
  dateISO,
  areaName,
  nearbyPlaces
}: SimplePlannerLayoutProps) {
  const [copied, setCopied] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  
  const handleCopyShareLink = async () => {
    if (typeof window === 'undefined') return;
    
    const url = window.location.href;
    setIsShortening(true);
    
    try {
      let urlToCopy = url;
      
      // If URL is > 1800 chars, create a shortlink
      if (url.length > 1800) {
        console.log('URL too long, creating shortlink...');
        const response = await fetch('/api/plan/shorten', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        
        if (response.ok) {
          const data = await response.json();
          urlToCopy = data.shortUrl;
          console.log('✅ Shortlink created:', urlToCopy);
        } else {
          console.warn('Failed to create shortlink, using full URL');
        }
      }
      
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    } finally {
      setIsShortening(false);
    }
  };
  
  return (
    <>
      {/* Share Link Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleCopyShareLink}
          disabled={isShortening}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] text-sm hover:bg-[var(--paper-accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isShortening ? (
            <>
              <Share2 className="w-4 h-4 animate-pulse" />
              Creating link...
            </>
          ) : copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Copy share link
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column - Day Planner */}
      <div className="lg:col-span-7">
        <DayPlanner
          initialSlots={initialSlots}
          dateISO={dateISO}
          areaName={areaName}
        />
      </div>

      {/* Right Column - Nearby + Sidequests */}
      <div className="lg:col-span-5 space-y-4">
        <NearbyList items={nearbyPlaces} />
        <SidequestsList />
      </div>
      </div>
    </>
  );
}
