import React from 'react';

export const StatusBadge = ({ status, size = 'md' }) => {
  let badgeStyle = 'bg-emerald-950/80 text-emerald-400 border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-800';
  let dotStyle = 'bg-emerald-500';

  const s = String(status).toLowerCase();

  if (s === 'offline' || s === 'critical') {
    badgeStyle = 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-800';
    dotStyle = 'bg-rose-500';
  } else if (s === 'warning' || s === 'attention needed') {
    badgeStyle = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-800';
    dotStyle = 'bg-amber-500';
  } else if (s === 'on') {
    badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-600 animate-pulse';
    dotStyle = 'bg-emerald-500';
  } else if (s === 'off') {
    badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700';
    dotStyle = 'bg-slate-500';
  } else if (s === 'online' || s === 'optimal') {
    badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-800';
    dotStyle = 'bg-emerald-500';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${badgeStyle} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`}></span>
      {status}
    </span>
  );
};
