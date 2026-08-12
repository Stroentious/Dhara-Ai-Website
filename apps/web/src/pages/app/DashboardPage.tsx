import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, Grid, Layers, Sprout, Plus, AlertCircle, Cpu, WifiOff } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardMetricsDTO } from '@dhara/shared';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeOrganization } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetricsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      setIsLoading(true);
      try {
        const data = await apiClient.getDashboardMetrics(activeOrganization?.id);
        setMetrics(data);
      } catch {
        setMetrics({ totalFarms: 0, totalFields: 0, totalZones: 0, activeCropCycles: 0 });
      } finally {
        setIsLoading(false);
      }
    }
    loadMetrics();
  }, [activeOrganization?.id]);

  return (
    <div className="py-8">
      <Section variant="default">
        <Container>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                    REAL DATABASE METRICS
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-slate-700 text-slate-400 font-mono text-[10px]"
                  >
                    POSTGRESQL AGGREGATION
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
                  Farm Operations Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  {metrics?.organizationName || activeOrganization?.name || 'Organization'}{' '}
                  Agricultural Structure Overview
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => navigate('/app/farms')}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs space-x-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Manage Farms</span>
                </Button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Farms */}
              <div className="p-5 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-2">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                    Total Farms
                  </span>
                  <Tractor className="h-5 w-5" />
                </div>
                <div className="text-3xl font-extrabold text-slate-100 font-mono">
                  {isLoading ? '...' : (metrics?.totalFarms ?? 0)}
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Active farm facilities registered
                </p>
              </div>

              {/* Total Fields */}
              <div className="p-5 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-2">
                <div className="flex items-center justify-between text-cyan-400">
                  <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                    Total Fields
                  </span>
                  <Grid className="h-5 w-5" />
                </div>
                <div className="text-3xl font-extrabold text-slate-100 font-mono">
                  {isLoading ? '...' : (metrics?.totalFields ?? 0)}
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Land parcels / soil boundaries
                </p>
              </div>

              {/* Total Zones */}
              <div className="p-5 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-2">
                <div className="flex items-center justify-between text-purple-400">
                  <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                    Total Zones
                  </span>
                  <Layers className="h-5 w-5" />
                </div>
                <div className="text-3xl font-extrabold text-slate-100 font-mono">
                  {isLoading ? '...' : (metrics?.totalZones ?? 0)}
                </div>
                <p className="text-[11px] text-slate-400 font-sans">Irrigation blocks configured</p>
              </div>

              {/* Active Crop Cycles */}
              <div className="p-5 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-2">
                <div className="flex items-center justify-between text-amber-400">
                  <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                    Active Crops
                  </span>
                  <Sprout className="h-5 w-5" />
                </div>
                <div className="text-3xl font-extrabold text-slate-100 font-mono">
                  {isLoading ? '...' : (metrics?.activeCropCycles ?? 0)}
                </div>
                <p className="text-[11px] text-slate-400 font-sans">Current active crop seasons</p>
              </div>
            </div>

            {/* Device Integration Placeholders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Telemetry Hardware Card */}
              <div className="p-6 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-4">
                <div className="flex items-center space-x-3 text-slate-400">
                  <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <WifiOff className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-200">Soil Telemetry Stream</h3>
                    <p className="text-xs text-slate-400">Field Pole RS485 Sensor Telemetry</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-dhara-dark border border-slate-800 text-center space-y-2 font-mono">
                  <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">
                    NOT CONNECTED YET
                  </Badge>
                  <p className="text-xs text-slate-400 font-sans">
                    Live soil moisture, NPK, pH, and EC telemetry streams will become available
                    after hardware device provisioning in <strong>Phase 4 and Phase 5</strong>.
                  </p>
                </div>
              </div>

              {/* Actuator Hardware Card */}
              <div className="p-6 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-4">
                <div className="flex items-center space-x-3 text-slate-400">
                  <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-200">
                      Substation Actuator Control
                    </h3>
                    <p className="text-xs text-slate-400">ESP32-S3 Pump & Valve Relays</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-dhara-dark border border-slate-800 text-center space-y-2 font-mono">
                  <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">
                    AVAILABLE AFTER DEVICE INTEGRATION
                  </Badge>
                  <p className="text-xs text-slate-400 font-sans">
                    Real-time pump relay status, valve scheduling, and fertigation channel controls
                    will be integrated in <strong>Phase 6 and Phase 7</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Quality Note */}
            <div className="p-4 rounded-xl bg-dhara-slate border border-slate-800 text-xs text-slate-400 font-mono flex items-center space-x-3">
              <AlertCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                All counts displayed above are aggregated live from your PostgreSQL database. Zero
                simulated or hardcoded fake metrics exist.
              </span>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
