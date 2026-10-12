import React from 'react';
import tritorcLogo from '../assets/images/tritorc_logo.png';
import { TabType } from './MobileBottomNav';

interface MobileTopBarProps {
  activeTab: TabType;
  onOpenQuote: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  onOpenQuote
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#f6f7f8]/95 backdrop-blur-md px-5 pt-3 pb-2 flex items-center justify-between">
      {/* Tritorc Brand Logo Clean Display */}
      <div className="flex items-center gap-2.5">
        <img
          src={tritorcLogo}
          alt="Tritorc"
          className="h-6 sm:h-7 w-auto object-contain"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = 'https://www.tritorc.com/images/logo.png';
          }}
        />
      </div>

      {/* Pill Connect Button (Ather style) */}
      <button
        onClick={onOpenQuote}
        className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-50 rounded-full transition-all shadow-sm active:scale-95"
      >
        Inquire
      </button>
    </header>
  );
};
