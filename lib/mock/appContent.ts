// App-level content that doesn't have a Strapi content type yet. Everything
// here is derived from facts already in lib/mock/content.ts or published on
// tritorc.com — nothing is invented. Swap for CMS calls in lib/strapi.ts.

export const CONTACT = {
  email: "response@tritorc.com",
  phoneIndia: "+91 84337 08957",
  phoneIndiaHref: "tel:+918433708957",
  phoneUsa: "+1 704 749 4050",
  phoneUsaHref: "tel:+17047494050",
  website: "https://www.tritorc.com",
  contactPage: "https://www.tritorc.com/contact-us",
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/tritorc/" },
    { label: "YouTube", href: "https://www.youtube.com/c/TritorcEquipments" },
    { label: "Instagram", href: "https://www.instagram.com/tritorcgroup/" },
    { label: "Facebook", href: "https://www.facebook.com/tritorcequipment" },
  ],
} as const;

export type NotificationTag =
  | "Event"
  | "Case study"
  | "Article"
  | "Library"
  | "Video"
  | "Update"
  | "Product"
  | "Service"
  | "LinkedIn";

export interface AppNotification {
  id: string;
  tag: NotificationTag;
  title: string;
  body: string;
  /** Short date/label; omitted when the source doesn't publish one. */
  when?: string;
  /** Internal route, or an https URL on tritorc.com (opened in a new tab). */
  href: string;
  image?: string;
  /** ISO timestamp for live notifications (used for ordering). */
  createdAt?: string;
}

const BLOG = "https://www.tritorc.com/blog";
const BLOG_IMG = "https://tritorc.com/blog/add";

// Newest first. Events come from tritorc.com/events-and-exhibitions, case
// studies and articles from tritorc.com/blog; library items from the app.
export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "adipec-2026",
    tag: "Event",
    title: "Meet us at ADIPEC 2026",
    body: "Abu Dhabi, Hall 12, booth 12200 — 2–5 November 2026.",
    when: "2–5 Nov 2026",
    href: "/events/adipec-2026",
    image: "https://www.tritorc.com/exhibition/adipec-2025-1.jpg",
  },
  {
    id: "case-ongc-nqp",
    tag: "Case study",
    title: "Hot tapping completed in 3 days for ONGC at NQP offshore platform",
    body: "A live 16-inch pipeline was hot-tapped to add a new 12-inch branch connection with no shutdown.",
    href: `${BLOG}/hot-tapping-operation-completed-in-3-days-at-nqc`,
    image: `${BLOG_IMG}/2025/06/Tritorc-Team-holding-the-tocken-after-sucessful-hot-tapping-operation-scaled.webp`,
  },
  {
    id: "case-adnoc-sarb",
    tag: "Case study",
    title: "Nitrogen-helium leak testing — SARB Accelerated Growth Project, UAE",
    body: "Precise leak detection on 1\"–6\" critical process piping for the early tie-in of production wells.",
    href: `${BLOG}/nitrogen-helium-leak-testing-sarb-project-uae`,
    image: `${BLOG_IMG}/2025/06/Tritorc-Leak-Testing.webp`,
  },
  {
    id: "case-new-pamban",
    tag: "Case study",
    title: "TRITORC tools empowering construction of the New Pamban Bridge",
    body: "Specialised bolting tools supplied for India's first vertical-lift sea bridge.",
    href: `${BLOG}/tritorc-tools-the-new-pamban-bridge`,
    image: `${BLOG_IMG}/2025/06/pamban-railway-bridge-in-india.webp`,
  },
  {
    id: "case-wind-turbines",
    tag: "Case study",
    title: "Tritorc powering a greener future by bolting wind turbines",
    body: "Leading the bolting work on a major Indian wind energy project.",
    href: `${BLOG}/tritorc-bolting-wind-turbines`,
    image: `${BLOG_IMG}/2025/06/Site-scaled.webp`,
  },
  {
    id: "article-wind-oems",
    tag: "Article",
    title: "Powering through wind: how global OEMs and industry giants support renewable energy",
    body: "Why decarbonisation is pushing wind energy up the global electricity mix.",
    href: `${BLOG}/global-oems-and-industry-giants-supporting-wind`,
    image: `${BLOG_IMG}/2025/06/Global-OEM.webp`,
  },
  {
    id: "article-bolt-tensioners",
    tag: "Article",
    title: "Design and analysis of hydraulic bolt tensioners",
    body: "How a hydraulic bolt tensioner stretches a bolt to give a controlled, accurate preload.",
    href: `${BLOG}/design-and-analysis-of-hydraulic-bolt-tensioners`,
    image: `${BLOG_IMG}/2023/05/Bolt-Tensioners.webp`,
  },
  {
    id: "catalogues-aug-2026",
    tag: "Library",
    title: "Catalogues refreshed",
    body: "Hot Tapping, Waterjet Cutting, Tube Tool and Sockets catalogues were updated.",
    when: "Aug 2026",
    href: "/library",
  },
  {
    id: "videos-aug-2026",
    tag: "Video",
    title: "New product & service videos",
    body: "Hot tapping, BTL bolt tensioner and pipe bevelling machine demos added to the library.",
    when: "Aug 2026",
    href: "/library",
  },
];

/** Cards rolled on the Home screen's notification deck. */
export interface TickerItem {
  id: string;
  label: string;
  title: string;
  href: string;
}

export const TICKER_ITEMS: TickerItem[] = [
  {
    id: "adipec-2026",
    label: "Upcoming event",
    title: "ADIPEC 2026 in Abu Dhabi, Hall 12, booth 12200",
    href: "/events/adipec-2026",
  },
  ...NOTIFICATIONS.filter((n) => n.tag === "Case study" || n.tag === "Article")
    .slice(0, 3)
    .map((n) => ({ id: n.id, label: n.tag, title: n.title, href: n.href })),
];

export const INDUSTRIES = [
  { name: "Oil & Gas", note: "Refineries, offshore platforms, pipelines" },
  { name: "Wind Power", note: "Foundation and tower bolting" },
  { name: "Mining", note: "Heavy equipment and plant maintenance" },
  { name: "Cement", note: "Kilns, mills and rotating plant" },
  { name: "Infrastructure", note: "Bridges and heavy structures" },
  { name: "Power & Heat Exchange", note: "Boilers, condensers, exchangers" },
] as const;
