import { createClient } from '@/utils/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * Calls the NestJS backend, attaching the current Supabase access token as a
 * Bearer header so protected routes (e.g. /me) can verify the user.
 * Use from Client Components.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const errorMessage = errorBody?.message || `Request to ${path} failed with ${res.status}`;
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}
