# RelayOps

Turn customer feedback and messy notes into structured execution plans for startup teams.

**Live demo:** add your Vercel URL here after deploy.

## Features

- Landing page and in-browser dashboard
- Paste notes and generate tasks with priority, owner lane, and timeline hints
- Rule-based planner works with no API keys
- Optional OpenAI enhancement when `OPENAI_API_KEY` is set on the server
- Progress tracking and Markdown export
- Data stored in browser localStorage (no account required)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | No | Enables AI-generated plans in `/api/plan` |

## Deploy

Deploy to Vercel:

```bash
npm run build
npx vercel --prod
```

## Author

Jay Sawant · [GitHub](https://github.com/Jay2006sawant)
