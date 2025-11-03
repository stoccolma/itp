// Simple passkey authentication for admin routes
import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'itp_admin_auth';
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  
  if (!authCookie) {
    return false;
  }

  // Verify the cookie value matches the admin key
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    console.warn('ADMIN_KEY not set in environment variables');
    return false;
  }

  return authCookie.value === adminKey;
}

export async function setAuthCookie(key: string): Promise<boolean> {
  const adminKey = process.env.ADMIN_KEY;
  
  if (!adminKey || key !== adminKey) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, key, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: '/',
  });

  return true;
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
