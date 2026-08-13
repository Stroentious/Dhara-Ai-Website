import React from 'react';

export const StatCard = ({ title, value, unit, icon: Icon, description }) => {
  return (
    <div className="agri-card p-5 hover:border-emerald-500/50 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-agri-900 border border-emerald-200 dark:border-agri-800 text-emerald-600 dark:text-emerald-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</span>
        {unit && <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400/80">{unit}</span>}
      </div>
      {description && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex items-center gap-1">
          {description}
        </p>
      )}
    </div>
  );
};
