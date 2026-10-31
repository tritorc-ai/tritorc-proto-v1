// Mock content shaped like the eventual Strapi responses. This is the ONLY
// layer that gets replaced when lib/strapi.ts is wired to the real CMS.

import type { ImageKey } from "./images";

export interface ImpactStat {
  value: string;
  label: string;
}

export const IMPACT_STATS: ImpactStat[] = [
  { value: "35+", label: "Years Excellence" },
  { value: "500+", label: "Projects Done" },
  { value: "50+", label: "Global Clients" },
  { value: "100+", label: "Expert Engineers" },
];

export interface CaseStudy {
  slug: string;
  name: string;
  stat: string;
  statLabel: string;
  meta: string;
  imageKey?: ImageKey;
  // Real project photos sourced directly from tritorc.com's own blog posts —
  // same pattern as Product/Service directImageUrl, no re-hosting needed.
  directImageUrl?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "reliance-jamnagar",
    name: "Reliance Jamnagar Refinery, India",
    stat: "1.4M",
    statLabel: "Barrels/day processing capacity",
    meta: "Partnering with the world's largest single-site oil refinery since 2013. 144 studs detensioned in under 24 hours.",
    imageKey: "caseReliance",
  },
  {
    slug: "adani-wind",
    name: "Adani Wind Project, India",
    stat: "60",
    statLabel: "Wind turbines erected in 48 weeks",
    meta: "From base to blade — torqueing and tensioning the towers of tomorrow. 69,247 Nm torque delivered.",
    imageKey: "caseAdani",
  },
  {
    slug: "samsung-abu-dhabi",
    name: "Samsung Abu Dhabi Oil & Gas Plant",
    stat: "40,000",
    statLabel: "Tubes retubed in 7-8 days",
    meta: "Reliability re-engineered. 100% QA/QC documented, ASME/TEMA/SAES standards.",
    imageKey: "caseSamsung",
  },
  {
    // Replaces the earlier "Bonga F.P.S.O., Nigeria" entry, which had been
    // paired with this same image by mistake — the image (and its source
    // filename) is actually from Tritorc's own "Karabatan Onshore
    // Facility" success story, so the case study now matches it.
    slug: "karabatan-kazakhstan",
    name: "Karabatan Onshore Facility, Kazakhstan",
    stat: "13B",
    statLabel: "Barrels of recoverable oil, high-pressure sour gas facility",
    meta: "Empowering NCOC's high-pressure onshore facility — up to 40-80 MPa H2S sour gas. Delivered a 69,247 Nm hydraulic torque wrench, 5,406 kN bolt tensioner, and 72\" pipe cutting machine work.",
    imageKey: "caseKarabatan",
  },
  // Sourced directly from tritorc.com/blog (real, dated project write-ups) —
  // images link to tritorc.com's own hosting, not re-hosted.
  {
    slug: "ongc-nqp-hot-tapping",
    name: "ONGC NQP Offshore Platform, India",
    stat: "16\"",
    statLabel: "Live pipeline hot-tapped, zero downtime",
    meta: "Hot tapping a live 16\" pipeline to add a 12\" branch connection with no shutdown and no interruption to hydrocarbon flow — commended by both L&T and ONGC for execution.",
    directImageUrl:
      "https://tritorc.com/blog/add/2025/06/Tritorc-Team-holding-the-tocken-after-sucessful-hot-tapping-operation-scaled.webp",
  },
  {
    slug: "adnoc-sarb-leak-testing",
    name: "ADNOC SARB Accelerated Growth Project, UAE",
    stat: "276",
    statLabel: "Barg tested, 1\"-6\" critical process piping",
    meta: "Nitrogen-Helium leak testing (1% He / 99% N2) for early tie-in of production wells at AlQatia, SARB North Artificial Island — precision detection where even a micro-leak was a safety risk.",
    directImageUrl: "https://tritorc.com/blog/add/2025/06/Tritorc-Leak-Testing.webp",
  },
  {
    slug: "new-pamban-bridge",
    name: "The New Pamban Bridge, India",
    stat: "2.08km",
    statLabel: "India's first vertical-lift sea bridge",
    meta: "Heavy-duty impact sockets, stack sockets, and impact reducers supplied for the bridge's gear couplings and bearing housings — precision bolting across a wide range of bolt sizes and torque specs.",
    directImageUrl: "https://tritorc.com/blog/add/2025/06/pamban-railway-bridge-in-india.webp",
  },
];

export interface Certification {
  code: string;
  name: string;
  description: string;
}

export const CERTIFICATIONS: Certification[] = [
  { code: "ISO", name: "ISO 9001:2015", description: "Certified quality management" },
  { code: "CE", name: "CE-Certified Tools", description: "Meets EU safety standards" },
  { code: "ECITB", name: "ECITB-Accredited", description: "Engineering construction industry training standard" },
];

export interface CoreValue {
  name: string;
  description: string;
}

// Sourced from tritorc.com/about-us.
export const CORE_VALUES: CoreValue[] = [
  { name: "Safety", description: "Ensuring safe practices in every operation" },
  { name: "Synergy", description: "Fostering collaboration across teams and clients" },
  { name: "Integrity", description: "Acting with honesty in every engagement" },
  { name: "Compassion", description: "Leading with empathy" },
  { name: "Innovation", description: "Driving progress through continuous innovation" },
];

