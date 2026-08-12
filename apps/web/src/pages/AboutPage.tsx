import React from 'react';
import { Sprout, Target } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';

export const AboutPage: React.FC = () => {
  return (
    <div>
      <Section variant="grid" className="py-16 md:py-20">
        <Container>
          <div className="space-y-4 max-w-3xl">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              About Dhara AI
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-50 tracking-tight">
              Precision Irrigation Engineering
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Dhara AI is built to transform agricultural irrigation from fixed guesswork into an
              intelligent, data-driven system powered by real-time soil telemetry and deterministic
              safety guardrails.
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <Target className="h-5 w-5" />
                <span>The Problem We Address</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Agriculture consumes over 70% of global freshwater withdrawals. Traditional
                irrigation systems operate on arbitrary timer schedules, leading to over-watering in
                low-evaporation periods, under-watering during heat spikes, and fertilizer leaching
                into groundwater.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <Sprout className="h-5 w-5" />
                <span>Our Engineering Approach</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                We combine RS485 soil probes (measuring NPK, pH, EC, moisture, and temperature),
                ESP32-C3 LoRaWAN field poles, and ESP32-S3 substation gateways with a layered
                TypeScript cloud backend and deterministic safety validation.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="dark" className="py-16">
        <Container size="narrow">
          <div className="p-8 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface text-center space-y-4">
            <Badge variant="outline" className="border-purple-500/30 text-purple-400">
              Platform Vision
            </Badge>
            <h2 className="text-2xl font-extrabold text-slate-100">Our Vision</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
              To provide agricultural producers, research institutions, and farm managers with a
              reliable, commercial-grade precision agriculture platform that maximizes crop yield
              while conserving vital water and nutrient resources.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
};
