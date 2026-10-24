# Tritorc CMS notes

Own Strapi 5 for the Tritorc app (replaces the old shared cms.tritorc.com for this app).

## Run it
    powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
First time: `copy .env.example .env`, replace the secret values (APP_KEYS etc.), `npm install`.
Admin: http://localhost:1338/admin (port set by `PORT` in `.env`; 1338 so it does not clash with
the notifications Strapi `tritorc-strapi` on 1337). The first visit asks you to create the admin
account. The Next.js app needs this running; if it is not, the app shows its built-in sample content.
Point the app at it with `STRAPI_API_URL=http://localhost:1338` and `STRAPI_API_READ_TOKEN` in the
app's `.env.local` (the seed script below writes both).

Windows note: `start-dev.ps1` maps a temporary drive letter so swc (admin build) accepts its
cache folder. Without it `npm run develop` can fail with "Failed to load native binding".

## What is in it
14 content types (product, product-category, product-section, service, service-section,
case-study, testimonial, certification, journey-milestone, impact-stat, core-value,
global-office, event, brand) with Draft & Publish on. Defined as code in `src/api/*` and
`src/components/shared/*`. Filled from the app's old sample data by `scripts/seed.js`
(data in `scripts/seed-data.json`).

Re-seed (stop Strapi first, SQLite has one writer):
    $env:SWC_NATIVE_BINDING_CACHE="Y:\"; node scripts/seed.js "<app>\.env.local"
This also (re)creates the read-only token `tritorc-app` and writes it to that .env.local.

## Adding images (no code change)
Media Library, upload a file and set its Caption:
- Card image:   product:<slug>:thumbnail      (services: service:<slug>:thumbnail)
- Big image:    product:<slug>:hero
- Gallery:      product:<slug>:gallery:product  or  :gallery:in-use
Slugs: tsl-20, thl-series, thl-ultra-slim, btl-19, slt-series, mst-series, tsf-series,
twe-3, twp-3, tbp-150, tbe-200, pipe-cold-cutting-beveling-machines.
Sizes: 1200x1600 (hero images 1344x1800), WebP under about 300 KB.

## Before going live
SQLite and local disk are for development. Production needs Postgres, media on S3,
secrets from the environment (APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET,
TRANSFER_TOKEN_SALT, JWT_SECRET, DATABASE_URL) and backups.