export interface GlobalOffice {
  city: string;
  country: string;
}

// Sourced from tritorc.com/LinkedIn company profile.
export const GLOBAL_OFFICES: GlobalOffice[] = [
  { city: "Mumbai", country: "India" },
  { city: "Pune", country: "India" },
  { city: "Ambernath", country: "India" },
  { city: "Pasadena, Texas", country: "USA" },
  { city: "Sharjah", country: "UAE" },
  { city: "Abu Dhabi", country: "UAE" },
  { city: "Boumerdes", country: "Algeria" },
  { city: "Muscat", country: "Oman" },
  { city: "Edmonton", country: "Canada" },
  { city: "Dortmund", country: "Germany" },
];

export interface JourneyMilestone {
  year: string;
  label: string;
}

export const JOURNEY: JourneyMilestone[] = [
  { year: "1989", label: "Founded" },
  { year: "2008", label: "UAE Expansion" },
  { year: "2012", label: "Global Reach" },
  { year: "2013", label: "In-house Manufacturing" },
  { year: "2014", label: "USA/Houston Office" },
  { year: "2016", label: "Onsite Machining" },
  { year: "2023", label: "Specialized Engineering" },
  { year: "2024", label: "Pipeline Services" },
];

export interface ServiceMediaAsset {
  id: string;
  kind: "photo" | "video";
  context: "product" | "in-use";
  url: string;
  portrait?: boolean;
}

export interface Service {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  imageKey?: ImageKey;
  directImageUrl?: string;
  media: ServiceMediaAsset[];
  catalogue?: { title: string; meta: string; url: string } | null;
}

export interface ServiceCategory {
  name: string;
  imageKey?: ImageKey;
  directImageUrl?: string;
}

export interface ServiceSection {
  name: string;
  color: string;
  categories: string[];
}

// Real taxonomy confirmed directly from tritorc.com/services (live page) and
// the official site's own repo fallback content (lib/servicesContent.ts) —
// 7 categories, ~19 real sub-services. Services that had no photo yet (Dewatering, Hydro Testing,
// Nitrogen Helium Leak Testing, Pneumatic Testing, Calibration, Dry Rental) were removed from the app;
// Onsite Controlled Bolting took Calibration's place. Not an invented structure.
export const SERVICE_SECTIONS: ServiceSection[] = [
  {
    name: "Specialised Engineering Services",
    color: "#d97706",
    categories: ["Hot Tapping & Line Stopping", "Retubing Services"],
  },
  {
    name: "Onsite Machining Services",
    color: "#2563eb",
    categories: ["Pipeline Coldcutting & Bevelling", "Flange Facing"],
  },
  {
    name: "Process & Pipeline Services",
    color: "#0d9488",
    categories: ["Nitrogen Purging Preservation Services"],
  },
  { name: "Controlled Bolting Services", color: "#db2777", categories: ["Onsite Controlled Bolting"] },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { name: "Onsite Controlled Bolting", imageKey: "productTorqueHero" },
  { name: "Pipeline Coldcutting & Bevelling", imageKey: "catPipeColdCutting" },
  { name: "Flange Facing", imageKey: "catFlangeFacing" },
  { name: "Nitrogen Purging Preservation Services", imageKey: "svcNitrogenPurging" },
  {
    name: "Retubing Services",
    directImageUrl: "https://www.tritorc.com/assets/services/Retubing.jpg",
  },
  { name: "Hot Tapping & Line Stopping", imageKey: "svcHotTapping" },
];

const HOT_TAPPING_CATALOGUE = {
  title: "Hot Tapping Cata",
  meta: "Updated Aug 2026",
  url: "#",
};
const PIPELINE_PROCESS_CATALOGUE = {
  title: "Pipeline Process Services",
  meta: "Updated Aug 2026",
  url: "#",
};

