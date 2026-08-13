import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Bell, ArrowRight } from 'lucide-react';

export const RecentAlertsWidget = ({ alerts, onViewAllAlerts }) => {
  return (
    <div className="agri-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            Recent Farm Alerts
          </h3>
          <button
            onClick={onViewAllAlerts}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
          >
            View All ({alerts.length}) <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {alerts.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              className="p-3 rounded-lg bg-slate-50 dark:bg-agri-950/70 border border-slate-200 dark:border-agri-850 flex items-start justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={alert.severity.toUpperCase()} size="sm" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{alert.title}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{alert.description}</p>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 block">{alert.timestamp} • {alert.zoneName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
