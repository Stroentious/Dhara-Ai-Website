import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Bell, CheckCircle, Clock, ShieldAlert, Filter } from 'lucide-react';

export const AlertListTable = ({ alerts, selectedSeverity, selectedStatus, onFilterChange, onAcknowledge }) => {
  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="agri-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Filter Alerts
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Severity Filter */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-agri-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-agri-800 text-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => onFilterChange('severity', e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">All Severities</option>
              <option value="critical" className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">Critical</option>
              <option value="warning" className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">Warning</option>
              <option value="info" className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">Information</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-agri-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-agri-800 text-xs">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">All Statuses</option>
              <option value="active" className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">Active</option>
              <option value="acknowledged" className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">Acknowledged</option>
              <option value="resolved" className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alert List Cards */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="agri-card p-12 text-center text-slate-500 dark:text-slate-400">
            <Bell className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">No alerts found matching the selected filters.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="agri-card p-5 hover:border-emerald-500 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <StatusBadge status={alert.severity.toUpperCase()} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{alert.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{alert.description}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Zone: <b className="text-emerald-600 dark:text-emerald-400">{alert.zoneName}</b></span>
                    <span>Pole: <b className="text-emerald-600 dark:text-emerald-400">{alert.poleId.toUpperCase()}</b></span>
                    <span>Logged: {alert.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-agri-850 justify-end">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  alert.status === 'active' ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800' :
                  alert.status === 'acknowledged' ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800' :
                  'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800'
                }`}>
                  {alert.status.toUpperCase()}
                </span>

                {alert.status === 'active' && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-agri-850 dark:hover:bg-agri-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-agri-800 flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
