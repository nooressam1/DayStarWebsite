'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/utils/api/api.apiFetch';
import { useAuth } from '@/lib/supabase/auth-provider';

export default function DashboardPage() {
  const { user } = useAuth();
  const [me, setMe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    (async () => {
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
  }, [user]);

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div>
        <h1 className="text-2xl font-serif font-bold text-brand-primary-brown">
          Profile Overview
        </h1>
        <p className="text-sm text-brand-gray">
          Manage your personal details and view your account status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Profile Card */}
        <div className="bg-[#FAF5F3]/50 p-6 rounded-xl border border-[#78534a]/10 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-brand-primary-brown uppercase tracking-wider font-sans">
            Personal Information
          </h2>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-brand-gray">Email Address</span>
            <span className="text-sm font-medium text-brand-primary-brown">
              {user?.email || "Not Available"}
            </span>
          </div>
        </div>

        {/* System Diagnostics */}
        <div className="bg-[#FAF5F3]/50 p-6 rounded-xl border border-[#78534a]/10 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-brand-primary-brown uppercase tracking-wider font-sans">
            Account Status (Server response)
          </h2>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-brand-gray mb-1">Backend Connection Status</span>
            {loading && <span className="text-sm text-brand-gray">Loading details...</span>}
            {error && <span className="text-sm text-red-500">{error}</span>}
            {me != null && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-brand-secondary-blue font-semibold">
                  Authenticated and Connected
                </span>
                <span className="text-xs text-brand-gray">
                  User ID: {me.id || me.sub || "N/A"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
