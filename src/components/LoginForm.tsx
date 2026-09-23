"use client";

import { useSearchParams } from "next/navigation";

export function LoginForm({ action }: { action: (formData: FormData) => void }) {
  const params = useSearchParams();
  const error = params.get("error");

  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-xs font-medium text-slate-400">Email</span>
        <input
          name="email"
          type="email"
          required
          defaultValue="demo@relayops.dev"
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-slate-400">Password</span>
        <input
          name="password"
          type="password"
          required
          defaultValue="RelayOps2026!"
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
      </label>
      {error && (
        <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          Invalid email or password. Use the demo credentials below.
        </p>
      )}
      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
      >
        Sign in
      </button>
    </form>
  );
}
