<div align="center">

# ⚙️ Tritorc App

**A modern web app for Tritorc's tools, services, and product catalogue**

Built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), and [shadcn/ui](https://ui.shadcn.com)

</div>

---

## ✨ Features

- 🏠 **Home** — hero, client testimonials, impact stats, featured products, and case studies
- 📦 **Products & Services** — browsable catalogues with detail pages
- 🏢 **Company** — journey timeline and certifications
- 📚 **Library** — media and resource browser
- 📱 **PWA-ready** — installable with icons, manifest, and a service worker

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui + Radix UI |
| Icons | Lucide |
| Content | Strapi CMS (with local mock data fallback) |
| Language | TypeScript |

## 🚀 Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app. Pages auto-update as you edit files.

## 📁 Project Structure

```
app/                  Routes (App Router)
├── company/          Company & journey page
├── library/          Media library
├── products/         Product catalogue + detail pages
└── services/         Services catalogue + detail pages

components/
├── app/              Feature components (Hero, BottomNav, carousels, etc.)
└── ui/               Reusable shadcn/ui primitives

lib/
├── mock/             Placeholder content & images
└── strapi.ts         CMS data layer (Strapi + mock fallback)
```

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the app for production |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |

## 🌐 Content

Product catalogues are wired to a live [Strapi](https://strapi.io) CMS instance. Other sections (stats, case studies, certifications, testimonials, etc.) currently use mock data in [`lib/mock`](lib/mock) until their content types are ready — see [`lib/strapi.ts`](lib/strapi.ts) for the swap points.

## ☁️ Deployment

Deploy via [Vercel](https://vercel.com/new) — zero extra config needed beyond environment variables:

1. Import this repo in Vercel.
2. Add the env vars from [`.env.example`](.env.example) under Project Settings → Environment Variables (`STRAPI_API_URL`, `STRAPI_API_READ_TOKEN`). Missing vars don't break the build — the app falls back to mock content.
3. Optionally set `NEXT_PUBLIC_SITE_URL` once a custom domain is attached (defaults to Vercel's own preview/production URL otherwise).

ISR (`revalidate: 30`) and `next/image` optimization both work out of the box on Vercel — no extra setup. See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for other hosts.

---

<div align="center">
<sub>Built with Next.js</sub>
</div>
