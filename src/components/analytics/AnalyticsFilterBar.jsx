import React from 'react';
import { Filter, Calendar, Sprout, Layers } from 'lucide-react';

export const AnalyticsFilterBar = ({ zones, poles, selectedZone, selectedPole, timeRange, onFilterChange }) => {
  const filteredPoles = selectedZone === 'all'
    ? poles
    : poles.filter(p => p.zoneId === selectedZone);

  return (
    <div className="agri-card p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
        <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        Analytics Filters
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Select Zone */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-agri-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-agri-800 text-xs">
          <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-slate-500 dark:text-slate-400 font-medium">Zone:</span>
          <select
            value={selectedZone}
            onChange={(e) => onFilterChange('zoneId', e.target.value)}
            className="bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">All Zones</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id} className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">{z.name}</option>
            ))}
          </select>
        </div>

        {/* Select Pole */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-agri-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-agri-800 text-xs">
          <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-slate-500 dark:text-slate-400 font-medium">Node / Pole:</span>
          <select
            value={selectedPole}
            onChange={(e) => onFilterChange('poleId', e.target.value)}
            className="bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">All Poles</option>
            {filteredPoles.map((p) => (
              <option key={p.id} value={p.id} className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">{p.name} ({p.zoneName.split('—')[0].trim()})</option>
            ))}
          </select>
        </div>

        {/* Time Range */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-agri-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-agri-800 text-xs">
          <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-slate-500 dark:text-slate-400 font-medium">Time Horizon:</span>
          <select
            value={timeRange}
            onChange={(e) => onFilterChange('timeRange', e.target.value)}
            className="bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="24h" className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">Last 24 Hours</option>
            <option value="7d" className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">Last 7 Days</option>
            <option value="30d" className="bg-white dark:bg-agri-900 text-slate-900 dark:text-white">Last 30 Days</option>
          </select>
        </div>
      </div>
    </div>
  );
};
