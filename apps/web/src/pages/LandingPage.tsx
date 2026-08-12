import React, { useState } from 'react';
import {
  Sprout,
  Activity,
  ShieldAlert,
  Cpu,
  Database,
  Radio,
  CheckCircle,
  RefreshCw,
  Layers,
  ArrowRight,
  Droplets,
  Thermometer,
  Zap,
  Gauge,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { healthApi } from '@/lib/api-client';
import { HealthCheckResponse } from '@dhara/shared';

export const LandingPage: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerHealthCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await healthApi.checkHealth();
      setHealthData(res);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const telemetryParameters = [
    {
      name: 'Nitrogen (N)',
      symbol: 'N',
      icon: Sprout,
      unit: 'mg/kg',
      desc: 'Primary macronutrient',
    },
    {
      name: 'Phosphorus (P)',
      symbol: 'P',
      icon: Zap,
      unit: 'mg/kg',
      desc: 'Root & bloom development',
    },
    {
      name: 'Potassium (K)',
      symbol: 'K',
      icon: Gauge,
      unit: 'mg/kg',
      desc: 'Water regulation & disease resistance',
    },
    {
      name: 'Soil pH',
      symbol: 'pH',
      icon: Activity,
      unit: 'pH scale',
      desc: 'Nutrient availability factor',
    },
    {
      name: 'Electrical Conductivity',
      symbol: 'EC',
      icon: Zap,
      unit: 'uS/cm',
      desc: 'Soil salinity & soluble salts',
    },
    {
      name: 'Soil Moisture',
      symbol: 'Moisture',
      icon: Droplets,
      unit: '% VWC',
      desc: 'Volumetric water content',
    },
    {
      name: 'Soil Temperature',
      symbol: 'Temp',
      icon: Thermometer,
      unit: '°C',
      desc: 'Root zone thermal dynamics',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-8 md:p-10 shadow-2xl">
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sprout className="h-3.5 w-3.5" />
            <span>Precision Agriculture & Fertigation Platform</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-50 leading-tight">
            Intelligent Field Telemetry & Automated Irrigation
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Dhara AI bridges physical soil telemetry from distributed ESP32 field poles and central
            substations to a robust TypeScript microservice backend, deterministic safety pipeline,
            and AI decision boundary.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              onClick={triggerHealthCheck}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Test API Health Endpoint</span>
            </Button>
            <a href="#architecture">
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 space-x-2"
              >
                <span>View Architecture</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>

          {/* Health Check Result Container */}
          {healthData && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 font-mono text-xs text-emerald-300 space-y-1">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <CheckCircle className="h-4 w-4" />
                <span>Backend Response Received [GET /api/health]:</span>
              </div>
              <pre className="text-slate-300 bg-slate-900 p-2.5 rounded-lg overflow-x-auto">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 font-mono text-xs text-rose-300">
              ❌ Connection Error: {error}
            </div>
          )}
        </div>
      </div>

      {/* System Physical Components Breakdown */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-100 mb-4 flex items-center space-x-2">
          <Cpu className="h-5 w-5 text-emerald-400" />
          <span>Physical Telemetry & Actuation Architecture</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Field Poles */}
          <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                  ESP32-C3
                </Badge>
                <Radio className="h-4 w-4 text-emerald-400" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-100 pt-2">
                Field Sensor Poles
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Solar-powered distributed field nodes with SX1262 LoRa module & RS485 Modbus soil
                sensor.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-slate-400">Parameters Measured:</div>
              <ul className="space-y-1 font-mono text-[11px] text-slate-400">
                <li>• N, P, K (Nitrogen, Phosphorus, Potassium)</li>
                <li>• pH & Electrical Conductivity (EC)</li>
                <li>• Soil Moisture & Soil Temperature</li>
                <li>• Solar Voltage & Battery Health</li>
              </ul>
            </CardContent>
          </Card>

          {/* Card 2: Central Substation */}
          <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-teal-500/30 text-teal-400">
                  ESP32-S3
                </Badge>
                <Layers className="h-4 w-4 text-teal-400" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-100 pt-2">
                Central Substation
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                LoRaWAN local gateway & high-voltage relay controller for pumps, valves, and
                fertigation.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-slate-400">Control Capabilities:</div>
              <ul className="space-y-1 font-mono text-[11px] text-slate-400">
                <li>• Main Water Supply Pump Relay</li>
                <li>• Zone Solenoid Valves</li>
                <li>• Multi-channel Fertigation Dosing</li>
                <li>• Autonomous Local Safety Interlocks</li>
              </ul>
            </CardContent>
          </Card>

          {/* Card 3: Cloud & Backend API */}
          <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-indigo-500/30 text-indigo-400">
                  TypeScript API
                </Badge>
                <Database className="h-4 w-4 text-indigo-400" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-100 pt-2">
                Cloud Engine & Database
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Node.js Express REST API, PostgreSQL database (TimescaleDB compatible), and AI
                decision engine.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-slate-400">Core Services:</div>
              <ul className="space-y-1 font-mono text-[11px] text-slate-400">
                <li>• Multi-Tenant Organization Hierarchy</li>
                <li>• Time-Series Telemetry Aggregation</li>
                <li>• Deterministic Safety Command Pipeline</li>
                <li>• Audit Trail & Real-time WebSockets</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Telemetry Parameters Grid */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-100 mb-4 flex items-center space-x-2">
          <Activity className="h-5 w-5 text-emerald-400" />
          <span>Supported Soil Telemetry Metrics</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {telemetryParameters.map((param) => {
            const Icon = param.icon;
            return (
              <div
                key={param.name}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{param.name}</span>
                  <Icon className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-xs font-mono text-emerald-400 font-semibold">{param.unit}</div>
                <p className="text-[11px] text-slate-400 leading-snug">{param.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Pipeline Specification */}
      <div
        id="architecture"
        className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4"
      >
        <div className="flex items-center space-x-3">
          <ShieldAlert className="h-6 w-6 text-amber-400" />
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              Deterministic Safety Pipeline Architecture
            </h3>
            <p className="text-xs text-slate-400">
              High-voltage physical actuators are never directly controlled by browser clients.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
          Frontend UI &rarr; REST API &rarr; Auth & Authz &rarr; Safety Validation Engine &rarr;
          Audit Log &rarr; MQTT &rarr; Substation
        </div>
      </div>
    </div>
  );
};
