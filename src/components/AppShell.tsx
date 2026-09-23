import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:py-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-xs font-bold">
              AI
            </span>
            <span className="hidden sm:inline">RelayOps Intelligence</span>
            <span className="sm:hidden">RelayOps</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm sm:gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg px-2 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/new"
              className="rounded-lg bg-indigo-500 px-3 py-2 font-medium text-white hover:bg-indigo-400"
            >
              Analyze
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-lg px-2 py-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
