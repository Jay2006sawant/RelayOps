import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-sm">
              AI
            </span>
            RelayOps Intelligence
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-slate-300 hover:text-white">Overview</Link>
            <Link href="/dashboard/new" className="rounded-lg bg-indigo-500 px-3 py-2 font-medium hover:bg-indigo-400">
              Analyze feedback
            </Link>
            <form action={signOutAction}>
              <button type="submit" className="text-slate-400 hover:text-white">Sign out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
