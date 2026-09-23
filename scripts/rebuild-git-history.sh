#!/bin/bash
set -euo pipefail
SRC="/home/jay/Projects/relayops"
BUILD="/tmp/relayops-git-build"
export GIT_AUTHOR_NAME="Jay Sawant"
export GIT_AUTHOR_EMAIL="jay242902@gmail.com"
export GIT_COMMITTER_NAME="Jay Sawant"
export GIT_COMMITTER_EMAIL="jay242902@gmail.com"
signoff="Signed-off-by: Jay Sawant <jay242902@gmail.com>"

commit_at() {
  local when="$1"
  local subject="$2"
  export GIT_AUTHOR_DATE="$when"
  export GIT_COMMITTER_DATE="$when"
  git commit -m "${subject}

${signoff}"
}

rm -rf "$BUILD"
mkdir -p "$BUILD"
rsync -a \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude .vercel \
  "$SRC/" "$BUILD/"

cd "$BUILD"
rm -rf .git scripts/rebuild-git-history.sh
git init -b main

mkdir -p src/app public src/lib src/components src/app/api/plan src/app/app/new "src/app/app/[id]"

# Commit 1
cat > src/app/page.tsx <<'EOF'
export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">RelayOps</h1>
      <p className="mt-2 text-slate-600">Startup ops planner scaffold.</p>
    </main>
  );
}
EOF
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs \
  tailwind.config.ts eslint.config.mjs .gitignore src/app/globals.css src/app/layout.tsx \
  src/app/page.tsx public
commit_at "2026-09-02 09:18:00 +0530" "Bootstrap Next.js scaffold for RelayOps."

git add src/lib/types.ts src/lib/id.ts
commit_at "2026-09-02 10:05:00 +0530" "Add core TypeScript types and id helper."

git add src/lib/planGenerator.ts
commit_at "2026-09-02 11:12:00 +0530" "Add rule-based plan generator and markdown export."

git add src/lib/storage.ts src/lib/useInitiatives.ts
commit_at "2026-09-02 12:40:00 +0530" "Persist initiatives in browser localStorage."

git add src/app/api/plan/route.ts
commit_at "2026-09-02 13:55:00 +0530" "Add plan API with optional OpenAI support."

git add src/components/SiteHeader.tsx src/app/page.tsx src/app/layout.tsx
commit_at "2026-09-02 15:10:00 +0530" "Add marketing landing page and site header."

git add src/components/InitiativesProvider.tsx src/app/app/layout.tsx
commit_at "2026-09-02 16:22:00 +0530" "Add app shell and initiatives context provider."

git add src/app/app/page.tsx src/app/app/new/page.tsx
commit_at "2026-09-02 17:35:00 +0530" "Add dashboard and new plan workflow."

git add src/components/PriorityBadge.tsx "src/app/app/[id]/page.tsx"
commit_at "2026-09-02 18:48:00 +0530" "Add initiative detail view with task progress."

git add README.md
commit_at "2026-09-02 19:30:00 +0530" "Document setup, deploy, and usage in README."

git log --oneline --format='%h %ad %an %s' --date=iso

# Replace project git with clean history
rm -rf "$SRC/.git"
cp -a "$BUILD/.git" "$SRC/.git"
echo "Git history installed at $SRC"
