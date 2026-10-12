import React from 'react';
import { Home, Wrench, Layers, Award } from 'lucide-react';

export type TabType = 'home' | 'products' | 'services' | 'projects';

interface MobileBottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'products' as TabType, label: 'Equipment', icon: Wrench },
    { id: 'services' as TabType, label: 'Services', icon: Layers },
    { id: 'projects' as TabType, label: 'Projects', icon: Award }
  ];

  return (
    <aside
      aria-label="Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-50 pointer-events-none pb-[env(safe-area-inset-bottom,16px)]"
    >
      <div className="max-w-[440px] mx-auto px-4 pb-3">
        {/* Ather Minimalist Floating Dock - Pillowy Soft & Tactile */}
        <nav className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[28px] shadow-[0_12px_40px_rgba(15,23,42,0.12)] px-2.5 py-1.5 flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[68px] rounded-2xl transition-all duration-200 group focus-visible:outline-none"
                aria-label={`Navigate to ${tab.label}`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-sm scale-105'
                      : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-1 transition-colors ${
                    isActive ? 'text-slate-950 font-bold' : 'text-slate-400 font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
