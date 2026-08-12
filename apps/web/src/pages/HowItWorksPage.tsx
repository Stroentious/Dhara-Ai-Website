import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { SystemArchitectureVisual } from '@/components/visualizations/SystemArchitectureVisual';

export const HowItWorksPage: React.FC = () => {
  const uplinkSteps = [
    {
      title: '1. Root Probe Sensing',
      tech: 'RS485 Modbus Sensor',
      desc: 'Gathers soil moisture, NPK, pH, EC, and temp parameters every 15 minutes.',
    },
    {
      title: '2. Node Packet Encoding',
      tech: 'ESP32-C3 Microcontroller',
      desc: 'Serial payload packed into binary telemetry buffer with solar battery diagnostics.',
    },
    {
      title: '3. Long-Range Transmission',
      tech: 'SX1262 LoRa Module',
      desc: 'Transmits encoded sub-GHz RF packet over distances up to 10km to substation.',
    },
    {
      title: '4. LoRaWAN Packet Ingestion',
      tech: 'ChirpStack Network Server',
      desc: 'Receives wireless frames and routes JSON payloads to Mosquitto MQTT broker.',
    },
  ];

  const processingSteps = [
    {
      title: '5. Backend API Ingestion',
      tech: 'Express REST & WebSockets',
      desc: 'Validates telemetry schema, checks tenant isolation, and stores time-series metrics.',
    },
    {
      title: '6. AI Advisory Calculation',
      tech: 'AI Decision Boundary',
      desc: 'Evaluates evapotranspiration rates ($ET_c$) and crop stress indices.',
    },
    {
      title: '7. Deterministic Safety Validation',
      tech: 'Safety Rules Engine',
      desc: 'Enforces maximum run-time, pipe pressure limits, and pump dry-run prevention.',
    },
  ];

  const downlinkSteps = [
    {
      title: '8. Downlink Command Dispatch',
      tech: 'MQTT Downlink Topic',
      desc: 'Safety-validated actuation token dispatched to specific substation queue.',
    },
    {
      title: '9. Substation Relay Execution',
      tech: 'ESP32-S3 Substation',
      desc: 'Substation verifies command checksum and energizes solenoid valve relays.',
    },
  ];

  return (
    <div>
      <Section variant="grid" className="py-16 md:py-20">
        <Container>
          <div className="space-y-4 max-w-3xl">
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
              Data Pathway
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-50 tracking-tight">
              How Dhara AI Operates
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Step-by-step conceptual walkthrough showing how soil metrics travel from physical
              field sensors to safety-checked solenoid valve execution.
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-8">
        <Container>
          <SystemArchitectureVisual />
        </Container>
      </Section>

      {/* UPLINK PIPELINE */}
      <Section variant="dark">
        <Container>
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-xs">
                UP
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  1. Uplink Pipeline (Telemetry Gathering)
                </h2>
                <p className="text-xs text-slate-400">
                  Field node sensors to cloud backend data flow.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {uplinkSteps.map((s, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-dhara-surfaceBorder bg-dhara-surface space-y-2"
                >
                  <div className="text-xs font-mono text-emerald-400 font-semibold">{s.tech}</div>
                  <h3 className="text-sm font-bold text-slate-100">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* PROCESSING PIPELINE */}
      <Section variant="default">
        <Container>
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold font-mono text-xs">
                CPU
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  2. Processing & Safety Boundary
                </h2>
                <p className="text-xs text-slate-400">
                  Cloud analytics, AI recommendation, and rule enforcement.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {processingSteps.map((s, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-dhara-surfaceBorder bg-dhara-surface space-y-2"
                >
                  <div className="text-xs font-mono text-purple-400 font-semibold">{s.tech}</div>
                  <h3 className="text-sm font-bold text-slate-100">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* DOWNLINK PIPELINE */}
      <Section variant="dark">
        <Container>
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono text-xs">
                DN
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  3. Downlink Pipeline (Actuator Execution)
                </h2>
                <p className="text-xs text-slate-400">
                  Safety-approved command dispatch to high-voltage equipment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {downlinkSteps.map((s, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-dhara-surfaceBorder bg-dhara-surface space-y-2"
                >
                  <div className="text-xs font-mono text-cyan-400 font-semibold">{s.tech}</div>
                  <h3 className="text-sm font-bold text-slate-100">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
