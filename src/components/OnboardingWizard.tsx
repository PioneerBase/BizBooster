import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Calendar, 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Users, 
  DollarSign, 
  FileText, 
  Clock, 
  Check, 
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Compass,
  FileCheck,
  ExternalLink,
  Scale,
  BookOpen
} from 'lucide-react';
import { BusinessProfile } from '../types/compliance';
import { MARYLAND_COUNTIES } from '../data/countyData';
import { EntityDecideModal } from './EntityDecideModal';

interface OnboardingWizardProps {
  initialProfile: BusinessProfile;
  onCompleteOnboarding: (configuredProfile: BusinessProfile, autoConfigureChecklist?: boolean) => void;
  onSkip: () => void;
  onOpenPdfPage: (page: number) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialProfile,
  onCompleteOnboarding,
  onSkip,
  onOpenPdfPage,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<BusinessProfile>({
    ...initialProfile,
    businessName: initialProfile.businessName || '',
    industry: initialProfile.industry || '',
    operatingAddress: initialProfile.operatingAddress || '',
    countyOrCity: initialProfile.countyOrCity || 'Anne Arundel County',
    targetOpeningDate: initialProfile.targetOpeningDate || '2027-03-01',
    complianceLead: initialProfile.complianceLead || '',
    hasRetailInventory: initialProfile.hasRetailInventory ?? true,
    inventoryValuation: initialProfile.inventoryValuation || 25000,
    employeeCount: initialProfile.employeeCount || 4,
    estimatedQuarterlyWages: initialProfile.estimatedQuarterlyWages || 45000,
  });

  const [entityType, setEntityType] = useState<string>('llc');
  const [isHomeBased, setIsHomeBased] = useState<boolean>(false);
  const [hasEmployees, setHasEmployees] = useState<boolean>(true);
  const [isMHICContractor, setIsMHICContractor] = useState<boolean>(false);
  const [showEntityModal, setShowEntityModal] = useState<boolean>(false);

