import { getFullAreas, getAreaImages } from '@/lib/areas';
import { getPOIsNearLocation } from '@/lib/pois';
import Link from 'next/link';

export default async function DebugAreasPage() {
  const areas = await getFullAreas();
  const today = new Date().toISOString().split('T')[0];

  const areasWithCoords = areas.filter(a => a.hasCoords);
  const areasWithoutCoords = areas.filter(a => !a.hasCoords);

  // Gather enhanced data for areas with coords
  const enhancedAreas = await Promise.all(
    areasWithCoords.map(async (area) => {
      const images = await getAreaImages(area.slug);
      const pois = area.lat && area.lon 
        ? await getPOIsNearLocation({ lat: area.lat, lon: area.lon }, 25)
        : [];
      
      return {
        ...area,
        imageCount: images.length,
        poisNearby: pois.length,
      };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Areas Debug View</h1>
          <p className="text-gray-600">
            Total areas: {areas.length} | With coords: {areasWithCoords.length} | Without coords: {areasWithoutCoords.length}
          </p>
        </div>

        {/* Areas with coordinates */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            ✓ Areas with Coordinates ({areasWithCoords.length})
          </h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coordinates
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Images
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    POIs
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Story
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enhancedAreas.map((area) => (
                  <tr key={area.slug} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {area.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {area.slug}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {area.lat?.toFixed(4)}, {area.lon?.toFixed(4)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {area.region || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {area.imageCount > 0 ? (
                        <span className="text-green-600 font-semibold">{area.imageCount}</span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {area.poisNearby > 0 ? (
                        <span className="text-blue-600 font-semibold">{area.poisNearby}</span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {area.tucci_story ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm space-x-2">
                      <Link
                        href={`/?from=${area.slug}&date=${today}`}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Plan
                      </Link>
                      <Link
                        href={`/admin/areas/${area.slug}/images`}
                        className="text-purple-600 hover:text-purple-800 underline"
                      >
                        Images
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Areas without coordinates */}
        {areasWithoutCoords.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-red-700 mb-4">
              ✗ Areas Missing Coordinates ({areasWithoutCoords.length})
            </h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Region
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Has Story
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {areasWithoutCoords.map((area) => (
                    <tr key={area.slug} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {area.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {area.slug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {area.region || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {area.tucci_story ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Data sample */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sample Area Data</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(areas.slice(0, 2), null, 2)}
            </pre>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
