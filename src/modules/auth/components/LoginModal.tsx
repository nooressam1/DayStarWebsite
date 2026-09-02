'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { CustomButton, useCartStore } from "@/modules/shared";
import { useAuthModalStore } from '@/app/api/hooks';
import { fetchServerCart, mergeGuestCartToDb } from '@/app/api/endpoints/cart.endpoint';

export default function LoginModal() {
  const router = useRouter();
  const { setView, closeModal } = useAuthModalStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error || !data.user) {
      setError(error?.message || "Failed to sign in");
      return;
    }

    // Merge guest cart items into database cart ONCE upon successful login
    try {
      const guestItems = useCartStore.getState().cart;
      useCartStore.getState().setUserId(data.user.id);
      if (guestItems.length > 0) {
        await mergeGuestCartToDb(data.user.id, guestItems);
      }
      const serverCart = await fetchServerCart(data.user.id);
      useCartStore.getState().setCart(serverCart);
    } catch (cartErr) {
      console.error("Failed to merge guest cart on login:", cartErr);
    }

    router.refresh();
    closeModal();
  }

  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-brand-primary-brown font-serif font-bold text-2xl">Welcome back</h2>
        <p className="text-brand-gray font-sans text-sm">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-brand-primary-brown font-sans text-sm font-medium">Email</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-brand-primary-brown/20 px-4 py-2.5 text-sm outline-none focus:border-brand-primary-brown transition-colors font-sans"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-brand-primary-brown font-sans text-sm font-medium">Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-brand-primary-brown/20 px-4 py-2.5 text-sm outline-none focus:border-brand-primary-brown transition-colors font-sans"
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs text-center font-sans font-medium">{error}</p>
        )}

        <CustomButton
          type="submit"
          disabled={loading}
          variant="solid"
          colorScheme="secondary"
          className="w-full py-3 mt-1"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </CustomButton>
      </form>


    </div>
  );
}
