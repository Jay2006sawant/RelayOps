import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-indigo-600">Operations automation for startups</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Turn messy feedback into clear execution plans
          </h1>
          <p className="mt-5 text-lg text-slate-600">
            RelayOps helps founder-led teams triage customer notes, assign owners, and track
            progress without another heavyweight project tool.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/app/new"
              className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Create a plan
            </Link>
            <Link
              href="/app"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Open dashboard
            </Link>
          </div>
        </div>

        <section className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">Capture</h2>
            <p className="mt-2 text-sm text-slate-600">
              Paste support threads, call notes, or internal ideas in one place.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">Structure</h2>
            <p className="mt-2 text-sm text-slate-600">
              Get prioritized tasks with owner lanes and timeline hints in seconds.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">Ship</h2>
            <p className="mt-2 text-sm text-slate-600">
              Mark work complete, export Markdown, and share with your team.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
