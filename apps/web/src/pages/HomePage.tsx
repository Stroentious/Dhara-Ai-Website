import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Radio,
  Activity,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Droplets,
  Zap,
  Gauge,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { SystemArchitectureVisual } from '@/components/visualizations/SystemArchitectureVisual';
import { InteractiveFarmStatus } from '@/components/demo/InteractiveFarmStatus';
import { AIRecommendationDemoCard } from '@/components/demo/AIRecommendationDemoCard';

export const HomePage: React.FC = () => {
  const trustCapabilities = [
    { label: '7 Soil Parameters', icon: Sprout },
    { label: 'Long-Range Connectivity', icon: Radio },
    { label: 'AI-Assisted Decisions', icon: BrainCircuit },
    { label: 'Smart Irrigation', icon: Droplets },
    { label: 'Fertigation Ready', icon: Zap },
    { label: 'Real-Time Monitoring', icon: Activity },
  ];

  const steps = [
    {
      num: '01',
      title: 'Sense',
      desc: 'Soil probes measure N, P, K, pH, EC, Moisture, and Temperature at root zone depth.',
    },
    {
      num: '02',
      title: 'Connect',
      desc: 'Field poles transmit telemetry via RS485, ESP32-C3 & SX1262 LoRaWAN wireless link.',
    },
    {
      num: '03',
      title: 'Understand',
      desc: 'Dhara cloud processes telemetry with crop stage and environmental context.',
    },
    {
      num: '04',
      title: 'Decide',
      desc: 'AI decision engine generates precise irrigation and fertigation recommendations.',
    },
    {
      num: '05',
      title: 'Protect',
      desc: 'Deterministic safety rules validate all pump, valve, and flow rate limits.',
    },
    {
      num: '06',
      title: 'Act',
      desc: 'ESP32-S3 central substation executes authorized relay commands safely.',
    },
  ];

  const soilParameters = [
    {
      name: 'Nitrogen (N)',
      symbol: 'N',
      icon: Sprout,
      unit: 'mg/kg',
      desc: 'Primary macronutrient for vegetative canopy growth and chlorophyll production.',
    },
    {
      name: 'Phosphorus (P)',
      symbol: 'P',
      icon: Zap,
      unit: 'mg/kg',
      desc: 'Essential for root structure expansion and early crop blooming development.',
    },
    {
      name: 'Potassium (K)',
      symbol: 'K',
      icon: Gauge,
      unit: 'mg/kg',
      desc: 'Regulates stomatal water loss, crop disease resistance, and fruit quality.',
    },
    {
      name: 'Soil pH',
      symbol: 'pH',
      icon: Activity,
      unit: '0 - 14 scale',
      desc: 'Governs biological nutrient solubility and root absorption efficiency.',
    },
    {
      name: 'Electrical Conductivity',
      symbol: 'EC',
      icon: Zap,
      unit: 'uS/cm',
      desc: 'Measures total soluble salt concentration to prevent root osmotic stress.',
    },
    {
      name: 'Soil Moisture',
      symbol: 'Moisture',
      icon: Droplets,
      unit: '% VWC',
      desc: 'Volumetric Water Content tracking root zone water depletion curves.',
    },
    {
      name: 'Soil Temperature',
      symbol: 'Temp',
      icon: Activity,
      unit: '°C',
      desc: 'Influences microbial activity, germination rates, and nutrient uptake speed.',
    },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <Section variant="grid" className="pt-12 md:pt-20 pb-16">
        <Container>
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Sprout className="h-3.5 w-3.5" />
                <span>Precision Irrigation & Farm Intelligence Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-50 leading-[1.1]">
                Intelligent Irrigation.{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
                  Healthier Crops.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                Dhara AI combines real-time soil intelligence, connected field devices and
                AI-assisted irrigation to help farms use water and nutrients more precisely.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/technology">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-6 h-11 text-xs sm:text-sm space-x-2 shadow-lg shadow-emerald-600/20">
                    <span>Explore Dhara AI</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#demo">
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 h-11 px-6 text-xs sm:text-sm"
                  >
                    View Live Demo
                  </Button>
                </a>
              </div>
            </div>

            {/* HERO SYSTEM ARCHITECTURE VISUALIZATION */}
            <div className="pt-4">
              <SystemArchitectureVisual />
            </div>
          </div>
        </Container>
      </Section>

      {/* TRUST & CAPABILITIES BAR */}
      <Section variant="dark" className="py-8 border-y border-dhara-surfaceBorder/40">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {trustCapabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="p-3 rounded-xl bg-dhara-surface/60 border border-slate-800/80 flex flex-col items-center justify-center space-y-2"
                >
                  <Icon className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-300">{item.label}</span>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* HOW IT WORKS SECTION */}
      <Section variant="default">
        <Container>
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                System Workflow
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
                MEASURE &rarr; UNDERSTAND &rarr; DECIDE &rarr; IRRIGATE
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                From field probes to safety-validated solenoid relays, Dhara AI operates in a
                continuous precision cycle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="p-6 rounded-xl border border-dhara-surfaceBorder bg-dhara-surface space-y-3 relative group agri-card-hover"
                >
                  <div className="text-2xl font-mono font-extrabold text-emerald-500/40 group-hover:text-emerald-400 transition-colors">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* SOIL INTELLIGENCE SECTION */}
      <Section variant="dark">
        <Container>
          <div className="space-y-10">
            <div className="max-w-2xl space-y-3">
              <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                Root Zone Analytics
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
                7 Essential Soil Telemetry Parameters
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Integrated RS485 Modbus probes measure root environment factors directly in field
                zones.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {soilParameters.map((param) => {
                const Icon = param.icon;
                return (
                  <div
                    key={param.name}
                    className="p-5 rounded-xl border border-dhara-surfaceBorder bg-dhara-surface space-y-3 agri-card-hover"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{param.name}</span>
                      <Icon className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-400">{param.unit}</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{param.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* SMART IRRIGATION COMPARISON */}
      <Section variant="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                Precision vs Legacy
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
                Designed to Improve Water-Use Precision
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Traditional irrigation relies on timer schedules and guesswork, risking water waste
                and crop stress. Dhara AI introduces zone-level soil data and deterministic safety
                guardrails.
              </p>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-semibold">Traditional Irrigation</div>
                  <p className="text-slate-400 text-[11px]">
                    Fixed timer schedules • Limited soil visibility • Risk of over/under irrigation
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1.5" /> Dhara AI Precision Approach
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Real-time root data • Zone-level visibility • Context-aware recommendations •
                    Safety validation
                  </p>
                </div>
              </div>
            </div>

            <div id="demo" className="space-y-4">
              <InteractiveFarmStatus />
            </div>
          </div>
        </Container>
      </Section>

      {/* AI SECTION */}
      <Section variant="dark">
        <Container>
          <div className="space-y-8">
            <div className="max-w-2xl space-y-3">
              <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                AI Advisory Boundary
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
                Context-Aware Irrigation Advisory
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                The AI engine combines soil telemetry, crop growth stage, and weather forecasts to
                generate irrigation recommendations, which pass through deterministic safety
                guardrails before execution.
              </p>
            </div>

            <AIRecommendationDemoCard />
          </div>
        </Container>
      </Section>

      {/* HARDWARE OVERVIEW SUMMARY */}
      <Section variant="default">
        <Container>
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="border-indigo-500/30 text-indigo-400">
                  Physical Hardware
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  Industrial Hardware Ecosystem
                </h2>
              </div>
              <Link to="/hardware">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
                >
                  View Full Hardware Specifications &rarr;
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                title="ESP32-C3 Field Sensor Poles"
                description="Solar-powered distributed field nodes with SX1262 LoRa module & RS485 Modbus soil probe. Measures N, P, K, pH, EC, Moisture, Temp."
                icon={Radio}
                badge="AVAILABLE HARDWARE SPEC"
              />
              <FeatureCard
                title="ESP32-S3 Central Substation"
                description="LoRaWAN gateway & high-voltage relay controller for main supply pumps, zone solenoid valves, and multi-channel fertigation dosing."
                icon={Radio}
                badge="PLANNED SUBSTATION SPEC"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* DEMO CTA SECTION */}
      <Section variant="grid" className="py-20 border-t border-dhara-surfaceBorder/40">
        <Container size="narrow">
          <div className="p-8 md:p-12 rounded-3xl border border-dhara-surfaceBorder bg-gradient-to-br from-dhara-surface via-slate-900 to-dhara-dark text-center space-y-6 shadow-2xl">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Sprout className="h-6 w-6" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
              Ready to Upgrade Farm Water Precision?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              Explore the Dhara AI technical documentation or request a hardware architecture review
              with our engineering team.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-6 h-11 text-xs sm:text-sm space-x-2">
                  <span>Contact Engineering</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/technology">
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 h-11 px-6 text-xs sm:text-sm"
                >
                  System Architecture
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
