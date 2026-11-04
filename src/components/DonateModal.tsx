import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Coffee, 
  Gift, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const [selectedTier, setSelectedTier] = useState<number>(15);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [thankYouMessage, setThankYouMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const tiers = [
    {
      amount: 5,
      title: 'Coffee Booster',
      desc: 'Keep the caffeine flowing while keeping Maryland regulatory rules and deadlines up-to-date.',
      icon: Coffee,
    },
    {
      amount: 15,
      title: 'Civic Contributor',
      desc: 'Help cover server hosting, domain fees, and continuous legal source monitoring.',
      icon: Heart,
      popular: true,
    },
    {
      amount: 30,
      title: 'Small Business Patron',
      desc: 'Sponsor the development of future free open-source civic calculators and licensing guides.',
      icon: Gift,
    },
  ];

  const effectiveAmount = customAmount ? Number(customAmount) || 0 : selectedTier;
  const APP_URL = 'https://pioneerbase.github.io/BizBooster/';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(APP_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCompleteMockDonation = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Support This Portfolio Project
              </h2>
              <div className="text-xs text-slate-500">
                Independent civic tools for Maryland business owners
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Close support dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4 animate-in fade-in">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Thank You for Your Generous Support!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                Your contribution of <strong>${effectiveAmount}</strong> makes a real difference in keeping free, ad-free civic software available to all Maryland entrepreneurs.
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Mission Statement */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              This dashboard is maintained as a free public resource to demystify complex state licensing, local county Clerk procedures, and Maryland FAMLI rules. If it helped you save money or clarify a requirement, consider supporting its creator!
            </p>

            {/* Donation Tiers */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select a Contribution Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {tiers.map((tier) => {
                  const Icon = tier.icon;
                  const isSelected = selectedTier === tier.amount && !customAmount;

                  return (
                    <button
                      key={tier.amount}
                      type="button"
                      onClick={() => {
                        setSelectedTier(tier.amount);
                        setCustomAmount('');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/40 ring-1 ring-rose-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-2 right-2 text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                        <span className="text-sm font-bold font-mono text-slate-900">${tier.amount}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-800">{tier.title}</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-1 line-clamp-2">
                        {tier.desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom amount */}
              <div className="pt-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Or enter custom amount ($)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 25"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            {/* Direct Channels / Quick Links */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Direct Support Channels
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="https://buymeacoffee.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-medium transition-colors"
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                  <span>Buy Me a Coffee</span>
                </a>

                <a
                  href="https://github.com/pioneerbase"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg font-medium transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-600 fill-current" />
                  <span>GitHub (@pioneerbase)</span>
                </a>
              </div>
            </div>

            {/* Simulated instant support checkout form */}
            <form onSubmit={handleCompleteMockDonation} className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Optional note or feedback:
                </label>
                <input
                  type="text"
                  value={thankYouMessage}
                  onChange={(e) => setThankYouMessage(e.target.value)}
                  placeholder="e.g. Thanks for clarifying the Trader’s License fee!"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Confirm Contribution (${effectiveAmount})</span>
              </button>
            </form>

            {/* Share link alternative */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Share BizBooster Maryland:</span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
                </button>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-600 break-all select-all flex items-center justify-between">
                <span>{APP_URL}</span>
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-700 ml-2"
                  title="Open live link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
