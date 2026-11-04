import React, { useState } from 'react';
import { Building, MapPin, Calendar, UserCheck, ShieldAlert, ChevronDown, ChevronUp, Edit3, Check, Compass } from 'lucide-react';
import { BusinessProfile } from '../types/compliance';
import { MARYLAND_COUNTIES } from '../data/countyData';

interface BusinessProfileBarProps {
  profile: BusinessProfile;
  onUpdateProfile: (updated: Partial<BusinessProfile>) => void;
  onOpenOnboarding?: () => void;
}

export const BusinessProfileBar: React.FC<BusinessProfileBarProps> = ({
  profile,
  onUpdateProfile,
  onOpenOnboarding,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<BusinessProfile>(profile);

  const handleSave = () => {
    onUpdateProfile(tempProfile);
    setIsEditing(false);
  };

  const isBaltimoreCity = profile.countyOrCity === 'Baltimore City';
  const isBaltimoreCounty = profile.countyOrCity === 'Baltimore County';

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Compact summary bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="font-bold text-slate-900">
                {profile.businessName || 'My Maryland Venture'}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 text-xs">
                {profile.industry || 'General Business & Retail'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-800">{profile.countyOrCity}</span>
              {profile.operatingAddress && (
                <span className="text-slate-500 hidden md:inline">({profile.operatingAddress})</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Target Launch:</span>
              <span className="font-mono font-medium text-slate-900">{profile.targetOpeningDate}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Lead:</span>
              <span className="font-medium text-slate-800">{profile.complianceLead || 'Founder / Manager'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
                title="Restart Maryland startup onboarding wizard"
              >
                <Compass className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Setup Wizard</span>
              </button>
            )}

            <button
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setTempProfile(profile);
                  setIsEditing(true);
                  setIsExpanded(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isEditing ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Save Info</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 cursor-pointer"
              title="Toggle details"
              aria-label="Toggle profile details"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Baltimore jurisdiction warning if applicable */}
        {(isBaltimoreCity || isBaltimoreCounty) && (
          <div className="mt-2.5 p-2 bg-amber-50 rounded border border-amber-200/80 flex items-center gap-2 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Jurisdiction Notice:</strong> Baltimore City and Baltimore County are completely separate legal jurisdictions with separate Circuit Court Clerks and tax schedules. Ensure filings are addressed to the exact operating premises.
            </span>
          </div>
        )}

        {/* Expanded Profile Form */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Business Legal Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={isEditing ? tempProfile.businessName : profile.businessName}
                onChange={(e) => setTempProfile({ ...tempProfile, businessName: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white disabled:bg-slate-50"
                placeholder="e.g. Chesapeake Artisan Co. LLC"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Industry & Primary Activities</label>
              <input
                type="text"
                disabled={!isEditing}
                value={isEditing ? tempProfile.industry : profile.industry}
                onChange={(e) => setTempProfile({ ...tempProfile, industry: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white disabled:bg-slate-50"
                placeholder="e.g. Retail, Home Improvement, Cafe"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">County or Baltimore City</label>
              <select
                disabled={!isEditing}
                value={isEditing ? tempProfile.countyOrCity : profile.countyOrCity}
                onChange={(e) => setTempProfile({ ...tempProfile, countyOrCity: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white disabled:bg-slate-50 font-medium"
              >
                {MARYLAND_COUNTIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} {c.isCity ? '(Independent City)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Target Opening Date</label>
              <input
                type="date"
                disabled={!isEditing}
                value={isEditing ? tempProfile.targetOpeningDate : profile.targetOpeningDate}
                onChange={(e) => setTempProfile({ ...tempProfile, targetOpeningDate: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white disabled:bg-slate-50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Operating Street Address</label>
              <input
                type="text"
                disabled={!isEditing}
                value={isEditing ? tempProfile.operatingAddress : profile.operatingAddress}
                onChange={(e) => setTempProfile({ ...tempProfile, operatingAddress: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white disabled:bg-slate-50"
                placeholder="e.g. 100 Main St, Annapolis MD"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Compliance Lead / Manager</label>
              <input
                type="text"
                disabled={!isEditing}
                value={isEditing ? tempProfile.complianceLead : profile.complianceLead}
                onChange={(e) => setTempProfile({ ...tempProfile, complianceLead: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white disabled:bg-slate-50"
                placeholder="e.g. Jane Doe (Managing Member)"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">SDAT Entity ID</label>
              <input
                type="text"
                disabled={!isEditing}
                value={isEditing ? (tempProfile.sdatId || '') : (profile.sdatId || '')}
                onChange={(e) => setTempProfile({ ...tempProfile, sdatId: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white disabled:bg-slate-50 font-mono"
                placeholder="e.g. W12345678"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Federal EIN</label>
              <input
                type="text"
                disabled={!isEditing}
                value={isEditing ? (tempProfile.ein || '') : (profile.ein || '')}
                onChange={(e) => setTempProfile({ ...tempProfile, ein: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white disabled:bg-slate-50 font-mono"
                placeholder="e.g. 12-3456789"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
