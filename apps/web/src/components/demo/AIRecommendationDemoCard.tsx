import React from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Thermometer,
  Droplets,
  CloudRain,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const AIRecommendationDemoCard: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900 via-dhara-surface to-slate-950 space-y-5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">AI Decision Engine Recommendation</h4>
            <p className="text-[11px] text-slate-400">
              Soil moisture deficit prediction & irrigation scheduling.
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="border-amber-500/40 text-amber-300 bg-amber-500/10 font-mono text-[10px]"
        >
          EXAMPLE / DEMONSTRATION
        </Badge>
      </div>

      {/* Recommendation Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-dhara-dark border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Target Field</span>
            <span className="text-xs font-mono font-bold text-emerald-400">Zone 03 (Wheat)</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center">
                <Droplets className="h-3.5 w-3.5 mr-1.5 text-cyan-400" /> Current Soil Moisture
              </span>
              <span className="text-slate-100 font-bold">27% VWC</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center">
                <Droplets className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> Target Moisture Range
              </span>
              <span className="text-slate-100">40% - 55%</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center">
                <Thermometer className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> Ambient Temperature
              </span>
              <span className="text-slate-100">31°C</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center">
                <CloudRain className="h-3.5 w-3.5 mr-1.5 text-indigo-400" /> Rain Forecast (6h)
              </span>
              <span className="text-slate-100">8% Probability</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-dhara-dark border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-1">Generated Action</div>
            <div className="text-sm font-bold text-emerald-400">
              Irrigate Zone 03 for 45 Minutes
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Calculated deficit requires ~1,200 Liters water volume. Recommended optimal execution
              window: 18:30 hrs.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="text-[11px] font-mono text-purple-400">Model Confidence: 91%</div>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs space-x-1"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Simulate Safety Review</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Safety Interlock Note */}
      <div className="p-3 rounded-lg bg-slate-950 border border-teal-500/20 text-[11px] font-mono text-teal-300 flex items-center space-x-2">
        <CheckCircle2 className="h-4 w-4 text-teal-400 flex-shrink-0" />
        <span>
          Safety Interlock: AI recommendations never execute directly without passing deterministic
          valve pressure & max run-time checks.
        </span>
      </div>
    </div>
  );
};
