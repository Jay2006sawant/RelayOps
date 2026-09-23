# RelayOps Intelligence

AI customer-ops platform for founder-led teams: LLM analysis, sentiment and urgency scoring, embedding similarity, PostgreSQL persistence, and AWS RDS Terraform.

**Live app:** [https://relayops.vercel.app](https://relayops.vercel.app) (requires production `DATABASE_URL`)

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | Next.js 15, React 19, Tailwind, Recharts |
| Auth | Auth.js (NextAuth v5), credentials + optional GitHub OAuth |
| API | Route handlers, Zod-validated LLM JSON |
| AI / ML | OpenAI GPT-4o-mini, text-embedding-3-small, rule-based fallback |
| Data | PostgreSQL 16, Prisma ORM |
| Cloud DB | AWS RDS (Terraform) or Neon via Vercel Marketplace |
| Deploy | Vercel |

## Features

- Paste feedback and run an analysis pipeline (topics, sentiment, urgency, owned tasks)
- Dashboard analytics (topic bar chart, intake volume line chart)
- Vector similarity across past feedback when embeddings are available
- Secure per-user data with session auth
- Demo user seeded on deploy (`demo@relayops.dev`)

## Local development

```bash
docker compose up -d
cp .env.example .env
# DATABASE_URL=postgresql://relayops:relayops@localhost:5433/relayops
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login) with `demo@relayops.dev` / `RelayOps2026!`

## Production database (pick one)

### Option A: Neon on Vercel (fastest)

1. Accept Neon marketplace terms: [Vercel Neon integration](https://vercel.com/jays-projects-54c31aef/~/integrations/accept-terms/neon?source=cli)
2. Run `npx vercel integration add neon` and connect to project `relayops`
3. Add `AUTH_SECRET` and `OPENAI_API_KEY` in Vercel project settings
4. Redeploy

### Option B: AWS RDS (interview-grade)

```bash
cd infra/terraform
terraform init
terraform apply -var='db_password=YOUR_STRONG_PASSWORD'
```

Copy the `database_url` output into Vercel as `DATABASE_URL`, then redeploy.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Session signing secret |
| `OPENAI_API_KEY` | No | Enables LLM + embeddings |
| `GITHUB_ID` / `GITHUB_SECRET` | No | GitHub login |
| `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD` | No | Seed credentials |

## Author

Jay Sawant · [GitHub](https://github.com/Jay2006sawant)
