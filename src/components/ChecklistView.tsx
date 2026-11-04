import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  Search, 
  Printer, 
  ExternalLink, 
  FileText, 
  Calendar, 
  User, 
  FileCheck,
  ChevronRight,
  Sparkles,
  RotateCcw,
  FileDown,
  ShieldCheck,
  Scale,
  BookOpen,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ChecklistItem, ComplianceStatus } from '../types/compliance';

interface ChecklistViewProps {
  items: ChecklistItem[];
  onUpdateItem: (id: string, updates: Partial<ChecklistItem>) => void;
  onResetItems: () => void;
  onOpenPdfPage: (page: number) => void;
  onSelectPortalKey: (key: string) => void;
  onOpenGoNoGo: () => void;
  onOpenComplianceRecord: () => void;
  onOpenEntityModal?: () => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  items,
  onUpdateItem,
  onResetItems,
  onOpenPdfPage,
  onSelectPortalKey,
  onOpenGoNoGo,
  onOpenComplianceRecord,
  onOpenEntityModal,
}) => {
  const [activeSection, setActiveSection] = useState<string>('all');
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [isGuideDrawerOpen, setIsGuideDrawerOpen] = useState<boolean>(false);

  // Filter sections
  const sections = [
    { id: 'all', label: 'All Items' },
    { id: 'A', label: 'Section A: Location & Structure' },
    { id: 'B', label: 'Section B: Registrations & Accounts' },
    { id: 'C', label: 'Section C: Licensing & Insurance' },
    { id: 'clerk_packet', label: 'Clerk Application Packet' },
    { id: 'payroll_controls', label: 'Payroll & FAMLI Controls' },
  ];

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Exclude go_no_go from main list since it has a dedicated review
      if (item.sectionId === 'go_no_go') return false;

      const matchesSection = activeSection === 'all' || item.sectionId === activeSection;
      const matchesStatus = activeStatus === 'all' || item.status === activeStatus;
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        (item.owner && item.owner.toLowerCase().includes(query)) ||
        (item.notes && item.notes.toLowerCase().includes(query));

      return matchesSection && matchesStatus && matchesSearch;
    });
  }, [items, activeSection, activeStatus, searchQuery]);

  // Statistics
  const mainItems = items.filter((i) => i.sectionId !== 'go_no_go');
  const totalCount = mainItems.length;
  const completedCount = mainItems.filter((i) => i.status === 'completed').length;
  const inProgressCount = mainItems.filter((i) => i.status === 'in_progress').length;
  const notStartedCount = mainItems.filter((i) => i.status === 'not_started').length;
  const waivedCount = mainItems.filter((i) => i.status === 'not_applicable').length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Toggle quick completion
  const handleToggleComplete = (item: ChecklistItem) => {
    const nextStatus: ComplianceStatus = item.status === 'completed' ? 'not_started' : 'completed';
    onUpdateItem(item.id, { status: nextStatus });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Overview & Metric Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Master Compliance Tracker</span>
              <span aria-hidden="true">·</span>
              <span>Maryland Small Business Guide</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Statewide Startup Checklist & Evidence Log
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Step-by-step statutory sequencing from entity formation to opening day. Assign owners, log evidence files, and retain verification for local Circuit Court Clerks and SDAT.
            </p>
          </div>

          <div className="w-full lg:w-80 shrink-0 bg-slate-50 rounded-lg p-4 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Readiness Score</span>
              <span className="text-lg font-bold font-mono text-slate-900">{completionPercentage}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-600 transition-all duration-300 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            {/* Metric Breakdown */}
            <div className="mt-3 grid grid-cols-4 gap-1 text-center text-xs">
              <div className="py-1 px-1 bg-white rounded border border-slate-200/60">
                <div className="font-bold text-emerald-700 font-mono">{completedCount}</div>
                <div className="text-[10px] text-slate-500">Done</div>
              </div>
              <div className="py-1 px-1 bg-white rounded border border-slate-200/60">
                <div className="font-bold text-amber-700 font-mono">{inProgressCount}</div>
                <div className="text-[10px] text-slate-500">Active</div>
              </div>
              <div className="py-1 px-1 bg-white rounded border border-slate-200/60">
                <div className="font-bold text-slate-700 font-mono">{notStartedCount}</div>
                <div className="text-[10px] text-slate-500">Pending</div>
              </div>
              <div className="py-1 px-1 bg-white rounded border border-slate-200/60">
                <div className="font-bold text-slate-500 font-mono">{waivedCount}</div>
                <div className="text-[10px] text-slate-500">N/A</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGoNoGo}
              className="flex items-center gap-1.5 px-3 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch Day Go / No-Go Review</span>
            </button>
            <button
              onClick={() => onOpenPdfPage(2)}
              className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>View Guide Checklist (Page 2)</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenComplianceRecord}
              className="flex items-center gap-1.5 px-3 py-1.5 font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer shadow-xs"
              title="Generate and download full multi-page Compliance Record PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download Record (PDF)</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
              title="Print formatted compliance audit sheet"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onResetItems}
              className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="Reset checklist items to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Local Storage Privacy Indicator */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Local Device Storage: All progress, task notes & IDs are stored exclusively on this device.</span>
          </div>
          <button
            onClick={onOpenComplianceRecord}
            className="text-slate-600 hover:text-slate-900 underline cursor-pointer"
          >
            Manage Device Backup & Data
          </button>
        </div>
      </div>

      {/* Official Maryland Startup Guide Banner & Quick Chapter Navigator */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                  Official Statewide Source Document
                </span>
                <span className="text-xs text-amber-900/60 font-mono hidden sm:inline">8 Pages · Maryland Compliance</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                Maryland Small Business Startup Checklist & Licensing Guide
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                The statutory roadmap underpinning this checklist. Access official sequencing, Circuit Court Trader’s License formulas, Clerk application dossiers, and 2026–2028 FAMLI timelines.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenPdfPage(1)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Full Guide (PDF)</span>
            </button>

            <a
              href={`${import.meta.env.BASE_URL || './'}assets/aistudio/Maryland_Startup_Guide_431a0bbf.pdf`}
              download="Maryland_Startup_Guide.pdf"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>

            <button
              onClick={() => setIsGuideDrawerOpen(!isGuideDrawerOpen)}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Toggle chapter quick drawer"
            >
              <span>{isGuideDrawerOpen ? 'Hide Chapters' : 'View Chapters'}</span>
              {isGuideDrawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 8-Page Quick Jump Bar */}
        <div className="mt-3.5 pt-3 border-t border-amber-200/60">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Jump to Guide Chapter in Checklist:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
            {[
              { page: 1, label: 'P.1 Sequence & SDAT' },
              { page: 2, label: 'P.2 Master Checklist' },
              { page: 3, label: 'P.3 Trader’s License' },
              { page: 4, label: 'P.4 Clerk Dossier' },
              { page: 5, label: 'P.5 Hiring & Workers’ Comp' },
              { page: 6, label: 'P.6 FAMLI Deadlines' },
              { page: 7, label: 'P.7 Launch Timeline' },
              { page: 8, label: 'P.8 Agency Portals' },
            ].map((btn) => (
              <button
                key={btn.page}
                onClick={() => onOpenPdfPage(btn.page)}
                className="text-left px-2 py-1.5 rounded-md bg-white/80 hover:bg-amber-100/80 border border-amber-200/60 text-[11px] font-medium text-slate-800 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <span className="truncate">{btn.label}</span>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-amber-700 shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Expandable Chapter Summary Drawer */}
        {isGuideDrawerOpen && (
          <div className="mt-3 pt-3 border-t border-amber-200/60 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs animate-in fade-in">
            <div className="p-3 bg-white rounded-lg border border-amber-200/60 space-y-1">
              <span className="font-bold text-slate-900 block">Section A: Location & Legal Formations (Pages 1–2)</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Covers state entity filings with SDAT Business Express, resident agent designation, trade names, and prerequisite zoning compliance before signing commercial leases.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-amber-200/60 space-y-1">
              <span className="font-bold text-slate-900 block">Section B: Tax Accounts & Registrations (Page 2)</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Federal Employer Identification Number (EIN) with IRS, combined registration application (Form CRA) with Comptroller of Maryland for Sales & Use Tax and Employer Withholding.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-amber-200/60 space-y-1">
              <span className="font-bold text-slate-900 block">Section C: Circuit Court Clerk Licensing (Pages 3–4)</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Trader’s License statutory inventory brackets ($15 to $2,125), required 4-part application packet, local health department food permits, and Fire Marshal inspections.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-amber-200/60 space-y-1">
              <span className="font-bold text-slate-900 block">Section D: Hiring, Workers’ Comp & FAMLI (Pages 5–7)</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Mandatory Workers’ Compensation Form C-24 yellow poster, Maryland Directory of New Hires (20-day rule), Nov 15 2026 FAMLI DOI exemption, and Jan 1 2027 payroll start.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* Section Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                activeSection === sec.id
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Secondary filters and search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs text-slate-500 font-medium mr-1">Status:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'not_started', label: 'Pending' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' },
              { id: 'not_applicable', label: 'N/A' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setActiveStatus(st.id)}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  activeStatus === st.id
                    ? 'bg-slate-200 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, laws, or owners..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Checklist List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-800">No checklist items match your filters.</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the status filter or clearing your search keywords.</p>
            <button
              onClick={() => {
                setActiveSection('all');
                setActiveStatus('all');
                setSearchQuery('');
              }}
              className="mt-3 px-3 py-1.5 text-xs font-medium text-amber-700 hover:text-amber-800 bg-amber-50 rounded-md cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isCompleted = item.status === 'completed';
            const isInProgress = item.status === 'in_progress';
            const isWaived = item.status === 'not_applicable';
            const isExpanded = expandedItemId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-lg border transition-all duration-150 ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-4 flex items-start justify-between gap-3">
                  {/* Left: Checkbox & Item details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleComplete(item)}
                      className="mt-0.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer shrink-0"
                      title={isCompleted ? 'Mark pending' : 'Mark completed'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : isInProgress ? (
                        <Clock className="w-5 h-5 text-amber-600" />
                      ) : isWaived ? (
                        <Circle className="w-5 h-5 text-slate-300 stroke-dashed" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          {item.sectionTitle}
                        </span>
                        <span className="text-slate-300">·</span>
                        {/* Clean unboxed citations */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                          {item.sourceKeys.map((sk) => (
                            <button
                              key={sk}
                              onClick={() => onSelectPortalKey(sk)}
                              className="hover:text-amber-700 underline font-semibold cursor-pointer"
                              title={`View ${sk} official portal details`}
                            >
                              [{sk}]
                            </button>
                          ))}
                          <span className="text-slate-400">·</span>
                          <button
                            onClick={() => onOpenPdfPage(item.pdfPage)}
                            className="hover:text-slate-800 cursor-pointer text-[11px] text-slate-500"
                            title="Open in Startup Guide PDF"
                          >
                            pg. {item.pdfPage}
                          </button>
                        </div>
                      </div>

                      <h2
                        onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                        className={`text-sm sm:text-base font-semibold cursor-pointer ${
                          isCompleted ? 'text-slate-700 line-through decoration-slate-300' : 'text-slate-900 hover:text-amber-800'
                        }`}
                      >
                        {item.title}
                      </h2>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Special Helper for Task chk-a3: Entity Decision Guide */}
                      {item.id === 'chk-a3' && (
                        <div className="my-2 p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="space-y-0.5">
                            <span className="font-bold text-amber-950 block">
                              Need help deciding on LLC vs. Inc. vs. Sole Proprietorship?
                            </span>
                            <span className="text-[11px] text-slate-600">
                              Compare personal liability protections, double taxation, and the $300 SDAT fee.
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {onOpenEntityModal && (
                              <button
                                type="button"
                                onClick={onOpenEntityModal}
                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              >
                                <Scale className="w-3.5 h-3.5 text-amber-600" />
                                <span>Compare Entities</span>
                              </button>
                            )}

                            <a
                              href="https://businessexpress.maryland.gov/start/choose-a-legal-structure"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-950 underline"
                              title="Maryland Business Express official structure guide"
                            >
                              <span>Official MD Guide</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Evidence & Due Date Metadata Row (No static pills, clean inline text) */}
                      <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        {item.owner && (
                          <div className="flex items-center gap-1 text-slate-700">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>Owner: {item.owner}</span>
                          </div>
                        )}
                        {item.dueDate && (
                          <div className="flex items-center gap-1 text-slate-700 font-mono">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Due: {item.dueDate}</span>
                          </div>
                        )}
                        {item.notes && (
                          <div className="text-slate-600 truncate max-w-xs">
                            <span className="font-medium text-slate-700">Evidence:</span> {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Status dropdown & expand button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={item.status}
                      onChange={(e) => onUpdateItem(item.id, { status: e.target.value as ComplianceStatus })}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium border cursor-pointer focus:outline-none ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : isInProgress
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : isWaived
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <option value="not_started">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="not_applicable">N/A / Waived</option>
                    </select>

                    <button
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                      title="Edit owner, due date and evidence link"
                      aria-label="Expand task details"
                    >
                      <ChevronRight className={`w-4 h-4 transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded Item Form for evidence tracking */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60 rounded-b-lg grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-100">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Task Assignee / Owner
                      </label>
                      <input
                        type="text"
                        value={item.owner || ''}
                        onChange={(e) => onUpdateItem(item.id, { owner: e.target.value })}
                        placeholder="e.g. Founder, CPA, Legal Counsel"
                        className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Target Completion Date
                      </label>
                      <input
                        type="date"
                        value={item.dueDate || ''}
                        onChange={(e) => onUpdateItem(item.id, { dueDate: e.target.value })}
                        className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 bg-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Evidence / Confirmation Ref
                      </label>
                      <input
                        type="text"
                        value={item.notes || ''}
                        onChange={(e) => onUpdateItem(item.id, { notes: e.target.value })}
                        placeholder="e.g. Binder #94208, SDAT filing confirmed"
                        className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Guide Note regarding 4 distinct obligations */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-2">
          Critical Startup Rule: Keep 4 Employer Obligations Distinct
        </h3>
        <p className="text-xs text-slate-600 mb-3">
          Maryland law maintains four separate layers of employer compliance. Registering for one does not satisfy the others:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-900 mb-1">1. State Withholding</div>
            <div className="text-slate-600 text-[11px]">Register via CRA on MD Tax Connect. Configure payroll employee tax deductions and remittances.</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-900 mb-1">2. Unemployment Ins.</div>
            <div className="text-slate-600 text-[11px]">Department of Labor account, wage reporting and state unemployment tax payments.</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-900 mb-1">3. Workers’ Comp</div>
            <div className="text-slate-600 text-[11px]">Mandatory private insurance policy before employees work. Post C-24 notice on gold/yellow paper.</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-900 mb-1">4. FAMLI Paid Leave</div>
            <div className="text-slate-600 text-[11px]">Mandatory registration with FAMLI Division. 0.9% contribution starting Jan 1, 2027.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
