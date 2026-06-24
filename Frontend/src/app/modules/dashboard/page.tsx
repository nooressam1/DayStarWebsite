'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { apiFetch } from '@/utils/api/api.apiFetch';

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
        return;
      }

      try {
        // Calls the NestJS backend's protected /me route.
        const data = await apiFetch('/me');
        setMe(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to reach backend');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="rounded border border-black/15 px-3 py-1.5 text-sm dark:border-white/20"
        >
          Sign out
        </button>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-black/60 dark:text-white/60">
          Response from backend /me
        </h2>
        {loading && <p>Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {me != null && (
          <pre className="overflow-auto rounded bg-black/5 p-4 text-xs dark:bg-white/10">
            {JSON.stringify(me, null, 2)}
          </pre>
        )}
      </section>
    </main>
  );
}
