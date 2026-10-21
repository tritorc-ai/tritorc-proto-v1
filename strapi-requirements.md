# Strapi Requirements — Quick Summary

## ✅ What's already done
- **Catalogues (PDFs)** — working. Tag a file's `caption` = `catalogue` in Media Library, it shows on site instantly.
- **Key photos** — working. Matched by filename, list is in `lib/mock/images.ts`.
- No caching/rebuild issue — anything added to Strapi shows up live right away.

## 🔲 What I need from you

**1. Build these as real content types** (fields below, not caption tricks):

| Content type | Key fields |
|---|---|
| Case Study | slug, name, stat, statLabel, meta, image |
| Testimonial | quote, author, image |
| Certification | code, name, description |
| Journey Milestone | year, label |
| Impact Stat | value, label |
| Service | slug, name, category, tagline, description, image, media gallery |
| Product | slug, name, series, category, tagline, specs (label/value list), hero image, media gallery, catalogue link |
| Brand (single type) | quote, since |

Full field details available if you want them — kept short here.

**2. Products & Services must use fixed category names** — 20 product categories under 6 sections, 19 service categories under 7 sections. Exact spelling is in `lib/mock/content.ts` (`PRODUCT_SECTIONS`, `SERVICE_SECTIONS`) — copy from there, don't retype.

**3. Photos/Videos tagging** — extend the same `caption` trick: `photo` for images, but **videos need a real hosting decision first** (see below) — don't just upload raw video files.

**4. Shared backend, two frontends** — since we're using one Strapi for this app + the official site:
- Separate API tokens per frontend (not shared)
- CORS allowed for both domains
- Strapi holds data only; each frontend handles its own layout
- Schema changes should be additive — no renaming/removing fields without syncing both frontend devs
- Quick check that Strapi can handle combined traffic from both

*(FYI — no Strapi work needed later when I convert this to a PWA, that's frontend-only.)*

## ❓ Questions for you

1. **Draft vs Published** — is Draft & Publish on, so our token only ever pulls published entries? Don't want half-edited content going live by accident.
2. **Videos** — what do you recommend for hosting (Cloudflare Stream, Mux, YouTube-unlisted, something else)? Don't want raw video files sitting in Strapi.
3. Anything in this list that's harder than it looks, or a better way to structure it on your end? Open to your suggestions — you know Strapi better than I do.
