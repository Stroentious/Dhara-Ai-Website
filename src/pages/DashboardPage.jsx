import React from 'react';
import { StatCard } from '../components/common/StatCard';
import { FarmOverviewGrid } from '../components/dashboard/FarmOverviewGrid';
import { RecentAlertsWidget } from '../components/dashboard/RecentAlertsWidget';
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget';
import { Layers, CheckCircle2, AlertTriangle, Droplets, Sprout, Power } from 'lucide-react';

export const DashboardPage = ({ summary, zones, poles, alerts, onSelectPole, onNavigateTab }) => {
  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Nodes"
          value={summary?.totalPoles || 0}
          unit="Poles"
          icon={Layers}
          description="Distributed Field Nodes"
        />
        <StatCard
          title="Online Nodes"
          value={summary?.onlinePoles || 0}
          unit="Active"
          icon={CheckCircle2}
          description="LoRa connected"
        />
        <StatCard
          title="Offline Nodes"
          value={summary?.offlinePoles || 0}
          unit="Nodes"
          icon={AlertTriangle}
          description="Requires inspection"
        />
        <StatCard
          title="Avg Moisture"
          value={`${summary?.avgMoisture || 0}%`}
          unit="VWC"
          icon={Droplets}
          description="Across all 3 zones"
        />
        <StatCard
          title="Active Zones"
          value={summary?.activeZones || 0}
          unit="Zones"
          icon={Sprout}
          description="North, Greenhouse, South"
        />
        <StatCard
          title="Pump Status"
          value={summary?.pumpStatus || 'OFF'}
          unit={summary?.controlMode}
          icon={Power}
          description={`Active: ${summary?.activeZoneName?.split('—')[0] || 'Zone 2'}`}
        />
      </div>

      {/* Main Farm Grid */}
      <FarmOverviewGrid zones={zones} onSelectPole={onSelectPole} />

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAlertsWidget alerts={alerts} onViewAllAlerts={() => onNavigateTab('alerts')} />
        <RecentActivityWidget poles={poles} />
      </div>
    </div>
  );
};
