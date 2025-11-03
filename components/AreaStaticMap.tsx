'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import type { AreaFull } from '@/lib/areas';
import { haversineKm, mercatorProject, getBoundingBox } from '@/lib/geo';

interface AreaStaticMapProps {
  area: AreaFull;
  neighbors: AreaFull[];
}

export default function AreaStaticMap({ area, neighbors }: AreaStaticMapProps) {
  const { settings } = useAccessibility();

  // If text-only mode, show simple message
  if (settings.textOnly) {
    return (
      <div className="bg-terracotta-100 border-2 border-terracotta-200 rounded-lg p-6 mb-8">
        <p className="text-center text-terracotta-600 text-sm">
          Map omitted in Text-Only mode.
        </p>
      </div>
    );
  }

  // If no coordinates, can't render map
  if (!area.lat || !area.lon) {
    return (
      <div className="bg-terracotta-100 border-2 border-terracotta-200 rounded-lg p-6 mb-8">
        <p className="text-center text-terracotta-600 text-sm">
          No coordinates available for this area.
        </p>
      </div>
    );
  }

  // Find neighbors within 30 km
  const nearby = neighbors
    .filter(n => 
      n.slug !== area.slug && 
      n.lat && 
      n.lon && 
      haversineKm({ lat: area.lat!, lon: area.lon! }, { lat: n.lat, lon: n.lon }) <= 30
    )
    .map(n => ({
      ...n,
      distance: haversineKm({ lat: area.lat!, lon: area.lon! }, { lat: n.lat!, lon: n.lon! })
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 8); // Limit to 8 neighbors

  // Collect all points for bounding box
  const allPoints = [
    { lat: area.lat, lon: area.lon },
    ...nearby.map(n => ({ lat: n.lat!, lon: n.lon! }))
  ];

  const bbox = getBoundingBox(allPoints);

  // Add padding to bounding box (10%)
  const latPadding = (bbox.maxLat - bbox.minLat) * 0.1 || 0.5;
  const lonPadding = (bbox.maxLon - bbox.minLon) * 0.1 || 0.5;

  const paddedBbox = {
    minLat: bbox.minLat - latPadding,
    maxLat: bbox.maxLat + latPadding,
    minLon: bbox.minLon - lonPadding,
    maxLon: bbox.maxLon + lonPadding,
  };

  // SVG dimensions
  const width = 800;
  const height = 500;

  // Project points to mercator
  const projectedBbox = {
    min: mercatorProject(paddedBbox.minLat, paddedBbox.minLon),
    max: mercatorProject(paddedBbox.maxLat, paddedBbox.maxLon),
  };

  // Scale to SVG coordinates
  const xScale = width / (projectedBbox.max.x - projectedBbox.min.x);
  const yScale = height / (projectedBbox.max.y - projectedBbox.min.y);
  const scale = Math.min(xScale, yScale);

  const projectToSVG = (lat: number, lon: number) => {
    const projected = mercatorProject(lat, lon);
    return {
      x: (projected.x - projectedBbox.min.x) * scale,
      y: height - (projected.y - projectedBbox.min.y) * scale, // Flip y-axis
    };
  };

  // Project all points
  const mainPoint = projectToSVG(area.lat, area.lon);
  const neighborPoints = nearby.map(n => ({
    ...n,
    ...projectToSVG(n.lat!, n.lon!),
  }));

  return (
    <div className="bg-white rounded-lg p-6 card-shadow mb-8">
      <h2 className="text-2xl font-bold text-espresso-900 mb-4">Location</h2>
      
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto border border-terracotta-200 rounded-lg"
        style={{ backgroundColor: '#DEDED1' }}
        role="img"
        aria-label={`Map showing ${area.name} and nearby areas`}
      >
        {/* Background */}
        <rect width={width} height={height} fill="#DEDED1" />

        {/* Connection lines from main area to neighbors */}
        {neighborPoints.map((n, i) => (
          <line
            key={`line-${i}`}
            x1={mainPoint.x}
            y1={mainPoint.y}
            x2={n.x}
            y2={n.y}
            stroke="#B6AE9F"
            strokeWidth="1"
            strokeDasharray="3,3"
            opacity="0.3"
          />
        ))}

        {/* Neighbor markers */}
        {neighborPoints.map((n, i) => (
          <g key={`neighbor-${i}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r="6"
              fill="#C8B59B"
              stroke="#8B7355"
              strokeWidth="2"
            />
            <text
              x={n.x}
              y={n.y - 12}
              textAnchor="middle"
              fill="#8B7355"
              fontSize="12"
              fontWeight="600"
              style={{ pointerEvents: 'none' }}
            >
              {n.name}
            </text>
          </g>
        ))}

        {/* Main area marker (larger) */}
        <g>
          <circle
            cx={mainPoint.x}
            cy={mainPoint.y}
            r="10"
            fill="#C1704E"
            stroke="#8B4513"
            strokeWidth="3"
          />
          <text
            x={mainPoint.x}
            y={mainPoint.y - 18}
            textAnchor="middle"
            fill="#8B4513"
            fontSize="16"
            fontWeight="bold"
            style={{ pointerEvents: 'none' }}
          >
            {area.name}
          </text>
        </g>
      </svg>

      {/* Legend */}
      {nearby.length > 0 && (
        <div className="mt-4 text-sm text-espresso-600">
          <p className="font-semibold mb-2">Nearby areas within 30 km:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {nearby.slice(0, 6).map((n, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-terracotta-400"></span>
                <span>{n.name} ({n.distance.toFixed(1)} km)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
