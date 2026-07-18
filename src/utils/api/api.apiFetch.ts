import { apiClient } from '@/app/api/utils/client';

/**
 * Calls the NestJS backend using the centralized ApiClient request method.
 * Attaches the current Supabase access token as a Bearer header, merges headers,
 * supports timeouts and cache configuration.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  return apiClient.request<T>(path, undefined, options);
}
