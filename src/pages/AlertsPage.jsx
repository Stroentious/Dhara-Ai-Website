import React, { useState, useEffect } from 'react';
import { AlertListTable } from '../components/alerts/AlertListTable';
import { farmService } from '../services/farmService';

export const AlertsPage = () => {
  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'all'
  });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    farmService.getAlerts(filters).then(res => {
      setAlerts(res);
    });
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAcknowledge = async (alertId) => {
    await farmService.acknowledgeAlert(alertId);
    const updated = await farmService.getAlerts(filters);
    setAlerts(updated);
  };

  return (
    <div className="space-y-6">
      <AlertListTable
        alerts={alerts}
        selectedSeverity={filters.severity}
        selectedStatus={filters.status}
        onFilterChange={handleFilterChange}
        onAcknowledge={handleAcknowledge}
      />
    </div>
  );
};
