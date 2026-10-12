import React, { useState, useMemo } from 'react';
import { PRODUCTS_DATA, ProductModel } from '../../data/tritorcData';
import { Search, ChevronRight } from 'lucide-react';

interface ProductsTabProps {
  onSelectProduct: (product: ProductModel) => void;
  onOpenQuote: (toolId?: string) => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  onSelectProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Equipment' },
    { id: 'torque-wrench', label: 'Torque Wrenches' },
    { id: 'bolt-tensioner', label: 'Bolt Tensioners' },
    { id: 'flange-facing', label: 'Flange Facers' },
    { id: 'cold-cutting', label: 'Cold Cutters' },
    { id: 'impact-sockets', label: 'Impact Sockets' }
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.series.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-4 pb-20 text-slate-900 font-sans">
      {/* Title Card */}
      <div className="bg-white rounded-[24px] p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-1">
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-950 tracking-tight leading-tight">
          Equipment Catalog
        </h1>
        <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
          Controlled bolting tools &amp; in-situ machining systems.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search equipment series..."
          className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-[13px] bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-950 transition-all shadow-xs"
        />
      </div>

      {/* Horizontal Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Cards List */}
      <div className="space-y-3.5 pt-1">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="cursor-pointer bg-white rounded-[24px] border border-slate-200/80 p-4.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-slate-400 transition-all flex flex-col justify-between group active:scale-[0.99]"
          >
            {/* Top Series Kicker */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {product.series}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {product.category.replace('-', ' ').toUpperCase()}
              </span>
            </div>

            {/* Product Image & Content */}
            <div className="my-2.5 flex items-center gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#f8f9fa] rounded-2xl p-2.5 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-slate-100/70 transition-colors">
                <img
                  src={product.heroImage}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = 'https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_01_ee8aa345e00b82d9_2ebe5dcd22.webp';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-slate-950 leading-snug">
                  {product.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                  {product.tagline}
                </p>
              </div>
            </div>

            {/* Clean Action Row */}
            <div className="mt-1 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-950">
              <span className="text-slate-400 font-normal">
                {product.standards[0] || 'ISO 9001:2015'}
              </span>
              <span className="group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-xs">
          No equipment found matching &ldquo;{searchQuery}&rdquo;.
        </div>
      )}
    </div>
  );
};
