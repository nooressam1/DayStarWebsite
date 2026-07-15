const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function serverFetch<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}'${path}`);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}
