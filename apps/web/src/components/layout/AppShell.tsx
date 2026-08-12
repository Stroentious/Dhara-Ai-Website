import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sprout,
  Activity,
  Layers,
  Cpu,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Wifi,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { healthApi } from '@/lib/api-client';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const [apiHealth, setApiHealth] = useState<'checking' | 'healthy' | 'offline'>('checking');

  useEffect(() => {
    healthApi
      .checkHealth()
      .then((res) => {
        if (res.status === 'healthy') {
          setApiHealth('healthy');
        } else {
          setApiHealth('offline');
        }
      })
      .catch(() => setApiHealth('offline'));
  }, []);

  const navItems = [
    { label: 'Overview', path: '/', icon: Sprout, status: 'Active' },
    { label: 'Soil Telemetry', path: '/telemetry', icon: Activity, status: 'Phase 4' },
    { label: 'Irrigation & Fertigation', path: '/control', icon: Cpu, status: 'Phase 7' },
    { label: 'Field Mapping', path: '/gis', icon: Layers, status: 'Phase 11' },
    { label: 'System Architecture', path: '/docs', icon: FileText, status: 'Phase 0' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Global Status Header */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sprout className="h-6 w-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
                DHARA AI
              </span>
              <Badge
                variant="outline"
                className="text-[10px] py-0 border-emerald-500/30 text-emerald-400"
              >
                Phase 0 Foundation
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Precision Agriculture & Smart Fertigation
            </p>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Wifi className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400">MQTT Boundary:</span>
            <span className="text-emerald-400 font-semibold">READY</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Activity className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400">API Health:</span>
            {apiHealth === 'healthy' ? (
              <span className="flex items-center text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3 w-3 mr-1" /> HEALTHY
              </span>
            ) : apiHealth === 'checking' ? (
              <span className="text-amber-400 animate-pulse">CHECKING...</span>
            ) : (
              <span className="flex items-center text-rose-400 font-semibold">
                <AlertTriangle className="h-3 w-3 mr-1" /> DISCONNECTED
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800/80 bg-slate-900/40 hidden md:flex flex-col justify-between p-4">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      item.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Safety & Compliance Box */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Safety Pipeline</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Actuators enforced via REST API -&gt; Safety Validation -&gt; MQTT Substation gate.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <footer className="h-10 border-t border-slate-800/80 bg-slate-950 px-6 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div>Dhara AI &copy; 2026 • Enterprise IoT Precision Agriculture Platform</div>
        <div className="flex items-center space-x-3">
          <span>ESP32-C3 / SX1262 LoRa</span>
          <span>•</span>
          <span>ESP32-S3 Gateway</span>
          <span>•</span>
          <span>TimescaleDB Compatible</span>
        </div>
      </footer>
    </div>
  );
};
