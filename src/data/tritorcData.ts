export interface ProductModel {
  id: string;
  name: string;
  series: string;
  category: 'torque-wrench' | 'bolt-tensioner' | 'flange-facing' | 'cold-cutting' | 'impact-sockets' | 'power-packs';
  tagline: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  maxTorqueNm?: number;
  maxTorqueFtLbs?: number;
  maxLoadKn?: number;
  pressureBar: number;
  driveSize?: string;
  boltRange?: string;
  weightKg: number;
  accuracy: string;
  bodyMaterial: string;
  swivelType?: string;
  specTable: {
    modelCode: string;
    torqueNmOrLoadKn: string;
    driveOrHexSize: string;
    weightKg: string;
    dimensionMm: string;
  }[];
  features: string[];
  applications: string[];
  standards: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  standardCodes: string[];
  mobilizationTime: string;
  scopePoints: string[];
  toolingDeployed: string[];
  clientDeployments: string[];
  highlights: {
    metric: string;
    label: string;
  }[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  location: string;
  sector: 'Oil & Gas' | 'Renewable Wind' | 'Marine & Infrastructure' | 'Power & Nuclear';
  heroMetric: string;
  metricLabel: string;
  description: string;
  fullStory: string;
  image: string;
  toolingUsed: string[];
  achievementTags: string[];
}

export const PRODUCTS_DATA: ProductModel[] = [
  {
    id: 'tsl-series',
    name: 'TSL Series Square Drive Hydraulic Torque Wrench',
    series: 'TSL Heavy-Duty Series',
    category: 'torque-wrench',
    tagline: 'Aircraft-grade alloy square drive wrench engineered for high-cycle industrial bolting.',
    description: 'The Tritorc TSL Series is a premium square drive hydraulic torque wrench constructed from high-strength aerospace aluminum-titanium alloy. Engineered to withstand harsh offshore and refinery environments, the TSL delivers repeatable ±3% precision torque with a 360° x 180° multi-axis uni-swivel hose manifold and quick-release reaction arm.',
    heroImage: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_01_ee8aa345e00b82d9_2ebe5dcd22.webp',
    galleryImages: [
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_01_ee8aa345e00b82d9_2ebe5dcd22.webp',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_03_674d5618678d1285_b94224d21f.webp',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_collage_tsl_wind_turbine_white_png_6d12220863838799_130b0e60f6.png'
    ],
    maxTorqueNm: 24120,
    maxTorqueFtLbs: 17790,
    pressureBar: 700,
    driveSize: '3/4" to 2-1/2" Square Drive',
    boltRange: 'M16 to M90 (5/8" to 3-1/2")',
    weightKg: 28.5,
    accuracy: '±3% Calibrated',
    bodyMaterial: 'Aircraft Grade Titanium-Aluminum Alloy (7075-T6)',
    swivelType: '360° × 180° Multi-Axis Quick-Disconnect Swivel',
    features: [
      'Monolithic aerospace alloy body with zero flex under maximum load',
      'Patented fine-tooth anti-reverse ratchet mechanism for rapid advance stroke',
      '360° x 180° uni-swivel manifold allows unrestricted hose movement in tight spaces',
      'Laser-etched calibrated torque multiplier chart directly engraved on the body',
      'Push-button square drive quick-reversal for effortless switch between tightening and loosening',
      'Calibrated reaction arm with 360° multi-position positive lock'
    ],
    applications: [
      'Refinery heat exchangers & reactor head flanges',
      'Wind turbine tower foundation bolts & yaw rings',
      'Offshore drilling platform BOP stacks & riser joints',
      'Power generation turbine casing split lines',
      'High-pressure pipeline valves & flanged spool connections'
    ],
    standards: ['ISO 17025 Certified Calibration', 'CE Compliant', 'ASME PCC-1 Appendix O'],
    specTable: [
      { modelCode: 'TSL-01', torqueNmOrLoadKn: '112 - 1,120 Nm', driveOrHexSize: '3/4" Sq. Dr.', weightKg: '1.8 kg', dimensionMm: '110 × 42 × 80' },
      { modelCode: 'TSL-03', torqueNmOrLoadKn: '450 - 4,520 Nm', driveOrHexSize: '1" Sq. Dr.', weightKg: '4.5 kg', dimensionMm: '162 × 65 × 125' },
      { modelCode: 'TSL-05', torqueNmOrLoadKn: '750 - 7,530 Nm', driveOrHexSize: '1-1/2" Sq. Dr.', weightKg: '7.8 kg', dimensionMm: '205 × 80 × 155' },
      { modelCode: 'TSL-10', torqueNmOrLoadKn: '1,550 - 15,500 Nm', driveOrHexSize: '1-1/2" Sq. Dr.', weightKg: '15.2 kg', dimensionMm: '270 × 102 × 200' },
      { modelCode: 'TSL-20', torqueNmOrLoadKn: '2,400 - 24,120 Nm', driveOrHexSize: '2-1/2" Sq. Dr.', weightKg: '28.5 kg', dimensionMm: '345 × 128 × 245' }
    ]
  },
  {
    id: 'thl-series',
    name: 'THL Series Low Profile Hexagon Hydraulic Torque Wrench',
    series: 'THL Ultra-Slim Series',
    category: 'torque-wrench',
    tagline: 'Ultra-compact direct-fit hex cassette wrench for minimal clearance flange nuts.',
    description: 'Designed specifically for tight envelope bolting where overhead clearance or bolt protrusion prevents square drive sockets. The THL Series features interchangeable hex link cassettes that fit directly onto the nut with zero socket stack-up, transmitting maximum torque without bending stresses.',
    heroImage: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_02_1c40d28ce0a36924_cf5c1eeac0.webp',
    galleryImages: [
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_02_1c40d28ce0a36924_cf5c1eeac0.webp',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_03_674d5618678d1285_b94224d21f.webp'
    ],
    maxTorqueNm: 28650,
    maxTorqueFtLbs: 21130,
    pressureBar: 700,
    driveSize: '19mm to 175mm Hex A/F (3/4" to 6-7/8")',
    boltRange: 'M14 to M120',
    weightKg: 24.0,
    accuracy: '±3% Repeatability',
    bodyMaterial: 'High-Strength Chromium-Molybdenum & Al-Ti Forging',
    swivelType: '360° × 180° Swivel with Quick Couplers',
    features: [
      'Ultra-slim head radius allows entry into extremely narrow flange recesses',
      'Pin-less quick link swap allows cassette changes in under 10 seconds without tools',
      'Extended reaction pad integrated into cassette body for superior stability',
      'Zero-deflection cylinder design for maximum cycle durability',
      'Laser-marked size identifiers with protective hard-anodized finish'
    ],
    applications: [
      'Subsea wellheads & Christmas tree valves',
      'API flanged pipelines with long stud bolt extension',
      'Compact heat exchanger channel head covers',
      'Petrochemical pipe rack flanges with tight pipe-to-pipe spacing'
    ],
    standards: ['ISO 9001:2015', 'CE Certified', 'API 6A / 17D Compliant'],
    specTable: [
      { modelCode: 'THL-02', torqueNmOrLoadKn: '232 - 2,328 Nm', driveOrHexSize: '19 - 55 mm A/F', weightKg: '2.1 kg', dimensionMm: '195 × 32 × 125' },
      { modelCode: 'THL-04', torqueNmOrLoadKn: '585 - 5,858 Nm', driveOrHexSize: '30 - 80 mm A/F', weightKg: '4.8 kg', dimensionMm: '245 × 42 × 175' },
      { modelCode: 'THL-08', torqueNmOrLoadKn: '1,090 - 10,940 Nm', driveOrHexSize: '41 - 100 mm A/F', weightKg: '9.2 kg', dimensionMm: '300 × 52 × 220' },
      { modelCode: 'THL-14', torqueNmOrLoadKn: '1,850 - 18,520 Nm', driveOrHexSize: '50 - 115 mm A/F', weightKg: '15.6 kg', dimensionMm: '360 × 64 × 270' },
      { modelCode: 'THL-28', torqueNmOrLoadKn: '2,860 - 28,650 Nm', driveOrHexSize: '80 - 155 mm A/F', weightKg: '24.0 kg', dimensionMm: '420 × 82 × 330' }
    ]
  },
  {
    id: 'btl-series',
    name: 'BTL-19 Series Hydraulic Bolt Tensioner',
    series: 'BTL Spring-Return Series',
    category: 'bolt-tensioner',
    tagline: 'Ultra-fast spring return hydraulic bolt tensioner delivering pure axial elongation.',
    description: 'The Tritorc BTL-19 Series tensioner applies direct axial tension to the stud, eliminating thread friction, torsional shear stresses, and flange galling. Engineered with automatic spring return pistons, internal stroke limiters, and high-pressure polyurethane seals, it guarantees uniform residual bolt load across critical pressure vessel joints.',
    heroImage: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_bolt_tensioners_hero_faab38eb2a3d52d1_0977bce128.webp',
    galleryImages: [
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_bolt_tensioners_hero_faab38eb2a3d52d1_0977bce128.webp',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_products_bolt_tensioners_btl_piyush_m_001_webp_173df31de207de6a_3403de1a81.webp',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_products_bolt_tensioners_btl_piyush_m_002_webp_0df958a640157a9e_d32bad3c3a.webp',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_products_bolt_tensioners_btl_piyush_m_003_webp_75e5f2da1954b55c_bdfe85c625.webp'
    ],
    maxLoadKn: 2650,
    pressureBar: 1500,
    boltRange: 'M20 to M100 (3/4" to 4")',
    weightKg: 18.2,
    accuracy: '±1% Residual Load Accuracy',
    bodyMaterial: 'Hardened Micro-Alloy Steel with Anti-Corrosion Treatment',
    features: [
      'Integrated spring return mechanism auto-retracts piston within 3 seconds',
      'Over-stroke safety relief prevents seal blowout and operator hazard',
      'Interchangeable bridge & puller sets accommodate multiple stud diameters',
      'Direct visual stroke indicator gauge ensures optimal piston travel',
      'Twin port quick-connect coupling allows simultaneous daisy-chain tensioning'
    ],
    applications: [
      'Nuclear reactor pressure vessel cover studs',
      'Hydrocracker & reformer flanged closures',
      'Subsea pipeline manifolds and risers',
      'Steam turbine casing bolts',
      'High-pressure gas compressor heads'
    ],
    standards: ['ISO 9001:2015', 'CE Certified', 'ASME Boiler and Pressure Vessel Code Sec VIII'],
    specTable: [
      { modelCode: 'BTL-19-1', torqueNmOrLoadKn: '185 kN Load', driveOrHexSize: 'M20 - M24 (3/4" - 7/8")', weightKg: '2.4 kg', dimensionMm: 'Ø82 × 115' },
      { modelCode: 'BTL-19-2', torqueNmOrLoadKn: '345 kN Load', driveOrHexSize: 'M27 - M30 (1" - 1-1/8")', weightKg: '4.1 kg', dimensionMm: 'Ø102 × 130' },
      { modelCode: 'BTL-19-3', torqueNmOrLoadKn: '560 kN Load', driveOrHexSize: 'M33 - M39 (1-1/4" - 1-1/2")', weightKg: '6.8 kg', dimensionMm: 'Ø128 × 152' },
      { modelCode: 'BTL-19-4', torqueNmOrLoadKn: '980 kN Load', driveOrHexSize: 'M42 - M48 (1-5/8" - 1-7/8")', weightKg: '11.5 kg', dimensionMm: 'Ø160 × 185' },
      { modelCode: 'BTL-19-6', torqueNmOrLoadKn: '2,650 kN Load', driveOrHexSize: 'M72 - M100 (2-3/4" - 4")', weightKg: '28.0 kg', dimensionMm: 'Ø245 × 260' }
    ]
  },
  {
    id: 'wbt-series',
    name: 'WBT Series Wind Turbine Bolt Tensioner',
    series: 'WBT Multi-Stage Wind Series',
    category: 'bolt-tensioner',
    tagline: 'Specialized high-capacity multi-stage tensioner tailored for wind turbine tower foundation & blade studs.',
    description: 'Engineered specifically for the renewable wind sector, the Tritorc WBT Series provides high tensile force in an ultra-narrow footprint. Featuring dual-stage hydraulic cylinders and gear-driven nut rotating sockets, it enables wind turbine technicians to tension foundation anchor bolts and blade pitch bearings rapidly at heights.',
    heroImage: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_collage_tsl_wind_turbine_white_png_6d12220863838799_130b0e60f6.png',
    galleryImages: [
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_collage_tsl_wind_turbine_white_png_6d12220863838799_130b0e60f6.png',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_collage_cbtl_for_wind_application_201_jpg_7423d01fb860de8a_84910dfdeb.jpg'
    ],
    maxLoadKn: 1950,
    pressureBar: 1500,
    boltRange: 'M30 to M64 Foundation Bolts',
    weightKg: 14.5,
    accuracy: '±1.5% Target Preload',
    bodyMaterial: 'High-Fatigue Ni-Cr-Mo Structural Alloy',
    features: [
      'Multi-stage cylinder design delivers double the load capacity in half the diameter',
      'Integrated geared nut rundown mechanism speeds up cyclic fastening by 60%',
      'Optimized clearance for foundation cage clearance and nacelle flange pitch rings',
      'High-flow 1,500 bar quick couplings with non-drip technology'
    ],
    applications: [
      'Wind turbine tower foundation anchor bolts (M36, M42, M48)',
      'Tower section-to-section connection flanges',
      'Nacelle main frame & slewing ring bearings',
      'Rotor blade hub connection bolts'
    ],
    standards: ['IEC 61400 Wind Standards', 'ISO 9001:2015', 'CE Certified'],
    specTable: [
      { modelCode: 'WBT-36', torqueNmOrLoadKn: '720 kN Load', driveOrHexSize: 'M36 Anchor', weightKg: '7.8 kg', dimensionMm: 'Ø110 × 195' },
      { modelCode: 'WBT-42', torqueNmOrLoadKn: '980 kN Load', driveOrHexSize: 'M42 Anchor', weightKg: '9.5 kg', dimensionMm: 'Ø124 × 210' },
      { modelCode: 'WBT-48', torqueNmOrLoadKn: '1,280 kN Load', driveOrHexSize: 'M48 Anchor', weightKg: '12.2 kg', dimensionMm: 'Ø140 × 230' },
      { modelCode: 'WBT-56', torqueNmOrLoadKn: '1,950 kN Load', driveOrHexSize: 'M56 Anchor', weightKg: '16.8 kg', dimensionMm: 'Ø165 × 255' }
    ]
  },
  {
    id: 'flange-facing-machines',
    name: 'Portable In-Situ Flange Facing Machines',
    series: 'TFF In-Situ Machining Series',
    category: 'flange-facing',
    tagline: 'High-precision internal & external mount portable flange facers for ASME B16.5 gramophone resurfacing.',
    description: 'Tritorc TFF Series portable flange facing machines restore corroded, warped, and damaged flange sealing surfaces on-site without cutting or transporting piping spools. Featuring continuous auto-feed mechanisms, it generates precise ASME spiral serrated and concentric finishes from 0" up to 120" diameters.',
    heroImage: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/products_landing_flange_facing_machines_282965af4982a1fd_f9ffeadb93.webp',
    galleryImages: [
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/products_landing_flange_facing_machines_282965af4982a1fd_f9ffeadb93.webp'
    ],
    pressureBar: 6.2,
    boltRange: '2" to 120" Flange Diameters',
    weightKg: 42.0,
    accuracy: 'ASME B16.5 Finish (Ra 3.2 - 6.3 µm)',
    bodyMaterial: 'Hardened Tool Steel & Aircraft Castings',
    features: [
      'Internal (ID) and External (OD) mounting configurations available',
      'Continuous gear-driven automatic feed generates perfect phonographic serrations',
      'Dual tool posts for simultaneous facing and chamfering operations',
      'Pneumatic and hydraulic drive options with high torque at low RPM for vibration-free cutting',
      'Rigid multi-point self-centering clamping chucks'
    ],
    applications: [
      'Refinery raised face (RF) and ring joint (RTJ) flange re-machining',
      'Heat exchanger tube sheet gasket face restoration',
      'Offshore vessel manway & nozzle resurfacing',
      'Shipbuilding rudder and propeller shaft flange truing'
    ],
    standards: ['ASME B16.5', 'ASME PCC-2 Article 3.5', 'ISO 9001:2015'],
    specTable: [
      { modelCode: 'TFF-ID-12', torqueNmOrLoadKn: '2" - 12" Facing Range', driveOrHexSize: 'ID Mount 1.8" - 10"', weightKg: '24 kg', dimensionMm: 'Compact Modular' },
      { modelCode: 'TFF-ID-24', torqueNmOrLoadKn: '4" - 24" Facing Range', driveOrHexSize: 'ID Mount 3.5" - 20"', weightKg: '45 kg', dimensionMm: 'Rigid Frame' },
      { modelCode: 'TFF-ID-48', torqueNmOrLoadKn: '12" - 48" Facing Range', driveOrHexSize: 'ID Mount 10" - 42"', weightKg: '110 kg', dimensionMm: 'Heavy Duty' },
      { modelCode: 'TFF-OD-72', torqueNmOrLoadKn: '24" - 72" Facing Range', driveOrHexSize: 'OD Clamping Base', weightKg: '220 kg', dimensionMm: 'Modular Arm' }
    ]
  },
  {
    id: 'pipe-cold-cutting-machines',
    name: 'Pipe Cold Cutting and Beveling Split-Frame Machines',
    series: 'TCC Clamshell Series',
    category: 'cold-cutting',
    tagline: 'Spark-free split-frame clamshell machines for simultaneous precision cutting and weld beveling.',
    description: 'The Tritorc TCC Series split-frame clamshell machines mount around in-line piping to sever and bevel pipe walls simultaneously. Completely cold and spark-free, they are certified for explosive hydrocarbon environments where hot work is strictly prohibited.',
    heroImage: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/products_landing_pipe_cold_cutting_and_beveling_machines_0d5300eec27c6be4_2a77e371ea.webp',
    galleryImages: [
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/products_landing_pipe_cold_cutting_and_beveling_machines_0d5300eec27c6be4_2a77e371ea.webp'
    ],
    pressureBar: 6.2,
    boltRange: '2" to 72" Nominal Pipe Size (Sch 10 to Sch XXS)',
    weightKg: 55.0,
    accuracy: '±0.1 mm Square Cut & Precise 37.5° Bevel',
    bodyMaterial: 'Hardened Aluminum-Bronze Split Ring Assembly',
    features: [
      '100% Spark-free and heat-affected-zone (HAZ) free cold machining',
      'Split-frame clamshell design splits into two halves to mount around closed loop piping',
      'Simultaneous cut-off, facing, and compound weld prep beveling (30°, 37.5°, J-bevel)',
      'Star-wheel automatic radial feed provides smooth, uniform chip evacuation',
      'Pneumatic, hydraulic, or servo electric drive options'
    ],
    applications: [
      'Live refinery tie-ins & hazardous pipeline modifications',
      'Heavy-wall subsea pipeline severance',
      'Decommissioning offshore structures & platform conductors',
      'Boiler steam header and power piping weld preparation'
    ],
    standards: ['ATEX Certified Spark-Free', 'ASME B31.3 / B31.4', 'ISO 9001:2015'],
    specTable: [
      { modelCode: 'TCC-06', torqueNmOrLoadKn: '2" - 6" OD (60 - 168 mm)', driveOrHexSize: 'Pneumatic / Hydraulic', weightKg: '32 kg', dimensionMm: 'Split Clamshell' },
      { modelCode: 'TCC-12', torqueNmOrLoadKn: '6" - 12" OD (168 - 323 mm)', driveOrHexSize: 'Pneumatic / Hydraulic', weightKg: '58 kg', dimensionMm: 'Split Clamshell' },
      { modelCode: 'TCC-24', torqueNmOrLoadKn: '14" - 24" OD (355 - 610 mm)', driveOrHexSize: 'Hydraulic High-Torque', weightKg: '115 kg', dimensionMm: 'Heavy Frame' },
      { modelCode: 'TCC-48', torqueNmOrLoadKn: '30" - 48" OD (762 - 1219 mm)', driveOrHexSize: 'Hydraulic Twin-Motor', weightKg: '240 kg', dimensionMm: 'Industrial Rig' }
    ]
  },
  {
    id: 'heavy-impact-sockets',
    name: 'Industrial Heavy Impact Sockets & Accessories',
    series: 'TIS Heavy Duty Sockets',
    category: 'impact-sockets',
    tagline: 'Forged chrome-molybdenum alloy impact sockets engineered for 25,000+ Nm cyclic impulse.',
    description: 'Tritorc Heavy Impact Sockets are forged from ultra-tough chrome-molybdenum alloy steel and heat-treated to resist the highest vibrational torque stresses. Available in 6-point, 12-point, stack sockets, deep well, and impact reducers.',
    heroImage: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_impact_socket_family_0283e5233e82c94e_e60f63bffc.png',
    galleryImages: [
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_impact_socket_family_0283e5233e82c94e_e60f63bffc.png'
    ],
    pressureBar: 0,
    driveSize: '3/4", 1", 1-1/2", 2-1/2" up to #5 Spline',
    boltRange: '19mm to 220mm A/F (3/4" to 8-5/8")',
    weightKg: 8.5,
    accuracy: 'ASME B107.2 / DIN 3129 Standards',
    bodyMaterial: 'Drop-Forged High Carbon Chrome Molybdenum (SCM440)',
    features: [
      'Precision broached hexagon prevents rounding of costly exotic alloy nuts',
      'Black industrial phosphate coating resists salt spray and harsh chemicals',
      'Pin and O-ring retaining grooves ensure operator safety during high-torque runs',
      'Stack sockets and extended depth configurations for long stud clearance'
    ],
    applications: [
      'Bridge bearing housings (e.g. New Pamban Bridge)',
      'Subsea pipeline flanges & heavy crane track fasteners',
      'Mining haul truck wheel hubs and excavator track assemblies',
      'High-pressure turbine split casing studs'
    ],
    standards: ['ASME B107.2', 'DIN 3129', 'ISO 2725-2'],
    specTable: [
      { modelCode: 'TIS-100-Series', torqueNmOrLoadKn: 'Up to 5,000 Nm', driveOrHexSize: '1" Square Drive (24 - 80 mm)', weightKg: '0.8 - 3.2 kg', dimensionMm: 'Standard & Deep' },
      { modelCode: 'TIS-150-Series', torqueNmOrLoadKn: 'Up to 15,000 Nm', driveOrHexSize: '1-1/2" Square Drive (36 - 130 mm)', weightKg: '2.5 - 9.5 kg', dimensionMm: 'Industrial Heavy' },
      { modelCode: 'TIS-250-Series', torqueNmOrLoadKn: 'Up to 30,000 Nm', driveOrHexSize: '2-1/2" Square Drive (65 - 220 mm)', weightKg: '8.0 - 32.0 kg', dimensionMm: 'Extreme Heavy' }
    ]
  }
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'controlled-bolting',
    title: 'On-Site Controlled Bolting & Joint Integrity Management',
    shortTitle: 'Controlled Bolting',
    tagline: 'Zero-leak joint integrity execution compliant with ASME PCC-1 guidelines.',
    description: 'Tritorc provides end-to-end controlled bolting services utilizing hydraulic torque wrenches, bolt tensioners, and ultrasonic bolt elongation measurement. Our ECITB-accredited technicians calculate precise bolt loads, manage multi-pass cross-pattern tightening, and maintain 100% digital flange tag registries to guarantee zero leaks during plant restarts.',
    heroImage: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_03_674d5618678d1285_b94224d21f.webp',
    galleryImages: [
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_03_674d5618678d1285_b94224d21f.webp',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_collage_tsl_wind_turbine_white_png_6d12220863838799_130b0e60f6.png'
    ],
    standardCodes: ['ASME PCC-1-2019', 'ECITB Certified Crews', 'API 6A / 17D'],
    mobilizationTime: 'Immediate (24/7 Global Field Mobilization)',
    scopePoints: [
      'Flange joint calculation & target torque/preload data sheet preparation',
      'Hydraulic torque tightening & 50%-100% multi-pass cross bolting sequence',
      'Hydraulic bolt tensioning for simultaneous 50% or 100% joint loading',
      'Ultrasonic bolt elongation measurement (UT) for exact clamped residual stress',
      'Flange registry tag & trace system with digital torque certification sign-off'
    ],
    toolingDeployed: [
      'TSL & THL Hydraulic Torque Wrenches up to 28,000 Nm',
      'BTL-19 & Subsea Bolt Tensioners up to 2,650 kN',
      'Electric & Pneumatic Dual-Stage 700/1500 Bar Power Units',
      'Ultrasonic Bolt Stress Meters'
    ],
    clientDeployments: [
      'Reliance Jamnagar: 144 reactor studs detensioned in under 24 hours',
      'Adani Wind Energy: 69,247 Nm delivered across 48-week wind farm erection',
      'Karabatan Kazakhstan: 40-80 MPa sour gas facility controlled bolting'
    ],
    highlights: [
      { metric: '100%', label: 'First-Time Leak-Free Startup Record' },
      { metric: '±3%', label: 'Applied Torque Repeatability' },
      { metric: '500+', label: 'Critical Flanges Torqued Per Turnaround' }
    ]
  },
  {
    id: 'hot-tapping',
    title: 'Hot Tapping & Line Stopping (Zero Shutdown Operations)',
    shortTitle: 'Hot Tapping & Line Stopping',
    tagline: 'Tie-in live pressurized pipelines without stopping flow or risking hydrocarbon discharge.',
    description: 'Hot tapping enables modification, branch additions, and sensor tie-ins to live, high-pressure hydrocarbon and utility pipelines without interrupting production or shutting down facilities. Combined with line stopping, Tritorc isolates sections of piping for replacement while bypass lines keep process streams flowing 100% uninterrupted.',
    heroImage: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_hottapping_hot_tapping_1_webp_746fb127b4f429dc_6487d32429.webp',
    galleryImages: [
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_hottapping_hot_tapping_1_webp_746fb127b4f429dc_6487d32429.webp',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_hottapping_fitting_2_optimized_webp_89054edb37cab7c9_1e5ee54084.webp',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_hottapping_cutters_final_jpg_d8367cb2ed36bac9_631d82309f.jpg',
      'https://tritorc.com/blog/add/2025/06/Tritorc-Team-holding-the-tocken-after-sucessful-hot-tapping-operation-scaled.webp'
    ],
    standardCodes: ['API 2201 (Safe Hot Tapping)', 'ASME B31.3 / B31.4 / B31.8', 'ISO 9001:2015'],
    mobilizationTime: 'Rapid Response Engineering Team',
    scopePoints: [
      'Engineering calculation: Pipe wall thickness, metallurgy, flow velocity & thermal dissipation',
      'Welded split tee / saddle installation & hydrostatic pressure qualification',
      'Mounting of sandwich valve and high-pressure hot tapping machine',
      'Precision pilot drilling, coupon retention, and full-bore hot tap cutting',
      'Coupon retrieval and verified zero pressure loss execution'
    ],
    toolingDeployed: [
      'High-pressure Hot Tapping Machines rated up to 1,480 PSI / 100 Bar',
      'Full-encirclement Split Sleeves & Flanged Saddles',
      'Specialized Carbide Hole Cutters with Coupon Retainers',
      'Line Stopping Plugging Heads & Bypass Systems'
    ],
    clientDeployments: [
      'ONGC NQP Offshore Platform: 16" live pipeline tapped to add 12" branch connection with 0 shutdown',
      'L&T Hydrocarbon Projects: Commended for flawless zero-leak execution'
    ],
    highlights: [
      { metric: '0 PSI', label: 'Flow Interruption or Production Loss' },
      { metric: '16"', label: 'Live Pipeline Successfully Tapped' },
      { metric: '$M+', label: 'Client Shutdown Capital Saved' }
    ]
  },
  {
    id: 'insitu-machining',
    title: 'In-Situ Field Machining & Flange Resurfacing',
    shortTitle: 'In-Situ Machining',
    tagline: 'Bring machine-shop tolerances straight to the job site without cutting pipe spools.',
    description: 'Transporting huge piping spools and pressure vessels to a machine shop causes massive shutdown delays and logistics expenses. Tritorc brings portable, spark-free machining tools directly to your site, executing precision flange facing, pipe cold cutting, weld beveling, and journal turning with micron accuracy.',
    heroImage: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/products_landing_flange_facing_machines_282965af4982a1fd_f9ffeadb93.webp',
    galleryImages: [
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/products_landing_flange_facing_machines_282965af4982a1fd_f9ffeadb93.webp',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/products_landing_pipe_cold_cutting_and_beveling_machines_0d5300eec27c6be4_2a77e371ea.webp'
    ],
    standardCodes: ['ASME B16.5 / B16.47', 'ASME PCC-2 Article 3.5', 'API 570'],
    mobilizationTime: '24-48 Hours On-Site Setup',
    scopePoints: [
      'ID & OD mounted flange refacing from 2" up to 120" diameters',
      'Restoration of RTJ ring grooves, flat faces, and raised face spiral phonographic finishes',
      'Spark-free clamshell pipe cold cutting and compound 37.5° weld beveling',
      'Milling of pump & compressor mounting skid baseplates',
      'On-site casing stud drilling and precision thread tapping'
    ],
    toolingDeployed: [
      'Tritorc TFF ID/OD Flange Facers',
      'TCC Clamshell Split-Frame Cold Cutting Machines',
      'Pneumatic & Hydraulic Power Distribution Carts',
      'Digital Surface Roughness Profilometers'
    ],
    clientDeployments: [
      'Karabatan Kazakhstan: 72" pipe cold cutting in extreme winter conditions',
      'Reliance Jamnagar: Reactor head cover gasket groove machining'
    ],
    highlights: [
      { metric: '120"', label: 'Maximum Machining Diameter Capability' },
      { metric: 'Ra 3.2', label: 'Surface Finish Roughness Precision' },
      { metric: '0 HAZ', label: 'Zero Heat-Affected Zone (Spark Free)' }
    ]
  },
  {
    id: 'retubing-services',
    title: 'Condenser & Heat Exchanger Retubing Services',
    shortTitle: 'Retubing & Heat Exchangers',
    tagline: 'High-speed bundle overhaul, tube extraction, expanding, and hydro-testing.',
    description: 'Tritorc provides full-turnkey retubing solutions for condensers, boilers, reboilers, and shell-and-tube heat exchangers. Utilizing hydraulic tube pulling systems, torque-controlled tube expanders, and automated bundle cleaners, we reduce turnaround timelines from weeks to days with zero damage to tubesheets.',
    heroImage: 'https://www.tritorc.com/assets/services/Retubing.jpg',
    galleryImages: [
      'https://www.tritorc.com/assets/services/Retubing.jpg',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_tubing_min_jpg_05ba72638ffb7774_493a39c9b1.jpg'
    ],
    standardCodes: ['TEMA Standards', 'ASME Section VIII Div 1', 'HEI Standards'],
    mobilizationTime: 'Pre-Turnaround Assessment & Fast Dispatch',
    scopePoints: [
      'Continuous hydraulic tube pulling and stub removal without tubesheet galling',
      'Tube bundle high-pressure hydro-blasting and ultrasonic cleaning',
      'Precision tube insertion, projection trimming, and end flaring',
      'Digitally controlled electric tube expanding with calibrated wall thinning percentage',
      'Shell and tube side hydrostatic qualification and eddy current inspection'
    ],
    toolingDeployed: [
      'Continuous Hydraulic Tube Pullers (up to 3" OD tubes)',
      'Digital Electronic Torque-Controlled Tube Expansion Drive Units',
      'Tritorc Internal Tube Cutters & Facing Tools',
      'Hydrostatic Test Plugs rated to 10,000 PSI'
    ],
    clientDeployments: [
      'Samsung Abu Dhabi: 40,000 tubes retubed in 7-8 days with 100% QA/QC pass'
    ],
    highlights: [
      { metric: '40,000', label: 'Tubes Retubed in a Single 8-Day Window' },
      { metric: '100%', label: 'QA/QC Documentation & ASME Compliance' },
      { metric: '0%', label: 'Tubesheet Hole Distortion or Galling' }
    ]
  },
  {
    id: 'leak-testing-services',
    title: 'Nitrogen-Helium Leak Detection & Pre-Commissioning',
    shortTitle: 'N2-He Leak Detection',
    tagline: 'Pinpoint micro-leaks before hydrocarbon introduction using 99% N2 / 1% Helium trace gas.',
    description: 'Nitrogen-Helium leak testing is the global gold standard for process plant commissioning. Helium molecules penetrate micro-pores and gasket fissures that hydrostatic water tests cannot detect. Tritorc pressurizes process piping up to 95% operating pressure and utilizes mass spectrometers to guarantee 100% leak integrity before volatile gas introduction.',
    heroImage: 'https://tritorc.com/blog/add/2025/06/Tritorc-Leak-Testing.webp',
    galleryImages: [
      'https://tritorc.com/blog/add/2025/06/Tritorc-Leak-Testing.webp',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_qatar_gas_webp_959701032810fe03_3d327fcf63.webp'
    ],
    standardCodes: ['ASME B31.3 Chapter VI', 'API 598', 'ISO 20484 Non-Destructive Testing'],
    mobilizationTime: 'Certified Pre-Commissioning Crew',
    scopePoints: [
      'System dewatering, drying to dew point -40°C, and nitrogen purging',
      'Pressurization using 99% Nitrogen / 1% Helium certified gas blend',
      'Sniffing and bagging of flanged connections with vacuum mass spectrometers',
      'Detection sensitivity down to 1 × 10⁻⁶ mbar·l/s',
      'Immediate joint remediation and re-testing with formal handover certificates'
    ],
    toolingDeployed: [
      'Mobile Nitrogen Vaporizer Spreads & Tube Trailers',
      'Precision Helium Mass Spectrometer Sniffing Units',
      'High-Pressure Calibrated Gas Manifolds up to 400 Bar',
      'Digital Dew Point & Oxygen Analyzers'
    ],
    clientDeployments: [
      'ADNOC SARB Accelerated Growth, UAE: 276 Barg tested on 1"-6" critical piping at AlQatia artificial island',
      'Qatar Gas facilities: Pre-commissioning leak detection certification'
    ],
    highlights: [
      { metric: '276 Barg', label: 'Maximum Test Pressure Applied' },
      { metric: '10⁻⁶', label: 'Mass Spectrometer Detection Sensitivity' },
      { metric: 'Zero', label: 'Unscheduled Shutdowns Upon Hydrocarbon Live' }
    ]
  },
  {
    id: 'dry-rental-calibration',
    title: 'ISO 17025 Tool Calibration & 24/7 Dry Rental Fleet',
    shortTitle: 'Dry Rental & Calibration',
    tagline: 'Ready-to-deploy industrial bolting fleet with NABL/ISO 17025 certified calibration.',
    description: 'When project schedules cannot wait for capital expenditure purchases, Tritorc maintains the world’s most extensive dry rental fleet of hydraulic torque wrenches, bolt tensioners, flange facers, and high-pressure power packs. Every rental tool is serviced, recalibrated, and delivered with traceable ISO 17025 certificates.',
    heroImage: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/about_page_equipment_rentals_c8e3328c55af3b47_bb6e0004df.jpg',
    galleryImages: [
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/about_page_equipment_rentals_c8e3328c55af3b47_bb6e0004df.jpg',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/about_page_services_76263159dc124c72_e7040bdf1f.jpg',
      'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_collage_dry_rental_gen_new_01_jpg_23d7a99e526fef90_0b30b3c3c1.jpg'
    ],
    standardCodes: ['ISO/IEC 17025:2017 Laboratory Accredited', 'NIST / NABL Traceable', 'ISO 9001:2015'],
    mobilizationTime: 'Same-Day Dispatch from Regional Hubs',
    scopePoints: [
      'Emergency turnaround dry rental with customized tool kits & backup spares',
      'ISO 17025 accredited calibration bench testing up to 50,000 Nm',
      'Pressure gauge, transducer, and relief valve certification up to 2,800 Bar',
      'Preventive maintenance, rebuilds, and seal overhaul service',
      'On-site operator safety and torque calculation training'
    ],
    toolingDeployed: [
      '500+ Hydraulic Torque Wrenches in Global Rental Pool',
      '1,000+ Bolt Tensioners & Adapter Bridges in Stock',
      'State-of-the-Art Automated Calibration Test Benches',
      'High-Pressure Electric & Pneumatic Tensioner Pumps'
    ],
    clientDeployments: [
      'Major refinery turnarounds across India, UAE, Saudi Arabia, Singapore & USA',
      'Offshore vessel dry dockings with immediate 12-hour mobilization'
    ],
    highlights: [
      { metric: '500+', label: 'Heavy Rental Tools in Ready Stock' },
      { metric: '24/7', label: 'Emergency Mobilization Desk' },
      { metric: 'ISO 17025', label: 'Traceable Calibration Certificates' }
    ]
  }
];