export const SERVICES: Service[] = [
  {
    slug: "onsite-controlled-bolting",
    name: "Onsite Controlled Bolting",
    category: "Onsite Controlled Bolting",
    tagline: "Precision torque, delivered in the field",
    description:
      "Professional controlled bolting services with precision torque application for critical industrial applications and maintenance operations. Torqueing up to 700 bar / 69,427 Nm max, bolts 19-175mm; tensioning up to 1,500 bar / 5,406 kN max, bolts 16-150mm.",
    imageKey: "productTorqueHero",
    media: [],
    directImageUrl: "/services/onsite-controlled-bolting-photo.webp",
  },
  {
    slug: "pipeline-coldcutting-bevelling",
    name: "Pipeline Coldcutting & Bevelling",
    category: "Pipeline Coldcutting & Bevelling",
    tagline: "Advanced cold cutting technology",
    description: "Precise pipeline cutting and bevelling services using advanced cold cutting technology.",
    imageKey: "catPipeColdCutting",
    media: [],
    directImageUrl: "/services/pipeline-coldcutting-bevelling-photo.webp",
  },
  {
    slug: "flange-facing",
    name: "Flange Facing",
    category: "Flange Facing",
    tagline: "Perfect sealing surfaces, every time",
    description: "Expert flange facing services to ensure perfect sealing surfaces and optimal performance.",
    imageKey: "catFlangeFacing",
    media: [],
    directImageUrl: "/services/flange-facing-photo.webp",
  },
  {
    slug: "nitrogen-purging-preservation",
    name: "Nitrogen Purging Preservation Services",
    category: "Nitrogen Purging Preservation Services",
    tagline: "Protecting pipeline systems",
    description: "Nitrogen purging and preservation services to protect pipeline systems.",
    imageKey: "svcNitrogenPurging",
    media: [],
    catalogue: PIPELINE_PROCESS_CATALOGUE,
    directImageUrl: "/services/nitrogen-purging-preservation-photo.webp",
  },
  {
    slug: "retubing-services",
    name: "Retubing Services",
    category: "Retubing Services",
    tagline: "Heat exchanger tube replacement",
    description:
      "Complete retubing solutions for heat exchangers and industrial equipment: tube removal (1/2\"-4-1/2\" OD, pulling force to 22 T), tube insertion/expansion (3/8\"-2-1/2\" OD), tube sheet prep, weld overlay (GTAW/FCAW/SAW), and tube plugging (up to 7,000 psi).",
    directImageUrl: "/services/retubing-services-photo.webp",
    media: [],
  },
  {
    slug: "hot-tapping-line-stopping",
    name: "Hot Tapping & Line Stopping",
    category: "Hot Tapping & Line Stopping",
    tagline: "Live pipeline modification, zero downtime",
    description:
      "Safe hot tapping and line stopping services for live pipeline modifications. Pipe dia 2\"-84\" (50-2100mm), pressure to 100 bar (1,450 psi), temp -20°C to 280°C, materials CS/SS/Duplex/HDPE. Compliant with ASME B31.3/4/8, API 1104 App B, API 2201.",
    imageKey: "svcHotTapping",
    media: [],
    catalogue: HOT_TAPPING_CATALOGUE,
    directImageUrl: "/services/hot-tapping-line-stopping-photo.webp",
  },
];

export interface ProductMediaAsset {
  id: string;
  kind: "photo" | "video";
  context: "product" | "in-use";
  url: string;
  portrait?: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  series: string;
  category: string;
  tagline: string;
  specs: ProductSpec[];
  media: ProductMediaAsset[];
  catalogue: { title: string; meta: string; url: string } | null;
  heroImageKey?: ImageKey;
  // Some products' real per-item photo lives on the official tritorc.com
  // site rather than in the Strapi media library (confirmed by browsing
  // tritorc.com directly) — takes priority over heroImageKey when set.
  directImageUrl?: string;
}

export interface ProductCategory {
  name: string;
  imageKey: ImageKey;
}

export interface ProductSection {
  name: string;
  color: string;
  categories: string[];
}

// Mirrors the real official catalog structure at tritorc.com/products
// (6 sections, 21 product types) — this is the definitive taxonomy, not an
// invented one. `color` drives the scroll-position rail/indicator on the
// Products page — one distinct accent per section.
export const PRODUCT_SECTIONS: ProductSection[] = [
  {
    name: "Controlled Bolting",
    color: "#d6312f",
    categories: [
      "Hydraulic Torque Wrenches and Pumps",
      "Hydraulic Bolt Tensioners",
      "Heavy Impact Sockets",
    ],
  },
  {
    name: "Onsite Machining Tools",
    color: "#2563eb",
    categories: [
      "Pipe Cold Cutting and Beveling Machines",
      "Flange Facing Machines",
      "Tube and Pipe Beveling Machine",
    ],
  },
  {
    name: "Tube Tools",
    color: "#7c3aed",
    categories: [
      "Tube Expanders",
      "Tube Installation Tools",
      "Tube Removal Tools",
      "Tube Cleaning Tools",
    ],
  },
  {
    name: "Lifting Tools",
    color: "#d97706",
    categories: ["Single-Acting Cylinders", "Double-Acting Cylinders", "Cylinder Powerpacks and Pumps"],
  },
  {
    name: "Flange Management",
    color: "#0d9488",
    categories: [
      "Heavy Duty Hydraulic Nut Splitters",
      "Light Weight Nut Splitter",
      "Low Clearance Hydraulic Flange Spreader",
      "Hydraulic Flange Spreader Standard Maxi Kit",
    ],
  },
  {
    name: "Pipe Accessories",
    color: "#db2777",
    categories: ["Fixed and Folding Pipe Stands", "Heavy Duty Beam Roller", "Chain Clamps"],
  },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { name: "Hydraulic Torque Wrenches and Pumps", imageKey: "catTorqueWrenches" },
  { name: "Hydraulic Bolt Tensioners", imageKey: "catBoltTensioners" },
  { name: "Heavy Impact Sockets", imageKey: "catImpactSockets" },
  { name: "Pipe Cold Cutting and Beveling Machines", imageKey: "catPipeColdCutting" },
  { name: "Flange Facing Machines", imageKey: "catFlangeFacing" },
  { name: "Tube and Pipe Beveling Machine", imageKey: "catTubeBeveling" },
  { name: "Tube Expanders", imageKey: "catTubeExpanders" },
  { name: "Tube Installation Tools", imageKey: "catTubeInstallation" },
  { name: "Tube Removal Tools", imageKey: "catTubeRemoval" },
  { name: "Tube Cleaning Tools", imageKey: "catTubeCleaning" },
  { name: "Single-Acting Cylinders", imageKey: "catSingleActingCylinders" },
  { name: "Double-Acting Cylinders", imageKey: "catDoubleActingCylinders" },
  { name: "Cylinder Powerpacks and Pumps", imageKey: "catCylinderPowerpacks" },
  { name: "Heavy Duty Hydraulic Nut Splitters", imageKey: "catFlangeManagement" },
  { name: "Light Weight Nut Splitter", imageKey: "catFlangeManagement" },
  { name: "Low Clearance Hydraulic Flange Spreader", imageKey: "catFlangeManagement" },
  { name: "Hydraulic Flange Spreader Standard Maxi Kit", imageKey: "catFlangeManagement" },
  { name: "Fixed and Folding Pipe Stands", imageKey: "catPipeAccessories" },
  { name: "Heavy Duty Beam Roller", imageKey: "catPipeAccessories" },
  { name: "Chain Clamps", imageKey: "catChainClamps" },
];

