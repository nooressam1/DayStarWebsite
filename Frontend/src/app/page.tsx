import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">DayStar</h1>
      <p className="text-black/70 dark:text-white/70">
        Foundation is ready: Next.js frontend + NestJS backend + Supabase auth.
      </p>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="rounded bg-foreground px-4 py-2 text-background"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded border border-black/15 px-4 py-2 dark:border-white/20"
        >
          Sign up
        </Link>
        <Link
          href="/dashboard"
          className="rounded border border-black/15 px-4 py-2 dark:border-white/20"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
