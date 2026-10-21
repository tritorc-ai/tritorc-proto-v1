# decision.md — project memory for Claude

**Purpose:** compact map of the codebase + running log of decisions/changes, so Claude can orient
without re-reading the whole repo. **Read this first. Update it at the end of every task** (see
"How to maintain" at the bottom).

_Last updated: 2026-10-21 (push Phase 2: live inbox, unread badge, in-app banner)_

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

## 4b. Backend design (push notifications, inbox, enquiries) — full plan: `C:\Users\vp89\.claude\plans\deep-wishing-pie.md`
- Backend = a **separate Strapi 5 project** at `C:\Users\vp89\Desktop\tritorc-strapi` (SQLite in dev, port 1337; NOT cms.tritorc.com, which stays the content/media CMS). Next.js `app/api/*` is a BFF calling it via `strapiWrite()` (`lib/strapiClient.ts`). Start it: `cd ../tritorc-strapi && npm run develop`.
- **Web Push** (VAPID) shown as native OS notifications; when the app is focused the SW posts `push-received` and the page shows an in-app banner instead. iOS needs install-to-Home-Screen.
- **Anonymous devices** (`lib/deviceId.ts` UUID), no login. Read/unread is **client-side** (no server table).
- Strapi collections to build: `push-subscription` (custom routes `/api/push-subscriptions/upsert` + `/deactivate`), `notification`, `enquiry`, `linkedin-post`. Dispatcher using `web-push` lives in Strapi; prune subscriptions on 404/410.
- Triggers: manual broadcast; new event; new product/service/library; **LinkedIn = manual paste in Strapi now, official Community Management API poller later** (no LinkedIn webhook; no scraping).
- Env (Next `.env.local`, gitignored): `NOTIF_API_URL`, `NOTIF_API_WRITE_TOKEN`, `NOTIF_API_READ_TOKEN`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`. Env (Strapi `.env`): `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (placeholder mailto: change it). `STRAPI_API_URL`/`STRAPI_API_READ_TOKEN` still = cms.tritorc.com catalogue.
- Phases: 1 Foundation ✅ · 2 inbox ✅ (live `GET /api/notifications`, unread badge, in-app banner) · 3 auto triggers + topics · 4 enquiry (`EnquiryForm` still `mailto:`) · 5 LinkedIn.

## 5. Change log (newest first)
| Date | Change | Files |
|---|---|---|
| 2026-10-21 | **Push Phase 2**: live inbox. `lib/notifications.ts` (server: maps Strapi `notification` -> `AppNotification`, falls back to mock when none) + `notifFetch()`; `GET /api/notifications`; `InboxProvider` in layout (polls on load/focus/60s + SW `push-received`; read ids in localStorage `tritorc:readIds`, first run baselines existing as read; sets app-icon badge); `InAppBanner` (iOS-style heads-up, swipe-up/tap); `NotificationBell` badge on home; feed shows unread dots + "Mark all read"; new tags Update/Product/Service/LinkedIn. Strapi dev helper `npm run notify -- "Title" "Body" /url type topic`. tsc+eslint clean, verified in browser | `lib/notifications.ts`, `app/api/notifications/route.ts`, `components/app/{InboxProvider,InAppBanner,NotificationBell,NotificationFeed}.tsx`, `app/{layout,page}.tsx`, `app/notifications/page.tsx`, `lib/strapiClient.ts`, `lib/mock/appContent.ts` |
| 2026-10-21 | **Separate Strapi installed** (`../tritorc-strapi`, Strapi 5.58 TS): collections `push-subscription` (custom `POST /api/push-subscriptions/upsert` + `/deactivate`), `notification` (creating one with `sendPush=true` triggers `dispatch()` via `web-push`: topic filter, batches of 25, prunes 404/410, writes `sentAt`+`stats`), `enquiry`; VAPID keys generated; scoped API tokens `next-write` (upsert/deactivate/enquiry create only) + `next-read` created by `scripts/create-tokens.ts`. Verified: token scoping (403s), BFF -> Strapi 200, dispatch prune test. `strapiWrite` now uses `NOTIF_*` env | `../tritorc-strapi/**`, `lib/strapiClient.ts` |
| 2026-10-21 | **Push Phase 1**: SW `push`/`notificationclick`/`pushsubscriptionchange` (cache bumped to v2); client helpers; `strapiWrite()`; `POST /api/push/subscribe\|unsubscribe` (validation + in-memory rate limit, forwards to Strapi — Strapi side NOT built yet, so returns 502); `NotificationPrompt` on /notifications. tsc + eslint clean; verified in browser | `public/sw.js`, `lib/push.ts`, `lib/pushApi.ts`, `lib/deviceId.ts`, `lib/strapiClient.ts`, `app/api/push/*`, `components/app/NotificationPrompt.tsx`, `app/notifications/page.tsx` |
| 2026-10-21 | Created decision.md. Uncommitted work in tree at that time: small edits to products/services page + `lib/fonts.ts` (one font line removed) | `app/products/page.tsx`, `app/services/page.tsx`, `lib/fonts.ts` |
| (prior, from git) | PR #6 product/service detail redesign; events+notifications grey/black palette | see `git log` |
| (prior) | PR #5 notification bar; PR #4 swipeable event notifications, services restyle, new splash | see `git log` |

## 6. Open items / TODO
- Strapi: create admin user at /admin; set real `VAPID_SUBJECT`; production DB (Postgres) + hosting; enquiry email alert (Phase 4); lifecycle hooks for event/product/service/library; regenerate tokens for prod with `npm run create-tokens` (set `TOKEN_ENV_FILE` to write them to a file).
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
