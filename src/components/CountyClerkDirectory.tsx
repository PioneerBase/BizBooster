import React, { useState, useMemo } from 'react';
import { Building2, Phone, MapPin, ExternalLink, Search, ShieldAlert, Info } from 'lucide-react';
import { MARYLAND_COUNTIES } from '../data/countyData';
import { CountyInfo } from '../types/compliance';

interface CountyClerkDirectoryProps {
  currentCounty: string;
  onSelectCounty: (countyName: string) => void;
}

export const CountyClerkDirectory: React.FC<CountyClerkDirectoryProps> = ({
  currentCounty,
  onSelectCounty,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCounties = useMemo(() => {
    return MARYLAND_COUNTIES.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.circuitCourtName.toLowerCase().includes(q) ||
        c.clerkAddress.toLowerCase().includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Local Circuit Court Clerk Registry</span>
              <span aria-hidden="true">·</span>
              <span>24 Maryland Jurisdictions</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Circuit Court Clerks & Local Permitting Offices
            </h1>
            <p className="text-sm text-slate-600">
              State business licenses (traders, construction, restaurants) are issued locally by the Clerk of the Circuit Court in each county or Baltimore City. Contact your clerk for county-specific fee packets and clearances.
            </p>
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search county or city..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Baltimore Caution Box directly from Page 3 */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4.5 flex items-start gap-3.5">
        <div className="p-2 bg-amber-500/20 text-amber-900 rounded-lg shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="font-bold text-amber-950 text-sm">
            Field Guide Rule: Baltimore Address Caution
          </div>
          <p className="text-slate-800 leading-relaxed">
            Baltimore City and Baltimore County are separate jurisdictions. Identify the actual jurisdiction of the operating premises, then use its Clerk and permitting offices. For any municipality (e.g. Annapolis, Rockville, Frederick, Gaithersburg, Salisbury), ask whether additional municipal approvals apply. <strong>Do not use a mailing-city label as the sole location test.</strong>
          </p>
        </div>
      </div>

      {/* County Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCounties.map((county) => {
          const isSelected = currentCounty === county.name;

          return (
            <div
              key={county.name}
              className={`bg-white rounded-xl border p-4.5 transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-600 ring-2 ring-amber-600/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {county.name}
                    </h3>
                    {county.isCity && (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                        Independent City
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Selected Active
                    </span>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-700 mb-2">
                  {county.circuitCourtName}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{county.clerkAddress}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-800">{county.phone}</span>
                  </div>
                </div>

                {county.notes && (
                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 mb-4">
                    {county.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectCounty(county.name)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isSelected ? 'Current County' : 'Select for Dashboard'}
                </button>

                <a
                  href={county.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
                >
                  <span>Clerk Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
