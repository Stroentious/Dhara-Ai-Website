import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Droplets, Thermometer, BatteryCharging, Clock } from 'lucide-react';

export const PoleCard = ({ pole, onClick }) => {
  return (
    <div
      onClick={() => onClick(pole.id)}
      className="agri-card p-5 hover:border-emerald-500 cursor-pointer transition-all hover:scale-[1.01] group"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-agri-850">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-agri-950 border border-slate-200 dark:border-agri-800 flex items-center justify-center font-black text-sm text-emerald-600 dark:text-emerald-400 group-hover:border-emerald-500">
            {pole.name.replace('Pole ', 'P')}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">{pole.name}</h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">{pole.zoneName}</span>
          </div>
        </div>
        <StatusBadge status={pole.status} size="sm" />
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 gap-3 my-4">
        <div className="bg-slate-50 dark:bg-agri-950/80 p-3 rounded-lg border border-slate-200 dark:border-agri-850">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Moisture</span>
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {pole.telemetry.moisture}<span className="text-xs font-semibold text-blue-500">%</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-agri-950/80 p-3 rounded-lg border border-slate-200 dark:border-agri-850">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Temp</span>
            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {pole.telemetry.temperature}<span className="text-xs font-semibold text-amber-500">°C</span>
          </div>
        </div>
      </div>

      {/* NPK Summary Pills */}
      <div className="bg-slate-50 dark:bg-agri-950/60 p-3 rounded-lg border border-slate-200 dark:border-agri-850 mb-3 text-xs">
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1.5">NPK Nutrient Levels (mg/kg)</span>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white dark:bg-agri-900 py-1.5 px-2 rounded border border-slate-200 dark:border-agri-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">N</span>
            <span className="font-bold text-slate-900 dark:text-white">{pole.telemetry.nitrogen}</span>
          </div>
          <div className="bg-white dark:bg-agri-900 py-1.5 px-2 rounded border border-slate-200 dark:border-agri-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">P</span>
            <span className="font-bold text-slate-900 dark:text-white">{pole.telemetry.phosphorus}</span>
          </div>
          <div className="bg-white dark:bg-agri-900 py-1.5 px-2 rounded border border-slate-200 dark:border-agri-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">K</span>
            <span className="font-bold text-slate-900 dark:text-white">{pole.telemetry.potassium}</span>
          </div>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-agri-850">
        <span className="flex items-center gap-1">
          <BatteryCharging className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          {pole.battery}% ({pole.solarStatus})
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          {pole.lastUpdated}
        </span>
      </div>
    </div>
  );
};