  // Check jurisdiction
  const isBaltimoreCity = formData.countyOrCity === 'Baltimore City';
  const isBaltimoreCounty = formData.countyOrCity === 'Baltimore County';

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    onCompleteOnboarding(formData, true);
  };

  return (
    <div className="min-h-screen bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95">
        
        {/* Wizard Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-5 shrink-0 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <span>BizBooster Maryland</span>
              <span className="text-slate-600">·</span>
              <span>Startup Onboarding</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Setup Your BizBooster Maryland Roadmap
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenPdfPage(1)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
              title="Open the official 8-page Maryland Startup Guide"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Maryland Startup Guide (PDF)</span>
              <span className="sm:hidden">Guide PDF</span>
            </button>

            <button
              onClick={onSkip}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Step Progress Indicator (Clean typography, no pill badges) */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 shrink-0">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span className="font-semibold text-slate-900">
              Step {currentStep} of {totalSteps}: {
                currentStep === 1 ? 'Entity & Location' :
                currentStep === 2 ? 'Licensing & Retail Goods' :
                currentStep === 3 ? 'Staffing & 2027 FAMLI' :
                'Compliance Lead & Launch'
              }
            </span>
            <span className="font-mono text-slate-500 font-medium">
              {Math.round((currentStep / totalSteps) * 100)}% Configured
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-600 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Step Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* ========================================================= */}
          {/* STEP 1: ENTITY, STRUCTURE & OPERATING LOCATION            */}
          {/* ========================================================= */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Step 1: Define Entity & Operating Jurisdiction
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Page 1 of the Maryland Startup Guide instructs: <em>"Start with the right sequence: Confirm location and industry rules → register the business with SDAT."</em>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Chesapeake Bay Outfitters LLC"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white font-medium"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Must match your SDAT Articles of Organization or trade name registration.
                  </span>
                </div>

                {/* Legal Entity Selection & Decision Guidance */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Choosing a Legal Structure (LLC, Inc., etc.)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Your choice impacts personal asset liability, SDAT filing fees, and taxation.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowEntityModal(true)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      >
                        <Scale className="w-3.5 h-3.5 text-amber-600" />
                        <span>Compare Structures</span>
                      </button>

                      <a
                        href="https://businessexpress.maryland.gov/start/choose-a-legal-structure"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800 hover:underline"
                        title="Decide first on the official state portal"
                      >
                        <span>Official MD Guide</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Select Structure
                      </label>
                      <select
                        value={entityType}
                        onChange={(e) => setEntityType(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white font-medium"
                      >
                        <option value="llc">Limited Liability Company (LLC)</option>
                        <option value="corp">Corporation (Inc., Corp. — C or S-Corp)</option>
                        <option value="sole_prop">Sole Proprietorship (Unincorporated)</option>
                        <option value="partnership">General Partnership / LLP</option>
                        <option value="nonprofit">Nonprofit Organization</option>
                      </select>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-[11px] text-slate-600 flex flex-col justify-center">
                      {entityType === 'llc' && (
                        <div>
                          <strong className="text-slate-900">LLC Overview:</strong> Shields personal assets from business liabilities. Profits pass through to personal tax return. $300 annual SDAT report.
                        </div>
                      )}
                      {entityType === 'corp' && (
                        <div>
                          <strong className="text-slate-900">Inc. Overview:</strong> Distinct corporate entity issuing stock. Strongest liability shield, formal board meetings required. C-Corp or S-Corp tax status.
                        </div>
                      )}
                      {entityType === 'sole_prop' && (
                        <div>
                          <strong className="text-rose-700">Sole Prop Warning:</strong> No state entity filing, but ZERO personal liability protection. Personal assets at risk for business debts.
                        </div>
                      )}
                      {entityType === 'partnership' && (
                        <div>
                          <strong className="text-slate-900">Partnership Overview:</strong> Co-owned business. LLP limits liability; general partnership leaves all partners personally liable.
                        </div>
                      )}
                      {entityType === 'nonprofit' && (
                        <div>
                          <strong className="text-slate-900">Nonprofit Overview:</strong> Mission-driven non-stock corporation. Tax-exempt under 501(c)(3). $0 annual SDAT report fee.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Operating County or Baltimore City *
                  </label>
                  <select
                    value={formData.countyOrCity}
                    onChange={(e) => setFormData({ ...formData, countyOrCity: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white font-medium"
                  >
                    {MARYLAND_COUNTIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} {c.isCity ? '(Independent City)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Baltimore City vs County Caution Banner directly from guide page 3 */}
                {(isBaltimoreCity || isBaltimoreCounty) && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-950">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">Baltimore Address Caution:</strong> Baltimore City and Baltimore County are separate jurisdictions. Identify the actual physical jurisdiction of the premises, then use its Clerk and permitting offices. Do not rely on a mailing-city label.
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Operating Street Address (or Home-Occupation Location)
                  </label>
                  <input
                    type="text"
                    value={formData.operatingAddress}
                    onChange={(e) => setFormData({ ...formData, operatingAddress: e.target.value })}
                    placeholder="e.g. 100 Main Street, Annapolis, MD 21401"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="home-based"
                    checked={isHomeBased}
                    onChange={(e) => setIsHomeBased(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="home-based" className="text-xs text-slate-700 cursor-pointer">
                    This is a home-occupation / residential-based business (requires county home-occupation zoning approval).
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: LICENSING, RETAIL GOODS & TRADER'S LICENSE        */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Step 2: Licensing Layer & Trader's License Checkpoint
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  In Maryland, <strong>SDAT registration does not substitute for operational licensing</strong>. Different activities require separate state and local authorizations.
                </p>
              </div>

              {/* Retail goods / Trader's license selector */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                <div className="text-xs font-bold text-slate-900">
                  Does your business sell tangible goods at retail?
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasRetailInventory: true })}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      formData.hasRetailInventory
                        ? 'border-amber-600 bg-amber-50/70 font-semibold text-slate-900 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span>Yes — Retail Goods Sold</span>
                      {formData.hasRetailInventory && <Check className="w-4 h-4 text-amber-600" />}
                    </div>
                    <p className="text-[11px] font-normal text-slate-500 leading-snug">
                      Requires Circuit Court Trader’s License and Sales & Use Tax account.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasRetailInventory: false })}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      !formData.hasRetailInventory
                        ? 'border-amber-600 bg-amber-50/70 font-semibold text-slate-900 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span>No — Service-Only Business</span>
                      {!formData.hasRetailInventory && <Check className="w-4 h-4 text-amber-600" />}
                    </div>
                    <p className="text-[11px] font-normal text-slate-500 leading-snug">
                      Exempt from Trader’s License (no retail inventory held).
                    </p>
                  </button>
                </div>

                {/* If goods sold, ask for estimated wholesale value */}
                {formData.hasRetailInventory && (
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Estimated Wholesale Value of Retail Inventory:
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="500"
                        step="1000"
                        value={formData.inventoryValuation}
                        onChange={(e) => setFormData({ ...formData, inventoryValuation: Math.max(0, Number(e.target.value)) })}
                        className="w-full text-xs font-mono pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Trader’s license fees are based on wholesale brackets + $2 Clerk fee. License year: May 1 – April 30.
                    </span>
                  </div>
                )}
              </div>

              {/* Special Industry Overlays */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Industry & Regulated Activity Check:
                </label>

                <div>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. Retail Boutique, Home Improvement, Cafe, Consultancy"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    id="mhic-check"
                    checked={isMHICContractor}
                    onChange={(e) => setIsMHICContractor(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="mhic-check" className="cursor-pointer">
                    <strong className="text-slate-900">Maryland Home Improvement (MHIC):</strong> Contractor performing residential renovation/alteration.
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      Note: MHIC requires a minimum $500,000 general-liability policy (effective June 1, 2024). Do not rely on older $50k application text.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: STAFFING, WORKERS' COMP & 2027 FAMLI READINESS    */}
          {/* ========================================================= */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Step 3: Staffing & Maryland FAMLI / Insurance Readiness
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Maryland maintains <strong>four distinct employer obligations</strong>: Withholding, Unemployment Insurance, Workers’ Compensation, and FAMLI Paid Leave.
                </p>
              </div>

              {/* Has employees toggle */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  id="has-emp"
                  checked={hasEmployees}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHasEmployees(checked);
                    if (!checked) {
                      setFormData({ ...formData, employeeCount: 0, estimatedQuarterlyWages: 0 });
                    } else if (formData.employeeCount === 0) {
                      setFormData({ ...formData, employeeCount: 2, estimatedQuarterlyWages: 25000 });
                    }
                  }}
                  className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="has-emp" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  We employ (or plan to employ) workers in Maryland (including part-time or family members).
                </label>
              </div>

              {hasEmployees ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Total Employee Count (Inside & Outside MD)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={formData.employeeCount}
                        onChange={(e) => setFormData({ ...formData, employeeCount: Math.max(1, Number(e.target.value)) })}
                        className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        Threshold: 15 employees triggers 0.45% employer FAMLI share.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Estimated Quarterly Maryland Gross Payroll ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="5000"
                        value={formData.estimatedQuarterlyWages}
                        onChange={(e) => setFormData({ ...formData, estimatedQuarterlyWages: Math.max(0, Number(e.target.value)) })}
                        className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* FAMLI small employer rule */}
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1.5 text-xs text-amber-950">
                    <div className="flex items-center gap-2 font-bold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Time-Sensitive FAMLI Rules (Guide Page 6)</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">
                      • <strong>Nov 15, 2026:</strong> Declaration of Intent (DOI) deadline for employers seeking a qualifying private-plan seeding-period exemption.<br />
                      • <strong>Jan 1, 2027:</strong> State Plan payroll contributions begin at 0.9% rate.<br />
                      • <strong>Small Employer Benefit:</strong> Employers with &lt;15 employees pay <strong>0% employer share</strong> (only 0.45% employee withholding is remitted).
                    </p>
                  </div>

                  {/* Workers' comp rule */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                    <strong className="text-slate-900">Workers’ Compensation Pre-Work Requirement:</strong> Coverage must be bound before covered employees begin work. Once effective, post Form C-24 on mandatory 8.5 x 14-inch gold or yellow paper.
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                  <strong className="text-slate-900">Sole Operator Status:</strong> If you operate with zero employees, workers’ compensation and FAMLI contributions are not currently required. If you hire later, register with MD Department of Labor and FAMLI immediately.
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: COMPLIANCE LEAD & LAUNCH TIMELINE                 */}
          {/* ========================================================= */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Step 4: Assign Compliance Lead & Target Launch
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Assign a designated compliance lead to maintain permits, insurance binders, and payroll records in a single launch file.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designated Compliance Lead / Officer *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.complianceLead}
                    onChange={(e) => setFormData({ ...formData, complianceLead: e.target.value })}
                    placeholder="e.g. Morgan Vance (Managing Member)"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Person responsible for agency filings and audit evidence.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Opening Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.targetOpeningDate}
                    onChange={(e) => setFormData({ ...formData, targetOpeningDate: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Guide recommends an 8–12 week lead time before opening day.
                  </span>
                </div>
              </div>

              {/* Startup Roadmap Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-700" />
                  <span>Your Initial Tailored Maryland Roadmap Summary</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div>• <strong>SDAT Entity Filing:</strong> {formData.businessName || 'Business Entity'}</div>
                  <div>• <strong>Clerk Jurisdiction:</strong> {formData.countyOrCity}</div>
                  <div>• <strong>Trader’s License:</strong> {formData.hasRetailInventory ? 'Required (Goods Sold)' : 'Exempt (Service-Only)'}</div>
                  <div>• <strong>FAMLI 2027 Status:</strong> {formData.employeeCount < 15 ? 'Small Employer (0% employer share)' : 'Standard Employer (0.45% employer share)'}</div>
                </div>

                {/* Official Maryland Startup Guide Onboarding Documents */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-amber-600" />
                      <span>Official Startup Guide Onboarding Documents (8 Pages)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenPdfPage(1)}
                      className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                    >
                      Open Full Guide PDF
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => onOpenPdfPage(2)}
                      className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800 group-hover:text-amber-950">
                        <span>1. Master Statutory Checklist</span>
                        <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">P. 2</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        Sections A, B, & C statutory sequences & agencies.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenPdfPage(3)}
                      className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800 group-hover:text-amber-950">
                        <span>2. Trader's License Fee Schedule</span>
                        <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">P. 3</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        Statewide inventory tiers & Baltimore City rates.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenPdfPage(4)}
                      className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800 group-hover:text-amber-950">
                        <span>3. Clerk Application Packet</span>
                        <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">P. 4</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        4-part dossier for Circuit Court Clerk licensing.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenPdfPage(6)}
                      className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800 group-hover:text-amber-950">
                        <span>4. FAMLI Exemption & Rates</span>
                        <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">P. 6</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        Nov 15, 2026 DOI deadline & Jan 1, 2027 start.
                      </p>
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-[11px]">
                  <strong>Local Device Privacy Confirmed:</strong> All information configured in this wizard is saved directly to your browser's localStorage. Zero data is sent to external servers.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Navigation Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenPdfPage(1)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Read Guide Intro (Page 1)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Launch My Compliance Dashboard</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Legal Structure Comparison & Decision Modal */}
      <EntityDecideModal
        isOpen={showEntityModal}
        onClose={() => setShowEntityModal(false)}
        onSelectEntity={(id) => setEntityType(id)}
        currentSelectedId={entityType}
      />
    </div>
  );
};
