import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Building, 
  Check, 
  HelpCircle, 
  FileText, 
  Sparkles,
  Scale,
  DollarSign
} from 'lucide-react';

export interface EntityTypeInfo {
  id: string;
  name: string;
  shortTag: string;
  badge: string;
  summary: string;
  liabilityProtection: 'high' | 'maximum' | 'none' | 'moderate';
  taxTreatment: string;
  governance: string;
  sdatFilingFee: string;
  sdatAnnualFee: string;
  idealFor: string;
  keyPros: string[];
  keyCons: string[];
}

export const ENTITY_TYPES_DATA: EntityTypeInfo[] = [
  {
    id: 'llc',
    name: 'Limited Liability Company (LLC)',
    shortTag: 'LLC',
    badge: 'Most Popular for MD Startups',
    summary: 'A hybrid legal entity that shields owners’ personal assets while keeping taxation and management simple and flexible.',
    liabilityProtection: 'high',
    taxTreatment: 'Pass-through taxation by default (profits reported on owners’ personal returns; avoids corporate double taxation). Can also elect S-Corp or C-Corp tax status.',
    governance: 'Flexible: member-managed (by owners) or manager-managed. Regulated by a private Operating Agreement without mandatory board meetings.',
    sdatFilingFee: '$100 Articles of Organization (plus $50 expedited online processing)',
    sdatAnnualFee: '$300 / year (SDAT Annual Report & Personal Property Return due April 15)',
    idealFor: 'Small businesses, e-commerce stores, consultancies, retail shops, and professional service firms wanting liability protection without corporate bureaucracy.',
    keyPros: [
      'Protects personal assets (home, personal savings) from business debts & claims',
      'No federal corporate double taxation; profits pass directly to members',
      'Flexible ownership splits and minimal formal paperwork / record-keeping'
    ],
    keyCons: [
      'Annual $300 SDAT filing fee applies every year, even with $0 revenue',
      'Self-employment taxes (15.3% Medicare/SS) apply to active members’ earnings',
      'Not designed for issuing public stock or institutional venture capital'
    ]
  },
  {
    id: 'corp',
    name: 'Corporation (Inc., Corp. — C-Corp or S-Corp)',
    shortTag: 'Inc.',
    badge: 'Standard for Outside Investment',
    summary: 'An independent legal entity separate from its owners (shareholders), offering the strongest liability shield and formal governance.',
    liabilityProtection: 'maximum',
    taxTreatment: 'C-Corp: Entity-level tax (21% federal) + shareholder tax on dividends (double taxation). S-Corp Election: Pass-through taxation if eligible (≤100 US shareholders).',
    governance: 'Strict & Formal: Must appoint Board of Directors and officers (President, Treasurer, Secretary), adopt Bylaws, and hold recorded annual meetings.',
    sdatFilingFee: '$120 Articles of Incorporation (plus $50 expedited online processing)',
    sdatAnnualFee: '$300 / year (SDAT Annual Report due April 15)',
    idealFor: 'High-growth startups seeking venture capital or angel investors, businesses intending to issue stock options, or companies retaining substantial profits.',
    keyPros: [
      'Strongest, time-tested liability separation under Maryland corporate law',
      'Easier to sell ownership shares, raise venture capital, and issue equity',
      'Perpetual legal existence that survives changes in ownership or management'
    ],
    keyCons: [
      'Double taxation for standard C-Corps unless qualified S-Corp status is elected',
      'Substantial administrative burden: mandatory bylaws, minutes, and meetings',
      'Annual $300 SDAT report filing fee required every April 15'
    ]
  },
  {
    id: 'sole_prop',
    name: 'Sole Proprietorship (Unincorporated)',
    shortTag: 'Sole Prop',
    badge: 'Zero Entity Formation Fees',
    summary: 'An individual owning an unincorporated business directly. No separate legal entity exists: you and the business are legally one and the same.',
    liabilityProtection: 'none',
    taxTreatment: 'Direct personal taxation: Business revenue and expenses reported on Schedule C of personal IRS Form 1040.',
    governance: 'No formal governance. The owner makes all decisions without corporate formalities or bylaws.',
    sdatFilingFee: '$0 entity filing. If using a business name other than your legal surname, register a Trade Name with SDAT ($25).',
    sdatAnnualFee: '$0 annual corporate report (unless personal property is certified)',
    idealFor: 'Low-risk, solo freelancers, independent contractors, or hobbyists testing an idea before committing capital.',
    keyPros: [
      'Simplest and cheapest to start; no state incorporation filings needed',
      'No separate business tax returns; integrated with individual taxes',
      'No annual $300 SDAT corporate fee'
    ],
    keyCons: [
      'ZERO personal liability protection: your home, car, and personal bank accounts are at risk for all business debts, torts, or lawsuits',
      'Difficult to raise capital or establish credibility with commercial landlords',
      'Must still obtain local Circuit Court Clerk licenses (Trader’s) if selling goods'
    ]
  },
  {
    id: 'partnership',
    name: 'General Partnership (GP) or LLP',
    shortTag: 'LLP / GP',
    badge: 'Multi-Owner Co-Ventures',
    summary: 'A co-owned enterprise. General Partnerships share joint liability, whereas a Limited Liability Partnership (LLP) shields partners from other partners’ malpractice.',
    liabilityProtection: 'moderate',
    taxTreatment: 'Pass-through taxation via IRS Form 1065 informational return; partners receive K-1s.',
    governance: 'Governed by a written Partnership Agreement dictating profit splits, decision voting, and capital calls.',
    sdatFilingFee: '$100 for Limited Liability Partnership (LLP) Certificate with SDAT',
    sdatAnnualFee: '$300 / year for LLPs (SDAT Annual Report due April 15)',
    idealFor: 'Professional licensed groups (law firms, medical practices, accounting firms, architects) with two or more co-principals.',
    keyPros: [
      'Allows shared managerial expertise and pooled startup resources',
      'LLP structure protects partners from peer errors or commercial defaults',
      'Pass-through taxation avoids entity-level double tax'
    ],
    keyCons: [
      'In a general partnership, all partners are personally liable for all business debts',
      'Partnership disputes can deadlock operations without clear agreement terms',
      'Annual $300 SDAT report required for LLPs'
    ]
  },
  {
    id: 'nonprofit',
    name: 'Nonprofit Corporation (501(c)(3) / Non-Stock)',
    shortTag: 'Nonprofit',
    badge: 'Tax-Exempt Mission',
    summary: 'Formed under Maryland non-stock corporation law to pursue educational, religious, scientific, or charitable public benefit missions.',
    liabilityProtection: 'high',
    taxTreatment: 'Tax-exempt from federal and Maryland state income taxes upon IRS 501(c)(3) determination. Contributions are tax-deductible for donors.',
    governance: 'Governed by a fiduciary Board of Directors with no private shareholders or owner dividend payouts.',
    sdatFilingFee: '$170 Articles of Incorporation for Non-Stock Corporation',
    sdatAnnualFee: '$0 / year (SDAT Annual Report is statutory fee-exempt for nonprofits)',
    idealFor: 'Charities, educational programs, religious organizations, community foundations, and cultural arts groups.',
    keyPros: [
      'Exempt from state and federal income taxes upon approval',
      'Eligible for philanthropic grants, public donations, and government funding',
      'Exempt from the standard $300 Maryland SDAT annual report fee'
    ],
    keyCons: [
      'Strict IRS compliance: prohibited from distributing profits to private individuals',
      'Extensive public reporting (IRS Form 990 is public record)',
      'Substantial setup timeline for federal 501(c)(3) determination'
    ]
  }
];