export const CASE_STUDIES_DATA: CaseStudy[] = [
  {
    id: 'reliance-jamnagar',
    title: 'Reliance Jamnagar Refinery',
    client: 'Reliance Industries Limited',
    location: 'Jamnagar, Gujarat, India',
    sector: 'Oil & Gas',
    heroMetric: '144 Studs',
    metricLabel: 'Detensioned in Under 24 Hours',
    description: "Partnering with the world's largest single-site oil refinery (1.4M barrels/day). Delivered zero-delay turnaround execution on critical reactor closure studs.",
    fullStory: 'During a planned emergency turnaround at the Jamnagar complex, 144 massive reactor cover studs required simultaneous detensioning and subsequent controlled torquing under extreme time pressure. Tritorc deployed multi-gang hydraulic tensioners and electric power units, achieving flawless breakout without galling a single stud and completing the entire scope 18 hours ahead of schedule.',
    image: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_01_ee8aa345e00b82d9_2ebe5dcd22.webp',
    toolingUsed: ['BTL-19 Series Multi-Gang Tensioners', 'TSL-10 Square Drive Wrenches', '1,500 Bar Electric Power Packs'],
    achievementTags: ['18h Ahead of Schedule', '144 Studs', 'Zero Galling', 'ISO 9001']
  },
  {
    id: 'adani-wind',
    title: 'Adani Wind Energy Megaproject',
    client: 'Adani New Industries Ltd',
    location: 'Kutch, Gujarat, India',
    sector: 'Renewable Wind',
    heroMetric: '69,247 Nm',
    metricLabel: 'Torque Delivered to Towers',
    description: 'From base to blade — torqueing and tensioning the towers of tomorrow across 48 weeks of wind turbine foundation erection.',
    fullStory: 'Erecting high-megawatt wind turbines requires rigorous torque repeatability under severe desert winds and dust. Tritorc engineered specialized WBT multi-stage tensioners and high-torque TSL wrenches to secure tower foundation anchor cages and blade bearing pitch joints, ensuring 100% fatigue compliance across every turbine foundation.',
    image: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_collage_tsl_wind_turbine_white_png_6d12220863838799_130b0e60f6.png',
    toolingUsed: ['WBT-48 Wind Tensioners', 'TSL-20 Heavy Hydraulic Wrenches', 'Pneumatic Torque Multipliers'],
    achievementTags: ['48 Weeks Erection', '69,247 Nm Peak Torque', 'Zero Fatigue Failures']
  },
  {
    id: 'ongc-offshore',
    title: 'ONGC NQP Offshore Platform',
    client: 'Oil and Natural Gas Corporation (ONGC) / L&T',
    location: 'Mumbai High Offshore, India',
    sector: 'Oil & Gas',
    heroMetric: '16" Line',
    metricLabel: 'Live Pipeline Hot-Tapped with Zero Shutdown',
    description: 'Hot tapping a live 16" hydrocarbon pipeline to add a 12" branch connection with no shutdown and no interruption to flow — commended by L&T and ONGC.',
    fullStory: 'Operating on an offshore oil platform without taking a shutdown requires surgical engineering precision. Tritorc designed a custom split sleeve assembly, performed on-line welding qualification, mounted a high-pressure hot tapping machine, and severed the 16" pipe wall to create a 12" branch connection while full hydrocarbon gas continued flowing underneath.',
    image: 'https://tritorc.com/blog/add/2025/06/Tritorc-Team-holding-the-tocken-after-sucessful-hot-tapping-operation-scaled.webp',
    toolingUsed: ['High-Pressure Hot Tapping Rig', 'Full-Encirclement Split Tees', 'Carbide Cutters with Coupon Retainer'],
    achievementTags: ['Zero Flow Interruption', 'API 2201 Compliant', 'Commended by ONGC & L&T']
  },
  {
    id: 'new-pamban-bridge',
    title: 'The New Pamban Railway Sea Bridge',
    client: 'Rail Vikas Nigam Limited (RVNL)',
    location: 'Rameswaram, Tamil Nadu, India',
    sector: 'Marine & Infrastructure',
    heroMetric: '2.08 km',
    metricLabel: "India's First Vertical-Lift Sea Bridge",
    description: 'Heavy-duty impact sockets, stack sockets, and torque tools supplied for gear couplings, lift mechanisms, and bearing housings across the marine channel.',
    fullStory: "India's first vertical lift sea bridge endures extreme corrosive ocean spray and heavy tidal wave impacts. Tritorc supplied heavy forged impact sockets, stack extensions, and calibrated torque wrenches to bolt down the massive mechanical lift towers, electro-mechanical gearboxes, and rail track bearing blocks with exact pre-calculated clamping force.",
    image: 'https://tritorc.com/blog/add/2025/06/pamban-railway-bridge-in-india.webp',
    toolingUsed: ['TIS Heavy-Duty Drop Forged Sockets', 'THL Low Profile Hex Wrenches', 'TSL Series Square Drive'],
    achievementTags: ['Marine Grade Salt Resistant', '2.08 km Sea Span', 'Vertical Lift Mechanism']
  },
  {
    id: 'adnoc-sarb',
    title: 'ADNOC SARB Accelerated Growth Project',
    client: 'Abu Dhabi National Oil Company (ADNOC)',
    location: 'AlQatia, SARB North Artificial Island, UAE',
    sector: 'Oil & Gas',
    heroMetric: '276 Barg',
    metricLabel: 'Tested on 1"-6" Critical Process Piping',
    description: 'Nitrogen-Helium leak testing (1% He / 99% N2) for early tie-in of production wells where even a micro-leak posed a severe safety hazard.',
    fullStory: 'Located on an artificial island offshore Abu Dhabi, the SARB facility handles toxic, sour gas at high pressure. Before bringing wells online, Tritorc deployed cryogenic nitrogen pump spreads, blended 1% trace helium, and scanned hundreds of flanged spool joints with mass spectrometers at 276 Barg pressure, achieving flawless zero-leak certification.',
    image: 'https://tritorc.com/blog/add/2025/06/Tritorc-Leak-Testing.webp',
    toolingUsed: ['Cryogenic Nitrogen Vaporizer Spread', 'Helium Mass Spectrometer Sniffers', 'High Pressure Gas Manifolds'],
    achievementTags: ['276 Barg Pressure', 'Mass Spec Precision', 'Offshore Artificial Island']
  },
  {
    id: 'samsung-retubing',
    title: 'Samsung Abu Dhabi Petrochemical Plant',
    client: 'Samsung Engineering',
    location: 'Ruwais Industrial Complex, UAE',
    sector: 'Power & Nuclear',
    heroMetric: '40,000',
    metricLabel: 'Tubes Retubed in 7-8 Days',
    description: 'Turnaround speed record with 100% QA/QC documentation, ASME/TEMA/SAES compliance, and zero tubesheet damage.',
    fullStory: 'A critical heat exchanger train suffered severe corrosion cracking, threatening downstream refinery operations. Tritorc mobilized 24 specialized retubing technicians equipped with continuous hydraulic pullers and digital torque expanders. The crew extracted and re-installed 40,000 tubes within 8 days, passing hydro-testing on the first attempt.',
    image: 'https://www.tritorc.com/assets/services/Retubing.jpg',
    toolingUsed: ['Continuous Hydraulic Tube Pullers', 'Digital Electric Tube Expanders', 'Tritorc End Facing Tooling'],
    achievementTags: ['40,000 Tubes', '8-Day Turnaround', '100% QA/QC Pass']
  },
  {
    id: 'karabatan-kazakhstan',
    title: 'Karabatan High-Pressure Onshore Facility',
    client: 'North Caspian Operating Company (NCOC)',
    location: 'Atyrau Region, Kazakhstan',
    sector: 'Oil & Gas',
    heroMetric: '13 Billion',
    metricLabel: 'Barrels Recoverable Oil, 40-80 MPa H2S',
    description: "Empowering NCOC's ultra-high pressure sour gas plant. Delivered 69,247 Nm hydraulic torque wrenches, 5,406 kN tensioners, and 72\" pipe cutting machines.",
    fullStory: 'Operating in sub-zero winter temperatures with high concentrations of dangerous hydrogen sulfide (H2S) gas, standard bolting tools crack from hydrogen embrittlement. Tritorc provided specially treated alloy torque wrenches and tensioners alongside split-frame cold cutting machines for heavy 72" pipeline severance.',
    image: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_karbatan_jpg_531c1b769b2d38b2_2205b9a41f.jpg',
    toolingUsed: ['TSL-20 Heavy Square Drive', '5,406 kN Custom Tensioners', '72" TCC Split Frame Cold Cutter'],
    achievementTags: ['Sub-Zero Execution', '40-80 MPa Sour Gas', '72" Cold Cut']
  }
];