const BOLTING_CATALOGUE = {
  title: "Bolting & Machining Solutions Catalogue",
  meta: "10.9 MB · Updated Aug 2026",
  url: "#",
};
const IN_SITU_MACHINING_CATALOGUE = {
  title: "In Situ Machining Catalogue",
  meta: "6.3 MB · Updated Aug 2026",
  url: "#",
};
const TUBE_TOOL_CATALOGUE = {
  title: "Tube Tool Catalogue Final",
  meta: "14.1 MB · Updated Aug 2026",
  url: "#",
};
const SOCKETS_CATALOGUE = {
  title: "Sockets Catalogue Revised",
  meta: "8.3 MB · Updated Aug 2026",
  url: "#",
};

export const PRODUCTS: Product[] = [
  {
    slug: "tsl-20",
    name: "Square Drive Hydraulic Torque Wrench",
    series: "TSL-20",
    category: "Hydraulic Torque Wrenches and Pumps",
    tagline:
      "Make heavy-duty torque and de-torque operations easy with Tritorc's industry-proven hydraulic torque wrenches and reliable power packs to get consistent results.",
    specs: [
      { label: "Min. Torque", value: "3,045 Nm" },
      { label: "Max. Torque", value: "30,461 Nm" },
      { label: "Square Drive", value: '2.1/2"' },
      { label: "Tool Weight", value: "26 kg" },
      { label: "Accuracy", value: "±3%" },
      { label: "Duty Cycles", value: "5,000+" },
    ],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    directImageUrl: "/products/tsl-20-studio.webp",
  },
  {
    slug: "btl-19",
    name: "Top-Side Hydraulic Bolt Tensioner",
    series: "BTL-19",
    category: "Hydraulic Bolt Tensioners",
    tagline:
      "The various types of hydraulic bolt tensioning tools are designed and built as per industry requirements for a variety of applications.",
    specs: [
      { label: "Bolt Size Range", value: "M64 - M76" },
      { label: "Cylinder Force", value: "1,843.3 kN" },
      { label: "Weight", value: "22 kg" },
    ],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    heroImageKey: "productTensionerHero",
    directImageUrl: "/products/btl-19-studio.webp",
  },
  {
    slug: "wbt-series",
    name: "Wind Turbine Foundation Bolt Tensioner",
    series: "WBT Series",
    category: "Hydraulic Bolt Tensioners",
    tagline: "Purpose-built for wind turbine foundation bolting.",
    specs: [
      { label: "Application", value: "Foundation bolting" },
      { label: "Industry", value: "Wind Energy" },
      { label: "Max. Tensioning Pressure", value: "1,500 bar" },
      { label: "Max. Load", value: "5,406 kN" },
      { label: "Bolt Size Range", value: "M16 - M150" },
    ],
    media: [],
    catalogue: { title: "Wind Power Catalogue", meta: "8.1 MB · Updated Aug 2026", url: "#" },
    heroImageKey: "catWindTurbine",
  },
  {
    slug: "heavy-impact-sockets",
    name: "Heavy Impact Sockets",
    series: "Impact Socket Family",
    category: "Heavy Impact Sockets",
    tagline:
      "Impact sockets that last the rigors of industrial bolting with quality backed by a lifetime warranty against any manufacturing defects.",
    specs: [
      { label: "Drive Sizes", value: '1/4" - 3-1/2"' },
      { label: "Material", value: "Chrome Molybdenum, Black Oxide finish" },
      { label: "Torque Capacity (6-Point Regular)", value: "150 - 800 ft-lbs" },
    ],
    media: [],
    catalogue: SOCKETS_CATALOGUE,
    heroImageKey: "catImpactSockets",
  },
  {
    slug: "pipe-cold-cutting-beveling-machines",
    name: "Pipe Cold Cutting and Beveling Machines",
    series: "Cold Cutting Range",
    category: "Pipe Cold Cutting and Beveling Machines",
    tagline:
      "Slit pipe sections and prepare weld edges with accuracy and safety — split-frame design and a spark-free working method ease every operation.",
    specs: [
      { label: "Pipe OD Range", value: '2" - 72"' },
      { label: "Bevel Types", value: "Standard, compound, J-prep" },
      { label: "Drive Options", value: "Pneumatic, hydraulic, electric" },
      { label: "Mounting", value: "Split-frame" },
    ],
    media: [],
    catalogue: IN_SITU_MACHINING_CATALOGUE,
    heroImageKey: "catPipeColdCutting",
    directImageUrl: "/products/pipe-cold-cutting-beveling-machines-studio.webp",
  },
  {
    slug: "flange-facing-machines",
    name: "Flange Facing Machines",
    series: "Flange Facer Range",
    category: "Flange Facing Machines",
    tagline:
      "Proper gasket grip cannot be compromised — Tritorc's reliable flange facers provide accurate surface finish, overcoming bolted-joint flange leakages with ease.",
    specs: [
      { label: "Max. OD", value: '118"' },
      { label: "Mounting", value: "OD or ID mountable" },
      { label: "Depth of Cut", value: "0.05 - 0.3 mm" },
      { label: "Tool Post", value: "360° swivel" },
      { label: "Drive Options", value: "Manual, pneumatic, hydraulic, CNC" },
    ],
    media: [],
    catalogue: IN_SITU_MACHINING_CATALOGUE,
    heroImageKey: "catFlangeFacing",
  },
  {
    slug: "tube-pipe-beveling-machine",
    name: "Tube and Pipe Beveling Machine",
    series: "Beveling Range",
    category: "Tube and Pipe Beveling Machine",
    tagline:
      "Precision tube and pipe beveling for reliable weld preparation, built for accuracy and safety in the field.",
    specs: [],
    media: [],
    catalogue: IN_SITU_MACHINING_CATALOGUE,
    heroImageKey: "catTubeBeveling",
  },
  {
    slug: "tube-expanders",
    name: "Tube Expanders",
    series: "Tube Expander Range",
    category: "Tube Expanders",
    tagline:
      "An incorrectly rolled tube can compromise the entire heat transfer vessel — Tritorc's industry-proven tube expanders are trusted on tubes of heat exchangers, boilers, and condensers.",
    specs: [
      { label: "T-114 Series", value: '1-3/4" - 4-1/2" dia' },
      { label: "TA Series", value: '7/8" - 4-1/2" dia' },
      { label: "TAF3 Series (flaring)", value: '7/8" - 4-1/2" dia' },
      { label: "T-1000 Series", value: '1" - 4-1/2" dia' },
      { label: "T-3000 Series (rolling)", value: '1-1/4" - 4-1/4" dia' },
      { label: "T-800/1200 3 & 5-Roller", value: '1/2" - 4" dia, reach to 10-3/4"' },
    ],
    media: [],
    catalogue: TUBE_TOOL_CATALOGUE,
    heroImageKey: "catTubeExpanders",
  },
  {
    slug: "tube-installation-tools",
    name: "Tube Installation Tools",
    series: "Tube Installation Range",
    category: "Tube Installation Tools",
    tagline:
      "Install tubes without damaging them or compromising their working with highly functional tube rolling drives, tube expansion systems, and reliable accessories.",
    specs: [],
    media: [],
    catalogue: TUBE_TOOL_CATALOGUE,
    heroImageKey: "catTubeInstallation",
  },
  {
    slug: "tube-removal-tools",
    name: "Tube Removal Tools",
    series: "Tube Removal Range",
    category: "Tube Removal Tools",
    tagline:
      "Extract damaged and corroded tubes with Tritorc's efficient tube-pulling systems, tube mandrels, tube spears, and stub pullers.",
    specs: [],
    media: [],
    catalogue: TUBE_TOOL_CATALOGUE,
    heroImageKey: "catTubeRemoval",
  },
  {
    slug: "tube-cleaning-tools",
    name: "Tube Cleaning Tools",
    series: "Tube Cleaning Range",
    category: "Tube Cleaning Tools",
    tagline:
      "Tube cleaning tools like brushes, flexible shafts, and cleaning systems ensure thorough maintenance for boilers and heat exchangers.",
    specs: [],
    media: [],
    catalogue: TUBE_TOOL_CATALOGUE,
    heroImageKey: "catTubeCleaning",
  },
  {
    slug: "single-acting-cylinders",
    name: "Single-Acting Cylinders",
    series: "Lifting Cylinder Range",
    category: "Single-Acting Cylinders",
    tagline:
      "Versatile and effective single-acting lifting cylinders allow restricted space access, high tonnage, and hollow cylinder applications.",
    specs: [
      { label: "Standard", value: "5 - 95 T, 25 - 362 mm stroke, 700 bar" },
      { label: "Hollow", value: "5 - 100 T, 13 - 155 mm stroke, 700 bar" },
      { label: "High Tonnage", value: "50 - 800 T, up to 300 mm stroke" },
      { label: "Low Profile", value: "10 - 150 T, up to 80 mm stroke" },
      { label: "Low Profile Lock Nut", value: "10 - 520 T, up to 80 mm stroke" },
      { label: "Low Flat", value: "up to 150 T, up to 258 mm stroke" },
    ],
    media: [],
    catalogue: null,
    heroImageKey: "catSingleActingCylinders",
  },
  {
    slug: "double-acting-cylinders",
    name: "Double-Acting Cylinders",
    series: "Lifting Cylinder Range",
    category: "Double-Acting Cylinders",
    tagline: "Double-acting cylinders allow controlled lifting and lowering of heavy objects and accurate positioning.",
    specs: [
      { label: "Hollow", value: "30 - 145 T, up to 203 mm stroke, 700 bar" },
      { label: "High Tonnage", value: "50 - 800 T, up to 300 mm stroke, 700 bar" },
    ],
    media: [],
    catalogue: null,
    heroImageKey: "catDoubleActingCylinders",
  },
  {
    slug: "cylinder-powerpacks-pumps",
    name: "Cylinder Powerpacks and Pumps",
    series: "Powerpack Range",
    category: "Cylinder Powerpacks and Pumps",
    tagline: "Reliable power packs and hand pumps that provide consistent pressure for critical load-lifting tools.",
    specs: [
      { label: "Powerpack", value: "Up to 700 bar, 1 - 2.21 L/min flow" },
      { label: "Hand Pumps", value: "700 bar, two-speed" },
    ],
    media: [],
    catalogue: null,
    heroImageKey: "catCylinderPowerpacks",
  },
  {
    slug: "heavy-duty-nut-splitters",
    name: "Heavy Duty Hydraulic Nut Splitters",
    series: "Nut Splitter Range",
    category: "Heavy Duty Hydraulic Nut Splitters",
    tagline:
      "Meticulously designed hydraulic nut splitters for effective, safe, and damage-free removal of corroded or seized nuts sizing from 11-89 mm dia.",
    specs: [
      { label: "Nut Size Range", value: "11 - 89 mm dia" },
      { label: "Chisel", value: "Triangular 3-edge" },
      { label: "Connection", value: "Rear-end" },
    ],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    heroImageKey: "catFlangeManagement",
    directImageUrl:
      "https://www.tritorc.com/assets/img/products/flange-management-tools/heavy-duty-hydraulic-nut-splitters.webp",
  },
  {
    slug: "light-weight-nut-splitter",
    name: "Light Weight Nut Splitter",
    series: "Nut Splitter Range",
    category: "Light Weight Nut Splitter",
    tagline:
      "Compatible with 6-48 mm dia nuts, our angle-headed nut splitter enables effortless, safe, and damage-free removal in confined or hard-to-reach spaces.",
    specs: [
      { label: "Nut Size Range", value: "6 - 48 mm dia" },
      { label: "Head Style", value: "Angle-head" },
      { label: "Cylinder", value: "Spring-return, single-acting" },
    ],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    heroImageKey: "catFlangeManagement",
    directImageUrl:
      "https://www.tritorc.com/assets/img/products/flange-management-tools/light-weight-nut-splitter.webp",
  },
  {
    slug: "low-clearance-flange-spreader",
    name: "Low Clearance Hydraulic Flange Spreader",
    series: "Flange Spreader Range",
    category: "Low Clearance Hydraulic Flange Spreader",
    tagline:
      "A force-controlled low-clearance flange spreader requiring just 2 mm insertion clearance effectively separates flanges in tight spaces without damaging seals.",
    specs: [
      { label: "Force", value: "5 - 10 T" },
      { label: "Pressure", value: "700 bar" },
      { label: "Insertion Clearance", value: "2 mm" },
    ],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    heroImageKey: "catFlangeManagement",
    directImageUrl:
      "https://www.tritorc.com/assets/img/products/flange-management-tools/low-clearence-hydraulic-flange-spreader.webp",
  },
  {
    slug: "flange-spreader-maxi-kit",
    name: "Hydraulic Flange Spreader Standard Maxi Kit",
    series: "Flange Spreader Range",
    category: "Hydraulic Flange Spreader Standard Maxi Kit",
    tagline:
      "Capable of controlled flange separation and expansion up to 81 mm, our hydraulic flange spreading kit delivers reliable performance across diverse industrial applications.",
    specs: [
      { label: "Spread (standard)", value: "up to 61 mm" },
      { label: "Spread (w/ stepped blocks)", value: "up to 81 mm" },
      { label: "Gap Required", value: "6 mm" },
      { label: "Force", value: "14 T" },
    ],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    heroImageKey: "catFlangeManagement",
    directImageUrl:
      "https://www.tritorc.com/assets/img/products/flange-management-tools/hydraulic-flange-spreader-standard-maxi-kit.webp",
  },
  {
    slug: "fixed-folding-pipe-stands",
    name: "Fixed and Folding Pipe Stands",
    series: "Pipe Stand Range",
    category: "Fixed and Folding Pipe Stands",
    tagline:
      "Reliable fixed and folding pipe stands avoid the use of temporary platforms, keeping pipes stable in workshops and onsite operations.",
    specs: [
      { label: "Load Capacity", value: "up to 1,500 kg" },
      { label: "Height Adjustment", value: 'up to 48"' },
      { label: "V-Head Width", value: '12" - 24"' },
    ],
    media: [],
    catalogue: null,
    heroImageKey: "catPipeAccessories",
    directImageUrl: "https://www.tritorc.com/assets/img/products/pipe-accessories/fixed-and-folding-stands.webp",
  },
  {
    slug: "heavy-duty-beam-roller",
    name: "Heavy Duty Beam Roller",
    series: "Beam Roller Range",
    category: "Heavy Duty Beam Roller",
    tagline: "Trusted tools that allow pipes to be rotated with ease while keeping them stable for welding and other operations.",
    specs: [
      { label: "Load Capacity", value: "1 - 10 T" },
      { label: "Pipe Diameter", value: 'up to 60"' },
      { label: "Mounting", value: "I-beam mounted" },
    ],
    media: [],
    catalogue: null,
    heroImageKey: "catPipeAccessories",
    directImageUrl: "https://www.tritorc.com/assets/img/products/pipe-accessories/heavy-duty-beam-roller.webp",
  },
  {
    slug: "chain-clamps",
    name: "Chain Clamps",
    series: "Chain Clamp Range",
    category: "Chain Clamps",
    tagline: "Keep flanges, elbow sections, and other pipe sections steady while welding reliably with our chain clamps.",
    specs: [
      { label: "Diameter Range", value: '2.125" - 72"' },
      { label: "Types", value: "Single, double, scissor, spider, elbow spider" },
    ],
    media: [],
    catalogue: null,
    heroImageKey: "catChainClamps",
    directImageUrl: "https://www.tritorc.com/assets/img/products/pipe-accessories/scissor-clamps-1000-series.webp",
  },
  // --- Products added for the curated Products page (see PRODUCT_LIST below). ---
  // Details and photos come from the matching pages on tritorc.com; where the
  // site gave no figure or photo, the field is left empty rather than invented.
  {
    slug: "thl-series",
    name: "Hex Drive Hydraulic Torque Wrench",
    series: "THL Series",
    category: "Hydraulic Torque Wrenches and Pumps",
    tagline:
      "Low-profile, hex-type hydraulic torque wrench with interchangeable hex links, a small nose radius and a 360° × 180° swivel for confined spaces.",
    specs: [
      { label: "Max. Torque", value: "53,512 Nm" },
      { label: "Hex Size", value: "19 - 175 mm" },
    ],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    directImageUrl: "/products/thl-series-studio.webp",
  },
  {
    slug: "thl-ultra-slim",
    name: "Ultra-Slim Hex Drive Hydraulic Torque Wrench",
    series: "THL Ultra-Slim Series",
    category: "Hydraulic Torque Wrenches and Pumps",
    tagline: "Ultra-slim, low-profile hex-drive torque wrench for the tightest clearances.",
    specs: [{ label: "Torque Range", value: "275 - 12,834 Nm" }],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    directImageUrl: "/products/thl-ultra-slim-studio.webp",
  },
  {
    slug: "slt-series",
    name: "Spring Return Hydraulic Bolt Tensioner",
    series: "SLT Series",
    category: "Hydraulic Bolt Tensioners",
    tagline: "Spring-return hydraulic bolt tensioner for controlled, repeatable bolt loading.",
    specs: [],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    directImageUrl: "/products/slt-series-studio.webp",
  },
  {
    slug: "mst-series",
    name: "Multi Stage Hydraulic Bolt Tensioner",
    series: "MST Series",
    category: "Hydraulic Bolt Tensioners",
    tagline: "Multi-stage hydraulic bolt tensioner for controlled, repeatable bolt loading.",
    specs: [],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    directImageUrl: "/products/mst-series-studio.webp",
  },
  {
    slug: "tsf-series",
    name: "Split Frame Pipe Cutting Machine",
    series: "TSF Series",
    category: "Pipe Cold Cutting and Beveling Machines",
    tagline:
      "OD-mounted split-frame machine that cuts and bevels pipe in one operation with a cold, spark-free mechanical process.",
    specs: [
      { label: "Pipe OD Range", value: '2" - 72"' },
      { label: "Drive Options", value: "Pneumatic, hydraulic, electric" },
      { label: "Bevel Types", value: "Standard, compound, J-prep" },
    ],
    media: [],
    catalogue: IN_SITU_MACHINING_CATALOGUE,
    directImageUrl: "/products/tsf-series-studio.webp",
  },
  {
    slug: "twe-3",
    name: "TWE-3 Electric Torquing Pump",
    series: "TWE-3",
    category: "Hydraulic Torque Wrenches and Pumps",
    tagline: "Electric-driven pump that powers hydraulic torque wrenches.",
    specs: [],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    directImageUrl: "/products/twe-3-studio.webp",
  },
  {
    slug: "twp-3",
    name: "TWP-3 Air Driven Torque Pump",
    series: "TWP-3",
    category: "Hydraulic Torque Wrenches and Pumps",
    tagline:
      "Air-operated pump for hydraulic torque wrenches, built for remote, hazardous or power-restricted sites.",
    specs: [
      { label: "Tank", value: "10 L" },
      { label: "Weight", value: "30 kg" },
      { label: "Air Supply", value: "4 - 8 bar" },
      { label: "Noise", value: "82 dB" },
    ],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    directImageUrl: "/products/twp-3-studio.webp",
  },
  {
    slug: "tbp-150",
    name: "TBP-150 Air Driven Tensioning Pump",
    series: "TBP-150",
    category: "Hydraulic Bolt Tensioners",
    tagline:
      "Compact air-driven hydraulic pump for high-pressure bolt tensioning; can run several tensioners at once.",
    specs: [
      { label: "Working Pressure", value: "1,500 bar" },
      { label: "Air Supply", value: "4 - 7 bar" },
      { label: "Tank", value: "5 - 10 L" },
    ],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    directImageUrl: "/products/tbp-150-studio.webp",
  },
  {
    slug: "tbe-200",
    name: "TBE-200 Electric Tensioning Pump",
    series: "TBE-200",
    category: "Hydraulic Bolt Tensioners",
    tagline: "Electric-driven pump for hydraulic bolt tensioning.",
    specs: [],
    media: [],
    catalogue: BOLTING_CATALOGUE,
    directImageUrl: "/products/tbe-200-studio.webp",
  },
];

