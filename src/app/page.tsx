import Link from "next/link";

const features = [
  {
    title: "LLM pipeline",
    body: "Structured GPT-4o-mini output with validation and rule-based fallback.",
  },
  {
    title: "ML signals",
    body: "Sentiment score, urgency index, and automatic topic extraction.",
  },
  {
    title: "Vector recall",
    body: "Embedding similarity surfaces related feedback you already handled.",
  },
  {
    title: "Cloud data",
    body: "PostgreSQL on Neon with Terraform for AWS RDS in production.",
  },
];

const steps = [
  "Paste raw customer or GTM notes",
  "AI ranks urgency and proposes owned tasks",
  "Track completion and export for standups",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.15),_transparent_50%)]" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-xs font-bold">
            AI
          </span>
          RelayOps Intelligence
        </Link>
        <div className="flex gap-2 text-sm sm:gap-3">
          <Link href="/login" className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
            Sign in
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-indigo-500 px-3 py-2 font-medium text-white hover:bg-indigo-400"
          >
            Launch app
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 sm:pt-14">
        <p className="text-sm font-medium text-indigo-400">AI · PostgreSQL · Production ready</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Turn noisy feedback into{" "}
          <span className="text-gradient">clear execution plans</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Built for founder-office and ops interns: ingest notes, run an LLM analysis pipeline,
          persist everything in Postgres, and ship with a real analytics dashboard.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400"
          >
            Open dashboard
          </Link>
          <a
            href="https://github.com/Jay2006sawant/RelayOps"
            className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            View source
          </a>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur"
            >
              <p className="text-xs font-bold text-indigo-400">Step {i + 1}</p>
              <p className="mt-2 text-sm text-slate-200">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-indigo-500/40"
            >
              <h2 className="font-semibold text-white">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
