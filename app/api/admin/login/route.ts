import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookie, clearAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { key, action } = await request.json();

    if (action === 'logout') {
      await clearAuthCookie();
      return NextResponse.json({ success: true });
    }

    if (!key) {
      return NextResponse.json(
        { error: 'Admin key required' },
        { status: 400 }
      );
    }

    const success = await setAuthCookie(key);

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid admin key' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
