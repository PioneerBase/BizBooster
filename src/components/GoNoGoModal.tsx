import React from 'react';
import { X, CheckCircle2, AlertOctagon, ShieldCheck, Printer, FileText } from 'lucide-react';
import { ChecklistItem } from '../types/compliance';

interface GoNoGoModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ChecklistItem[];
  onToggleItem: (id: string) => void;
  businessName: string;
}

export const GoNoGoModal: React.FC<GoNoGoModalProps> = ({
  isOpen,
  onClose,
  items,
  onToggleItem,
  businessName,
}) => {
  if (!isOpen) return null;

  const goNoGoItems = items.filter((i) => i.sectionId === 'go_no_go');
  const completedCount = goNoGoItems.filter((i) => i.status === 'completed').length;
  const isAllComplete = completedCount === goNoGoItems.length && goNoGoItems.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Field Guide Gatekeeper Review</span>
              <span aria-hidden="true">·</span>
              <span>Guide Page 7</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Opening-Day Go / No-Go Review
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Do not open to the public or commence commercial activities until all five statutory gates are confirmed effective.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Status Verdict Banner */}
        <div
          className={`p-5 rounded-xl border flex items-center gap-4 ${
            isAllComplete
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-950'
          }`}
        >
          {isAllComplete ? (
            <ShieldCheck className="w-10 h-10 text-emerald-600 shrink-0" />
          ) : (
            <AlertOctagon className="w-10 h-10 text-rose-600 shrink-0" />
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Launch Gate Verdict:
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/80">
                {completedCount} / {goNoGoItems.length} Gates Verified
              </span>
            </div>
            <div className="text-lg font-bold mt-0.5">
              {isAllComplete ? 'CLEARED FOR OPENING' : 'HOLD: PRE-OPENING ITEMS REMAIN UNFULFILLED'}
            </div>
            <p className="text-xs opacity-90 mt-1">
              {isAllComplete
                ? `All statutory prerequisites, insurance binders, and local approvals are active for ${businessName || 'your business'}.`
                : 'Maryland state law prohibits operating unapproved premises or employing uninsured staff. Resolve all pending items.'}
            </p>
          </div>
        </div>

        {/* Gatekeeper Checkpoints */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Mandatory Gatekeeper Criteria:
          </div>

          {goNoGoItems.map((item, idx) => {
            const isCompleted = item.status === 'completed';

            return (
              <div
                key={item.id}
                onClick={() => onToggleItem(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      isCompleted ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                    }`}
                  />
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Gate 0{idx + 1}: {item.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isCompleted ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 font-medium cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Readiness Certificate</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};
