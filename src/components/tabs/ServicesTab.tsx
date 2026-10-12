import React, { useState } from 'react';
import { SERVICES_DATA, ServiceItem } from '../../data/tritorcData';
import { ArrowRight, CheckCircle2, Clock, X } from 'lucide-react';

interface ServicesTabProps {
  onOpenQuoteWithService: (serviceName: string) => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  onOpenQuoteWithService
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <div className="space-y-4 pb-20 text-slate-900 font-sans">
      {/* Intro Header */}
      <div className="bg-white rounded-[24px] p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-1">
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-950 tracking-tight leading-tight">
          Field Services
        </h1>
        <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
          Turnkey turnaround execution for refinery, offshore &amp; power plants.
        </p>
      </div>

      {/* Services Grid (Clean Aesthetic Cards) */}
      <div className="space-y-3.5 pt-1">
        {SERVICES_DATA.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-[24px] border border-slate-200/90 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-slate-400 transition-all flex flex-col justify-between"
          >
            {/* Visual Media Header */}
            <div
              onClick={() => setSelectedService(srv)}
              className="relative h-44 bg-slate-950 cursor-pointer group"
            >
              <img
                src={srv.heroImage}
                alt={srv.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/about_page_services_76263159dc124c72_e7040bdf1f.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-3.5 left-4 right-4">
                <span className="text-[10px] font-semibold text-emerald-400 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {srv.standardCodes[0]}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight mt-1.5">
                  {srv.title}
                </h3>
              </div>
            </div>

            {/* Quick Metrics & Actions */}
            <div className="p-4.5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{srv.mobilizationTime.split('(')[0].trim()}</span>
                </div>
                <div className="text-sm font-bold text-slate-950 tabular-nums">
                  {srv.highlights[0]?.metric}{' '}
                  <span className="text-[11px] font-normal text-slate-500 font-sans">
                    {srv.highlights[0]?.label.split(' ')[0]}
                  </span>
                </div>
              </div>

              <div className="mt-3.5 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedService(srv)}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors"
                >
                  Scope Protocols &rarr;
                </button>

                <button
                  onClick={() => onOpenQuoteWithService(srv.title)}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1 shadow-xs active:scale-[0.98]"
                >
                  <span>Book Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Details Sheet */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden text-slate-900 font-sans">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {selectedService.standardCodes.join(' · ')}
                </span>
                <h3 className="text-lg font-bold text-slate-950 mt-0.5">
                  {selectedService.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1.5 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed text-sm">
                {selectedService.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Key Execution Protocols
                </h4>
                <ul className="space-y-2">
                  {selectedService.scopePoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-700 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    const title = selectedService.title;
                    setSelectedService(null);
                    onOpenQuoteWithService(title);
                  }}
                  className="w-full py-3.5 text-xs font-bold bg-slate-950 hover:bg-slate-800 text-white rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                >
                  <span>Book Turnaround Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
