import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ShieldCheck, 
  FileText, 
  HardDrive, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Upload, 
  FileDown,
  Printer,
  Eye
} from 'lucide-react';
import { BusinessProfile, ChecklistItem, StatutoryDeadline } from '../types/compliance';
import { generateCompliancePdf } from '../utils/pdfGenerator';

interface ComplianceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BusinessProfile;
  checklistItems: ChecklistItem[];
  deadlines: StatutoryDeadline[];
  onImportBackup: (backup: { profile: BusinessProfile; checklistItems: ChecklistItem[]; deadlines: StatutoryDeadline[] }) => void;
  onClearDeviceData: () => void;
}

export const ComplianceRecordModal: React.FC<ComplianceRecordModalProps> = ({
  isOpen,
  onClose,
  profile,
  checklistItems,
  deadlines,
  onImportBackup,
  onClearDeviceData,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  // Stats
  const mainItems = checklistItems.filter((i) => i.sectionId !== 'go_no_go');
  const completedCount = mainItems.filter((i) => i.status === 'completed').length;
  const totalCount = mainItems.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const sanitizeFilename = (name: string) => {
    return (name || 'Maryland_Business')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 30);
  };

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    try {
      const doc = generateCompliancePdf(profile, checklistItems, deadlines);
      const safeName = sanitizeFilename(profile.businessName);
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `Maryland_Compliance_Record_${safeName}_${dateStr}.pdf`;
      doc.save(filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Error generating PDF. Please ensure your browser allows local file generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportJson = () => {
    const backupData = {
      app: 'Maryland Business Compliance Hub',
      version: '1.0',
      exportDate: new Date().toISOString(),
      profile,
      checklistItems,
      deadlines,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MD_Compliance_Backup_${sanitizeFilename(profile.businessName)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.profile && parsed.checklistItems && parsed.deadlines) {
          onImportBackup({
            profile: parsed.profile,
            checklistItems: parsed.checklistItems,
            deadlines: parsed.deadlines,
          });
          alert('Local compliance backup imported successfully!');
        } else {
          alert('Invalid backup file structure.');
        }
      } catch (err) {
        alert('Could not parse the backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Download Official Compliance Record (PDF)
              </h2>
              <div className="text-xs text-slate-500 font-medium">
                Comprehensive statutory status, deadline timetable & audit dossier
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Local-Only Privacy Guarantee Callout */}
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-start gap-3">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-800 rounded-lg shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-emerald-950 text-sm">
              Local-Only Device Privacy Guarantee
            </div>
            <p className="text-emerald-900/90 leading-relaxed">
              Your business data—including SDAT Department IDs, Federal EINs, tax accounts, task notes, and assigned owners—is stored <strong>strictly on your device</strong> in browser localStorage.
            </p>
            <p className="text-[11px] text-emerald-800 font-medium">
              • Zero cloud server synchronization · Zero remote telemetry · 100% client-side PDF generation
            </p>
          </div>
        </div>

        {/* PDF Contents Preview Breakdown */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Document Contents Summary:
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-800">Entity & Location:</span>
              <span className="font-medium text-slate-900 text-right">
                {profile.businessName || 'My Venture'} ({profile.countyOrCity})
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-800">Checklist Completion:</span>
              <span className="font-mono font-bold text-slate-900">
                {completionPct}% ({completedCount}/{totalCount} tasks completed)
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-800">Scheduled Deadlines:</span>
              <span className="font-mono text-slate-900">
                {deadlines.length} regulatory & custom milestones
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-800">Gatekeeper Launch Status:</span>
              <span className="font-semibold text-slate-900">
                Opening-Day Go / No-Go review checkpoints included
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Local Tax & License Parameters:</span>
              <span className="text-slate-900">
                Trader’s License, 2027 FAMLI, SDAT Good Standing notes
              </span>
            </div>
          </div>
        </div>

        {/* Primary Download Button */}
        <div className="space-y-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>
              {isGenerating ? 'Assembling PDF...' : 'Download Compliance Record PDF'}
            </span>
          </button>

          {downloadSuccess && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Compliance record downloaded successfully to your device!</span>
            </div>
          )}
        </div>

        {/* Device Data Management (Local Backup & Wipe) */}
        <div className="pt-3 border-t border-slate-200 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-slate-500" />
            <span>Device Storage Management</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {/* Export JSON */}
            <button
              onClick={handleExportJson}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-medium transition-colors cursor-pointer"
              title="Save a JSON backup of your compliance state to this computer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON Backup</span>
            </button>

            {/* Import JSON */}
            <label className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-medium transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import JSON Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </label>

            {/* Clear Data */}
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to clear all business data from this device? This will erase your local checklist progress and profile details.'
                  )
                ) {
                  onClearDeviceData();
                  onClose();
                }
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-lg font-medium transition-colors cursor-pointer"
              title="Clear all local data from this device"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Device Data</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Target Platform: Maryland Circuit Courts & SDAT</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
