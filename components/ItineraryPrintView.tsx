'use client';

import type { PlanSlot, Sidequest } from '@/lib/plan';

interface ItineraryPrintViewProps {
  slots: PlanSlot[];
  sidequests?: Sidequest[];
  dateISO: string;
  areaName: string;
}

export default function ItineraryPrintView({ 
  slots, 
  sidequests = [],
  dateISO, 
  areaName 
}: ItineraryPrintViewProps) {
  // Format date for display
  const dateObj = new Date(dateISO + 'T12:00:00');
  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentYear = new Date().getFullYear();

  // Get the base URL for POI links
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://italoplanner.com';

  return (
    <div className="print-view" style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      backgroundColor: 'white',
      color: '#000',
      maxWidth: '210mm',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div className="print-header" style={{
        borderBottom: '3px solid #18181b',
        paddingBottom: '20px',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <img 
          src="/brand/logo.svg" 
          alt="ItaloPlanner Logo" 
          style={{
            width: '140px',
            height: 'auto'
          }}
        />
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            color: '#18181b'
          }}>
            ItaloPlanner
          </h1>
          <p style={{
            fontSize: '14px',
            fontStyle: 'italic',
            color: '#52525b',
            margin: 0
          }}>
            Discover Sicily, where every stop has a story.
          </p>
        </div>
      </div>

      {/* Subheader */}
      <div className="print-subheader" style={{
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: '#f4f4f5',
        borderRadius: '8px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          margin: '0 0 8px 0',
          color: '#18181b'
        }}>
          Your Itinerary
        </h2>
        <div style={{
          fontSize: '14px',
          color: '#52525b',
          display: 'flex',
          gap: '20px'
        }}>
          <span><strong>Date:</strong> {dateFormatted}</span>
          <span><strong>Starting Area:</strong> {areaName}</span>
        </div>
      </div>

      {/* Time slots table with sidequests */}
      <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '40px',
          fontSize: '13px'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#18181b',
              color: 'white'
            }}>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                width: '80px',
                fontWeight: '600'
              }}>Time</th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: '600'
              }}>Place</th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: '600'
              }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              // Merge slots and sidequests, then sort by time
              const allItems: Array<{ type: 'slot' | 'sidequest'; time: string; data: PlanSlot | Sidequest }> = [
                ...slots.map(slot => ({ type: 'slot' as const, time: slot.time, data: slot })),
                ...sidequests.map(sq => ({ type: 'sidequest' as const, time: sq.time, data: sq }))
              ];
              
              allItems.sort((a, b) => a.time.localeCompare(b.time));
              
              return allItems.map((item, index) => {
                if (item.type === 'sidequest') {
                  const sq = item.data as Sidequest;
                  return (
                    <tr 
                      key={`sidequest-${sq.id}`}
                      style={{
                        borderBottom: '1px solid #e4e4e7',
                        backgroundColor: '#fafafa',
                        pageBreakInside: 'avoid'
                      }}
                    >
                      <td style={{
                        padding: '12px',
                        fontWeight: '500',
                        color: '#52525b',
                        verticalAlign: 'top',
                        fontSize: '12px'
                      }}>
                        {sq.time}
                      </td>
                      <td style={{
                        padding: '12px',
                        verticalAlign: 'top'
                      }}>
                        <div style={{
                          fontWeight: '600',
                          fontSize: '14px',
                          color: '#18181b',
                          marginBottom: '2px'
                        }}>
                          {sq.name}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#71717a',
                          fontStyle: 'italic',
                          display: 'inline-block',
                          padding: '2px 6px',
                          backgroundColor: '#e4e4e7',
                          borderRadius: '4px'
                        }}>
                          Sidequest
                        </div>
                      </td>
                      <td style={{
                        padding: '12px',
                        verticalAlign: 'top',
                        color: '#71717a',
                        fontSize: '12px'
                      }}>
                        {sq.note && (
                          <div style={{ marginBottom: '4px', fontStyle: 'italic' }}>
                            {sq.note}
                          </div>
                        )}
                        {sq.distance !== undefined && (
                          <div style={{ fontSize: '11px' }}>
                            📍 {sq.distance.toFixed(1)} km
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                }
                
                const slot = item.data as PlanSlot;
              // If no POI, show time with '—'
              if (!slot.poi) {
                return (
                  <tr 
                    key={slot.id}
                    style={{
                      borderBottom: '1px solid #e4e4e7',
                      pageBreakInside: 'avoid'
                    }}
                  >
                    <td style={{
                      padding: '16px 12px',
                      fontWeight: '600',
                      color: '#18181b',
                      verticalAlign: 'top'
                    }}>
                      {slot.time}
                    </td>
                    <td style={{
                      padding: '16px 12px',
                      verticalAlign: 'top',
                      color: '#71717a',
                      fontStyle: 'italic'
                    }}>
                      —
                    </td>
                    <td style={{
                      padding: '16px 12px',
                      verticalAlign: 'top',
                      color: '#71717a',
                      fontSize: '12px'
                    }}>
                      {slot.title}
                    </td>
                  </tr>
                );
              }

              const poi = slot.poi;
              const address = (poi as any).address || 'Address not provided';
              const lat = (poi as any).lat;
              const lon = (poi as any).lon;
              const sourceUrl = (poi as any).source_url;
              
              // Create Google Maps link with 5 decimal precision
              const mapsUrl = lat && lon 
                ? `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(5)},${lon.toFixed(5)}`
                : address !== 'Address not provided'
                  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
                  : null;

              return (
                <tr 
                  key={slot.id}
                  style={{
                    borderBottom: '1px solid #e4e4e7',
                    pageBreakInside: 'avoid'
                  }}
                >
                  <td style={{
                    padding: '16px 12px',
                    fontWeight: '600',
                    color: '#18181b',
                    verticalAlign: 'top'
                  }}>
                    {slot.time}
                  </td>
                  <td style={{
                    padding: '16px 12px',
                    verticalAlign: 'top'
                  }}>
                    <a 
                      href={`${baseUrl}/poi/${poi.id}`}
                      style={{
                        color: '#2563eb',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '15px',
                        display: 'block',
                        marginBottom: '4px'
                      }}
                    >
                      {poi.name}
                    </a>
                    <div style={{
                      fontSize: '12px',
                      color: '#71717a',
                      fontStyle: 'italic'
                    }}>
                      {slot.title}
                    </div>
                  </td>
                  <td style={{
                    padding: '16px 12px',
                    verticalAlign: 'top'
                  }}>
                    <div style={{ marginBottom: '8px', color: '#52525b' }}>
                      {address}
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      fontSize: '12px'
                    }}>
                      {mapsUrl && (
                        <a 
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#059669',
                            textDecoration: 'none'
                          }}
                        >
                          📍 Open in Google Maps
                        </a>
                      )}
                      {sourceUrl && (
                        <a 
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#7c3aed',
                            textDecoration: 'none'
                          }}
                        >
                          🔗 Visit website
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
                );
              });
            })()}
          </tbody>
        </table>

      {/* Footer */}
      <div className="print-footer" style={{
        borderTop: '2px solid #e4e4e7',
        paddingTop: '20px',
        marginTop: '40px',
        fontSize: '11px',
        color: '#71717a',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: '600', color: '#18181b' }}>
          ItaloPlanner © {currentYear}
        </div>
        <div style={{ marginBottom: '4px', fontStyle: 'italic' }}>
          Built with affection, not data points.
        </div>
        <div style={{ fontSize: '10px', color: '#a1a1aa' }}>
          Download is generated locally. We don't store your itinerary.
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          .print-view {
            padding: 15mm;
          }
          
          .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10mm 15mm;
            background: white;
          }
          
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          thead {
            display: table-header-group;
          }
          
          /* Ensure links are visible in print */
          a {
            text-decoration: underline;
          }
          
          /* Page numbers - supported by some PDF generators */
          .print-footer::after {
            content: counter(page) " of " counter(pages);
            position: absolute;
            right: 15mm;
            bottom: 10mm;
          }
        }
      `}</style>
    </div>
  );
}
