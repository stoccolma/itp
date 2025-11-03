export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { db } from "@/db/client";
import { NextResponse } from "next/server";

// your code here...

import { NextRequest, NextResponse } from 'next/server';
import { getFullAreas } from '@/lib/areas';
import { nearbyPOIs } from '@/lib/nearby';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const radius = parseInt(searchParams.get('radius') || '30');
    const allowParam = searchParams.get('allow');
    const excludeParam = searchParams.get('exclude');
    const limit = parseInt(searchParams.get('limit') || '12');

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    // Get area
    const areas = await getFullAreas();
    const area = areas.find((a) => a.slug === slug);

    if (!area) {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    }

    // Parse category filters
    const allowCats = allowParam?.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    const excludeCats = excludeParam?.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

    // Get nearby POIs
    const pois = await nearbyPOIs(area, {
      radiusKm: radius,
      allowCats,
      excludeCats,
      limit,
    });

    return NextResponse.json(pois);
  } catch (error) {
    console.error('Error in /api/nearby:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
