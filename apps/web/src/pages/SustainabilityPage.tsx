import React from 'react';
import { Droplets, Sun, Sprout } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { FeatureCard } from '@/components/ui/FeatureCard';

export const SustainabilityPage: React.FC = () => {
  return (
    <div>
      <Section variant="grid" className="py-16 md:py-20">
        <Container>
          <div className="space-y-4 max-w-3xl">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              Resource Stewardship
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-50 tracking-tight">
              Water Intelligence & Sustainable Agriculture
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Dhara AI is engineered to improve agricultural water-use efficiency and reduce
              fertilizer runoff through continuous root-zone soil telemetry.
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Targeted Water Application"
              description="Designed to reduce unnecessary irrigation by triggering water valves only when soil moisture depletion curves cross agronomic deficit thresholds."
              icon={Droplets}
              badge="WATER CONSERVATION"
            />

            <FeatureCard
              title="Solar-Powered Off-Grid Nodes"
              description="Field sensor poles utilize integrated monocrystalline solar panels and rechargeable LiFePO4 batteries for clean, low-maintenance field operation."
              icon={Sun}
              badge="SOLAR POWERED"
            />

            <FeatureCard
              title="Nutrient Leaching Reduction"
              description="Monitoring Electrical Conductivity (EC) and soil pH helps prevent over-fertilization, protecting local groundwater aquifers from nitrate runoff."
              icon={Sprout}
              badge="SOIL PROTECTION"
            />
          </div>
        </Container>
      </Section>

      <Section variant="dark" className="py-16">
        <Container size="narrow">
          <div className="p-8 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-100">Sustainable Resource Philosophy</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
              By combining real-time soil telemetry with context-aware scheduling, Dhara AI aims to
              help farms optimize resource usage, potentially improving crop quality while
              conserving local water supplies.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
};
