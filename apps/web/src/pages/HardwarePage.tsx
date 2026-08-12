import React from 'react';
import { Radio, Cpu, ShieldAlert } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';

export const HardwarePage: React.FC = () => {
  return (
    <div>
      <Section variant="grid" className="py-16 md:py-20">
        <Container>
          <div className="space-y-4 max-w-3xl">
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400">
              Physical Systems
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-50 tracking-tight">
              Hardware Architecture & Specifications
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Industrial hardware specifications for distributed field sensor poles and central
              substation gateways.
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FIELD POLE SPECIFICATION */}
            <div className="p-6 sm:p-8 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-5 agri-card-hover">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Radio className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">ESP32-C3 Field Sensor Pole</h2>
                    <p className="text-xs text-slate-400">Distributed Soil Telemetry Node</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/40 text-emerald-400 font-mono text-[10px]"
                >
                  AVAILABLE SPEC
                </Badge>
              </div>

              <div className="space-y-3 text-xs text-slate-300 font-mono">
                <div className="p-3 rounded-lg bg-dhara-dark border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-sans font-bold">Microcontroller & Radio</div>
                  <div>• MCU: ESP32-C3 RISC-V 32-bit Single-Core</div>
                  <div>• Transceiver: SX1262 LoRa Module (868/915 MHz)</div>
                  <div>• Bus Interface: RS485 Modbus RTU</div>
                </div>

                <div className="p-3 rounded-lg bg-dhara-dark border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-sans font-bold">Soil Sensor Probe</div>
                  <div>• Sensor: 7-in-1 Modbus Probe (N, P, K, pH, EC, Moisture, Temp)</div>
                  <div>• Probe Material: 316 Stainless Steel Electrodes</div>
                  <div>• Protection: IP68 Waterproof Epoxy Encapsulated</div>
                </div>

                <div className="p-3 rounded-lg bg-dhara-dark border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-sans font-bold">Power Subsystem</div>
                  <div>• Solar Panel: Monocrystalline 5V / 2W</div>
                  <div>• Battery: 18650 LiFePO4 / Li-ion Charge Management</div>
                  <div>• Operational Mode: Deep Sleep with Periodic Telemetry Wakeup</div>
                </div>
              </div>
            </div>

            {/* CENTRAL SUBSTATION SPECIFICATION */}
            <div className="p-6 sm:p-8 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-5 agri-card-hover">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">
                      ESP32-S3 Central Substation
                    </h2>
                    <p className="text-xs text-slate-400">LoRaWAN Gateway & Actuator Controller</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-teal-500/40 text-teal-400 font-mono text-[10px]"
                >
                  PLANNED SUBSTATION SPEC
                </Badge>
              </div>

              <div className="space-y-3 text-xs text-slate-300 font-mono">
                <div className="p-3 rounded-lg bg-dhara-dark border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-sans font-bold">
                    Microcontroller & Gateway
                  </div>
                  <div>• MCU: ESP32-S3 Dual-Core Xtensa LX7</div>
                  <div>• Gateway Engine: SX1302 / SX1303 LoRaWAN Concentrator</div>
                  <div>• Network Uplink: Wi-Fi / Ethernet / 4G Cellular Module</div>
                </div>

                <div className="p-3 rounded-lg bg-dhara-dark border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-sans font-bold">
                    Relay & Actuator Interfaces
                  </div>
                  <div>• Supply Pump Relay Output (24V DC / Relay Trigger)</div>
                  <div>• Zone Solenoid Valve Control Channels (Multi-zone outputs)</div>
                  <div>• Multi-Channel Fertigation Dosing Injector Relays</div>
                </div>

                <div className="p-3 rounded-lg bg-dhara-dark border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-sans font-bold">Local Safety Subsystem</div>
                  <div>• Autonomous Watchdog: Emergency Shutdown on Cloud Timeout</div>
                  <div>• Hardware Flow Sensor & Pressure Transducer Inputs</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* SAFETY WARNING BANNER */}
      <Section variant="dark" className="py-12">
        <Container size="narrow">
          <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-amber-300 flex items-start space-x-4 text-xs">
            <ShieldAlert className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-100 font-sans text-sm block">
                Industrial Electrical Safety Precaution
              </span>
              <p className="text-slate-300 leading-relaxed font-sans">
                High-voltage pump starters, contactors, and fertigation chemical dosing equipment
                must be installed by certified agricultural electrical technicians in compliance
                with local industrial wiring codes.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
