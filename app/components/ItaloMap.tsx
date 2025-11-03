'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { usePlanStore, CITY_BBOX, type CitySlug } from '@/stores/planStore';

// Sicily-wide default view
const SICILY_CENTER: [number, number] = [14.0, 37.5];
const SICILY_ZOOM = 8;

const SICILY_BOUNDS: [[number, number], [number, number]] = [
  [12.20, 36.55], // SW corner (west of Palermo, south of Agrigento)
  [15.75, 38.45]  // NE corner (east of Taormina, north of Palermo)
];

// City centroids for fail-safe zoom
const CITY_CENTROIDS: Record<string, [number, number]> = {
  palermo: [13.3613, 38.1157],
  catania: [15.0872, 37.5029],
  taormina: [15.2877, 37.8530],
  siracusa: [15.2875, 37.0594],
  noto: [15.0746, 36.8890],
  agrigento: [13.5833, 37.3111]
};

const MAP_STYLES = [
  { name: 'Satellite', url: 'https://tiles.stadiamaps.com/styles/alidade_satellite.json' },
  { name: 'Dark', url: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json' },
];

// Featured six destinations with accurate coordinates
const FEATURED_DESTINATIONS = [
  { slug: 'palermo', name: 'Palermo', lon: 13.3614, lat: 38.1157 },
  { slug: 'catania', name: 'Catania', lon: 15.0870, lat: 37.5079 },
  { slug: 'taormina', name: 'Taormina', lon: 15.2869, lat: 37.8517 },
  { slug: 'siracusa', name: 'Siracusa', lon: 15.2866, lat: 37.0755 },
  { slug: 'noto', name: 'Noto', lon: 15.0698, lat: 36.8907 },
  { slug: 'agrigento', name: 'Agrigento', lon: 13.5765, lat: 37.3110 }
];

interface ItaloMapProps {
  // areas prop no longer needed but kept for compatibility
  areas?: any[];
}

// Robust zoom function with 3-step fallback
async function focusCity(
  city: CitySlug,
  mapRef: React.MutableRefObject<maplibregl.Map | null>,
  mapReady: boolean
): Promise<void> {
  console.info('[ZoomV2] start', city);
  
  if (!mapReady || !mapRef.current) {
    console.warn('[ZoomV2] Not ready');
    return;
  }
  
  const map = mapRef.current;
  
  // Check container height
  const container = map.getContainer();
  if (container.offsetHeight < 200) {
    console.warn('[ZoomV2] Container too small, waiting');
    await new Promise(r => setTimeout(r, 100));
    map.resize();
  }
  
  // Stop ongoing animations
  map.stop();
  
  // STEP A: Try bbox fit
  const bbox = CITY_BBOX[city];
  if (bbox && Array.isArray(bbox) && bbox.length === 2) {
    try {
      console.info('[ZoomV2] A bbox attempt');
      map.resize();
      
      map.fitBounds(bbox, {
        padding: 48,
        animate: true,
        duration: 900
      });
      
      await new Promise<void>((resolve) => {
        map.once('moveend', () => resolve());
        setTimeout(() => resolve(), 1500);
      });
      
      const zoom = map.getZoom();
      const center = map.getCenter();
      
      if (zoom >= 9 && zoom <= 16) {
        console.info('[ZoomV2] A bbox success - center:', center, 'zoom:', zoom);
        map.easeTo({ pitch: 30, bearing: 10, duration: 600 });
        return;
      }
      
      console.warn('[ZoomV2] A bbox fail - zoom:', zoom);
    } catch (err) {
      console.warn('[ZoomV2] A bbox error:', err);
    }
  }
  
  // STEP C: Fly to centroid (fail-safe)
  const centroid = CITY_CENTROIDS[city];
  if (centroid) {
    try {
      console.info('[ZoomV2] C centroid used');
      
      map.flyTo({
        center: centroid,
        zoom: 13,
        speed: 0.8,
        curve: 1.3
      });
      
      await new Promise(r => setTimeout(r, 1200));
      
      const center = map.getCenter();
      const zoom = map.getZoom();
      console.info('[ZoomV2] C complete - center:', center, 'zoom:', zoom);
    } catch (err) {
      console.error('[ZoomV2] C centroid fail:', err);
    }
  }
}

export default function ItaloMap({ areas = [] }: ItaloMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [currentStyle, setCurrentStyle] = useState(MAP_STYLES[0].name);
  const [mapReady, setMapReady] = useState(false);
  const router = useRouter();

  // Function to fetch and update POIs based on current map bounds
  const fetchAndUpdatePOIs = async () => {
    const map = mapRef.current;
    if (!map) {
      console.warn('🗺️ POI fetch skipped: map not ready');
      return;
    }
    
    try {
      const source = map.getSource('pois') as maplibregl.GeoJSONSource | undefined;
      if (!source) {
        console.warn('🗺️ POI source not ready, retrying in 100ms');
        setTimeout(fetchAndUpdatePOIs, 100);
        return;
      }
      
      const bounds = map.getBounds();
      const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
      
      console.log('🗺️ Fetching POIs for bbox:', bbox);
      const response = await fetch(`/api/pois?bbox=${bbox}`);
      
      if (response.ok) {
        const geojson = await response.json();
        source.setData(geojson);
        console.log('🗺️ POIs updated:', geojson.features?.length || 0, 'features');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('🗺️ POI fetch failed:', error.message);
      } else {
        console.error('🗺️ POI fetch failed:', error);
      }
    }
  };

  // Function to clear POIs
  const clearPOIs = () => {
    const map = mapRef.current;
    if (!map) return;
    
    const source = map.getSource('pois') as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: []
      });
      console.log('🗺️ POIs cleared');
    }
  };

  // Function to add POI layers with color differentiation
  const addPOILayers = (map: maplibregl.Map) => {
    console.log('🗺️ Adding POI layers');
    
    // Add plan POIs layer (main itinerary stops) - teal
    map.addLayer({
      id: 'plan-pois',
      type: 'circle',
      source: 'pois',
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'role'], 'plan']],
      paint: {
        'circle-color': '#43b3ae',
        'circle-radius': 6,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Add sidequest POIs layer - orange
    map.addLayer({
      id: 'sidequest-pois',
      type: 'circle',
      source: 'pois',
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'role'], 'sidequest']],
      paint: {
        'circle-color': '#ff9966',
        'circle-radius': 6,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#000000'
      }
    });
    
    // Add generic POIs layer (no role specified)
    map.addLayer({
      id: 'poi-points',
      type: 'circle',
      source: 'pois',
      filter: ['all', ['!', ['has', 'point_count']], ['!', ['has', 'role']]],
      paint: {
        'circle-color': '#ff9966',
        'circle-radius': 5,
        'circle-stroke-width': 0.5,
        'circle-stroke-color': '#000000'
      }
    });

    // Add click handlers for POI markers
    const handlePoiClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      const feature = e.features?.[0];
      if (!feature || !feature.geometry) return;

      const props = feature.properties || {};
      const name = props.name || 'Unknown';
      const shortDesc = props.short_desc || props.tucci_short || '';
      const distanceLabel = props.distance_label || '';

      // Get coordinates
      const coords = feature.geometry.type === 'Point'
        ? (feature.geometry as GeoJSON.Point).coordinates as [number, number]
        : e.lngLat.toArray() as [number, number];

      // Create popup HTML
      const html = `
        <div class="text-sm p-2">
          <strong class="text-base">${name}</strong><br/>
          ${shortDesc ? `<p class="text-xs mt-1 text-zinc-600 text-[var(--ink)]/60">${shortDesc}</p>` : ''}
          ${distanceLabel ? `<em class="text-xs text-zinc-500">${distanceLabel}</em><br/>` : ''}
          <button 
            id="add-sidequest-${props.id}" 
            class="mt-2 px-2 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
          >
            + Add to Sidequests
          </button>
        </div>
      `;

      // Create and show popup
      const popup = new maplibregl.Popup({ 
        offset: 12, 
        closeOnMove: false,
        closeButton: true
      })
        .setLngLat(coords)
        .setHTML(html)
        .addTo(map);

      // Attach click listener to button
      setTimeout(() => {
        const btn = document.getElementById(`add-sidequest-${props.id}`);
        if (btn) {
          btn.onclick = () => {
            console.log('📍 Adding to sidequests:', name);
            // Close popup
            popup.remove();
            // Add to sidequests via store
            const { addSidequest } = usePlanStore.getState();
            addSidequest({
              id: props.id || `poi-${Date.now()}`,
              name: name,
              walkMinutes: props.walk_minutes,
              walkMeters: props.walk_meters,
              lat: coords[1],
              lon: coords[0],
              type: props.type
            });
          };
        }
      }, 0);
    };

    // Register click handlers
    map.on('click', 'plan-pois', handlePoiClick);
    map.on('click', 'sidequest-pois', handlePoiClick);
    map.on('click', 'poi-points', handlePoiClick);

    // Add cursor pointer on hover
    map.on('mouseenter', 'plan-pois', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'plan-pois', () => {
      map.getCanvas().style.cursor = '';
    });
    
    map.on('mouseenter', 'sidequest-pois', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'sidequest-pois', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('mouseenter', 'poi-points', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'poi-points', () => {
      map.getCanvas().style.cursor = '';
    });

    console.log('🗺️ POI click handlers registered');
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // Initialize only once

    // Create map with Satellite style as default, centered on Sicily
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.stadiamaps.com/styles/alidade_satellite.json',
      center: SICILY_CENTER,
      zoom: SICILY_ZOOM,
      maxBounds: SICILY_BOUNDS,
      fitBoundsOptions: { padding: 32 },
      minZoom: 5.5,
      renderWorldCopies: false,
      scrollZoom: false,
      keyboard: false,
      boxZoom: false,
      dragRotate: false,
      pitchWithRotate: false,
    });

    mapRef.current = map;

    // Expose map for testing (non-production only)
    if (process.env.NODE_ENV !== 'production') {
      (window as any).__italoMap = mapRef.current;
      (window as any).__italoFitHome = () => mapRef.current?.fitBounds(SICILY_BOUNDS as any, { padding: 32, duration: 700 });
      (window as any).__italoLayers = () => mapRef.current?.getStyle().layers?.map(l => l.id) ?? [];
    }

    // Disable rotation
    map.touchZoomRotate.disableRotation();

    // Require Ctrl+wheel to zoom, normal wheel scrolls page
    map.scrollZoom.disable();
    const canvas = map.getCanvas();
    canvas.addEventListener('wheel', (e: WheelEvent) => {
      if (e.ctrlKey) {
        map.scrollZoom.enable();
      } else {
        map.scrollZoom.disable();
      }
    }, { passive: true });

    // Add sources and layers when style loads
    map.on('load', () => {
      console.info('[Map] load fired');
      setMapReady(true);
      
      // Add destinations GeoJSON source (featured six cities)
      const destinationFeatures = FEATURED_DESTINATIONS.map(dest => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [dest.lon, dest.lat]
        },
        properties: {
          slug: dest.slug,
          name: dest.name
        }
      }));

      map.addSource('destinations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: destinationFeatures
        }
      });

      // Add destination circles layer (visible at zoom ~5-10.5)
      map.addLayer({
        id: 'destination-circles',
        type: 'circle',
        source: 'destinations',
        paint: {
          'circle-color': '#d4af37',
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            6, 4,
            10, 12
          ],
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0.8,
            10.5, 0
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0.9,
            10.5, 0
          ]
        },
        minzoom: 6,
        maxzoom: 10.5
      });

      // Add destination labels layer (visible at zoom ~5-10.5)
      map.addLayer({
        id: 'destination-labels',
        type: 'symbol',
        source: 'destinations',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 12,
          'text-offset': [0, 1.5],
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1,
          'text-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 1,
            10.5, 0
          ]
        },
        minzoom: 5,
        maxzoom: 10.5
      });

      // Add empty POI source (created once)
      if (!map.getSource('pois')) {
        console.log('🗺️ Creating POI source');
        map.addSource('pois', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          },
          cluster: true,
          clusterRadius: 40,
          clusterMaxZoom: 14
        });

        // Add POI layers
        addPOILayers(map);
      }

      // Add click handler for destinations
      map.on('click', 'destination-circles', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const slug = feature.properties?.slug;
          const coordinates = (feature.geometry as any).coordinates;
          
          if (slug && coordinates) {
            // Get current URL parameters
            const currentParams = new URLSearchParams(window.location.search);
            const existingDate = currentParams.get('date');
            
            // Use existing date if present, otherwise use today
            const dateToUse = existingDate || new Date().toISOString().split('T')[0];
            
            // Navigate to planner with this destination (without scrolling)
            router.push(`/?from=${slug}&date=${dateToUse}`, { scroll: false });
            
            // Zoom in with animation
            map.easeTo({
              center: [coordinates[0], coordinates[1]],
              zoom: 11,
              pitch: 30,
              duration: 1200
            });
          }
        }
      });

      // Change cursor on hover for destinations
      map.on('mouseenter', 'destination-circles', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'destination-circles', () => {
        map.getCanvas().style.cursor = '';
      });

      // Handle zoom-based POI fetching
      const handleZoomEnd = () => {
        const zoom = map.getZoom();
        if (zoom >= 11) {
          fetchAndUpdatePOIs();
        } else {
          clearPOIs();
        }
      };

      map.on('zoomend', handleZoomEnd);
      map.on('moveend', () => {
        const zoom = map.getZoom();
        if (zoom >= 11) {
          fetchAndUpdatePOIs();
        }
      });

      // Initial check
      handleZoomEnd();
    });

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [areas, router]);

  // Effect to zoom to selected city using robust focusCity
  const searchParams = useSearchParams();
  const city = searchParams?.get('from') as CitySlug | null;
  
  useEffect(() => {
    if (!city || !mapReady) return;
    
    focusCity(city, mapRef, mapReady);
  }, [city, mapReady]);

  // Separate effect for zoom events to avoid re-adding listeners
  useEffect(() => {
    const handleZoomToArea = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { lon, lat } = customEvent.detail;
      if (mapRef.current && lon && lat) {
        // Wait a bit to ensure map is ready
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.easeTo({
              center: [lon, lat],
              zoom: 11,
              pitch: 30,
              duration: 1200
            });
          }
        }, 100);
      }
    };

    window.addEventListener('zoomToArea', handleZoomToArea);

    return () => {
      window.removeEventListener('zoomToArea', handleZoomToArea);
    };
  }, []);

  const handleReset = () => {
    const m = mapRef.current;
    if (!m || !mapReady) return;
    
    console.info('[Map] reset to Sicily bounds');
    m.stop(); // Stop any ongoing animations
    m.resize();
    m.fitBounds(SICILY_BOUNDS, { 
      padding: 48, // More padding for better framing
      animate: true,
      duration: 700 
    });
  };

  const handleZoomIn = () => {
    const m = mapRef.current;
    if (!m || !mapReady) return;
    m.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    const m = mapRef.current;
    if (!m || !mapReady) return;
    m.zoomOut({ duration: 300 });
  };

  const handleStyleChange = (styleName: string) => {
    const style = MAP_STYLES.find(s => s.name === styleName);
    if (style && mapRef.current) {
      setCurrentStyle(styleName);
      mapRef.current.setStyle(style.url);
      
      // Re-add all layers after style changes
      mapRef.current.once('styledata', () => {
        if (!mapRef.current) return;
        
        // Re-add destinations GeoJSON source
        const destinationFeatures = FEATURED_DESTINATIONS.map(dest => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [dest.lon, dest.lat]
          },
          properties: {
            slug: dest.slug,
            name: dest.name
          }
        }));

        mapRef.current.addSource('destinations', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: destinationFeatures
          }
        });

        // Re-add destination circles layer
        mapRef.current.addLayer({
          id: 'destination-circles',
          type: 'circle',
          source: 'destinations',
          paint: {
            'circle-color': '#d4af37',
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              6, 4,
              10, 12
            ],
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0.8,
              10.5, 0
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0.9,
              10.5, 0
            ]
          },
          minzoom: 6,
          maxzoom: 10.5
        });

        // Re-add destination labels layer
        mapRef.current.addLayer({
          id: 'destination-labels',
          type: 'symbol',
          source: 'destinations',
          layout: {
            'text-field': ['get', 'name'],
            'text-size': 12,
            'text-offset': [0, 1.5],
            'text-anchor': 'top'
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 1,
            'text-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 1,
              10.5, 0
            ]
          },
          minzoom: 5,
          maxzoom: 10.5
        });

        // Re-add POI source
        mapRef.current.addSource('pois', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          },
          cluster: true,
          clusterRadius: 40,
          clusterMaxZoom: 14
        });

        // Re-add POI layers
        addPOILayers(mapRef.current);

        // Re-add click handler for destinations
        mapRef.current.on('click', 'destination-circles', (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const slug = feature.properties?.slug;
            const coordinates = (feature.geometry as any).coordinates;
            
            if (slug && coordinates) {
              // Get current URL parameters
              const currentParams = new URLSearchParams(window.location.search);
              const existingDate = currentParams.get('date');
              
              // Use existing date if present, otherwise use today
              const dateToUse = existingDate || new Date().toISOString().split('T')[0];
              
              router.push(`/?from=${slug}&date=${dateToUse}`, { scroll: false });
              
              if (mapRef.current) {
                mapRef.current.easeTo({
                  center: [coordinates[0], coordinates[1]],
                  zoom: 11,
                  pitch: 30,
                  duration: 1200
                });
              }
            }
          }
        });

        // Re-add cursor handlers for destinations
        mapRef.current.on('mouseenter', 'destination-circles', () => {
          if (mapRef.current) {
            mapRef.current.getCanvas().style.cursor = 'pointer';
          }
        });

        mapRef.current.on('mouseleave', 'destination-circles', () => {
          if (mapRef.current) {
            mapRef.current.getCanvas().style.cursor = '';
          }
        });

        // Re-add zoom-based POI fetching
        const handleZoomEnd = () => {
          if (!mapRef.current) return;
          const zoom = mapRef.current.getZoom();
          if (zoom >= 11) {
            fetchAndUpdatePOIs();
          } else {
            clearPOIs();
          }
        };

        mapRef.current.on('zoomend', handleZoomEnd);
        mapRef.current.on('moveend', () => {
          if (!mapRef.current) return;
          const zoom = mapRef.current.getZoom();
          if (zoom >= 11) {
            fetchAndUpdatePOIs();
          }
        });

        // Initial check after style change
        handleZoomEnd();
      });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div id="map-container" ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }} />
      
      {/* Control buttons overlay */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {/* Reset button */}
        <button
          onClick={handleReset}
          className="bg-white bg-[var(--card)] text-zinc-900 text-[var(--ink)] px-3 py-1.5 rounded shadow-md hover:shadow-lg transition-shadow text-sm font-medium border border-zinc-200 border-[var(--line)]"
          aria-label="Reset map view"
          data-testid="map-reset"
        >
          Reset
        </button>
        
        {/* Style selector dropdown */}
        <select
          id="map-style-selector"
          name="mapStyle"
          value={currentStyle}
          onChange={(e) => handleStyleChange(e.target.value)}
          className="bg-white bg-[var(--card)] text-zinc-900 text-[var(--ink)] px-3 py-1.5 rounded shadow-md hover:shadow-lg transition-shadow text-sm font-medium border border-zinc-200 border-[var(--line)] cursor-pointer"
          aria-label="Map style selector"
          data-testid="map-style"
        >
          {MAP_STYLES.map(style => (
            <option key={style.name} value={style.name}>
              {style.name}
            </option>
          ))}
        </select>
      </div>

      {/* Zoom controls overlay */}
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        {/* Zoom in button */}
        <button
          onClick={handleZoomIn}
          className="bg-white bg-[var(--card)] text-zinc-900 text-[var(--ink)] w-10 h-10 rounded shadow-md hover:shadow-lg transition-shadow text-lg font-bold border border-zinc-200 border-[var(--line)] flex items-center justify-center"
          aria-label="Zoom in"
          data-testid="map-zoom-in"
        >
          +
        </button>
        
        {/* Zoom out button */}
        <button
          onClick={handleZoomOut}
          className="bg-white bg-[var(--card)] text-zinc-900 text-[var(--ink)] w-10 h-10 rounded shadow-md hover:shadow-lg transition-shadow text-lg font-bold border border-zinc-200 border-[var(--line)] flex items-center justify-center"
          aria-label="Zoom out"
          data-testid="map-zoom-out"
        >
          −
        </button>
      </div>
    </div>
  );
}
