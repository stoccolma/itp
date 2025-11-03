'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PlanSlot, Sidequest } from '@/lib/plan-utils';

function PrintPageContent() {
  const searchParams = useSearchParams();
  const [slots, setSlots] = useState<PlanSlot[]>([]);
  const [sidequests, setSidequests] = useState<Sidequest[]>([]);
  const [dateISO, setDateISO] = useState('');
  const [areaName, setAreaName] = useState('');
  const [hasTriggeredPrint, setHasTriggeredPrint] = useState(false);

  useEffect(() => {
    // Try to load from query params first
    const from = searchParams.get('from');
    const date = searchParams.get('date');

    if (from && date) {
      setDateISO(date);
      setAreaName(from);
      
      // Load from localStorage
      const storageKey = `planner-${from}-${date}`;
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        try {
          const savedData = JSON.parse(saved);
          setSlots(savedData.slots || []);
          setSidequests(savedData.sidequests || []);
        } catch (e) {
          console.error('Failed to load saved plan:', e);
        }
      }
    }
  }, [searchParams]);

  // Auto-trigger print after content loads
  useEffect(() => {
    if (slots.length > 0 && !hasTriggeredPrint) {
      // Wait for layout to settle
      const timer = setTimeout(() => {
        window.print();
        setHasTriggeredPrint(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [slots, hasTriggeredPrint]);

  // Format date for display
  const dateObj = dateISO ? new Date(dateISO + 'T12:00:00') : new Date();
  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentYear = new Date().getFullYear();

  // Merge and sort all items by time
  const allItems: Array<{ type: 'slot' | 'sidequest'; time: string; data: PlanSlot | Sidequest }> = [
    ...slots.map(slot => ({ type: 'slot' as const, time: slot.time, data: slot })),
    ...sidequests.map(sq => ({ type: 'sidequest' as const, time: sq.time, data: sq }))
  ];
  
  allItems.sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="print-container">
      {/* Header */}
      <header className="print-header">
        <img 
          src="/brand/logo.svg" 
          alt="ItaloPlanner Logo" 
          className="print-logo"
        />
        <div>
          <h1 className="print-title">ItaloPlanner</h1>
          <p className="print-slogan">Discover Sicily, where every stop has a story.</p>
        </div>
      </header>

      {/* Meta Info */}
      <div className="print-meta">
        <h2 className="print-subtitle">Your Itinerary</h2>
        <div className="print-meta-details">
          <span><strong>Date:</strong> {dateFormatted}</span>
          <span><strong>Starting Area:</strong> {areaName}</span>
        </div>
      </div>

      {/* Timeline Table */}
      <table className="print-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>Time</th>
            <th>Place</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {allItems.map((item, index) => {
            if (item.type === 'sidequest') {
              const sq = item.data as Sidequest;
              return (
                <tr key={`sidequest-${sq.id}`} className="print-row print-sidequest-row">
                  <td className="print-time">{sq.time}</td>
                  <td>
                    <div className="print-name">{sq.name}</div>
                    <div className="print-badge">Sidequest</div>
                  </td>
                  <td className="print-details">
                    {sq.note && <div className="print-note">{sq.note}</div>}
                    {sq.distance !== undefined && (
                      <div className="print-distance">📍 {sq.distance.toFixed(1)} km</div>
                    )}
                  </td>
                </tr>
              );
            }
            
            const slot = item.data as PlanSlot;
            
            if (!slot.poi) {
              return (
                <tr key={slot.id} className="print-row">
                  <td className="print-time">{slot.time}</td>
                  <td className="print-empty">—</td>
                  <td className="print-details">{slot.title}</td>
                </tr>
              );
            }

            const poi = slot.poi;
            const address = (poi as any).address || 'Address not provided';
            const lat = (poi as any).lat;
            const lon = (poi as any).lon;
            const sourceUrl = (poi as any).source_url;
            
            // Create Google Maps link
            const mapsUrl = lat && lon 
              ? `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(5)},${lon.toFixed(5)}`
              : address !== 'Address not provided'
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
                : null;

            return (
              <tr key={slot.id} className="print-row">
                <td className="print-time">{slot.time}</td>
                <td>
                  <a 
                    href={`/poi/${poi.id}`}
                    className="print-poi-link"
                  >
                    {poi.name}
                  </a>
                  <div className="print-slot-title">{slot.title}</div>
                </td>
                <td className="print-details">
                  <div className="print-address">{address}</div>
                  <div className="print-links">
                    {mapsUrl && (
                      <a 
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="print-link print-link-maps"
                      >
                        📍 Open in Google Maps
                      </a>
                    )}
                    {sourceUrl && (
                      <a 
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="print-link print-link-website"
                      >
                        🔗 Visit website
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Footer */}
      <footer className="print-footer">
        <div className="print-footer-brand">ItaloPlanner © {currentYear}</div>
        <div className="print-footer-tagline">Built with affection, not data points.</div>
        <div className="print-footer-privacy">Download is generated locally. We don't store your itinerary.</div>
      </footer>
    </div>
  );
}

export default function PrintPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading itinerary...</div>}>
      <PrintPageContent />
    </Suspense>
  );
}
