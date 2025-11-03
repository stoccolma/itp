import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /planner to / (home page)
  if (pathname.startsWith('/planner')) {
    const url = request.nextUrl.clone();
    
    // Preserve query params if any
    url.pathname = '/';
    
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/planner/:path*',
  ],
};
