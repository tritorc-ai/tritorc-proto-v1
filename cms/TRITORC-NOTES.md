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

## Going live (production setup)
SQLite and local disk are for development. The code is ready for production; each part below switches on
through environment variables (every name, with comments, is in `.env.example`; nothing changes locally
until you set them). Tested: Strapi on Postgres (the full seed, content API, push routes, enquiries),
the admin production build, the S3 settings loading, and the enquiry alert email.
NOT tested against a real S3 bucket, a real SMTP server or a real host: do one upload and one test
enquiry as soon as they exist.

1. **Secrets:** generate fresh values for `APP_KEYS` (four comma-separated), `API_TOKEN_SALT`,
   `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` and the VAPID pair.
   Never reuse the local ones. Keep them in the host's secret settings, not in git.
2. **Address:** `PUBLIC_URL=https://cms.tritorc.com` (or the real address) and `IS_PROXIED=true` when the
   host puts HTTPS in front of Strapi. `PORT` is whatever the host gives you.
3. **Postgres:** `DATABASE_CLIENT=postgres` and `DATABASE_URL=...` (and `DATABASE_SSL=true` if the host
   needs it). Strapi creates the tables on first start.
4. **Media on S3:** `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, plus
   `S3_PUBLIC_URL` (the address pictures are served from). Cloudflare R2 or another S3-compatible store
   also needs `S3_ENDPOINT`. Leave `S3_ACL` empty for new buckets and R2. The same public address goes
   into the app as `STRAPI_MEDIA_URL` so next/image may load it. Without `S3_BUCKET`, uploads stay on the
   server's disk and disappear when the server is rebuilt.
5. **Enquiry emails:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` and
   `ENQUIRY_ALERT_TO` (who gets the alert; the enquirer's address is set as Reply-To). Without them
   enquiries are only stored in the Enquiry collection.
6. **Build and start:** `npm run build` then `npm run start`.
7. **First start:** open `/admin` on the live address and create the first Super Admin (accounts do not
   carry over from a laptop), then load the content once:
   `node scripts/seed.js "<path to the app's .env>"` and `node scripts/setup-notifications.js "<same path>"`
   (they write the app's Strapi address and tokens; set `STRAPI_API_URL` / `NOTIF_API_URL` to the live
   address afterwards). Stop other writers while they run.
8. **Backups:** turn on automatic database backups at the host and keep a copy of the S3 bucket.

## Test push on a real phone
Push needs HTTPS, and the phone only has to reach the app (the app talks to Strapi on the computer).
1. Start Strapi and the app, and open the app's HTTPS address on the phone (a Cloudflare link works).
   iPhone: tap Share, then Add to Home Screen, and open it from the home-screen icon.
2. In the app tap the bell (top right), then turn notifications on and allow them.
3. On the computer open `/admin`, create your admin account the first time, then Content Manager,
   Notification, Create: fill Title and Body, leave Topic on general, set the **`sendPush`** toggle to True
   (it is a toggle named `sendPush`, easy to miss, and False by default), Save.
4. Within about 5 seconds the phone shows the alert (the app inbox shows it too). `Push Sent` on the entry
   says how many phones got it; a dead phone is removed automatically.
Check the Push Subscription collection: you should see one entry for your phone.

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
  Set the **`sendPush`** toggle (named exactly that, False by default) to True BEFORE saving to also alert phones. Within about 5 seconds it is sent once; `Pushed At` and
  `Push Sent` show the result. Saving again never re-sends.
- **Setup on a new machine / server:**
  1. `npx web-push generate-vapid-keys`, put them in this folder's `.env` as `VAPID_PUBLIC_KEY`,
     `VAPID_PRIVATE_KEY` (see `.env.example`) and the PUBLIC one in the app's `.env.local` as
     `NEXT_PUBLIC_VAPID_PUBLIC_KEY`. Never change the pair after launch: every phone would have to subscribe again.
  2. Stop Strapi, then `node scripts/setup-notifications.js "<app>\.env.local"`. It creates the two limited tokens
     (`tritorc-notif-read`, `tritorc-notif-write`) and writes `NOTIF_API_URL` and both tokens into the app's `.env.local`.
  3. Rebuild the app (the public key is baked into the build).
- Enquiries: the app's enquiry form sends to `/api/enquiries`, which stores it in the Enquiry collection (and
  falls back to opening the mail app if the backend is down). NOTE: the form component exists but is not placed
  on any screen yet. With SMTP set up (see Going live) each new enquiry is also emailed to `ENQUIRY_ALERT_TO`.
- Push only works over HTTPS (or localhost); on iPhone the app must be added to the Home Screen first.