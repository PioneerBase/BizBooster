import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, Clock, ArrowRight, X, Check } from 'lucide-react';
import { STATUTORY_DEADLINES } from '../data/checklistData';

interface AlertBannerProps {
  onViewDeadlines: () => void;
  onOpenPdfPage: (page: number) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  onViewDeadlines,
  onOpenPdfPage,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  // Use the reference date Nov 3, 2026 from the guide or current date
  const now = new Date('2026-11-03T00:00:00');
  
  // Find the most urgent upcoming deadline
  const urgentDeadline = STATUTORY_DEADLINES.find((d) => {
    const dDate = new Date(d.dateStr + 'T23:59:59');
    return dDate >= now && d.isUrgent;
  }) || STATUTORY_DEADLINES[0];

  const targetDate = new Date(urgentDeadline.dateStr + 'T23:59:59');
  const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const handleRequestNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported in your current browser.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
      if (permission === 'granted') {
        new Notification('BizBooster MD Alert Active', {
          body: `Upcoming deadline: ${urgentDeadline.title} on ${urgentDeadline.dateStr} (${diffDays} days away).`,
          icon: '/favicon.ico',
        });
      }
    } catch {
      // ignore
    }
  };

  if (dismissed) {
    return null;
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-amber-500/20 text-amber-900 rounded-md shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Time-Sensitive Notice
              </span>
              <span className="text-xs text-amber-800/80 font-mono font-medium">
                Due {urgentDeadline.dateStr}
              </span>
              <span className="text-xs font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-sm">
                {diffDays} days remaining
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-medium">
              <strong className="font-semibold">{urgentDeadline.title}:</strong> Employers seeking a qualifying private-plan seeding-period exemption must review the Declaration of Intent.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          {notificationStatus !== 'granted' ? (
            <button
              onClick={handleRequestNotifications}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200/80 rounded-md transition-colors cursor-pointer"
              title="Enable browser alerts for upcoming statutory deadlines"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Alerts</span>
            </button>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-100/70 px-2 py-1 rounded-md">
              <Check className="w-3 h-3 text-emerald-700" />
              <span>Alerts Active</span>
            </span>
          )}

          <button
            onClick={() => onOpenPdfPage(urgentDeadline.pdfPage || 6)}
            className="text-xs font-medium text-amber-900 hover:underline flex items-center gap-1 px-2 py-1 cursor-pointer"
          >
            <span>Guide pg. {urgentDeadline.pdfPage || 6}</span>
          </button>

          <button
            onClick={onViewDeadlines}
            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            <span>All Deadlines</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-amber-500/20 cursor-pointer ml-1"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
