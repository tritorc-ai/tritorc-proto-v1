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

## Editing page content (no code)
Every piece of text the app shows is now a Strapi entry. In the admin, Content Manager:
- Single types (one entry each): Founder Message, Home Page, Company Page, Site Contact, Brand.
  - Home Page: Hero slides (image, headline lines, side, link), the two Case tiles, Quotes, hero buttons.
  - Company Page: overview text, rotating lines, slideshow photos, the two stat tiles, certification badges, profile card.
  - Founder Message: name and portrait are set; replace the message text and role with his real words.
- Collections: Products, Product Sections (which products show on the Products page and in what order),
  Services, Service Sections (groups; a service with no group is not listed), Events, Global Offices and the rest.
- Images: each picture field has an upload slot (`image` / `photo`) AND a text field (`imageUrl` / `photoUrl`).
  An uploaded image wins; the text field is the fallback and starts as a local /public path.
- After clicking Publish the app shows the change within about 30 seconds, with no rebuild.
- Not here: the home notification strip's built-in sample items and the industries list.

## Notifications, push and enquiries (this Strapi handles them too)
Collections: Notification, Push Subscription (created by the app, do not edit), Enquiry.
- **Send a notification:** Content Manager, Notification, Create. Fill Title and Body; Url is where a tap goes
  (for example `/events/adipec-2026`); Type sets the label in the app; Topic picks who gets the phone alert
  (`general` = everyone, otherwise only people who follow that topic). It always appears in the app's inbox.
  Tick **Send Push** BEFORE saving to also alert phones. Within about 5 seconds it is sent once; `Pushed At` and
  `Push Sent` show the result. Saving again never re-sends.
- **Setup on a new machine / server:**
  1. `npx web-push generate-vapid-keys`, put them in this folder's `.env` as `VAPID_PUBLIC_KEY`,
     `VAPID_PRIVATE_KEY` (see `.env.example`) and the PUBLIC one in the app's `.env.local` as
     `NEXT_PUBLIC_VAPID_PUBLIC_KEY`. Never change the pair after launch: every phone would have to subscribe again.
  2. Stop Strapi, then `node scripts/setup-notifications.js "<app>\.env.local"`. It creates the two limited tokens
     (`tritorc-notif-read`, `tritorc-notif-write`) and writes `NOTIF_API_URL` and both tokens into the app's `.env.local`.
  3. Rebuild the app (the public key is baked into the build).
- Enquiries: the Enquiry collection and the write token's permission exist, but the app's enquiry form still opens
  the mail app. Wiring the form to `POST /api/enquiries` is a separate step.
- Push only works over HTTPS (or localhost); on iPhone the app must be added to the Home Screen first.