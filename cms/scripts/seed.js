// Fills a fresh Tritorc Strapi with the content that used to live in the app's
// lib/mock/content.ts (exported to scripts/seed-data.json), and creates a
// read-only API token for the Next.js app.
//
// Safe to re-run: entries are matched by slug/name and updated, not duplicated.
// Stop `npm run develop` first (SQLite should have a single writer), then:
//   node scripts/seed.js [path-to-app/.env.local]
// If a path is given, STRAPI_API_URL and STRAPI_API_READ_TOKEN are written there.

const fs = require("fs");
const path = require("path");
const { createStrapi, compileStrapi } = require("@strapi/strapi");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "seed-data.json"), "utf8"));
const envOut = process.argv[2];

const API = {
  section: "api::product-section.product-section",
  category: "api::product-category.product-category",
  product: "api::product.product",
  serviceSection: "api::service-section.service-section",
  service: "api::service.service",
  caseStudy: "api::case-study.case-study",
  testimonial: "api::testimonial.testimonial",
  certification: "api::certification.certification",
  milestone: "api::journey-milestone.journey-milestone",
  impact: "api::impact-stat.impact-stat",
  coreValue: "api::core-value.core-value",
  office: "api::global-office.global-office",
  event: "api::event.event",
  brand: "api::brand.brand",
};

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = "error";
  const counts = {};

  async function upsert(uid, where, payload) {
    const existing = await app.documents(uid).findFirst({ filters: where });
    const doc = existing
      ? await app.documents(uid).update({ documentId: existing.documentId, data: payload, status: "published" })
      : await app.documents(uid).create({ data: payload, status: "published" });
    counts[uid] = (counts[uid] || 0) + 1;
    return doc;
  }

  // Product display sections (Controlled Bolting, Pumps, Onsite Machine Tools).
  const sectionDocs = {};
  const listing = new Map(); // product slug -> { section, title, series, order }
  for (const [si, s] of data.productList.entries()) {
    sectionDocs[s.name] = await upsert(API.section, { name: s.name }, { name: s.name, order: si });
    s.items.forEach((it, i) => listing.set(it.slug, { section: s.name, title: it.title, series: it.series, order: i }));
  }

  // Product categories (used by the category pages).
  const categoryDocs = {};
  for (const [i, c] of data.productCategories.entries()) {
    categoryDocs[c.name] = await upsert(API.category, { name: c.name }, { name: c.name, order: i });
  }

  // Products (all of them; only those in a display section show on the Products page).
  for (const [i, p] of data.products.entries()) {
    const l = listing.get(p.slug);
    await upsert(API.product, { slug: p.slug }, {
      slug: p.slug,
      name: p.name,
      series: p.series,
      tagline: p.tagline,
      specs: (p.specs || []).map((s) => ({ label: s.label, value: s.value })),
      directImageUrl: p.directImageUrl || null,
      catalogueTitle: p.catalogue ? p.catalogue.title : null,
      category: categoryDocs[p.category] ? categoryDocs[p.category].documentId : null,
      listingSection: l ? sectionDocs[l.section].documentId : null,
      listingTitle: l ? l.title : null,
      listingSeries: l ? l.series : null,
      order: l ? l.order : 100 + i,
    });
  }

  // Service groups shown on the Services page, then every service. A service that
  // no group lists (e.g. Onsite Controlled Bolting, Dry Rental) still gets created:
  // its detail page exists, it just has no group, so it is not listed.
  const serviceSectionDocs = {};
  for (const [si, s] of data.serviceSections.entries()) {
    serviceSectionDocs[s.name] = await upsert(API.serviceSection, { name: s.name }, { name: s.name, color: s.color, order: si });
  }
  // Remove groups that the data no longer lists (their services are kept, just ungrouped).
  const wanted = new Set(data.serviceSections.map((s) => s.name));
  for (const sec of await app.documents(API.serviceSection).findMany({ limit: 100 })) {
    if (!wanted.has(sec.name)) await app.documents(API.serviceSection).delete({ documentId: sec.documentId });
  }
  const groupOf = new Map(); // service category -> { group name, position inside it }
  for (const sec of data.serviceSections) sec.categories.forEach((cat, i) => groupOf.set(cat, { group: sec.name, pos: i }));
  for (const [i, sv] of data.services.entries()) {
    const g = groupOf.get(sv.category);
    await upsert(API.service, { slug: sv.slug }, {
      slug: sv.slug,
      name: sv.name,
      category: sv.category,
      tagline: sv.tagline,
      description: sv.description,
      directImageUrl: sv.directImageUrl || null,
      catalogueTitle: sv.catalogue ? sv.catalogue.title : null,
      section: g ? serviceSectionDocs[g.group].documentId : null,
      order: g ? g.pos : 100 + i,
    });
  }

  for (const [i, c] of data.caseStudies.entries())
    await upsert(API.caseStudy, { slug: c.slug }, { slug: c.slug, name: c.name, stat: c.stat, statLabel: c.statLabel, meta: c.meta, directImageUrl: c.directImageUrl || null, order: i });
  for (const [i, t] of data.testimonials.entries())
    await upsert(API.testimonial, { author: t.author }, { quote: t.quote, author: t.author, order: i });
  for (const [i, c] of data.certifications.entries())
    await upsert(API.certification, { code: c.code }, { code: c.code, name: c.name, description: c.description, order: i });
  for (const [i, v] of data.coreValues.entries())
    await upsert(API.coreValue, { name: v.name }, { name: v.name, description: v.description, order: i });
  for (const [i, o] of data.globalOffices.entries())
    await upsert(API.office, { city: o.city, country: o.country }, { city: o.city, country: o.country, order: i });
  for (const [i, m] of data.journey.entries())
    await upsert(API.milestone, { year: m.year, label: m.label }, { year: m.year, label: m.label, order: i });
  for (const [i, s] of data.impactStats.entries())
    await upsert(API.impact, { label: s.label }, { value: s.value, label: s.label, order: i });

  for (const e of data.events) {
    await upsert(API.event, { slug: e.slug }, {
      slug: e.slug,
      title: e.title,
      eventStatus: e.status,
      featured: !!e.featured,
      dateLabel: e.dateLabel,
      start: e.start,
      schedule: e.schedule,
      venue: e.venue,
      city: e.city,
      hall: e.hall || null,
      booth: e.booth || null,
      imageUrl: e.image,
      category: e.category || null,
      sourceUrl: e.sourceUrl || null,
      hours: (e.hours || []).map((h) => ({ day: h.day, hours: h.hours })),
      intro: e.intro,
      about: e.about,
      stats: (e.stats || []).map((s) => ({ value: s.value, label: s.label })),
      highlights: (e.highlights || []).map((h) => ({ title: h.title, body: h.body })),
    });
  }

  // Brand (single type).
  const brandPayload = { quote: data.brand.quote, since: data.brand.since };
  const brandDoc = await app.documents(API.brand).findFirst();
  if (brandDoc) await app.documents(API.brand).update({ documentId: brandDoc.documentId, data: brandPayload, status: "published" });
  else await app.documents(API.brand).create({ data: brandPayload, status: "published" });
  counts[API.brand] = 1;

  // Page-level single types: founder message, home page, company page, site contact.
  // Images start as the local /public paths the app already uses (imageUrl); an image
  // uploaded in Strapi takes priority over them.
  async function upsertSingle(uid, payload) {
    const doc = await app.documents(uid).findFirst();
    if (doc) await app.documents(uid).update({ documentId: doc.documentId, data: payload, status: "published" });
    else await app.documents(uid).create({ data: payload, status: "published" });
    counts[uid] = 1;
  }
  const f = data.founder, h = data.homePage, c = data.companyPage, ct = data.contact;
  await upsertSingle("api::founder-message.founder-message", { name: f.name, role: f.role, message: f.message, photoUrl: f.photo || null });
  await upsertSingle("api::home-page.home-page", {
    heroSlides: h.heroSlides.map((s) => ({
      imageUrl: s.image, imagePosition: s.imagePosition || null, eyebrow: s.eyebrow || null,
      lines: s.lines, side: s.side, href: s.href || null,
    })),
    primaryCtaLabel: h.primary.label, primaryCtaHref: h.primary.href,
    secondaryCtaLabel: h.secondary.label, secondaryCtaHref: h.secondary.href,
    caseTiles: h.caseTiles.map((t) => ({
      title: t.title, note: t.note, imageUrl: t.image, imagePosition: t.pos, alt: t.alt, href: t.href,
    })),
    quotes: h.quotes.map((q) => ({ quote: q.quote, author: q.author })),
  });
  await upsertSingle("api::company-page.company-page", {
    overviewText: c.overviewText,
    overviewLines: c.overviewLines,
    slides: c.slides.map((s) => ({ imageUrl: s.src, position: s.position })),
    stats: c.stats.map((s) => ({ value: s.value, label: s.label })),
    certificationBadges: c.certifications.map((b) => ({ title: b.title, note: b.note, imageUrl: b.image, alt: b.alt })),
    vision: c.vision,
    mission: c.mission,
    profileTitle: c.profileTitle,
    profileMeta: c.profileMeta,
  });
  await upsertSingle("api::site-contact.site-contact", {
    email: ct.email, phoneIndia: ct.phoneIndia, phoneIndiaHref: ct.phoneIndiaHref,
    phoneUsa: ct.phoneUsa, phoneUsaHref: ct.phoneUsaHref, website: ct.website, contactPage: ct.contactPage,
    social: ct.social.map((s) => ({ label: s.label, href: s.href })),
  });

  // Read-only API token for the Next.js app (the key is only shown once, so re-running regenerates it).
  const tokenService = app.service("admin::api-token");
  const existing = await tokenService.getByName("tritorc-app");
  let accessKey;
  if (existing) accessKey = (await tokenService.regenerate(existing.id)).accessKey;
  else accessKey = (await tokenService.create({ name: "tritorc-app", description: "Read-only token for the Tritorc Next.js app", type: "read-only", lifespan: null })).accessKey;

  if (envOut) {
    const base = fs.existsSync(envOut) ? fs.readFileSync(envOut, "utf8") : "";
    const kept = base.split(/\r?\n/).filter((l) => l.trim() && !/^STRAPI_API_(URL|READ_TOKEN)=/.test(l));
    const port = app.config.get("server.port");
    kept.push(`STRAPI_API_URL=http://localhost:${port}`, `STRAPI_API_READ_TOKEN=${accessKey}`);
    fs.writeFileSync(envOut, kept.join("\n") + "\n");
    console.log("wrote STRAPI_API_URL and STRAPI_API_READ_TOKEN to", envOut, "(token not printed)");
  } else {
    console.log("created token 'tritorc-app' (pass a .env.local path to save it)");
  }

  console.log("seeded:", JSON.stringify(counts, null, 1));
  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error("seed failed:", err);
  process.exit(1);
});
