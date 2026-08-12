import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { AIRecommendationDemoCard } from '@/components/demo/AIRecommendationDemoCard';

export const AIPage: React.FC = () => {
  return (
    <div>
      <Section variant="grid" className="py-16 md:py-20">
        <Container>
          <div className="space-y-4 max-w-3xl">
            <Badge variant="outline" className="border-purple-500/30 text-purple-400">
              AI Intelligence
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-50 tracking-tight">
              AI Decision Engine & Advisory Guardrails
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Dhara AI generates zone-specific water and nutrient advisory recommendations by
              evaluating soil moisture depletion, crop growth stages, and micro-climate weather
              forecasts.
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-12">
        <Container>
          <AIRecommendationDemoCard />
        </Container>
      </Section>

      {/* AI ARCHITECTURE DETAILS */}
      <Section variant="dark">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                Decision Pipeline
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                How AI Computes Irrigation Recommendations
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                The AI service boundary receives time-series soil telemetry and combines it with
                agronomic crop water coefficients ($K_c$) and local evapotranspiration ($ET_c$)
                models.
              </p>

              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="p-3 rounded-lg bg-dhara-dark border border-slate-800">
                  1. Telemetry Ingestion: Soil Moisture VWC & Temp
                </div>
                <div className="p-3 rounded-lg bg-dhara-dark border border-slate-800">
                  2. Agronomic Context: Crop Type, Root Depth & Stage
                </div>
                <div className="p-3 rounded-lg bg-dhara-dark border border-slate-800">
                  3. Weather Context: Solar Radiation, Rain Forecast
                </div>
                <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/30 text-purple-300">
                  4. Output: Zone Irrigation Duration & Water Volume
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-4">
              <div className="flex items-center space-x-3 text-teal-400">
                <ShieldCheck className="h-6 w-6" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  The Deterministic Safety Interlock
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Artificial Intelligence models can make probabilistic errors. Therefore, in the
                Dhara AI system, an AI recommendation is strictly advisory. It MUST pass through
                deterministic safety rules before any physical pump or valve command can be
                generated.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                <div className="text-emerald-400 font-bold">Safety Engine Clearance Checklist:</div>
                <div>• Pump Max Continuous Runtime Check: PASSED</div>
                <div>• Main Line Pressure Transducer Limit: PASSED</div>
                <div>• Solenoid Valve Interlock (Prevent closed-pipe deadhead): PASSED</div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
