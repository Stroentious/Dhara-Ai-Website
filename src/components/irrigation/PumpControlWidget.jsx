import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Droplets, Play, Square } from 'lucide-react';

export const PumpControlWidget = ({ systemControl, zones, onTogglePump, onSelectZone }) => {
  const { pumpStatus, activeZoneId, activeZoneName, lastIrrigated } = systemControl;

  return (
    <div className="agri-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-agri-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              Water Pump & Contactor Relay
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ESP32-S3 Substation Hardware Interface</p>
          </div>
          <StatusBadge status={pumpStatus} />
        </div>

        {/* Zone Selector */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Target Irrigation Zone</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => onSelectZone(zone.id)}
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  activeZoneId === zone.id
                    ? 'bg-emerald-50 dark:bg-agri-850 border-emerald-500 text-slate-900 dark:text-white font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-agri-950/60 border-slate-200 dark:border-agri-850 text-slate-600 dark:text-slate-400 hover:border-emerald-300'
                }`}
              >
                <span className="block font-semibold text-slate-900 dark:text-white truncate">{zone.name.split('—')[0].trim()}</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400/80 block mt-0.5">Avg: {zone.avgMoisture}% Moisture</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Control Action Buttons */}
      <div className="pt-4 border-t border-slate-100 dark:border-agri-800 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-600 dark:text-slate-400 block">Active Zone: <b className="text-slate-900 dark:text-white">{activeZoneName}</b></span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Last Run: {lastIrrigated}</span>
        </div>

        <div className="flex items-center gap-3">
          {pumpStatus === 'OFF' ? (
            <button
              onClick={() => onTogglePump('ON')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              START PUMP
            </button>
          ) : (
            <button
              onClick={() => onTogglePump('OFF')}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-600/30 transition-all hover:scale-105 animate-pulse"
            >
              <Square className="w-4 h-4 fill-white" />
              STOP PUMP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
