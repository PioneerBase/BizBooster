import React, { useState, useMemo } from 'react';
import { 
  ExternalLink, 
  Search, 
  Building, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Filter
} from 'lucide-react';
import { GovernmentPortal } from '../types/compliance';
import { OFFICIAL_GOVERNMENT_PORTALS } from '../data/portalData';

interface PortalsDirectoryProps {
  onOpenPdfPage: (page: number) => void;
  selectedKey?: string | null;
}

export const PortalsDirectory: React.FC<PortalsDirectoryProps> = ({
  onOpenPdfPage,
  selectedKey,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(selectedKey || '');

  const categories = [
    { id: 'all', label: 'All Portals (S1–S13)' },
    { id: 'Registration & Formation', label: 'Formation & SDAT' },
    { id: 'Taxes & Payroll', label: 'Taxes & Comptroller' },
    { id: 'Licensing & Permits', label: 'Licensing & Clerks' },
    { id: 'Insurance & Labor', label: 'Labor, WC & FAMLI' },
    { id: 'Annual Filings', label: 'Good Standing' },
  ];

  const filteredPortals = useMemo(() => {
    return OFFICIAL_GOVERNMENT_PORTALS.filter((portal) => {
      const matchesCategory = activeCategory === 'all' || portal.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        portal.sourceKey.toLowerCase().includes(q) ||
        portal.title.toLowerCase().includes(q) ||
        portal.agency.toLowerCase().includes(q) ||
        portal.description.toLowerCase().includes(q) ||
        portal.requiredFor.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Official Maryland Source Directory</span>
              <span aria-hidden="true">·</span>
              <span>Direct Agency Gateways</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Government Portal Directory & Verification Links
            </h1>
            <p className="text-sm text-slate-600">
              Direct, verified links to official Maryland state portals cited in the Startup Guide (S1 through S13), including Maryland Business Express, Maryland Tax Connect, CompHub, and the FAMLI Division.
            </p>
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search S1-S13, agencies, or forms..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                activeCategory === c.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Government Portals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPortals.map((portal) => (
          <div
            key={portal.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
                    {portal.sourceKey}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {portal.category}
                  </span>
                </div>

                <button
                  onClick={() => onOpenPdfPage(portal.pdfPage)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  title="View citation on guide page"
                >
                  Guide pg. {portal.pdfPage}
                </button>
              </div>

              <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                {portal.title}
              </h2>

              <div className="text-xs font-medium text-slate-500 mb-2">
                Agency: <span className="text-slate-700">{portal.agency}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {portal.description}
              </p>

              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4">
                <span className="font-semibold text-slate-700">Applies to: </span>
                {portal.requiredFor}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                {portal.url.replace('https://', '')}
              </span>

              <a
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                <span>Open Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
