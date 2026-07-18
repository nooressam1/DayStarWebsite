'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { CustomButton } from "@/modules/shared";
import { useAuthModalStore } from '../hooks/useAuthModalStore';

export default function RegisterModal() {
  const { setView } = useAuthModalStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage('Account created! Check your email to confirm, then sign in.');
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-brand-primary-brown font-serif font-bold text-2xl">Create account</h2>
        <p className="text-brand-gray font-sans text-sm">Join to start shopping</p>
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
            minLength={6}
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-brand-primary-brown/20 px-4 py-2.5 text-sm outline-none focus:border-brand-primary-brown transition-colors font-sans"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <CustomButton
          type="submit"
          disabled={loading}
          variant="solid"
          colorScheme="secondary"
          className="w-full py-3 mt-1"
        >
          {loading ? 'Creating account…' : 'Sign Up'}
        </CustomButton>
      </form>

      <p className="text-center text-sm text-brand-gray font-sans">
        Already have an account?{' '}
        <button
          onClick={() => setView('login')}
          className="text-brand-primary-brown underline font-medium hover:text-brand-light-brown transition-colors cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
