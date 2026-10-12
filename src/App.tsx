import React, { useState } from 'react';
import { MobileTopBar } from './components/MobileTopBar';
import { MobileBottomNav, TabType } from './components/MobileBottomNav';
import { HomeTab } from './components/tabs/HomeTab';
import { ProductsTab } from './components/tabs/ProductsTab';
import { ServicesTab } from './components/tabs/ServicesTab';
import { ProjectsTab } from './components/tabs/ProjectsTab';
import { ProductModal } from './components/ProductModal';
import { QuoteDrawer } from './components/QuoteDrawer';
import { ProductModel } from './data/tritorcData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteInitialTool, setQuoteInitialTool] = useState<string | undefined>(undefined);
  const [quoteInitialNotes, setQuoteInitialNotes] = useState<string | undefined>(undefined);

  const handleOpenQuote = (initialTool?: string, notes?: string) => {
    setQuoteInitialTool(initialTool);
    setQuoteInitialNotes(notes);
    setIsQuoteOpen(true);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f3f4f7] text-slate-900 flex justify-center selection:bg-slate-950/10 selection:text-slate-900 font-sans antialiased">
      {/* Mobile App Viewport (Full height native feel with sticky top & bottom) */}
      <div className="w-full max-w-[440px] min-h-screen bg-[#fafbfc] sm:border-x sm:border-slate-200/90 sm:shadow-[0_0_60px_rgba(0,0,0,0.06)] flex flex-col relative pb-28">
        {/* Sticky Mobile Top Header */}
        <MobileTopBar
          activeTab={activeTab}
          onOpenQuote={() => handleOpenQuote(undefined, 'General Inquiry')}
        />

        {/* Natural Scrolling Tab Content Area */}
        <main className="flex-1 px-4 pt-3.5">
          {activeTab === 'home' && (
            <HomeTab
              onNavigateTab={handleTabChange}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenQuote={(toolId, notes) => handleOpenQuote(toolId, notes)}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenQuote={(toolId) => handleOpenQuote(toolId)}
            />
          )}

          {activeTab === 'services' && (
            <ServicesTab
              onOpenQuoteWithService={(srv) => handleOpenQuote(undefined, `Service Inquiry: ${srv}`)}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsTab />
          )}
        </main>

        {/* Always-visible Floating Bottom Navigation Bar at screen bottom */}
        <MobileBottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Product Spec Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenQuote={(toolId) => handleOpenQuote(toolId)}
      />

      {/* Commercial Inquiry / Contact Modal */}
      <QuoteDrawer
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialToolId={quoteInitialTool}
        initialServiceOrConfig={quoteInitialNotes}
      />
    </div>
  );
}
