# Pioneers in Computer Science

> *"A society grows great when old men plant trees, the shade of which they know they will never sit in."*

Dedicated to my grandfather, **Krishnasamy V.M** — may he rest in peace.

---

## Overview

**Pioneers in Computer Science** is a production-grade encyclopedia of the most influential figures in computing history, spanning 12 centuries from ancient algorithmists to modern AI researchers. It features 184 curated biographies, rich data visualisations, an interactive world map, and a full admin suite.

Live at: [pioneers-in-computer-science.vercel.app](https://pioneers-in-computer-science.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, RSC, static generation) |
| Language | TypeScript |
| API | tRPC v11 |
| ORM | Prisma 6 |
| Database | PostgreSQL — Neon (production), Docker (development) |
| Styling | Tailwind CSS v4 |
| Storage | Azure Blob Storage (pioneer portraits) |
| Email | Azure Communication Services (contact form) |
| Auth | GitHub OAuth (admin) |
| Deployment | Vercel |

---

## Features

- **184 pioneer biographies** with portraits, achievements, notable works, awards, institutions, and fun facts
- **Explore page** with filters by era, gender, country, and field
- **Timeline** — chronological scroll through all pioneers grouped by decade
- **Insights** — data visualisations: era distribution, gender breakdown, top countries, top fields, and data completeness
- **World map** showing birthplaces of pioneers globally
- **On This Day** — daily rotating spotlight of three pioneers on the home page
- **Cmd+K search palette** — instant pioneer search with keyboard navigation
- **Pioneer detail pages** with schema.org JSON-LD structured data and per-pioneer OG images
- **Contact / dispute form** with Azure Communication Services email delivery, rate-limited to 1 submission per IP per hour
- **Admin dashboard** — add, edit, and delete pioneers; image upload to Azure Blob; data completeness panel; activity analytics
- **Static generation** with `generateStaticParams` for all 184 pioneer pages
- **Sitemap** (`/sitemap.xml`) and `robots.txt`
- **Privacy Policy** and **Attribution** pages

---

## Local Development

**Prerequisites:** Node.js 20+, Docker

```bash
# Clone
git clone https://github.com/ajaymahadeven/Pioneers-in-Computer-Science.git
cd Pioneers-in-Computer-Science

# Install dependencies
npm install

# Copy env file and fill in your values
cp .env.example .env

# Start local PostgreSQL
docker compose up -d

# Apply migrations and seed
npx prisma migrate deploy
npx prisma db seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Pooled PostgreSQL connection string (Neon in production) |
| `DATABASE_URL_UNPOOLED` | Direct PostgreSQL connection string (used for migrations) |
| `AZURE_STORAGE_ACCOUNT_NAME` | Azure Blob Storage account name |
| `AZURE_STORAGE_ACCOUNT_KEY` | Azure Blob Storage account key |
| `AZURE_STORAGE_CONTAINER` | Blob container name for pioneer images |
| `AZURE_BLOB_BASE_URL` | Public base URL for blob images |
| `AZURE_COMMUNICATION_CONNECTION_STRING` | Azure Communication Services connection string |
| `AZURE_COMMUNICATION_SENDER_EMAIL` | Sender address for contact form emails |
| `CONTACT_RECIPIENT_EMAIL` | Inbox address for contact form submissions |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID (admin auth) |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `ADMIN_GITHUB_USER_ID` | Numeric GitHub user ID allowed to access admin |
| `ADMIN_JWT_SECRET` | 32+ character secret for admin JWT signing |
| `NEXT_PUBLIC_APP_URL` | Public URL of the deployed app |

See `.env.example` for the full template.

---

## Scripts

```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript type check
npm run format:write # Prettier format
npm run db:studio    # Open Prisma Studio
```

---

## Deployment

The app deploys to Vercel on every push to `master`. Set all environment variables in the Vercel dashboard. Migrations are run manually against Neon using the direct (unpooled) connection string:

```bash
DATABASE_URL="<neon-direct-url>" npx prisma migrate deploy
```

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

This project builds on the foundation of my MSc dissertation at the University of St Andrews (CS5099, distinction). It would not have been possible without:

Prof. Dharini Balasubramaniam · Prof. Ronald Morrison · Prof. Edmund Robertson · Prof. John O'Connor · Manish Mishra · Niharika Kumari · Felix Brown · Kiran Baby · Shivang Sinha · Furkan Tekinay · Cristobal · Gopichand Narra · Yusuf Farag · M K Mahadeven · Nagheshwari Mahadeven · K M Samyuktha · Krishnasamy V.M
