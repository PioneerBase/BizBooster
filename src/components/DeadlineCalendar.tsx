import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  AlertTriangle, 
  Clock, 
  Plus, 
  CheckCircle, 
  Trash2, 
  FileText, 
  ExternalLink,
  ShieldAlert,
  Bell
} from 'lucide-react';
import { StatutoryDeadline } from '../types/compliance';

interface DeadlineCalendarProps {
  deadlines: StatutoryDeadline[];
  onAddCustomDeadline: (deadline: Omit<StatutoryDeadline, 'id'>) => void;
  onToggleCompleteDeadline: (id: string) => void;
  onDeleteDeadline: (id: string) => void;
  onOpenPdfPage: (page: number) => void;
  onSelectPortalKey: (key: string) => void;
}

export const DeadlineCalendar: React.FC<DeadlineCalendarProps> = ({
  deadlines,
  onAddCustomDeadline,
  onToggleCompleteDeadline,
  onDeleteDeadline,
  onOpenPdfPage,
  onSelectPortalKey,
}) => {
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [customProgram, setCustomProgram] = useState<'FAMLI' | 'SDAT' | 'Clerk Licenses' | 'Taxes' | 'Custom'>('Custom');
  const [customDesc, setCustomDesc] = useState('');

  // Fixed reference date: Nov 3, 2026 (matching the current date and field guide release)
  const simulatedToday = new Date('2026-11-03T00:00:00');

  // Sorted deadlines with days remaining
  const enrichedDeadlines = useMemo(() => {
    return deadlines.map((item) => {
      const dDate = new Date(item.dateStr + 'T23:59:59');
      const diffTime = dDate.getTime() - simulatedToday.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let urgencyLevel: 'overdue' | 'critical' | 'upcoming' | 'future' = 'future';
      if (diffDays < 0) urgencyLevel = 'overdue';
      else if (diffDays <= 14) urgencyLevel = 'critical';
      else if (diffDays <= 60) urgencyLevel = 'upcoming';

      return {
        ...item,
        diffDays,
        urgencyLevel,
      };
    }).sort((a, b) => new Date(a.dateStr).getTime() - new Date(b.dateStr).getTime());
  }, [deadlines]);

  const filteredDeadlines = useMemo(() => {
    if (filterProgram === 'all') return enrichedDeadlines;
    if (filterProgram === 'urgent') return enrichedDeadlines.filter((d) => d.urgencyLevel === 'critical' || d.urgencyLevel === 'overdue');
    return enrichedDeadlines.filter((d) => d.program === filterProgram);
  }, [enrichedDeadlines, filterProgram]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customDate) return;

    onAddCustomDeadline({
      title: customTitle,
      dateStr: customDate,
      program: customProgram,
      description: customDesc || 'Custom business permit / operational milestone.',
      isCustom: true,
      completed: false,
      isUrgent: false,
    });

    setCustomTitle('');
    setCustomDate('');
    setCustomDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Statutory Compliance Calendar</span>
              <span aria-hidden="true">·</span>
              <span>Automated State Alerts</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Maryland Deadlines & Regulatory Timetable
            </h1>
            <p className="text-sm text-slate-600">
              Automated reminders for time-sensitive filings including the 2026 FAMLI Declaration of Intent, 2027 SDAT Annual Return, and May 1 Trader’s License renewal.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Deadline</span>
          </button>
        </div>

        {/* Filter chips */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium mr-2">Filter Program:</span>
          {[
            { id: 'all', label: 'All Dates' },
            { id: 'urgent', label: 'Urgent (≤ 14 Days)' },
            { id: 'FAMLI', label: 'FAMLI Paid Leave' },
            { id: 'SDAT', label: 'SDAT Annual Filings' },
            { id: 'Clerk Licenses', label: 'Circuit Court Licenses' },
            { id: 'Custom', label: 'My Custom Tasks' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterProgram(cat.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterProgram === cat.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Critical Highlight Alert: FAMLI DOI */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-900 rounded-lg shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Time-Critical Notice
              </span>
              <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                Due Nov 15, 2026 (12 Days)
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Maryland FAMLI: Declaration of Intent (DOI) Deadline
            </h2>
            <p className="text-xs text-slate-700 max-w-3xl">
              Employers seeking a qualifying private-plan seeding-period contribution exemption must file their Declaration of Intent with the Maryland Department of Labor by November 15, 2026. Review official guidance before submitting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={() => onSelectPortalKey('S8')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-200/80 hover:bg-amber-300 rounded-md transition-colors cursor-pointer"
          >
            <span>FAMLI Portal [S8]</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onOpenPdfPage(6)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
          >
            Guide Page 6
          </button>
        </div>
      </div>

      {/* Deadlines Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDeadlines.map((d) => {
          const isDone = d.completed;

          return (
            <div
              key={d.id}
              className={`bg-white rounded-xl border p-4.5 transition-all duration-150 flex flex-col justify-between ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                  : d.urgencyLevel === 'critical'
                  ? 'border-rose-300 shadow-xs'
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {d.program}
                    </span>
                    {d.isCustom && (
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        Custom
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {d.diffDays < 0 ? (
                      <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        Passed
                      </span>
                    ) : d.diffDays <= 14 ? (
                      <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{d.diffDays} days left</span>
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {d.diffDays} days
                      </span>
                    )}

                    {d.isCustom && (
                      <button
                        onClick={() => onDeleteDeadline(d.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Delete custom deadline"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {d.dateStr}
                  </span>
                </div>

                <h3 className={`text-sm sm:text-base font-bold mb-1.5 ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                  {d.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {d.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {d.sourceKey && (
                    <button
                      onClick={() => onSelectPortalKey(d.sourceKey!)}
                      className="font-mono font-bold text-amber-700 hover:underline cursor-pointer"
                    >
                      [{d.sourceKey}] Portal
                    </button>
                  )}
                  {d.pdfPage && (
                    <button
                      onClick={() => onOpenPdfPage(d.pdfPage!)}
                      className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Guide pg. {d.pdfPage}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onToggleCompleteDeadline(d.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <CheckCircle className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Deadline Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add Compliance Deadline</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deadline Title *</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. County Health Department Inspection"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={customProgram}
                    onChange={(e) => setCustomProgram(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                  >
                    <option value="Custom">Custom / Local</option>
                    <option value="Clerk Licenses">Circuit Court License</option>
                    <option value="SDAT">SDAT / Corporate</option>
                    <option value="Taxes">Taxes & Revenue</option>
                    <option value="FAMLI">FAMLI / Labor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="e.g. Inspect fire exits, commercial hood ventilation, and test emergency lighting."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer shadow-xs"
                >
                  Save Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
