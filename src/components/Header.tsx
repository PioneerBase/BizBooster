import React from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Calculator, 
  ExternalLink, 
  Building2, 
  Heart, 
  FileText, 
  Menu, 
  X,
  FileCheck,
  FileDown
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDonate: () => void;
  onOpenPdf: () => void;
  onOpenGoNoGo: () => void;
  onOpenComplianceRecord: () => void;
  completedTasksCount: number;
  totalTasksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenDonate,
  onOpenPdf,
  onOpenGoNoGo,
  onOpenComplianceRecord,
  completedTasksCount,
  totalTasksCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'checklist', label: 'Checklist & Roadmap', icon: CheckSquare },
    { id: 'deadlines', label: 'Deadlines & Alerts', icon: Calendar },
    { id: 'calculators', label: 'Tax & Fee Calculators', icon: Calculator },
    { id: 'portals', label: 'Government Portals', icon: ExternalLink },
    { id: 'counties', label: 'County Clerks', icon: Building2 },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const completionPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark (Single text element in display face, no pill badges) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('checklist')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-sm">
                  MD
                </div>
                <div>
                  <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
                    BizBooster <span className="text-amber-700 font-semibold text-sm">MD</span>
                  </span>
                  <div className="hidden sm:block text-[11px] text-slate-500 font-medium leading-none">
                    Maryland Small Business Compliance
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Quick Tools */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenComplianceRecord}
              title="Download your compliance record PDF (stored locally on this device only)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:text-white bg-amber-400/90 hover:bg-slate-900 border border-amber-500/30 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Record PDF</span>
              <span className="sm:hidden">Record</span>
            </button>

            <button
              onClick={onOpenPdf}
              title="View Maryland Startup Guide PDF"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Guide PDF</span>
            </button>

            <button
              onClick={onOpenDonate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-all duration-150 cursor-pointer whitespace-nowrap"
              title="Support portfolio development"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Support App</span>
            </button>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left cursor-pointer ${
                  isActive
                    ? 'bg-amber-50 text-amber-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <button
              onClick={() => {
                onOpenComplianceRecord();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-900 bg-amber-50 hover:bg-amber-100 rounded-lg w-full"
            >
              <FileDown className="w-4 h-4 text-amber-700" />
              <span>Download Compliance Record (PDF)</span>
            </button>
            <button
              onClick={() => {
                onOpenGoNoGo();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg w-full"
            >
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Opening-Day Go / No-Go Checklist</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
