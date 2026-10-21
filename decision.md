# decision.md — project memory for Claude

**Purpose:** compact map of the codebase + running log of decisions/changes, so Claude can orient
without re-reading the whole repo. **Read this first. Update it at the end of every task** (see
"How to maintain" at the bottom).

_Last updated: 2026-10-21 (initial snapshot)_

---

## 1. What this is
Tritorc App — mobile-first PWA for Tritorc (industrial bolting, on-site machining, pipeline integrity).
Prototype stage. Repo: `tritorc-ai/...`, branch flow: feature branch → PR → `main` (current: `ui-updated`).

## 2. Stack
- Next.js **16.3** (App Router; breaking changes vs. older Next — check `node_modules/next/dist/docs/` before using unfamiliar APIs, per AGENTS.md), React 19.2, TypeScript
- Tailwind CSS 4 (`app/globals.css`, theme tokens: brand-red, graphite, ivory, cu, ink…), shadcn/ui + Radix (`components/ui/`), lucide-react
- Fonts in `lib/fonts.ts`: Plus Jakarta Sans (Company/Library), Chakra Petch + Anybody (splash)
- Content: Strapi CMS (`cms.tritorc.com`) via `lib/strapi.ts` + `lib/strapiClient.ts`; mock fallback in `lib/mock/*`
- PWA: `app/manifest.ts`, `public/sw.js`, `ServiceWorkerRegister`, `InstallPrompt`
- Scripts: `npm run dev | build | lint`. No test suite.

## 3. Structure
```
app/
  layout.tsx        root: metadata, viewport, Splash, BottomNav, InstallPrompt, SW register
  template.tsx      page transition wrapper
  page.tsx          Home
  products/         page (catalogue) · [slug] product detail · c/[slug] category
  services/         page · [slug] service detail
  company/ library/ events/(+[slug]) notifications/
  **/loading.tsx    skeleton screens per route
components/
  app/       app-level screens/widgets (BottomNav, Splash, Hero, Product/Service DetailView,
             LibraryView, NotificationFeed, EnquiryForm, Carousel variants, Pdf/Media modals…)
  home/      HeroCarousel, EventTicker, sections
  company/   CoreValues, PhotoSlideshow, RotatingLines
  products/  scroll track / showcase cards / category cards
  ui/        shadcn primitives
lib/
  strapi.ts        single seam to CMS (server-only)
  mock/            appContent, content, events, images, imageFallbacks, videos
```

## 4. Key decisions (keep; add new ones with date)
- **Single CMS seam** (`lib/strapi.ts`): only *catalogues* are live from Strapi; stats, case studies,
  certifications, journey, services, products, testimonials still return mock data until their
  content types are populated. Swap one function at a time.
- **Mobile-app feel:** bottom nav, splash on startup (guarded by `splashGuard.ts`), safe-area insets,
  standalone PWA display.
- **Palette:** app uses grey/black (neutral) palette; events & notifications were recently aligned to it.
  manifest theme `#171717`, viewport themeColor `#f3f3f2`.
- **Images:** remote allowed only from tritorc S3 media bucket, cms.tritorc.com, (www.)tritorc.com
  (`next.config.ts`). Local fallbacks in `lib/mock/imageFallbacks.ts`.
- **Site URL:** `NEXT_PUBLIC_SITE_URL` → Vercel env → localhost, used for `metadataBase`.
- Detail pages (product/service) were redesigned (PR #6); home has stacked swipeable event notifications.

## 5. Change log (newest first)
| Date | Change | Files |
|---|---|---|
| 2026-10-21 | Created decision.md. Uncommitted work in tree at that time: small edits to products/services page + `lib/fonts.ts` (one font line removed) | `app/products/page.tsx`, `app/services/page.tsx`, `lib/fonts.ts` |
| (prior, from git) | PR #6 product/service detail redesign; events+notifications grey/black palette | see `git log` |
| (prior) | PR #5 notification bar; PR #4 swipeable event notifications, services restyle, new splash | see `git log` |

## 6. Open items / TODO
- Wire remaining mock content (products, services, testimonials, etc.) to Strapi when ready.
- (add as they come up)

## 7. Gotchas
- Windows dev machine; git warns LF→CRLF on edits (harmless).
- `lib/strapi.ts` is `server-only` — don't import from client components.

---

## How to maintain (instructions for Claude)
1. At start of a task: read this file instead of scanning the repo; only open files it points to.
2. At end of a task: bump "Last updated", add a row to the Change log (date, what + why, files), add any
   new decision to §4, and adjust §3/§6/§7 if structure, TODOs or gotchas changed.
3. Keep it terse — it exists to save tokens. Prune stale entries; don't paste code.
