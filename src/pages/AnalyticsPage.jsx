import React, { useState, useEffect } from 'react';
import { AnalyticsFilterBar } from '../components/analytics/AnalyticsFilterBar';
import { SensorTrendChart } from '../components/analytics/SensorTrendChart';
import { NPKChart } from '../components/analytics/NPKChart';
import { farmService } from '../services/farmService';

export const AnalyticsPage = ({ zones, poles }) => {
  const [filters, setFilters] = useState({
    zoneId: 'all',
    poleId: 'all',
    timeRange: '24h'
  });
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    farmService.getAnalytics(filters).then(res => {
      setAnalyticsData(res.series);
    });
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'zoneId' ? { poleId: 'all' } : {})
    }));
  };

  return (
    <div className="space-y-6">
      {/* Analytics Filter */}
      <AnalyticsFilterBar
        zones={zones}
        poles={poles}
        selectedZone={filters.zoneId}
        selectedPole={filters.poleId}
        timeRange={filters.timeRange}
        onFilterChange={handleFilterChange}
      />

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SensorTrendChart data={analyticsData} type="moistureTemp" />
        <SensorTrendChart data={analyticsData} type="phEc" />
      </div>

      {/* NPK and Water Usage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NPKChart data={analyticsData} type="npk" />
        <NPKChart data={analyticsData} type="waterUsage" />
      </div>
    </div>
  );
};
