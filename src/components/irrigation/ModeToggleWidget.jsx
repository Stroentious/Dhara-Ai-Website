import React from 'react';
import { Sliders, Cpu, UserCheck } from 'lucide-react';

export const ModeToggleWidget = ({ currentMode, onToggleMode }) => {
  const isAuto = currentMode === 'AUTOMATIC';

  return (
    <div className="agri-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Automation Strategy
          </h3>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{currentMode} MODE</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => onToggleMode('MANUAL')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              !isAuto
                ? 'bg-emerald-50 dark:bg-agri-850 border-emerald-500 text-slate-900 dark:text-white font-bold shadow-sm'
                : 'bg-slate-50 dark:bg-agri-950/60 border-slate-200 dark:border-agri-850 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <UserCheck className={`w-5 h-5 mb-2 ${!isAuto ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
            <span className="block text-sm font-bold text-slate-900 dark:text-white">Manual Control</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Operator manually toggles relays</span>
          </button>

          <button
            onClick={() => onToggleMode('AUTOMATIC')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              isAuto
                ? 'bg-emerald-50 dark:bg-agri-850 border-emerald-500 text-slate-900 dark:text-white font-bold shadow-sm'
                : 'bg-slate-50 dark:bg-agri-950/60 border-slate-200 dark:border-agri-850 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Cpu className={`w-5 h-5 mb-2 ${isAuto ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
            <span className="block text-sm font-bold text-slate-900 dark:text-white">Automatic AI Mode</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Sensor-triggered fertigation</span>
          </button>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-slate-50 dark:bg-agri-950/60 border border-slate-200 dark:border-agri-850 text-xs text-slate-600 dark:text-slate-300">
        {isAuto ? (
          <p className="flex items-start gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">●</span>
            Automatic fertigation triggers pumps when soil moisture drops below defined thresholds.
          </p>
        ) : (
          <p className="flex items-start gap-2">
            <span className="text-amber-500 font-bold">●</span>
            Manual override active. Automated recommendations will require manual confirmation.
          </p>
        )}
      </div>
    </div>
  );
};
