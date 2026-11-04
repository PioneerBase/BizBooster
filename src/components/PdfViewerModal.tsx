import React from 'react';
import { X, Download, ExternalLink, BookOpen, FileText } from 'lucide-react';

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
  if (!isOpen) return null;

  const pdfUrl = '/public/assets/aistudio/Maryland_Startup_Guide_431a0bbf.pdf';

  const tableOfContents = [
    { page: 1, title: 'Title, Sequence & FAMLI Overview', key: 'pg1' },
    { page: 2, title: 'Master Startup Checklist (Sections A, B, C)', key: 'pg2' },
    { page: 3, title: 'Licensing: Who Issues What? (Trader’s License)', key: 'pg3' },
    { page: 4, title: 'Clerk Application Packet & Permit Tracker', key: 'pg4' },
    { page: 5, title: 'Hiring, Workers’ Compensation & Insurance', key: 'pg5' },
    { page: 6, title: 'FAMLI Readiness: 2026–2028 Rates & Rules', key: 'pg6' },
    { page: 7, title: 'Launch Timeline & Good Standing Filings', key: 'pg7' },
    { page: 8, title: 'Official-Source Directory (S1–S13)', key: 'pg8' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
              <BookOpen className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Maryland Small Business Startup Checklist & Licensing Guide
              </h2>
              <div className="text-[11px] text-slate-500 font-mono">
                Statewide Edition · Prepared November 3, 2026
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              download="Maryland_Startup_Guide_431a0bbf.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Tab</span>
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

        {/* Content Area with Table of Contents & PDF Embed */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Quick Jump Index */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto shrink-0 space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Guide Table of Contents
            </div>
            {tableOfContents.map((item) => (
              <a
                key={item.key}
                href={`${pdfUrl}#page=${item.page}`}
                className={`flex items-start gap-2.5 p-2 rounded-lg text-xs transition-colors hover:bg-slate-200/70 text-slate-700 ${
                  initialPage === item.page ? 'bg-amber-100/70 font-semibold text-amber-900' : ''
                }`}
              >
                <span className="font-mono font-bold text-slate-400 shrink-0">
                  P.{item.page}
                </span>
                <span className="leading-tight">{item.title}</span>
              </a>
            ))}

            <div className="mt-4 pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
              <p><strong>Official Document Path:</strong></p>
              <p className="font-mono text-[10px] break-all bg-white p-1.5 rounded border border-slate-200">
                {pdfUrl}
              </p>
            </div>
          </div>

          {/* Right: Embedded PDF IFrame */}
          <div className="flex-1 bg-slate-100 h-full relative">
            <iframe
              src={`${pdfUrl}#page=${initialPage}`}
              title="Maryland Startup Guide PDF"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
