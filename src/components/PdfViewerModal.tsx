import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  BookOpen, 
  FileText, 
  Layers, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  Calendar,
  Building,
  CheckCircle2
} from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  initialPage = 1,
}) => {
  const [activePage, setActivePage] = useState<number>(initialPage);
  const [viewMode, setViewMode] = useState<'text' | 'pdf'>('text');

  if (!isOpen) return null;

  // Base-relative paths that work locally, in AI Studio, and on GitHub Pages
  const basePath = import.meta.env.BASE_URL || './';
  const cleanBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const pdfUrl = `${cleanBase}assets/aistudio/Maryland_Startup_Guide_431a0bbf.pdf`;

  const guideChapters = [
    {
      page: 1,
      title: 'Title, Sequencing & Statutory Foundations',
      summary: 'Statewide sequence of legal formation, SDAT registration, and statutory compliance.',
      highlights: [
        'Mandatory statutory sequence: SDAT filing ➔ IRS EIN ➔ Comptroller Tax Accounts ➔ Local Circuit Court Clerk Licensing.',
        'Good Standing prerequisite: Circuit Court clerks will not issue business licenses without active SDAT Good Standing status.',
        'Device-local privacy guarantee: all verification records are stored solely in local browser storage.',
      ],
      details: [
        { label: 'SDAT Business Express', value: 'businessexpress.maryland.gov' },
        { label: 'Statutory Authority', value: 'Maryland Code, Corps & Assns, Tax-General, and Business Regulation Articles' },
        { label: 'Target Audience', value: 'Entrepreneurs establishing LLCs, Corporations, Sole Proprietorships, and Partnerships in Maryland' },
      ]
    },
    {
      page: 2,
      title: 'Master Startup Checklist (Sections A, B, C)',
      summary: 'Comprehensive statutory action items from pre-formation through opening day.',
      highlights: [
        'Section A (Formation): Name reservation, resident agent selection, and SDAT Articles of Organization ($100 fee + $50 expedited).',
        'Section B (Taxation): Federal EIN (Form SS-4), Comptroller of Maryland Central Registration (Form CRA), and Sales/Use Tax Account.',
        'Section C (Permits & Local): County zoning compliance certificate, U&O permit, fire marshal clearance, and environmental health approvals.',
      ],
      details: [
        { label: 'SDAT Expedited Review', value: 'Recommended for 24-hr electronic processing' },
        { label: 'CRA Form Processing', value: 'Directly on Maryland Tax Connect (marylandtaxes.gov)' },
        { label: 'Zoning Prerequisite', value: 'Required prior to submitting application to Circuit Court Clerk' },
      ]
    },
    {
      page: 3,
      title: 'Licensing: Who Issues What? (Trader’s License)',
      summary: 'State vs County vs Municipal jurisdiction rules and Trader’s License fee schedule.',
      highlights: [
        'Trader’s License Requirement: Mandatory for any person or business selling goods, wares, merchandise, or chattels in Maryland.',
        'Issuing Authority: Office of the Clerk of the Circuit Court in the county where the establishment is situated.',
        'Exemptions: Service-only businesses (consulting, barbers, web designers) do not sell physical goods and are exempt from Trader’s Licenses.',
      ],
      details: [
        { label: 'Counties Formula', value: 'Tiered based on average annual inventory valuation (starts at $15 for <$1,000)' },
        { label: 'Baltimore City Formula', value: 'Unique statutory calculation: $20 for <$1,000 inventory; $80 for $1,001–$2,000; up to $2,125' },
        { label: 'Annual Expiration', value: 'All Trader’s Licenses expire annually on April 30 and renew on May 1' },
      ]
    },
    {
      page: 4,
      title: 'Clerk Application Packet & Permit Tracker',
      summary: 'The 4-part application dossier required by Circuit Court Clerk licensing departments.',
      highlights: [
        'Item 1: SDAT Good Standing Certificate or active entity printout showing valid department ID.',
        'Item 2: Comptroller Sales & Use Tax registration account number and Maryland Tax Clearance certificate.',
        'Item 3: Local County / Municipal Use & Occupancy (U&O) permit or zoning compliance verification letter.',
        'Item 4: Workers’ Compensation Insurance verification: Binder number, policy certificate, or WCC exemption declaration.',
      ],
      details: [
        { label: 'Application Submission', value: 'In-person or mail to local Circuit Court Clerk Licensing Office' },
        { label: 'Processing Window', value: 'Typically 5–10 business days upon submission of complete packet' },
        { label: 'Common Rejection Reason', value: 'Missing Workers’ Compensation policy binder or unpaid SDAT annual report' },
      ]
    },
    {
      page: 5,
      title: 'Hiring, Workers’ Compensation & Insurance',
      summary: 'Employer statutory obligations, Form C-24 posting, and mandatory insurance coverages.',
      highlights: [
        'Mandatory Coverage: Maryland law requires employers with 1 or more employees to maintain active Workers’ Compensation insurance.',
        'Form C-24 Legal Posting: Once insurance is bound, employers MUST post Workers’ Compensation Commission Notice Form C-24 on 8.5 x 14-inch goldenrod/yellow paper in employee breakrooms.',
        'New Hire Reporting: Report all newly hired or recalled employees to the Maryland State Directory of New Hires within 20 days.',
      ],
      details: [
        { label: 'WCC Form C-24', value: 'Mandatory statutory poster (8.5 x 14 inch goldenrod/yellow paper)' },
        { label: 'Unemployment Insurance', value: 'Register with MD Department of Labor via BEACON portal' },
        { label: 'Commercial General Liability', value: 'Standard $1M/$2M aggregate recommended for retail and leased premises' },
      ]
    },
    {
      page: 6,
      title: 'FAMLI Readiness: 2026–2028 Rates & Rules',
      summary: 'Time-sensitive Maryland Family and Medical Leave Insurance requirements.',
      highlights: [
        'November 15, 2026 Deadline: Employers desiring to offer a qualifying private plan during the seeding period MUST submit their Declaration of Intent (DOI) to MD Department of Labor by this date.',
        'January 1, 2027 Payroll Start: State plan payroll contributions commence for all covered employers and employees.',
        'Small Employer Exemption (<15 Employees): Employers with fewer than 15 employees pay 0% employer share (they only withhold and remit the 0.45% employee deduction).',
        'Standard Rate (0.9% Total): For employers with 15+ employees, 50% split (0.45% employer share + 0.45% employee deduction).',
      ],
      details: [
        { label: 'DOI Deadline', value: 'November 15, 2026' },
        { label: 'Contributions Commence', value: 'January 1, 2027' },
        { label: 'Benefits Become Available', value: 'July 1, 2027' },
      ]
    },
    {
      page: 7,
      title: 'Target Launch Timeline & Good Standing Filings',
      summary: '12-week runway schedule and ongoing annual reporting to SDAT.',
      highlights: [
        'Weeks 12–8 Out: Entity formation with SDAT, EIN procurement, and lease negotiation.',
        'Weeks 8–4 Out: Central registration with Comptroller, zoning reviews, buildout permits, and insurance binders.',
        'Weeks 4–1 Out: Circuit Court Clerk Trader’s License dossier submission, employee onboarding, FAMLI payroll setup.',
        'Ongoing Good Standing: File Annual SDAT Personal Property Return (Form 1) by April 15 each year to prevent entity forfeiture.',
      ],
      details: [
        { label: 'Annual SDAT Report', value: 'Due annually on April 15 ($300 annual fee for LLCs/Corporations)' },
        { label: 'Trader’s License Renewal', value: 'Due annually by April 30' },
        { label: 'Quarterly FAMLI / UI Filings', value: 'Due on the last day of the month following each calendar quarter' },
      ]
    },
    {
      page: 8,
      title: 'Official Government Portal Directory (S1–S13)',
      summary: 'Verified direct links to Maryland state, county, and federal regulatory portals.',
      highlights: [
        'S1: SDAT Maryland Business Express (businessexpress.maryland.gov)',
        'S2: Comptroller Maryland Tax Connect (marylandtaxes.gov)',
        'S3: IRS EIN Portal (irs.gov)',
        'S4: Maryland Judiciary Circuit Court Clerks (mdcourts.gov)',
        'S5: Maryland Department of Labor BEACON (labor.maryland.gov)',
        'S6: FAMLI Division Portal (paidleave.maryland.gov)',
        'S7: Maryland Workers’ Compensation Commission (wcc.state.md.us)',
      ],
      details: [
        { label: 'Official Portals Count', value: '13 statutory agencies linked directly in dashboard' },
        { label: 'Jurisdictions Covered', value: 'All 23 Maryland counties plus Baltimore City' },
        { label: 'Verification Status', value: 'Current for 2026–2027 statutory year' },
      ]
    },
  ];

  const currentChapter = guideChapters.find((c) => c.page === activePage) || guideChapters[0];

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl max-w-5xl w-full h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
              <BookOpen className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                  Official Statutory Document
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">8 Pages · Statewide Edition</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Maryland Small Business Startup Checklist & Licensing Guide
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-200/80 rounded-lg p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('text')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'text' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chapter Guide
              </button>
              <button
                type="button"
                onClick={() => setViewMode('pdf')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'pdf' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PDF View
              </button>
            </div>

            <a
              href={pdfUrl}
              download="Maryland_Startup_Guide.pdf"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              title="Open full PDF file in browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full Tab</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
              aria-label="Close guide viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Table of Contents */}
          <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-3 sm:p-4 overflow-y-auto shrink-0 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
              Guide Table of Contents (8 Pages)
            </div>
            
            {guideChapters.map((chapter) => (
              <button
                key={chapter.page}
                onClick={() => setActivePage(chapter.page)}
                className={`w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  activePage === chapter.page
                    ? 'bg-amber-100 text-amber-950 font-semibold shadow-xs border border-amber-200'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <span className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 font-mono text-[11px] font-bold ${
                  activePage === chapter.page ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  P{chapter.page}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="leading-snug truncate">{chapter.title}</div>
                  <div className="text-[10px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                    {chapter.summary}
                  </div>
                </div>
              </button>
            ))}

            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-2 px-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Statutory Maryland 2026–2027 Edition</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Prepared for potential business owners navigating SDAT, Comptroller, and Circuit Court Clerk requirements.
              </p>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 bg-white overflow-y-auto h-full p-4 sm:p-6">
            {viewMode === 'text' ? (
              <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
                {/* Chapter Header */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
                    <span>Official Guide Page {currentChapter.page} of 8</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    {currentChapter.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {currentChapter.summary}
                  </p>
                </div>

                {/* Key Statutory Highlights */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Statutory Requirements & Core Highlights</span>
                  </h4>
                  <div className="space-y-2">
                    {currentChapter.highlights.map((highlight, idx) => (
                      <div 
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed"
                      >
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statutory Reference Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Key Metrics & Regulatory References</span>
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                    {currentChapter.details.map((detail, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-1 bg-white hover:bg-slate-50">
                        <span className="font-semibold text-slate-700">{detail.label}</span>
                        <span className="font-mono text-slate-900 font-medium sm:text-right">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Quick Action Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => setViewMode('pdf')}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    <span>View in Raw PDF Viewer</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {activePage > 1 && (
                      <button
                        onClick={() => setActivePage(activePage - 1)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        ← Page {activePage - 1}
                      </button>
                    )}
                    {activePage < 8 && (
                      <button
                        onClick={() => setActivePage(activePage + 1)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                      >
                        Page {activePage + 1} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full min-h-[500px] flex flex-col">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Displaying embedded PDF at Page {activePage}</span>
                  <a
                    href={`${pdfUrl}#page=${activePage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Open in dedicated browser tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <iframe
                  src={`${pdfUrl}#page=${activePage}`}
                  title="Maryland Startup Guide PDF"
                  className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-100"
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
