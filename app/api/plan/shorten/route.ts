export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { db } from "@/db/client";
import { NextResponse } from "next/server";

// your code here...

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { shortlinks } from '@/db/shortlinks';
import { generateShortCode, validateShortlinkUrl } from '@/lib/shortlink';
import { SITE_URL, PLAN_SHORTLINK_TTL_DAYS } from '@/lib/config';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    const validation = validateShortlinkUrl(url, SITE_URL);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Generate unique code (try up to 5 times)
    let code: string = '';
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      code = generateShortCode(6);
      
      // Check if code already exists
      const existing = await db
        .select()
        .from(shortlinks)
        .where(eq(shortlinks.code, code))
        .limit(1);

      if (existing.length === 0) {
        break; // Code is unique
      }

      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: 'Failed to generate unique code' },
        { status: 500 }
      );
    }

    // Insert shortlink
    await db.insert(shortlinks).values({
      code,
      url,
      createdAt: new Date(),
      ttlDays: PLAN_SHORTLINK_TTL_DAYS,
    });

    console.log(`✅ Created shortlink: ${code} -> ${url}`);

    return NextResponse.json({
      code,
      shortUrl: `${SITE_URL}/p/${code}`,
      expiresInDays: PLAN_SHORTLINK_TTL_DAYS,
    });
  } catch (error) {
    console.error('Error creating shortlink:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
