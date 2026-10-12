import React, { useState } from 'react';
import { ProductModel } from '../data/tritorcData';
import { X, Check, ArrowRight } from 'lucide-react';

interface ProductModalProps {
  product: ProductModel | null;
  onClose: () => void;
  onOpenQuote: (productId: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onOpenQuote
}) => {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg sm:max-w-2xl bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-900 font-sans">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
              {product.series}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body (Classic Ather Editorial Layout) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Visual Gallery */}
          <div className="flex flex-col items-center">
            <div className="relative h-56 sm:h-64 w-full bg-[#f8f9fa] rounded-2xl border border-slate-100 p-6 flex items-center justify-center">
              <img
                src={product.galleryImages[selectedImgIdx] || product.heroImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = product.heroImage;
                }}
              />
            </div>

            {/* Thumbnails */}
            {product.galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 mt-3">
                {product.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`h-12 w-12 rounded-xl bg-[#f8f9fa] border p-1 transition-all overflow-hidden flex items-center justify-center ${
                      selectedImgIdx === idx
                        ? 'border-slate-950 ring-1 ring-slate-950'
                        : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bold Black Product Title & Tagline */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-950 tracking-tight leading-tight">
              {product.name}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* Key Engineering Specifications (Clean Ather Minimal Grid) */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-[#f8f9fa] rounded-2xl border border-slate-100 font-sans">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Working Pressure</span>
              <span className="text-base font-extrabold font-display text-slate-950">
                {product.pressureBar > 0 ? `${product.pressureBar} Bar` : 'Mechanical Drive'}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Accuracy Rating</span>
              <span className="text-base font-extrabold font-display text-slate-950">
                {product.accuracy}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Body Metallurgy</span>
              <span className="text-base font-extrabold font-display text-slate-950 truncate block">
                {product.bodyMaterial.split('(')[0].trim()}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Fastener Range</span>
              <span className="text-base font-extrabold font-display text-slate-950 truncate block">
                {product.boltRange || 'Standard Flange'}
              </span>
            </div>
          </div>

          {/* Key Design Features (Clean, Classic Typography) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Key Features
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 leading-relaxed font-sans">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-950 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Standards & Certifications */}
          <div className="pt-2 text-xs font-mono text-slate-400 flex flex-wrap items-center gap-2">
            <span>Standards:</span>
            <span className="text-slate-800 font-semibold">{product.standards.join(' · ')}</span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenQuote(product.id);
              }}
              className="w-full py-3.5 text-sm font-bold bg-slate-950 hover:bg-slate-800 text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
            >
              <span>Inquire for Pricing &amp; Specifications</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
