import { notFound, redirect } from 'next/navigation';
import { db } from '@/db';
import { shortlinks } from '@/db/shortlinks';
import { eq } from 'drizzle-orm';
import { isShortlinkExpired } from '@/lib/shortlink';
import Link from 'next/link';

// Force dynamic rendering (don't try to build at compile time)
export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ code: string }>;
};

export default async function ShortlinkRedirectPage({ params }: PageProps) {
  const { code } = await params;

  // Fetch shortlink from database
  const results = await db
    .select()
    .from(shortlinks)
    .where(eq(shortlinks.code, code))
    .limit(1);

  if (results.length === 0) {
    notFound();
  }

  const shortlink = results[0];

  // Check if expired
  if (isShortlinkExpired(shortlink.createdAt, shortlink.ttlDays)) {
    // Return expired page
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
        <div className="container-editorial py-12 text-center">
          <div className="mb-8">
            <h1 className="font-heading text-4xl md:text-5xl mb-4">
              Link Expired
            </h1>
            <p className="font-body text-lg md:text-xl text-[var(--ink)]/70 mb-8">
              This plan link has expired. Plan links are valid for {shortlink.ttlDays} days.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Create a New Plan
            </Link>
            <p className="text-sm text-[var(--ink)]/60">
              Build a new itinerary and share it with a fresh link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to the stored URL
  redirect(shortlink.url);
}
