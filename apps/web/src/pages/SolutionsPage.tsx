import React from 'react';
import { Droplets, Sprout, Layers, BrainCircuit, Zap, Activity, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { FeatureCard } from '@/components/ui/FeatureCard';

export const SolutionsPage: React.FC = () => {
  const solutions = [
    {
      title: 'Precision Irrigation Management',
      desc: 'Eliminate over-watering and dry spots by applying water strictly when and where root zone volumetric water content drops below crop thresholds.',
      icon: Droplets,
      badge: 'WATER PRECISION',
    },
    {
      title: 'Real-Time Soil Health Diagnostics',
      desc: 'Continuous monitoring of Nitrogen, Phosphorus, Potassium, pH, and Electrical Conductivity prevents nutrient leaching and soil salinization.',
      icon: Sprout,
      badge: 'NUTRIENT MGMT',
    },
    {
      title: 'Multi-Zone Field Segmentation',
      desc: 'Divide large fields into distinct micro-zones tailored to soil type, slope, and specific crop variety water demand curves.',
      icon: Layers,
      badge: 'ZONE CONTROL',
    },
    {
      title: 'Automated Fertigation Dosing',
      desc: 'Inject liquid fertilizer mixes directly into main irrigation lines during specific watering windows with precise channel ratio control.',
      icon: Zap,
      badge: 'FERTIGATION',
    },
    {
      title: 'AI Advisory & Evapotranspiration',
      desc: 'Leverage micro-climate weather forecasts and crop evapotranspiration calculations to optimize irrigation scheduling.',
      icon: BrainCircuit,
      badge: 'AI ADVISORY',
    },
    {
      title: 'Infrastructure & Device Health',
      desc: 'Monitor solar battery voltage, LoRaWAN signal RSSI, and valve solenoid continuity to catch hardware faults before crop damage occurs.',
      icon: Activity,
      badge: 'DEVICE MONITORS',
    },
  ];

  return (
    <div>
      <Section variant="grid" className="py-16 md:py-20">
        <Container>
          <div className="space-y-4 max-w-3xl">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              Agricultural Solutions
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-50 tracking-tight">
              Precision Agriculture Solutions
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Designed to help commercial farms, orchards, and agricultural research departments
              maximize yield while stewarding vital water and fertilizer resources.
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((s) => (
              <FeatureCard
                key={s.title}
                title={s.title}
                description={s.desc}
                icon={s.icon}
                badge={s.badge}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="dark" className="py-16">
        <Container size="narrow">
          <div className="p-8 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface text-center space-y-4">
            <ShieldCheck className="h-8 w-8 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-slate-100">Enterprise Multi-Tenant Hierarchy</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Dhara AI supports multi-organization accounts, allowing agricultural cooperatives and
              multi-site operations to manage multiple farms and field zones under unified
              role-based access control.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
};
