import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Calculator, 
  ExternalLink, 
  Building2, 
  Heart, 
  FileText, 
  ShieldCheck, 
  Printer, 
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { Header } from './components/Header';
import { AlertBanner } from './components/AlertBanner';
import { BusinessProfileBar } from './components/BusinessProfileBar';
import { ChecklistView } from './components/ChecklistView';
import { DeadlineCalendar } from './components/DeadlineCalendar';
import { TaxCalculatorView } from './components/TaxCalculatorView';
import { PortalsDirectory } from './components/PortalsDirectory';
import { CountyClerkDirectory } from './components/CountyClerkDirectory';
import { GoNoGoModal } from './components/GoNoGoModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { DonateModal } from './components/DonateModal';
import { ComplianceRecordModal } from './components/ComplianceRecordModal';
import { OnboardingWizard } from './components/OnboardingWizard';
import { EntityDecideModal } from './components/EntityDecideModal';
import { ChecklistItem, StatutoryDeadline, BusinessProfile } from './types/compliance';
import { INITIAL_CHECKLIST_ITEMS, STATUTORY_DEADLINES } from './data/checklistData';

const STORAGE_KEY_CHECKLIST = 'md_compliance_checklist_v1';
const STORAGE_KEY_DEADLINES = 'md_compliance_deadlines_v1';
const STORAGE_KEY_PROFILE = 'md_compliance_profile_v1';
const STORAGE_KEY_ONBOARDING = 'md_onboarding_completed_v1';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('checklist');

  // Modals & Onboarding
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfPage, setPdfPage] = useState<number>(1);
  const [isGoNoGoOpen, setIsGoNoGoOpen] = useState(false);
  const [isComplianceRecordOpen, setIsComplianceRecordOpen] = useState(false);
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      // Open onboarding automatically for first-time visitors who haven't finished it
      return localStorage.getItem(STORAGE_KEY_ONBOARDING) !== 'true';
    } catch {
      return false;
    }
  });
  const [selectedPortalKey, setSelectedPortalKey] = useState<string | null>(null);

  // Business Profile State
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      businessName: 'Annapolis Bay Outfitters LLC',
      industry: 'Retail Sporting Goods & Marine Apparel',
      operatingAddress: '142 Main Street, Annapolis, MD 21401',
      countyOrCity: 'Anne Arundel County',
      targetOpeningDate: '2027-02-15',
      complianceLead: 'Morgan Vance (Managing Member)',
      hasRetailInventory: true,
      inventoryValuation: 45000,
      employeeCount: 6,
      estimatedQuarterlyWages: 65000,
      sdatId: 'W24890123',
      ein: '52-9842104',
      salesTaxAccount: '08-419204',
    };
  });

  // Checklist Items State
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CHECKLIST_ITEMS;
  });

  // Deadlines State
  const [deadlines, setDeadlines] = useState<StatutoryDeadline[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DEADLINES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return STATUTORY_DEADLINES;
  });

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(checklistItems));
    } catch {
      // ignore
    }
  }, [checklistItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DEADLINES, JSON.stringify(deadlines));
    } catch {
      // ignore
    }
  }, [deadlines]);

  // Handlers for Checklist
  const handleUpdateItem = (id: string, updates: Partial<ChecklistItem>) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleResetChecklist = () => {
    if (window.confirm('Reset all checklist items to guide defaults?')) {
      setChecklistItems(INITIAL_CHECKLIST_ITEMS);
    }
  };

  const handleToggleGoNoGoItem = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === 'completed' ? 'not_started' : 'completed',
          };
        }
        return item;
      })
    );
  };

  // Handlers for Deadlines
  const handleAddCustomDeadline = (newDl: Omit<StatutoryDeadline, 'id'>) => {
    const item: StatutoryDeadline = {
      ...newDl,
      id: `custom-${Date.now()}`,
    };
    setDeadlines((prev) => [item, ...prev]);
  };

  const handleToggleCompleteDeadline = (id: string) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
    );
  };

  const handleDeleteDeadline = (id: string) => {
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
  };

  // Handlers for Nav & PDF
  const handleOpenPdfPage = (page: number) => {
    setPdfPage(page);
    setIsPdfOpen(true);
  };

  const handleSelectPortalKey = (key: string) => {
    setSelectedPortalKey(key);
    setActiveTab('portals');
  };

  const handleSelectCounty = (countyName: string) => {
    setProfile((prev) => ({ ...prev, countyOrCity: countyName }));
  };

  const handleImportBackup = (backup: {
    profile: BusinessProfile;
    checklistItems: ChecklistItem[];
    deadlines: StatutoryDeadline[];
  }) => {
    setProfile(backup.profile);
    setChecklistItems(backup.checklistItems);
    setDeadlines(backup.deadlines);
  };

  const handleCompleteOnboarding = (
    configuredProfile: BusinessProfile,
    autoConfigureChecklist: boolean = true
  ) => {
    setProfile(configuredProfile);
    try {
      localStorage.setItem(STORAGE_KEY_ONBOARDING, 'true');
    } catch {
      // ignore
    }

    if (autoConfigureChecklist) {
      setChecklistItems((prev) =>
        prev.map((item) => {
          let updated = { ...item };
          // Assign lead as owner if item has no owner yet
          if (configuredProfile.complianceLead && !item.owner) {
            updated.owner = configuredProfile.complianceLead;
          }
          // If service-only, mark trader's license inventory task as not applicable
          if (!configuredProfile.hasRetailInventory && item.id === 'chk-clerk4') {
            updated.status = 'not_applicable';
            updated.notes = 'Exempt (Service-Only business without retail inventory)';
          }
          return updated;
        })
      );
    }

    setIsOnboardingOpen(false);
  };

  const handleSkipOnboarding = () => {
    try {
      localStorage.setItem(STORAGE_KEY_ONBOARDING, 'true');
    } catch {
      // ignore
    }
    setIsOnboardingOpen(false);
  };

  const handleClearDeviceData = () => {
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem(STORAGE_KEY_CHECKLIST);
    localStorage.removeItem(STORAGE_KEY_DEADLINES);
    localStorage.removeItem(STORAGE_KEY_ONBOARDING);
    setChecklistItems(INITIAL_CHECKLIST_ITEMS);
    setDeadlines(STATUTORY_DEADLINES);
    setProfile({
      businessName: '',
      industry: '',
      operatingAddress: '',
      countyOrCity: 'Anne Arundel County',
      targetOpeningDate: '',
      complianceLead: '',
      hasRetailInventory: false,
      inventoryValuation: 0,
      employeeCount: 1,
      estimatedQuarterlyWages: 0,
      sdatId: '',
      ein: '',
      salesTaxAccount: '',
    });
    setIsOnboardingOpen(true);
  };

  const completedCount = checklistItems.filter((i) => i.status === 'completed').length;
  const totalCount = checklistItems.length;

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans">
      {/* Onboarding Wizard for new users or upon reset */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <OnboardingWizard
            initialProfile={profile}
            onCompleteOnboarding={handleCompleteOnboarding}
            onSkip={handleSkipOnboarding}
            onOpenPdfPage={handleOpenPdfPage}
          />
        </div>
      )}

      {/* Top Bar following Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDonate={() => setIsDonateOpen(true)}
        onOpenPdf={() => handleOpenPdfPage(1)}
        onOpenGoNoGo={() => setIsGoNoGoOpen(true)}
        onOpenComplianceRecord={() => setIsComplianceRecordOpen(true)}
        completedTasksCount={completedCount}
        totalTasksCount={totalCount}
      />

      {/* Automated Time-Sensitive Alert Banner */}
      <AlertBanner
        onViewDeadlines={() => setActiveTab('deadlines')}
        onOpenPdfPage={handleOpenPdfPage}
      />

      {/* Business Setup Bar */}
      <BusinessProfileBar
        profile={profile}
        onUpdateProfile={(updates) => setProfile((prev) => ({ ...prev, ...updates }))}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'checklist' && (
          <ChecklistView
            items={checklistItems}
            onUpdateItem={handleUpdateItem}
            onResetItems={handleResetChecklist}
            onOpenPdfPage={handleOpenPdfPage}
            onSelectPortalKey={handleSelectPortalKey}
            onOpenGoNoGo={() => setIsGoNoGoOpen(true)}
            onOpenComplianceRecord={() => setIsComplianceRecordOpen(true)}
            onOpenEntityModal={() => setIsEntityModalOpen(true)}
          />
        )}

        {activeTab === 'deadlines' && (
          <DeadlineCalendar
            deadlines={deadlines}
            onAddCustomDeadline={handleAddCustomDeadline}
            onToggleCompleteDeadline={handleToggleCompleteDeadline}
            onDeleteDeadline={handleDeleteDeadline}
            onOpenPdfPage={handleOpenPdfPage}
            onSelectPortalKey={handleSelectPortalKey}
          />
        )}

        {activeTab === 'calculators' && (
          <TaxCalculatorView
            profile={profile}
            onOpenPdfPage={handleOpenPdfPage}
            onSelectPortalKey={handleSelectPortalKey}
          />
        )}

        {activeTab === 'portals' && (
          <PortalsDirectory
            onOpenPdfPage={handleOpenPdfPage}
            selectedKey={selectedPortalKey}
          />
        )}

        {activeTab === 'counties' && (
          <CountyClerkDirectory
            currentCounty={profile.countyOrCity}
            onSelectCounty={handleSelectCounty}
          />
        )}
      </main>

      {/* Clean Civic Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-bold text-slate-700">BizBooster Maryland</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span>Based on the Maryland Small Business Startup Checklist & Licensing Guide (Nov 2026)</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsComplianceRecordOpen(true)}
              className="text-amber-800 hover:text-amber-950 font-semibold underline cursor-pointer"
            >
              Download Record (PDF)
            </button>
            <button
              onClick={() => handleOpenPdfPage(1)}
              className="hover:text-slate-900 underline cursor-pointer"
            >
              Startup Guide PDF
            </button>
            <button
              onClick={() => setIsGoNoGoOpen(true)}
              className="hover:text-slate-900 underline cursor-pointer"
            >
              Go / No-Go Review
            </button>
            <button
              onClick={() => setIsDonateOpen(true)}
              className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Support Developer</span>
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Local Device Privacy: All compliance tracking data is stored strictly in your browser (v1). Zero server transmission.</span>
          <button
            onClick={() => setIsComplianceRecordOpen(true)}
            className="hover:text-slate-600 underline cursor-pointer"
          >
            Manage Local Data & Backups
          </button>
        </div>
      </footer>

      {/* Modals */}
      <GoNoGoModal
        isOpen={isGoNoGoOpen}
        onClose={() => setIsGoNoGoOpen(false)}
        items={checklistItems}
        onToggleItem={handleToggleGoNoGoItem}
        businessName={profile.businessName}
      />

      <PdfViewerModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        initialPage={pdfPage}
      />

      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
      />

      <ComplianceRecordModal
        isOpen={isComplianceRecordOpen}
        onClose={() => setIsComplianceRecordOpen(false)}
        profile={profile}
        checklistItems={checklistItems}
        deadlines={deadlines}
        onImportBackup={handleImportBackup}
        onClearDeviceData={handleClearDeviceData}
      />

      <EntityDecideModal
        isOpen={isEntityModalOpen}
        onClose={() => setIsEntityModalOpen(false)}
      />
    </div>
  );
}