export interface BoltSpec {
  metric: string;
  nominalDiaMm: number;
  pitchMm: number;
  stressAreaMm2: number;
  recommendedWrenchId: string;
  recommendedTensionerId: string;
}

export const BOLT_DATABASE: BoltSpec[] = [
  { metric: 'M16 (5/8")', nominalDiaMm: 16, pitchMm: 2.0, stressAreaMm2: 157, recommendedWrenchId: 'tsl-series', recommendedTensionerId: 'btl-series' },
  { metric: 'M20 (3/4")', nominalDiaMm: 20, pitchMm: 2.5, stressAreaMm2: 245, recommendedWrenchId: 'tsl-series', recommendedTensionerId: 'btl-series' },
  { metric: 'M24 (1")', nominalDiaMm: 24, pitchMm: 3.0, stressAreaMm2: 353, recommendedWrenchId: 'tsl-series', recommendedTensionerId: 'btl-series' },
  { metric: 'M27 (1-1/8")', nominalDiaMm: 27, pitchMm: 3.0, stressAreaMm2: 459, recommendedWrenchId: 'tsl-series', recommendedTensionerId: 'btl-series' },
  { metric: 'M30 (1-1/4")', nominalDiaMm: 30, pitchMm: 3.5, stressAreaMm2: 561, recommendedWrenchId: 'tsl-series', recommendedTensionerId: 'btl-series' },
  { metric: 'M33 (1-3/8")', nominalDiaMm: 33, pitchMm: 3.5, stressAreaMm2: 694, recommendedWrenchId: 'tsl-series', recommendedTensionerId: 'btl-series' },
  { metric: 'M36 (1-1/2")', nominalDiaMm: 36, pitchMm: 4.0, stressAreaMm2: 817, recommendedWrenchId: 'tsl-series', recommendedTensionerId: 'wbt-series' },
  { metric: 'M42 (1-3/4")', nominalDiaMm: 42, pitchMm: 4.5, stressAreaMm2: 1121, recommendedWrenchId: 'tsl-series', recommendedTensionerId: 'wbt-series' },
  { metric: 'M48 (2")', nominalDiaMm: 48, pitchMm: 5.0, stressAreaMm2: 1473, recommendedWrenchId: 'tsl-series', recommendedTensionerId: 'wbt-series' },
  { metric: 'M56 (2-1/4")', nominalDiaMm: 56, pitchMm: 5.5, stressAreaMm2: 2030, recommendedWrenchId: 'thl-series', recommendedTensionerId: 'wbt-series' },
  { metric: 'M64 (2-1/2")', nominalDiaMm: 64, pitchMm: 6.0, stressAreaMm2: 2676, recommendedWrenchId: 'thl-series', recommendedTensionerId: 'btl-series' },
  { metric: 'M72 (2-7/8")', nominalDiaMm: 72, pitchMm: 6.0, stressAreaMm2: 3460, recommendedWrenchId: 'thl-series', recommendedTensionerId: 'btl-series' },
  { metric: 'M80 (3-1/4")', nominalDiaMm: 80, pitchMm: 6.0, stressAreaMm2: 4344, recommendedWrenchId: 'thl-series', recommendedTensionerId: 'btl-series' },
  { metric: 'M90 (3-5/8")', nominalDiaMm: 90, pitchMm: 6.0, stressAreaMm2: 5591, recommendedWrenchId: 'thl-series', recommendedTensionerId: 'btl-series' }
];

