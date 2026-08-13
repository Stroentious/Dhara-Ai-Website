import React from 'react';
import { PumpControlWidget } from '../components/irrigation/PumpControlWidget';
import { ModeToggleWidget } from '../components/irrigation/ModeToggleWidget';
import { RecommendationWidget } from '../components/irrigation/RecommendationWidget';
import { Droplets } from 'lucide-react';

export const IrrigationPage = ({ systemControl, zones, onTogglePump, onSelectZone, onToggleMode, onApplyRecommendation }) => {
  return (
    <div className="space-y-6">
      {/* System Status Summary Banner */}
      <div className="agri-card p-6 bg-gradient-to-r from-emerald-50/60 via-white to-slate-50 dark:from-agri-900 dark:to-agri-950 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Droplets className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Irrigation & Fertigation Controller</h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                {systemControl.mode} MODE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ESP32-S3 Substation Relay & Solenoid Valve Management</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="bg-white dark:bg-agri-950 p-2.5 rounded-lg border border-slate-200 dark:border-agri-850">
            <span className="text-[11px] text-slate-500 block">Pump State</span>
            <span className={`font-extrabold ${systemControl.pumpStatus === 'ON' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
              {systemControl.pumpStatus}
            </span>
          </div>

          <div className="bg-white dark:bg-agri-950 p-2.5 rounded-lg border border-slate-200 dark:border-agri-850">
            <span className="text-[11px] text-slate-500 block">Active Zone</span>
            <span className="font-bold text-slate-900 dark:text-white">{systemControl.activeZoneName?.split('—')[0].trim()}</span>
          </div>

          <div className="bg-white dark:bg-agri-950 p-2.5 rounded-lg border border-slate-200 dark:border-agri-850">
            <span className="text-[11px] text-slate-500 block">Last Cycle</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{systemControl.lastIrrigated}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls and Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PumpControlWidget
          systemControl={systemControl}
          zones={zones}
          onTogglePump={onTogglePump}
          onSelectZone={onSelectZone}
        />
        <ModeToggleWidget
          currentMode={systemControl.mode}
          onToggleMode={onToggleMode}
        />
      </div>

      {/* AI Recommendation Widget */}
      <RecommendationWidget
        recommendation={systemControl.recommendation}
        onApplyRecommendation={onApplyRecommendation}
      />
    </div>
  );
};
