import React, { useState } from 'react';
import { PRODUCTS_DATA } from '../data/tritorcData';
import { X, CheckCircle, Send } from 'lucide-react';

interface QuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialToolId?: string;
  initialServiceOrConfig?: string;
}

export const QuoteDrawer: React.FC<QuoteDrawerProps> = ({
  isOpen,
  onClose,
  initialToolId,
  initialServiceOrConfig
}) => {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState<string>('equipment-purchase');
  const [selectedProduct, setSelectedProduct] = useState<string>(initialToolId || 'tsl-series');
  const [notes, setNotes] = useState(initialServiceOrConfig || '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rfqNumber, setRfqNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !companyName) return;

    const randomRfq = `RFQ-TRIT-${Math.floor(100000 + Math.random() * 900000)}`;
    setRfqNumber(randomRfq);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto font-sans">
      <div className="relative w-full max-w-lg bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
              Technical Inquiry
            </div>
            <h2 className="text-xl font-extrabold font-display text-slate-950 mt-0.5">
              Request Commercial Proposal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-extrabold font-display text-slate-950">
                Inquiry Transmitted
              </h3>

              <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-slate-200 text-xs font-mono text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Reference:</span>
                  <span className="text-slate-950 font-bold">{rfqNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact:</span>
                  <span className="text-slate-950 font-bold">{fullName} ({companyName})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Response:</span>
                  <span className="text-emerald-600 font-bold">&lt; 4 Hours</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Tritorc application engineers will review your requirement and deliver complete technical documentation and commercial rates.
              </p>

              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 text-xs font-bold font-display bg-slate-950 hover:bg-black text-white rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Reliance / ONGC"
                    className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 / +971"
                    className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Requirement Type
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950"
                  >
                    <option value="equipment-purchase">Equipment Purchase</option>
                    <option value="dry-rental">Dry Rental Fleet</option>
                    <option value="onsite-services">On-Site Field Services</option>
                    <option value="calibration">ISO 17025 Calibration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Equipment Line
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950"
                  >
                    {PRODUCTS_DATA.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Scope or Technical Specifications
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention bolt diameter, required torque/preload, flange rating or project schedule..."
                  className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-slate-950"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 text-xs font-bold font-display bg-slate-950 hover:bg-black text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Technical RFQ</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