export interface BoltMaterialGrade {
  grade: string;
  yieldStrengthMpa: number;
  standard: string;
}

export const BOLT_GRADES: BoltMaterialGrade[] = [
  { grade: 'ASTM A193 B7 (High Temp Refinery)', yieldStrengthMpa: 724, standard: 'ASTM A193 / ASME SA193' },
  { grade: 'ASTM A193 B16 (Extreme Temp Steam)', yieldStrengthMpa: 725, standard: 'ASTM A193' },
  { grade: 'ASTM A320 L7 (Low Temp Cryogenic)', yieldStrengthMpa: 724, standard: 'ASTM A320' },
  { grade: 'ISO 8.8 (High Tensile Structural)', yieldStrengthMpa: 640, standard: 'ISO 898-1' },
  { grade: 'ISO 10.9 (Heavy Equipment & Wind)', yieldStrengthMpa: 940, standard: 'ISO 898-1' },
  { grade: 'ISO 12.9 (Extreme Structural Yield)', yieldStrengthMpa: 1100, standard: 'ISO 898-1' }
];

export const LUBRICANT_FACTORS = [
  { label: 'Molybdenum Disulphide (k = 0.10)', value: 0.10, desc: 'High-performance anti-seize paste' },
  { label: 'Nickel / Copper Base Paste (k = 0.12)', value: 0.12, desc: 'Standard high-temp anti-seize' },
  { label: 'Light Machine Oil (k = 0.15)', value: 0.15, desc: 'Clean oiled threads' },
  { label: 'Dry / As-Received (k = 0.18)', value: 0.18, desc: 'Unlubricated or zinc plated' }
];
