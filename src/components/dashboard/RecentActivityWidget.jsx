import React from 'react';
import { Activity, Clock } from 'lucide-react';

export const RecentActivityWidget = ({ poles }) => {
  return (
    <div className="agri-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Recent Sensor Telemetry Feed
        </h3>
        <span className="text-xs text-emerald-600 dark:text-emerald-400/80 font-medium">Live Sync</span>
      </div>

      <div className="space-y-3">
        {poles.map((pole) => (
          <div key={pole.id} className="p-3 rounded-lg bg-slate-50 dark:bg-agri-950/60 border border-slate-200 dark:border-agri-850 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white dark:bg-agri-900 border border-slate-200 dark:border-agri-800 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                {pole.name.replace('Pole ', 'P')}
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">{pole.name} ({pole.zoneName.split('—')[0].trim()})</span>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-0.5">
                  <span>Moisture: <b className="text-emerald-600 dark:text-emerald-300">{pole.telemetry.moisture}%</b></span>
                  <span>Temp: <b className="text-emerald-600 dark:text-emerald-300">{pole.telemetry.temperature}°C</b></span>
                  <span>pH: <b className="text-emerald-600 dark:text-emerald-300">{pole.telemetry.ph}</b></span>
                </div>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {pole.lastUpdated}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
