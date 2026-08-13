import React, { useState } from 'react';
import { ZoneCard } from '../components/monitoring/ZoneCard';
import { PoleCard } from '../components/monitoring/PoleCard';
import { PoleDetailsModal } from '../components/monitoring/PoleDetailsModal';
import { Sprout, Layers } from 'lucide-react';

export const MonitoringPage = ({ zones, poles, poleDetails, selectedPoleId, onSelectPole, onClosePoleDetails }) => {
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('all');

  const displayedPoles = selectedZoneFilter === 'all'
    ? poles
    : poles.filter(p => p.zoneId === selectedZoneFilter);

  return (
    <div className="space-y-6">
      {/* Zone Overview Cards Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Agricultural Zones Overview
          </h3>
          {selectedZoneFilter !== 'all' && (
            <button
              onClick={() => setSelectedZoneFilter('all')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
            >
              Clear Zone Filter (Show All)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              isSelected={selectedZoneFilter === zone.id}
              onSelect={(id) => setSelectedZoneFilter(id === selectedZoneFilter ? 'all' : id)}
            />
          ))}
        </div>
      </div>

      {/* Field Nodes List Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Field Nodes ({displayedPoles.length} Poles)
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Click any pole to open telemetry & diagnostics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedPoles.map((pole) => (
            <PoleCard
              key={pole.id}
              pole={pole}
              onClick={onSelectPole}
            />
          ))}
        </div>
      </div>

      {/* Pole Details Modal */}
      {selectedPoleId && (
        <PoleDetailsModal
          poleDetails={poleDetails}
          onClose={onClosePoleDetails}
        />
      )}
    </div>
  );
};
