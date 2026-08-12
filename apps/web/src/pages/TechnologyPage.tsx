import React from 'react';
import { Activity, Radio, Cpu, Database, BrainCircuit, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { SystemArchitectureVisual } from '@/components/visualizations/SystemArchitectureVisual';

export const TechnologyPage: React.FC = () => {
  return (
    <div>
      <Section variant="grid" className="py-16 md:py-20">
        <Container>
          <div className="space-y-6 max-w-3xl">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              Technical Deep Dive
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-50">
              Dhara AI System Architecture
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              A comprehensive breakdown of field sensing nodes, LoRaWAN wireless telemetry
              boundaries, Node.js Express cloud microservices, and deterministic safety interlocks.
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-12">
        <Container>
          <SystemArchitectureVisual />
        </Container>
      </Section>

      {/* DETAILED TECH PILLARS */}
      <Section variant="dark">
        <Container>
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                Core Technology Stack
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Layered technical architecture designed for scalability, low-latency telemetry, and
                hardware isolation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                title="1. Field Intelligence"
                description="RS485 Modbus soil sensors taking high-frequency readings of Nitrogen, Phosphorus, Potassium, pH, EC, Moisture, and Temperature directly at crop root depths."
                icon={Activity}
                badge="SENSING"
              />

              <FeatureCard
                title="2. LoRaWAN Boundary"
                description="SX1262 transceiver modules communicating over sub-GHz LoRaWAN protocol to bypass rural cellular connectivity dead zones and minimize battery drain."
                icon={Radio}
                badge="WIRELESS"
              />

              <FeatureCard
                title="3. ESP32-S3 Substation Gateway"
                description="Central hub gateway operating ChirpStack packet forwarding, local relay scheduling queues, and hardware emergency safety interlocks."
                icon={Cpu}
                badge="SUBSTATION"
              />

              <FeatureCard
                title="4. Express REST API & TimescaleDB"
                description="Layered TypeScript backend enforcing Routes -> Controllers -> Services -> Repositories -> Database separation with TimescaleDB time-series compatibility."
                icon={Database}
                badge="BACKEND"
              />

              <FeatureCard
                title="5. AI Decision Engine Boundary"
                description="Isolated machine learning advisory service generating zone-specific evapotranspiration calculations and precise water volume suggestions."
                icon={BrainCircuit}
                badge="AI ENGINE"
              />

              <FeatureCard
                title="6. Deterministic Safety Pipeline"
                description="Rule validation layer ensuring high-voltage pumps, zone solenoid valves, and fertigation channels cannot exceed physical pressure or runtime safety boundaries."
                icon={ShieldCheck}
                badge="SAFETY GATEWAY"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* DATA FLOW SUMMARY */}
      <Section variant="default" className="py-16">
        <Container size="narrow">
          <div className="p-6 sm:p-8 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-4 font-mono text-xs text-slate-300">
            <h3 className="text-sm font-bold text-slate-100 font-sans">
              Strict Physical Control Pipeline Principle
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              High-voltage pumps, valves, and chemical dosing injectors are NEVER directly triggered
              by the web browser interface. Commands strictly follow authentication, deterministic
              rule check, audit logging, and signed MQTT dispatch.
            </p>
            <div className="p-4 rounded-xl bg-dhara-dark border border-slate-800 text-emerald-400 overflow-x-auto">
              Web Client &rarr; REST API &rarr; Auth Check &rarr; Safety Engine &rarr; Audit Log
              &rarr; MQTT Downlink &rarr; Substation Relays
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
