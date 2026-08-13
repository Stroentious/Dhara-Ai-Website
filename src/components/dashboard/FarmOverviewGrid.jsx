import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Sprout, Droplets, BatteryCharging } from 'lucide-react';

export const FarmOverviewGrid = ({ zones, onSelectPole }) => {
  return (
    <div className="agri-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Farm Network & Zone Mapping
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time status of distributed Field Nodes (Poles)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-slate-50 dark:bg-agri-950/80 rounded-xl border border-slate-200 dark:border-agri-850 p-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-agri-850 pb-3 mb-3">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{zone.name}</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400/80 font-medium">{zone.cropType} • {zone.soilType}</p>
              </div>
              <StatusBadge status={zone.status} size="sm" />
            </div>

            {/* Poles list */}
            <div className="space-y-2.5">
              {zone.poles.map((pole) => (
                <button
                  key={pole.id}
                  onClick={() => onSelectPole(pole.id)}
                  className="w-full text-left bg-white dark:bg-agri-900/90 hover:bg-slate-100 dark:hover:bg-agri-850 border border-slate-200 dark:border-agri-800 hover:border-emerald-500 p-3 rounded-lg transition-all flex items-center justify-between group shadow-sm dark:shadow-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-agri-950 border border-slate-200 dark:border-agri-800 flex items-center justify-center font-bold text-xs text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                      {pole.name.replace('Pole ', 'P')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300">{pole.name}</span>
                        <StatusBadge status={pole.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          {pole.telemetry.moisture}%
                        </span>
                        <span className="flex items-center gap-1">
                          <BatteryCharging className="w-3 h-3 text-emerald-500" />
                          {pole.battery}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform">
                    View Details &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
