import React, { useState } from 'react';
import { Radio, Activity, Droplets, Zap, CheckCircle2, RefreshCw, Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const InteractiveFarmStatus: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const zonesData = [
    {
      id: 1,
      name: 'Zone 01 - Wheat Field',
      moisture: '32%',
      temp: '26.4°C',
      ph: '6.7',
      ec: '1.4 dS/m',
      status: 'Optimal',
      npk: '45 / 20 / 135',
    },
    {
      id: 2,
      name: 'Zone 02 - Corn Sector',
      moisture: '24%',
      temp: '29.1°C',
      ph: '6.5',
      ec: '1.2 dS/m',
      status: 'Attention Required',
      npk: '30 / 14 / 110',
    },
    {
      id: 3,
      name: 'Zone 03 - Vineyard West',
      moisture: '41%',
      temp: '24.8°C',
      ph: '7.1',
      ec: '1.6 dS/m',
      status: 'Irrigated Recently',
      npk: '55 / 25 / 160',
    },
  ];

  const currentZone = zonesData.find((z) => z.id === selectedZone) || zonesData[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="p-6 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-6 shadow-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-100">Farm Operational State</h3>
              <Badge
                variant="outline"
                className="border-amber-500/40 text-amber-300 bg-amber-500/10 font-mono text-[10px]"
              >
                DEMO DATA
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Interactive simulation of field telemetry & device connectivity.
            </p>
          </div>
        </div>

        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs space-x-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh View</span>
        </Button>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded-xl bg-dhara-dark border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Substation</span>
            <Radio className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-slate-100 mt-1">ONLINE</div>
          <div className="text-[10px] text-emerald-400">ESP32-S3 Gateway</div>
        </div>

        <div className="p-3.5 rounded-xl bg-dhara-dark border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Field Poles</span>
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-slate-100 mt-1">12 / 12</div>
          <div className="text-[10px] text-emerald-400">100% Signal Coverage</div>
        </div>

        <div className="p-3.5 rounded-xl bg-dhara-dark border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Valves</span>
            <Droplets className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-slate-100 mt-1">3 / 8</div>
          <div className="text-[10px] text-cyan-400">Scheduled Flow</div>
        </div>

        <div className="p-3.5 rounded-xl bg-dhara-dark border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Safety Interlock</span>
            <Zap className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400 mt-1">ACTIVE</div>
          <div className="text-[10px] text-slate-400">Pressure Rules Passed</div>
        </div>
      </div>

      {/* Zone Switcher */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-300">Select Zone to View Telemetry:</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {zonesData.map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                selectedZone === z.id
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-slate-100 font-semibold'
                  : 'border-slate-800 bg-dhara-dark text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{z.name}</span>
                {selectedZone === z.id && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Zone Deep Dive */}
      <div className="p-4 rounded-xl bg-dhara-dark border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">{currentZone.name} Readings</span>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold">
            {currentZone.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-500">Soil Moisture</div>
            <div className="text-sm font-bold text-cyan-400 mt-0.5">{currentZone.moisture}</div>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-500">Soil Temperature</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">{currentZone.temp}</div>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-500">Soil pH</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">{currentZone.ph}</div>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-500">Conductivity (EC)</div>
            <div className="text-sm font-bold text-indigo-400 mt-0.5">{currentZone.ec}</div>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-slate-500">N - P - K (mg/kg)</div>
            <div className="text-xs font-bold text-slate-200 mt-0.5">{currentZone.npk}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
