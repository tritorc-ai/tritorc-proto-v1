import React, { useState } from 'react';
import {
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Wrench,
  Layers,
  Truck,
  Award,
  Headphones,
  Calculator
} from 'lucide-react';
import { TabType } from '../MobileBottomNav';
import { PRODUCTS_DATA, ProductModel } from '../../data/tritorcData';

interface HomeTabProps {
  onNavigateTab: (tab: TabType) => void;
  onSelectProduct: (product: ProductModel) => void;
  onOpenQuote: (toolId?: string, notes?: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onNavigateTab,
  onSelectProduct,
  onOpenQuote
}) => {
  // Mobile App Interactive Hardware Selector (Ather-inspired equipment showcase)
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);

  const heroModels = [
    {
      id: 'tsl-series',
      shortName: 'Square Drive',
      title: 'TSL-20 Square Drive Wrench',
      categoryLabel: 'Flagship Hydraulic Bolting',
      image: '/src/assets/images/hydraulic_wrench_1791801999843.jpg',
      stat1: { value: '24,120 Nm', label: 'Max Torque' },
      stat2: { value: '700 Bar', label: 'Hydraulic P' },
      stat3: { value: '±3%', label: 'Repeatability' },
      product: PRODUCTS_DATA.find((p) => p.id === 'tsl-series') || PRODUCTS_DATA[0]
    },
    {
      id: 'thl-series',
      shortName: 'Low Profile',
      title: 'THL-28 Hex Cassette Wrench',
      categoryLabel: 'Narrow Clearance Bolting',
      image: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_02_1c40d28ce0a36924_cf5c1eeac0.webp',
      fallbackImage: '/src/assets/images/hydraulic_wrench_1791801999843.jpg',
      stat1: { value: '28,650 Nm', label: 'Max Torque' },
      stat2: { value: '700 Bar', label: 'Hydraulic P' },
      stat3: { value: '19-175mm', label: 'Hex Range' },
      product: PRODUCTS_DATA.find((p) => p.id === 'thl-series') || PRODUCTS_DATA[1]
    },
    {
      id: 'btl-series',
      shortName: 'Tensioner',
      title: 'BTL-19 Bolt Tensioner',
      categoryLabel: 'Pure Axial Preload',
      image: 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_bolt_tensioners_hero_faab38eb2a3d52d1_0977bce128.webp',
      fallbackImage: '/src/assets/images/bolt_tensioner_1791802013409.jpg',
      stat1: { value: '2,650 kN', label: 'Axial Load' },
      stat2: { value: '1,500 Bar', label: 'Ultra High' },
      stat3: { value: 'M20-M100', label: 'Stud Diam.' },
      product: PRODUCTS_DATA.find((p) => p.id === 'btl-series') || PRODUCTS_DATA[2]
    },
    {
      id: 'power-packs',
      shortName: 'Power Pack',
      title: 'PHP-04 Hydraulic Power Pack',
      categoryLabel: '700 Bar Electric Drive',
      image: '/src/assets/images/hydraulic_pump_1791802038626.jpg',
      stat1: { value: '700 Bar', label: 'Dual Stage' },
      stat2: { value: '4.0 kW', label: 'High Flow' },
      stat3: { value: '10 Liters', label: 'Reservoir' },
      product: PRODUCTS_DATA[0]
    }
  ];

  const currentHero = heroModels[selectedHeroIndex];

  return (
    <div className="space-y-3.5 pb-8 text-slate-900 font-sans">
      {/* 1. Ather-Style Mobile Hero Card - Interactive Hardware Showcase */}
      <section className="bg-white rounded-[28px] p-4.5 sm:p-5 shadow-[0_8px_32px_rgba(15,23,42,0.035)] space-y-3.5">
        {/* Tritorc Moto Line - Preserved verbatim */}
        <h1 className="text-[22px] sm:text-[24px] font-extrabold text-slate-950 tracking-tight leading-[1.2]">
          Engineering Excellence in Controlled Bolting
        </h1>

        {/* Mobile Interactive Segmented Tool Selector (Ather app tab styling) */}
        <div className="flex items-center gap-1 p-1 bg-[#f1f5f9] rounded-2xl">
          {heroModels.map((m, idx) => {
            const isSelected = idx === selectedHeroIndex;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedHeroIndex(idx)}
                className={`flex-1 py-1.5 px-1.5 text-[11px] font-bold rounded-xl transition-all duration-200 text-center ${
                  isSelected
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {m.shortName}
              </button>
            );
          })}
        </div>

        {/* Seamless Hardware Studio Display */}
        <div
          onClick={() => onSelectProduct(currentHero.product)}
          className="cursor-pointer group relative bg-gradient-to-b from-[#f8fafc] to-[#eef3f9] rounded-[24px] p-4 flex flex-col items-center justify-center overflow-hidden transition-all active:scale-[0.99]"
        >
          {/* Top category label & spec button */}
          <div className="w-full flex items-center justify-between pb-1">
            <span className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
              {currentHero.categoryLabel}
            </span>
            <span className="w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* High-Fidelity Studio Equipment Image */}
          <div className="py-2.5 w-full max-w-[250px] aspect-[4/3] flex items-center justify-center">
            <img
              src={currentHero.image}
              alt={currentHero.title}
              onError={(e) => {
                if (currentHero.fallbackImage) {
                  e.currentTarget.src = currentHero.fallbackImage;
                }
              }}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(15,23,42,0.12)] group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Real-time Dynamic Hardware Telemetry */}
          <div className="w-full pt-1 flex items-center justify-between text-xs font-bold text-slate-900 border-t border-slate-200/50 mt-1">
            <span className="truncate pr-2">{currentHero.title}</span>
            <span className="text-blue-700 flex items-center gap-0.5 shrink-0 group-hover:translate-x-1 transition-transform">
              <span>View Specs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Dynamic 3-metric hardware telemetry row */}
          <div className="grid grid-cols-3 gap-2 w-full pt-2.5">
            <div className="bg-white/80 rounded-xl py-1.5 px-1 text-center shadow-xs">
              <div className="text-[11px] font-extrabold text-slate-950">
                {currentHero.stat1.value}
              </div>
              <div className="text-[9px] font-medium text-slate-500">
                {currentHero.stat1.label}
              </div>
            </div>
            <div className="bg-white/80 rounded-xl py-1.5 px-1 text-center shadow-xs">
              <div className="text-[11px] font-extrabold text-slate-950">
                {currentHero.stat2.value}
              </div>
              <div className="text-[9px] font-medium text-slate-500">
                {currentHero.stat2.label}
              </div>
            </div>
            <div className="bg-white/80 rounded-xl py-1.5 px-1 text-center shadow-xs">
              <div className="text-[11px] font-extrabold text-slate-950">
                {currentHero.stat3.value}
              </div>
              <div className="text-[9px] font-medium text-slate-500">
                {currentHero.stat3.label}
              </div>
            </div>
          </div>
        </div>

        {/* Global Track Record Metric Bar (35+ Years, 50+ Nations, 500+ Projects) */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          <div className="bg-[#f8fafc] rounded-2xl py-2.5 px-2 text-center">
            <div className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              35+
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              Years
            </div>
          </div>
          <div className="bg-[#f8fafc] rounded-2xl py-2.5 px-2 text-center">
            <div className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              50+
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              Nations
            </div>
          </div>
          <div className="bg-[#f8fafc] rounded-2xl py-2.5 px-2 text-center">
            <div className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              500+
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              Projects
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ather-Style 4-Column Quick Action Dock */}
      <section className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onOpenQuote(undefined, 'Torque & Tension Engineering Calculation')}
          className="bg-white rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(15,23,42,0.025)] active:scale-95 transition-all group"
        >
          <span className="w-10 h-10 rounded-xl bg-[#f0f4f9] flex items-center justify-center text-blue-700 group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5" />
          </span>
          <span className="text-[11px] font-extrabold text-slate-800 text-center leading-tight">
            Torque Calc
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('products')}
          className="bg-white rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(15,23,42,0.025)] active:scale-95 transition-all group"
        >
          <span className="w-10 h-10 rounded-xl bg-[#f4f7fb] flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </span>
          <span className="text-[11px] font-extrabold text-slate-800 text-center leading-tight">
            Catalog
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('services')}
          className="bg-white rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(15,23,42,0.025)] active:scale-95 transition-all group"
        >
          <span className="w-10 h-10 rounded-xl bg-[#edf8f3] flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </span>
          <span className="text-[11px] font-extrabold text-slate-800 text-center leading-tight">
            On-Site
          </span>
        </button>

        <button
          onClick={() => onOpenQuote(undefined, 'Tool Rental Pool Dispatch Request')}
          className="bg-white rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(15,23,42,0.025)] active:scale-95 transition-all group"
        >
          <span className="w-10 h-10 rounded-xl bg-[#edf4fe] flex items-center justify-center text-blue-700 group-hover:scale-105 transition-transform">
            <Truck className="w-5 h-5" />
          </span>
          <span className="text-[11px] font-extrabold text-slate-800 text-center leading-tight">
            Rentals
          </span>
        </button>
      </section>

      {/* 3. Field Operations & Industrial Deployments (Making every picture 100% meaningful) */}
      <section className="space-y-3">
        {/* Featured Card: Bolt Tensioning on Industrial Piping */}
        <div
          onClick={() => {
            const tensioner = PRODUCTS_DATA.find((p) => p.id === 'btl-series');
            if (tensioner) onSelectProduct(tensioner);
          }}
          className="cursor-pointer group relative rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.04)] aspect-[16/9] active:scale-[0.99] transition-all"
        >
          <img
            src="/src/assets/images/bolt_tensioner_1791802013409.jpg"
            alt="Hydraulic Bolt Tensioner on Heavy Pipe Flange"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Subtle gradient scrim with clear operational context */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-wider text-blue-300 uppercase bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-lg">
                Subsea &amp; High-Pressure Piping
              </span>
              <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-950 transition-colors shadow-sm">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                Hydraulic Bolt Tensioners
              </h3>
              <div className="text-[11px] font-semibold text-slate-300 mt-1 flex items-center gap-2">
                <span>1,500 Bar Pure Axial Load</span>
                <span>·</span>
                <span>ASME Sec VIII</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Split Seamless Operational Cards: Flange Machining & 700 Bar Power Units */}
        <div className="grid grid-cols-2 gap-3">
          {/* Flange Facing Machine in Action */}
          <div
            onClick={() => onNavigateTab('services')}
            className="cursor-pointer group relative rounded-[26px] overflow-hidden shadow-[0_6px_24px_rgba(15,23,42,0.035)] aspect-[4/3] active:scale-[0.98] transition-all"
          >
            <img
              src="/src/assets/images/flange_machining_1791802025246.jpg"
              alt="In-Situ Flange Facing Machine"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent p-3.5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-bold text-slate-200 uppercase bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                  In-Situ Machining
                </span>
                <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-950 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <h3 className="text-[13px] font-extrabold text-white leading-tight">
                  Flange Facing
                </h3>
                <div className="text-[10px] font-medium text-slate-300 mt-0.5">
                  ASME B16.5 Gramophone
                </div>
              </div>
            </div>
          </div>

          {/* 700 Bar Hydraulic Power Units */}
          <div
            onClick={() => onOpenQuote(undefined, 'Hydraulic Power Pack Unit Inquiry')}
            className="cursor-pointer group relative rounded-[26px] overflow-hidden shadow-[0_6px_24px_rgba(15,23,42,0.035)] aspect-[4/3] active:scale-[0.98] transition-all"
          >
            <img
              src="/src/assets/images/hydraulic_pump_1791802038626.jpg"
              alt="700 Bar Hydraulic Power Pack"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent p-3.5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-bold text-slate-200 uppercase bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                  Power Systems
                </span>
                <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-950 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <h3 className="text-[13px] font-extrabold text-white leading-tight">
                  700 Bar Power Units
                </h3>
                <div className="text-[10px] font-medium text-slate-300 mt-0.5">
                  Dual-Stage High Flow
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Capability Flow with Ather-Style Light Skin & Cool Accents */}
      <section className="space-y-3">
        {/* Equipment Catalog Quick Bar (Cool Glacier Frost) */}
        <div
          onClick={() => onNavigateTab('products')}
          className="cursor-pointer bg-gradient-to-br from-[#f4f7fb] to-[#eaf0f8] rounded-[26px] p-4.5 shadow-[0_6px_24px_rgba(15,23,42,0.03)] hover:shadow-md transition-all group active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-900 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5 text-slate-800" />
              </span>
              <h3 className="text-base font-extrabold text-slate-950 leading-tight">
                Bolting &amp; Machining Catalog
              </h3>
            </div>

            <span className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-slate-900 group-hover:bg-slate-950 group-hover:text-white transition-colors shadow-sm">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Seamless Duo: Services & Rental */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tile A: On-Site Services (Cool Mint Aura) */}
          <div
            onClick={() => onNavigateTab('services')}
            className="cursor-pointer bg-gradient-to-br from-[#edf8f3] to-[#e2f3eb] rounded-[26px] p-4 shadow-[0_6px_20px_rgba(16,185,129,0.04)] hover:shadow-md transition-all flex items-center justify-between group active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center text-emerald-700">
                <Layers className="w-4 h-4" />
              </span>
              <h3 className="text-[14px] font-extrabold text-slate-950 leading-tight">
                On-Site Services
              </h3>
            </div>

            <span className="w-7 h-7 rounded-full bg-white/70 flex items-center justify-center text-emerald-800 group-hover:bg-emerald-700 group-hover:text-white transition-colors shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Tile B: Rental Fleet (Cool Glacier Blue) */}
          <div
            onClick={() => onOpenQuote(undefined, 'Tool Rental Pool Dispatch Request')}
            className="cursor-pointer bg-gradient-to-br from-[#edf4fe] to-[#e3edfc] rounded-[26px] p-4 shadow-[0_6px_20px_rgba(59,130,246,0.04)] hover:shadow-md transition-all flex items-center justify-between group active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center text-blue-700">
                <Truck className="w-4 h-4" />
              </span>
              <h3 className="text-[14px] font-extrabold text-slate-950 leading-tight">
                Rental Fleet
              </h3>
            </div>

            <span className="w-7 h-7 rounded-full bg-white/70 flex items-center justify-center text-blue-800 group-hover:bg-blue-700 group-hover:text-white transition-colors shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Tile C: Field Proof (Ather-Style Light Skin Sand Aura, Seamless) */}
        <div
          onClick={() => onNavigateTab('projects')}
          className="cursor-pointer bg-gradient-to-br from-[#fcf7ee] to-[#f7eee0] rounded-[26px] p-4.5 shadow-[0_6px_20px_rgba(217,119,6,0.04)] hover:shadow-md transition-all flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center text-amber-800">
              <Award className="w-4.5 h-4.5 text-amber-700" />
            </span>
            <h4 className="text-[14px] font-extrabold text-slate-950 leading-tight">
              Client Proof &amp; Case Studies
            </h4>
          </div>

          <span className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-amber-900 group-hover:bg-amber-900 group-hover:text-white transition-colors shadow-sm shrink-0">
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </section>

      {/* 5. About Tritorc - Aesthetic Seamless Skin-Sand Tone Matching Ather App */}
      <section className="bg-gradient-to-br from-[#fbf8f3] to-[#f5ede2] rounded-[28px] p-5 shadow-[0_6px_24px_rgba(217,119,6,0.03)] space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-white/90 shadow-sm flex items-center justify-center text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-800" />
          </span>
          <h2 className="text-xs font-bold text-amber-950/80 uppercase tracking-wider">
            About Tritorc Equipments
          </h2>
        </div>

        {/* Soft Aesthetic Credential Floating Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-amber-950">
          <span className="px-3 py-1 bg-white/80 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            ISO 9001:2015
          </span>
          <span className="px-3 py-1 bg-white/80 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            CE Certified
          </span>
          <span className="px-3 py-1 bg-white/80 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            ECITB Accredited
          </span>
          <span className="px-3 py-1 bg-white/80 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            ASME PCC-1
          </span>
        </div>
      </section>

      {/* 6. Direct Connect Card - Sleek Floating Ather Concierge Style */}
      <section className="bg-white rounded-[28px] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-[#f4f7fb] flex items-center justify-center text-slate-800 shrink-0">
            <Headphones className="w-5 h-5 text-slate-700" />
          </span>
          <h3 className="text-sm font-extrabold text-slate-950 leading-tight">
            Need Technical Assistance?
          </h3>
        </div>

        <button
          onClick={() => onOpenQuote(undefined, 'Direct In-App Consultation')}
          className="px-4 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-full transition-all shadow-sm shrink-0 active:scale-95"
        >
          Contact Us
        </button>
      </section>
    </div>
  );
};
