import React from 'react';
import { motion } from 'framer-motion';
import {
  Sprout,
  Radio,
  Wifi,
  Cpu,
  Cloud,
  BrainCircuit,
  ShieldCheck,
  Droplets,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const SystemArchitectureVisual: React.FC = () => {
  const steps = [
    {
      id: 'soil',
      label: 'Soil Probe',
      icon: Sprout,
      subtext: '7-in-1 NPK/pH/EC/Moisture/Temp',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'pole',
      label: 'Field Pole',
      icon: Radio,
      subtext: 'ESP32-C3 + Solar Power',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'lora',
      label: 'LoRaWAN',
      icon: Wifi,
      subtext: 'SX1262 Long Range Uplink',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'gateway',
      label: 'Gateway',
      icon: Cpu,
      subtext: 'ESP32-S3 Substation Hub',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      id: 'cloud',
      label: 'Cloud API',
      icon: Cloud,
      subtext: 'Node.js Express + Postgres',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      id: 'ai',
      label: 'AI Engine',
      icon: BrainCircuit,
      subtext: 'Precision Water Advisory',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      id: 'safety',
      label: 'Safety Check',
      icon: ShieldCheck,
      subtext: 'Deterministic Guardrails',
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20',
    },
    {
      id: 'irrigation',
      label: 'Irrigation',
      icon: Droplets,
      subtext: 'Pumps & Solenoid Valves',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
  ];

  return (
    <div className="p-6 md:p-8 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-6 relative overflow-hidden">
      {/* Disclaimer Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <span>Dhara AI End-to-End System Flow</span>
          </h3>
          <p className="text-xs text-slate-400">
            Conceptual telemetry pathway from field sensors to safety-validated pump control.
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-amber-500/40 text-amber-300 bg-amber-500/10 font-mono text-[10px]"
        >
          ARCHITECTURAL VISUALIZATION
        </Badge>
      </div>

      {/* Grid Flow Component */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="flex flex-col items-center text-center group relative"
            >
              <div
                className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all ${step.bg} ${step.color} group-hover:scale-105 shadow-md`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-slate-200 mt-2.5">{step.label}</span>
              <span className="text-[10px] text-slate-400 leading-tight mt-0.5 max-w-[100px]">
                {step.subtext}
              </span>

              {!isLast && (
                <div className="hidden lg:block absolute -right-3 top-5 z-20 text-slate-600">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Animated Pipeline Cable */}
      <div className="p-3.5 rounded-xl bg-dhara-dark border border-slate-800/80 font-mono text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold">Uplink Telemetry:</span>
          <span>RS485 &rarr; LoRaWAN Packet &rarr; MQTT Payload</span>
        </div>
        <div className="flex items-center space-x-2 text-emerald-400">
          <span>Downlink Safety:</span>
          <span>Auth &rarr; Rule Check &rarr; Relay Execution</span>
        </div>
      </div>
    </div>
  );
};
