import React from 'react';
import { Sprout, Droplets, BrainCircuit, Radio, Activity, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';

export const FeaturesPage: React.FC = () => {
  const featureGroups = [
    {
      category: 'SOIL INTELLIGENCE',
      icon: Sprout,
      color: 'text-emerald-400',
      items: [
        '7-Parameter soil telemetry (N, P, K, pH, EC, Moisture, Temperature)',
        'Root zone depth profile monitoring via RS485 Modbus probes',
        'Historical nutrient leaching and soil salinization trend analytics',
        'Automated sensor calibration drift diagnostic alerts',
      ],
    },
    {
      category: 'SMART IRRIGATION',
      icon: Droplets,
      color: 'text-cyan-400',
      items: [
        'Micro-zone level solenoid valve and pump actuation',
        'Context-aware watering duration schedules',
        'Deterministic pressure limit & dry-run interlock validation',
        'Multi-channel fertigation liquid fertilizer injection',
      ],
    },
    {
      category: 'AI ADVISORY ENGINE',
      icon: BrainCircuit,
      color: 'text-purple-400',
      items: [
        'Evapotranspiration ($ET_c$) calculation engine',
        'Weather forecast integration (Rain probability & thermal index)',
        'Confidence-scored irrigation recommendation cards',
        'Safety interlock boundary (AI recommendations require safety clearance)',
      ],
    },
    {
      category: 'DEVICE MANAGEMENT',
      icon: Radio,
      color: 'text-amber-400',
      items: [
        'ESP32-C3 Field Pole solar voltage & battery health tracking',
        'LoRaWAN wireless signal strength (RSSI & SNR) diagnostics',
        'ESP32-S3 Substation hardware uptime monitoring',
        'OTA firmware update boundary & device pairing registry',
      ],
    },
    {
      category: 'ANALYTICS & AUDIT LOGS',
      icon: Activity,
      color: 'text-indigo-400',
      items: [
        'Interactive telemetry trend charts powered by Recharts',
        'Comprehensive physical command audit logging for all actuator events',
        'Water consumption volume reports by zone and crop cycle',
        'Multi-tenant role-based security access management',
      ],
    },
  ];

  return (
    <div>
      <Section variant="grid" className="py-16 md:py-20">
        <Container>
          <div className="space-y-4 max-w-3xl">
            <Badge variant="outline" className="border-purple-500/30 text-purple-400">
              Platform Capabilities
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-50 tracking-tight">
              Dhara AI Feature Directory
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore the complete feature matrix spanning soil telemetry, smart actuation, AI
              advisory guardrails, and hardware device health monitoring.
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-16">
        <Container>
          <div className="space-y-10">
            {featureGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.category}
                  className="p-6 sm:p-8 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-4"
                >
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                    <div
                      className={`h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center ${group.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <h2 className="text-base font-bold text-slate-100 tracking-wider font-mono">
                      {group.category}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {group.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-2.5 p-3 rounded-lg bg-dhara-dark border border-slate-800/80"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>
    </div>
  );
};