/**
 * The curated list shown on the Products page: three sections, each card goes
 * straight to that product. `title`/`series` are the labels printed on the card.
 */
export interface ProductListItem {
  slug: string;
  title: string;
  series: string;
}
export interface ProductListSection {
  name: string;
  items: ProductListItem[];
}

export const PRODUCT_LIST: ProductListSection[] = [
  {
    name: "Controlled Bolting",
    items: [
      { slug: "tsl-20", title: "Square Drive Type", series: "TSL Series" },
      { slug: "thl-series", title: "Hex Drive Type", series: "THL Series" },
      { slug: "thl-ultra-slim", title: "Ultra-Slim Hex Drive", series: "THL Ultra-Slim Series" },
      { slug: "btl-19", title: "Top Loaded", series: "BTL Series" },
      { slug: "slt-series", title: "Spring Return", series: "SLT Series" },
      { slug: "mst-series", title: "Multi Stage", series: "MST Series" },
      { slug: "tsf-series", title: "Split Frame Pipe Cutting Machine", series: "TSF Series" },
    ],
  },
  {
    name: "Pumps",
    items: [
      { slug: "twe-3", title: "Electric Torquing Pump", series: "TWE-3" },
      { slug: "twp-3", title: "Air Driven Torque Pump", series: "TWP-3" },
      { slug: "tbp-150", title: "Air Driven Tensioning Pump", series: "TBP-150" },
      { slug: "tbe-200", title: "Electric Tensioning Pump", series: "TBE-200" },
    ],
  },
  {
    name: "Onsite Machine Tools",
    items: [
      {
        slug: "pipe-cold-cutting-beveling-machines",
        title: "Pipe Cold Cutting and Beveling Machines",
        series: "Cold Cutting Range",
      },
    ],
  },
];

