// Events & exhibitions published on https://www.tritorc.com/events-and-exhibitions.
// Copied as-is from the live site (and each event's detail page) — nothing is
// invented. Swap for a CMS call in lib/strapi.ts when an events type exists.

const SITE = "https://www.tritorc.com";

export interface EventStat {
  value: string;
  label: string;
}

export interface TritorcEvent {
  slug: string;
  title: string;
  category: "Exhibition";
  status: "upcoming" | "past";
  featured?: boolean;
  /** Short, one-line date range for cards. */
  dateLabel: string;
  start: string; // ISO date, used for sorting
  /** Full date & time as published on the site. */
  schedule: string;
  venue: string;
  city: string;
  hall?: string;
  booth?: string;
  image: string;
  intro: string;
  about: string[];
  stats: EventStat[];
  /** "Why visit Tritorc" bullets. */
  highlights: { title: string; body: string }[];
  /** Daily show hours, when published. */
  hours?: { day: string; hours: string }[];
  sourceUrl: string;
}

export const EVENTS: TritorcEvent[] = [
  {
    slug: "adipec-2026",
    title: "ADIPEC 2026",
    category: "Exhibition",
    status: "upcoming",
    featured: true,
    dateLabel: "2–5 Nov 2026",
    start: "2026-11-02",
    schedule: "2 November – 5 November 2026",
    venue: "Abu Dhabi National Exhibition Centre (ADNEC)",
    city: "Abu Dhabi, UAE",
    hall: "12",
    booth: "12200",
    image: `${SITE}/exhibition/adipec-2025-1.jpg`,
    intro: "Meet TRITORC at ADIPEC 2026 – where precision engineering meets real-world energy challenges.",
    about: [
      "ADIPEC 2026 is one of the world's leading energy exhibitions and conferences, bringing the global oil, gas and energy industry together in Abu Dhabi.",
      "TRITORC will be there to talk controlled bolting, on-site machining and pipeline integrity.",
    ],
    stats: [],
    highlights: [
      {
        title: "Controlled bolting",
        body: "Hydraulic torque wrenches and bolt tensioners for accurate, repeatable preload on critical joints.",
      },
      {
        title: "Pipe cutting & bevelling",
        body: "Cold-cutting solutions designed to reduce sparks and maximise uptime.",
      },
      {
        title: "Tube tools & heat exchangers",
        body: "Tube tools and bundle extraction systems for shutdowns and leak-free performance.",
      },
      {
        title: "On-site machining",
        body: "Portable machining systems for refinery turnarounds, offshore platforms and power plants.",
      },
      {
        title: "Hot tapping",
        body: "Connections to live pressurised lines without shutdowns, with certified safety assurance.",
      },
      {
        title: "Expert guidance",
        body: "Flange management, preload accuracy and torque-tension theory from the global technical team.",
      },
    ],
    hours: [
      { day: "Mon 2 Nov", hours: "10:00 AM – 6:30 PM" },
      { day: "Tue 3 Nov", hours: "10:00 AM – 6:30 PM" },
      { day: "Wed 4 Nov", hours: "10:00 AM – 6:30 PM" },
      { day: "Thu 5 Nov", hours: "10:00 AM – 5:30 PM" },
    ],
    sourceUrl: `${SITE}/events-and-exhibitions/adipec-2026`,
  },
  {
    slug: "adipec-2025",
    title: "ADIPEC 2025",
    category: "Exhibition",
    status: "past",
    dateLabel: "3–6 Nov 2025",
    start: "2025-11-03",
    schedule: "3 November 2025, 09:00 – 6 November 2025, 18:00",
    venue: "Abu Dhabi National Exhibition Centre (ADNEC)",
    city: "Abu Dhabi, UAE",
    hall: "12",
    booth: "12323",
    image: `${SITE}/exhibition/adipec-2025-1.jpg`,
    intro: "Experience ADIPEC like never before with TRITORC – where precision engineering meets real-world energy challenges.",
    about: [
      "ADIPEC 2025 was the world's most influential energy exhibition and conference, with 205,000+ attendees, 2,250+ exhibiting companies, 54 NOCs, IOCs, NECs & IECs, and 12 conference programmes.",
      "It is a global platform for redefining controlled bolting, on-site machining and pipeline integrity standards.",
    ],
    stats: [
      { value: "2,250+", label: "Exhibiting companies" },
      { value: "205,000+", label: "Attendees" },
      { value: "30+", label: "Countries" },
      { value: "54+", label: "Industry leaders" },
    ],
    highlights: [
      {
        title: "Live power in motion",
        body: "Hydraulic torque wrenches and bolt tensioners in live action — precision that defines safety on every critical joint.",
      },
      {
        title: "Pipe cutting & bevelling redefined",
        body: "Cold-cutting rigs slicing through heavy-wall pipes, engineered to minimise sparks and maximise uptime.",
      },
      {
        title: "Inside the heat exchanger",
        body: "A live mock-up showcasing tube tools and bundle extraction systems for seamless shutdowns and leak-free performance.",
      },
      {
        title: "Smart machining solutions",
        body: "Portable on-site machining systems built for refinery turnarounds, offshore platforms and power plants.",
      },
      {
        title: "Hot tapping excellence",
        body: "How Tritorc connects to live pressurised lines: no shutdowns, no compromise, certified safety assurance.",
      },
      {
        title: "Expert sessions & engineering consults",
        body: "Flange management, preload accuracy and torque-tension theory with the global technical team.",
      },
    ],
    sourceUrl: `${SITE}/events-and-exhibitions/adipec-2025`,
  },
  {
    slug: "windergy-india-2025",
    title: "Windergy India 2025",
    category: "Exhibition",
    status: "past",
    dateLabel: "29–31 Oct 2025",
    start: "2025-10-29",
    schedule: "29 October 2025, 09:00 – 31 October 2025, 18:00",
    venue: "Chennai Trade Centre, Nandambakkam",
    city: "Chennai, India",
    hall: "H3",
    booth: "G711",
    image: `${SITE}/exhibition/windergy-india-1.jpeg`,
    intro:
      "Engage with TRITORC and experience how we turn critical challenges into confident solutions in the wind energy sector.",
    about: [
      "Windergy India 2025 is India's premier international trade fair and conference for wind energy, with 350+ exhibiting companies from 20+ countries and participation from leading wind power nations including Denmark, Germany and Spain.",
    ],
    stats: [
      { value: "350+", label: "Exhibiting companies" },
      { value: "15,000+", label: "Attendees" },
      { value: "20+", label: "Countries" },
      { value: "50+", label: "Industry leaders" },
    ],
    highlights: [
      {
        title: "Live demonstrations",
        body: "Hydraulic torque wrenches and bolt tensioners for wind turbine installation and maintenance.",
      },
      {
        title: "On-site machining expertise",
        body: "Cold pipe cutting, flange facing and portable machining that cut downtime on wind energy projects.",
      },
      {
        title: "Tube tools & maintenance services",
        body: "The full range of maintenance tools and professional services for long-term performance of wind infrastructure.",
      },
      {
        title: "Expert guidance",
        body: "How Tritorc optimises operations, enhances safety and extends asset life across onshore and offshore wind projects.",
      },
      {
        title: "Conference highlights",
        body: "Panels on “Wind Power: Policies and Partnerships Towards Aatmanirbharta” — India's pathway to 100 GW wind capacity by 2030, offshore wind and supply chain excellence.",
      },
    ],
    sourceUrl: `${SITE}/events-and-exhibitions/windergy-india-2025`,
  },
  {
    slug: "oga-malaysia-2025",
    title: "OGA Malaysia 2025",
    category: "Exhibition",
    status: "past",
    dateLabel: "2–4 Sep 2025",
    start: "2025-09-02",
    schedule: "2 September 2025, 09:00 – 4 September 2025, 18:00",
    venue: "Kuala Lumpur Convention Centre",
    city: "Kuala Lumpur, Malaysia",
    hall: "5",
    booth: "5811",
    image: `${SITE}/exhibition/oga-malaysia-2025.jpg`,
    intro: "Engage with TRITORC and experience how we turn critical challenges into confident solutions.",
    about: [
      "OGA – Oil & Gas Asia 2025 is Southeast Asia's leading oil, gas, energy and petrochemicals event, with 2,000+ exhibiting companies, 36,000 attendees from 70+ countries and 60+ thought leaders.",
    ],
    stats: [
      { value: "2,000+", label: "Exhibiting companies" },
      { value: "36,000+", label: "Attendees" },
      { value: "70+", label: "Countries" },
      { value: "60+", label: "Industry leaders" },
    ],
    highlights: [
      {
        title: "Live demonstrations",
        body: "Hydraulic torque wrenches and bolt tensioners for precise, reliable bolting operations.",
      },
      {
        title: "On-site machining expertise",
        body: "Cold pipe cutting, flange facing and portable machining that reduce downtime and maximise accuracy.",
      },
      {
        title: "Hot tapping solutions",
        body: "Safe connections on live pipelines without costly shutdowns.",
      },
      {
        title: "Tube tools & retubing services",
        body: "A complete range of tube maintenance tools and professional retubing services.",
      },
      {
        title: "Expert guidance",
        body: "How Tritorc optimises operations, enhances safety and extends asset life across offshore, onshore and refinery projects.",
      },
    ],
    sourceUrl: `${SITE}/events-and-exhibitions/oga-malaysia-2025`,
  },
];

export const upcomingEvents = () => EVENTS.filter((e) => e.status === "upcoming");
export const pastEvents = () =>
  EVENTS.filter((e) => e.status === "past").sort((a, b) => b.start.localeCompare(a.start));
export const getEvent = (slug: string) => EVENTS.find((e) => e.slug === slug);
