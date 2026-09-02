import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm text-white">
            R
          </span>
          RelayOps
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/app" className="text-slate-600 hover:text-indigo-600">
            Dashboard
          </Link>
          <Link
            href="/app/new"
            className="rounded-lg bg-indigo-600 px-3 py-2 font-medium text-white hover:bg-indigo-700"
          >
            New plan
          </Link>
        </nav>
      </div>
    </header>
  );
}
