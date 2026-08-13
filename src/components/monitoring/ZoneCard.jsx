import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Sprout, Layers, Droplets } from 'lucide-react';

export const ZoneCard = ({ zone, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(zone.id)}
      className={`agri-card p-5 cursor-pointer transition-all ${
        isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40 dark:bg-agri-900 shadow-md' : 'hover:border-emerald-500/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-agri-950 border border-slate-200 dark:border-agri-800 text-emerald-600 dark:text-emerald-400">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{zone.name}</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400/80 font-medium">{zone.cropType} • {zone.soilType}</p>
          </div>
        </div>
        <StatusBadge status={zone.status} size="sm" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-agri-850 text-xs">
        <div className="bg-slate-50 dark:bg-agri-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-agri-850">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Nodes (Poles)</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {zone.poleCount} Field Nodes
          </span>
        </div>
        <div className="bg-slate-50 dark:bg-agri-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-agri-850">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Avg Soil Moisture</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300 flex items-center gap-1 mt-0.5">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            {zone.avgMoisture}%
          </span>
        </div>
      </div>
    </div>
  );
};
