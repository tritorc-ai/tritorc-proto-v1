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

export interface AppNotification {
  id: string;
  tag: "Event" | "Library" | "Project" | "Video";
  title: string;
  body: string;
  when: string;
  href: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  href: string;
}

// Shown on Home between the hero and the product range.
export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: "adipec-2026",
    title: "ADIPEC 2026 in Abu Dhabi, Hall 12, booth 12200",
    href: "/company#updates",
  },
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "adipec-2026",
    tag: "Event",
    title: "Meet us at ADIPEC 2026",
    body: "Abu Dhabi, Hall 12, booth 12200.",
    when: "Upcoming",
    href: "/company#updates",
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
  {
    id: "ongc-nqp",
    tag: "Project",
    title: "ONGC NQP hot tapping",
    body: "A live 16\" pipeline was hot-tapped with zero downtime.",
    when: "2025",
    href: "/company#case-studies",
  },
  {
    id: "adnoc-sarb",
    tag: "Project",
    title: "ADNOC SARB leak testing",
    body: "Nitrogen-helium testing at 276 barg for early well tie-in.",
    when: "2025",
    href: "/company#case-studies",
  },
];

export const INDUSTRIES = [
  { name: "Oil & Gas", note: "Refineries, offshore platforms, pipelines" },
  { name: "Wind Power", note: "Foundation and tower bolting" },
  { name: "Mining", note: "Heavy equipment and plant maintenance" },
  { name: "Cement", note: "Kilns, mills and rotating plant" },
  { name: "Infrastructure", note: "Bridges and heavy structures" },
  { name: "Power & Heat Exchange", note: "Boilers, condensers, exchangers" },
] as const;