interface EntityDecideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntity?: (entityId: string) => void;
  currentSelectedId?: string;
}

export const EntityDecideModal: React.FC<EntityDecideModalProps> = ({
  isOpen,
  onClose,
  onSelectEntity,
  currentSelectedId = 'llc',
}) => {
  const [selectedEntityId, setSelectedEntityId] = useState<string>(currentSelectedId);

  if (!isOpen) return null;

  const activeEntity = ENTITY_TYPES_DATA.find((e) => e.id === selectedEntityId) || ENTITY_TYPES_DATA[0];

  const handleApply = (id: string) => {
    if (onSelectEntity) {
      onSelectEntity(id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Top Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Maryland Entity Formation Guide</span>
              <span aria-hidden="true">·</span>
              <span>SDAT & Legal Implications</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Choosing Your Maryland Business Structure (LLC vs. Inc. vs. Sole Prop)
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
            aria-label="Close entity guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official State Decision Link Callout Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3.5 shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-800">
            <Scale className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Official State Portal:</strong> Review Maryland Business Express's interactive legal structure decision tree before filing.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://businessexpress.maryland.gov/start/choose-a-legal-structure"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <span>Maryland Official Structure Guide</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://www.sba.gov/business-guide/launch-your-business/choose-business-structure"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors"
            >
              <span>SBA Guide</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
          
          {/* Left Column: Entity Selection Tabs */}
          <div className="w-full lg:w-72 shrink-0 space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Legal Structure
            </div>

            {ENTITY_TYPES_DATA.map((entity) => {
              const isSelected = selectedEntityId === entity.id;

              return (
                <button
                  key={entity.id}
                  onClick={() => setSelectedEntityId(entity.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{entity.shortTag}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      entity.liabilityProtection === 'none'
                        ? 'bg-rose-100 text-rose-800'
                        : entity.liabilityProtection === 'maximum'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {entity.liabilityProtection === 'none' ? 'No Protection' : 'Limited Liability'}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-800">{entity.name}</div>
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{entity.badge}</div>
                </button>
              );
            })}

            <div className="pt-2 text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              <strong className="text-slate-700">Guide Citation [Page 2]:</strong> Sole proprietorships are not LLCs. If you do not incorporate, you are personally liable for all contracts and liabilities.
            </div>
          </div>

          {/* Right Column: Detailed Breakdown of Selected Entity */}
          <div className="flex-1 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                  {activeEntity.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {activeEntity.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {activeEntity.summary}
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Personal Liability Protection</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  {activeEntity.liabilityProtection === 'none' ? (
                    <strong className="text-rose-700">NONE: Personal assets (home, bank accounts) are vulnerable.</strong>
                  ) : activeEntity.liabilityProtection === 'maximum' ? (
                    'Maximum: Independent corporate legal firewall separates shareholders.'
                  ) : (
                    'High: Owners’ personal assets protected from business debts & claims.'
                  )}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-700" />
                  <span>Maryland SDAT Annual Fee</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  <strong>{activeEntity.sdatAnnualFee}</strong>
                </p>
              </div>
            </div>

            {/* In-depth details */}
            <div className="space-y-3 text-xs">
              <div className="border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-900 block mb-1">Taxation Treatment:</span>
                <p className="text-slate-600 leading-relaxed">{activeEntity.taxTreatment}</p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-900 block mb-1">Management & Formalities:</span>
                <p className="text-slate-600 leading-relaxed">{activeEntity.governance}</p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-900 block mb-1">State Formation Filing:</span>
                <p className="text-slate-600 leading-relaxed">{activeEntity.sdatFilingFee}</p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-900 block mb-1">Best Suited For:</span>
                <p className="text-slate-600 leading-relaxed">{activeEntity.idealFor}</p>
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-1.5">
                <span className="font-bold text-emerald-950">Key Advantages</span>
                <ul className="space-y-1 text-slate-700 text-[11px]">
                  {activeEntity.keyPros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="font-bold text-slate-900">Key Trade-Offs</span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  {activeEntity.keyCons.map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <a
                href="https://businessexpress.maryland.gov/start/register-a-business-in-maryland"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-700 hover:text-amber-800 font-medium underline flex items-center gap-1"
              >
                <span>Register with SDAT Business Express</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {onSelectEntity && (
                <button
                  type="button"
                  onClick={() => handleApply(activeEntity.id)}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Select {activeEntity.shortTag} for Setup
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