export interface Testimonial {
  quote: string;
  author: string;
  imageKey: ImageKey;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    // This image's specific project origin isn't identifiable (generic
    // plant + tools collage), so the caption stays a general capability
    // statement rather than an invented named-client attribution.
    quote: "From refineries to remote pipelines, our tools perform where it matters most.",
    author: "Field Operations, Oil & Gas Sector",
    imageKey: "testimonial1",
  },
  {
    // Corrected: this image is Tritorc's own "The New Pamban Bridge" success
    // story graphic (visible in the image itself) — it was previously
    // mismatched with an unrelated "Adani Wind Project" quote.
    quote: "Behind the bolts of India's first vertical-lift sea bridge.",
    author: "The New Pamban Bridge, India",
    imageKey: "testimonial2",
  },
];

export interface LibraryAsset {
  id: string;
  type: "Catalogue" | "Video" | "Photo";
  title: string;
  categoryLabel: string;
  imageKey?: ImageKey;
  // Real Strapi media files resolve their own thumbnail/file URL directly —
  // no curated ImageKey needed, same directImageUrl pattern used elsewhere.
  directImageUrl?: string;
  fileUrl?: string;
}

export const LIBRARY_MEDIA_ASSETS: LibraryAsset[] = [
  { id: "vid-1", type: "Video", title: "HTW Demo Video", categoryLabel: "Hydraulic Torque Wrenches and Pumps", imageKey: "productTorqueHero" },
  { id: "vid-2", type: "Video", title: "WBT Series Wind Turbine Install", categoryLabel: "Hydraulic Bolt Tensioners", imageKey: "catWindTurbine" },
  { id: "vid-3", type: "Video", title: "Hot Tapping & Line Stopping Overview", categoryLabel: "Services", imageKey: "svcHotTapping" },
  { id: "photo-1", type: "Photo", title: "TSL Series Product Shot", categoryLabel: "Hydraulic Torque Wrenches and Pumps", imageKey: "productTorqueHero" },
  // Corrected: this is studio product photography, not an in-use/offshore
  // shot — the earlier title overstated what the image actually shows.
  { id: "photo-2", type: "Photo", title: "BTL Series Product Photography", categoryLabel: "Hydraulic Bolt Tensioners", imageKey: "libraryBtlPhoto" },
  // Corrected: this file is a torque wrench technical spec diagram, not a
  // facility photo — it was mislabeled "Manufacturing Facility Overview"
  // before the visual audit caught it.
  { id: "photo-3", type: "Photo", title: "Torque Wrench Technical Drawing", categoryLabel: "Hydraulic Torque Wrenches and Pumps", imageKey: "productSpecDiagram" },
  { id: "photo-4", type: "Photo", title: "Company Operations Overview", categoryLabel: "Company", imageKey: "companyIntro" },
];

export const BRAND = {
  quote:
    "At Tritorc, we don't just take on challenges — we turn them into outcomes.",
  since: "Since 1989",
};
