import React, { useState } from 'react';
import { CASE_STUDIES_DATA, CaseStudy } from '../../data/tritorcData';
import { MapPin, X, CheckCircle2 } from 'lucide-react';

export const ProjectsTab: React.FC = () => {
  const [activeStory, setActiveStory] = useState<CaseStudy | null>(null);

  return (
    <div className="space-y-4 pb-20 text-slate-900 font-sans">
      {/* Intro Header */}
      <div className="bg-white rounded-[24px] p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-1">
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-950 tracking-tight leading-tight">
          Field Projects
        </h1>
        <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
          Proven at scale across mega-refineries, offshore islands &amp; bridges.
        </p>
      </div>

      {/* Projects Feed */}
      <div className="space-y-3.5 pt-1">
        {CASE_STUDIES_DATA.map((cs) => (
          <div
            key={cs.id}
            onClick={() => setActiveStory(cs)}
            className="cursor-pointer bg-white rounded-[24px] border border-slate-200/90 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-slate-400 transition-all flex flex-col justify-between"
          >
            {/* Visual Container */}
            <div className="relative h-40 bg-slate-950">
              <img
                src={cs.image}
                alt={cs.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_01_ee8aa345e00b82d9_2ebe5dcd22.webp';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3.5 left-4 text-[10px] font-semibold text-white bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                {cs.sector}
              </div>
            </div>

            {/* Metric & Title */}
            <div className="p-4.5">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 tabular-nums">
                  {cs.heroMetric}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cs.location.split(',')[0]}</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                {cs.metricLabel}
              </div>

              <h3 className="text-base font-bold text-slate-950 mt-1.5 leading-snug">
                {cs.title}
              </h3>

              <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                {cs.description}
              </p>

              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-600">{cs.client}</span>
                <span className="font-bold text-slate-950">Read Case &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Case Study Detail Sheet */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden text-slate-900 font-sans">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {activeStory.sector} &middot; {activeStory.client}
                </span>
                <h3 className="text-base font-bold text-slate-950 mt-0.5">
                  {activeStory.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="p-1.5 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="bg-[#f8f9fa] p-4.5 rounded-2xl border border-slate-200 text-center">
                <div className="text-3xl font-extrabold text-slate-950">
                  {activeStory.heroMetric}
                </div>
                <div className="text-xs font-semibold text-emerald-700 mt-1">
                  {activeStory.metricLabel}
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed text-sm">
                {activeStory.fullStory}
              </p>

              <div>
                <span className="text-xs font-bold text-slate-950 uppercase tracking-wider block mb-2">
                  Systems &amp; Tooling Deployed
                </span>
                <ul className="space-y-2 text-slate-700 text-xs">
                  {activeStory.toolingUsed.map((tool, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeStory.achievementTags.map((tag, i) => (
                  <span key={i} className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
