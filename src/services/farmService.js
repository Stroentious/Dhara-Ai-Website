import { initialFarmData } from '../data/mockData';

// Local reactive state for mock interactions
let farmState = JSON.parse(JSON.stringify(initialFarmData));

/**
 * Service Abstraction Layer for Dhara AI
 * Future transition to FastAPI: Replace internal logic with `fetch('/api/v1/...')`
 */
export const farmService = {
  /**
   * Fetch high-level farm overview KPIs
   */
  async getFarmSummary() {
    const totalPoles = farmState.poles.length;
    const onlinePoles = farmState.poles.filter(p => p.status === 'Online').length;
    const offlinePoles = farmState.poles.filter(p => p.status === 'Offline').length;
    const warningPoles = farmState.poles.filter(p => p.status === 'Warning').length;

    const totalMoisture = farmState.poles.reduce((acc, p) => acc + p.telemetry.moisture, 0);
    const avgMoisture = Math.round(totalMoisture / totalPoles);

    const activeZones = farmState.zones.length;
    const criticalAlertsCount = farmState.alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;

    return {
      totalPoles,
      onlinePoles,
      offlinePoles,
      warningPoles,
      avgMoisture,
      activeZones,
      pumpStatus: farmState.systemControl.pumpStatus,
      controlMode: farmState.systemControl.mode,
      activeZoneName: farmState.systemControl.activeZoneName,
      criticalAlertsCount
    };
  },

  /**
   * Fetch list of zones with calculated aggregates
   */
  async getZones() {
    return farmState.zones.map(zone => {
      const zonePoles = farmState.poles.filter(p => p.zoneId === zone.id);
      const totalMoisture = zonePoles.reduce((acc, p) => acc + p.telemetry.moisture, 0);
      const avgMoisture = zonePoles.length ? Math.round(totalMoisture / zonePoles.length) : 0;

      const hasOffline = zonePoles.some(p => p.status === 'Offline');
      const hasWarning = zonePoles.some(p => p.status === 'Warning');
      const isLowMoisture = avgMoisture < zone.targetMoistureMin;

      let status = 'Optimal';
      if (hasOffline) status = 'Offline Node';
      else if (hasWarning || isLowMoisture) status = 'Attention Needed';

      return {
        ...zone,
        poleCount: zonePoles.length,
        avgMoisture,
        status,
        poles: zonePoles
      };
    });
  },

  /**
   * Fetch poles with optional zone filter
   */
  async getPoles(zoneId = null) {
    if (!zoneId || zoneId === 'all') {
      return farmState.poles;
    }
    return farmState.poles.filter(p => p.zoneId === zoneId);
  },

  /**
   * Fetch detailed metadata and historical series for a specific pole
   */
  async getPoleDetails(poleId) {
    const pole = farmState.poles.find(p => p.id === poleId);
    if (!pole) throw new Error(`Pole with ID ${poleId} not found`);

    const zone = farmState.zones.find(z => z.id === pole.zoneId);

    // Generate historical mock data specific to this pole
    const history = farmState.historicalTelemetry.map(h => ({
      time: h.time,
      moisture: Math.max(10, Math.min(90, h.moisture + (pole.id === 'pole-3' ? -12 : pole.id === 'pole-4' ? -8 : 4))),
      temperature: Number((h.temp + (pole.id === 'pole-3' ? 1.5 : -0.5)).toFixed(1)),
      nitrogen: pole.telemetry.nitrogen,
      phosphorus: pole.telemetry.phosphorus,
      potassium: pole.telemetry.potassium,
      ph: pole.telemetry.ph,
      ec: pole.telemetry.ec
    }));

    return {
      ...pole,
      zone,
      history
    };
  },

  /**
   * Fetch historical analytics telemetry
   */
  async getAnalytics(filters = {}) {
    const { zoneId, poleId, timeRange = '24h' } = filters;
    let data = [...farmState.historicalTelemetry];

    if (poleId && poleId !== 'all') {
      const pole = farmState.poles.find(p => p.id === poleId);
      if (pole) {
        data = data.map(item => ({
          ...item,
          moisture: pole.telemetry.moisture,
          temp: pole.telemetry.temperature,
          nitrogen: pole.telemetry.nitrogen,
          phosphorus: pole.telemetry.phosphorus,
          potassium: pole.telemetry.potassium,
          ph: pole.telemetry.ph,
          ec: pole.telemetry.ec
        }));
      }
    } else if (zoneId && zoneId !== 'all') {
      const zonePoles = farmState.poles.filter(p => p.zoneId === zoneId);
      if (zonePoles.length > 0) {
        const avgM = Math.round(zonePoles.reduce((acc, p) => acc + p.telemetry.moisture, 0) / zonePoles.length);
        data = data.map(item => ({
          ...item,
          moisture: avgM
        }));
      }
    }

    return {
      timeRange,
      series: data
    };
  },

  /**
   * Fetch alerts with severity & status filters
   */
  async getAlerts(filters = {}) {
    const { severity = 'all', status = 'all' } = filters;
    return farmState.alerts.filter(alert => {
      if (severity !== 'all' && alert.severity !== severity) return false;
      if (status !== 'all' && alert.status !== status) return false;
      return true;
    });
  },

  /**
   * Update pump state (Start/Stop)
   */
  async updatePumpState(status, zoneId = null) {
    farmState.systemControl.pumpStatus = status;
    if (zoneId) {
      const zone = farmState.zones.find(z => z.id === zoneId);
      if (zone) {
        farmState.systemControl.activeZoneId = zone.id;
        farmState.systemControl.activeZoneName = zone.name;
      }
    }
    if (status === 'ON') {
      farmState.systemControl.lastIrrigated = 'Just now';
    }
    return { ...farmState.systemControl };
  },

  /**
   * Toggle manual/automatic irrigation mode
   */
  async updateControlMode(mode) {
    farmState.systemControl.mode = mode;
    return { ...farmState.systemControl };
  },

  /**
   * Acknowledge/Resolve an alert
   */
  async acknowledgeAlert(alertId) {
    const alert = farmState.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = alert.status === 'active' ? 'acknowledged' : 'resolved';
    }
    return [...farmState.alerts];
  },

  /**
   * Simulated AI Assistant query using central mock data
   */
  async sendChatMessage(userQuery) {
    const q = userQuery.toLowerCase().trim();

    // 1. Pole specific moisture / status
    const poleMatch = q.match(/pole\s*(\d+)/i);
    if (poleMatch) {
      const poleNum = poleMatch[1];
      const pole = farmState.poles.find(p => p.id === `pole-${poleNum}` || p.name.toLowerCase() === `pole ${poleNum}`);
      if (pole) {
        return `**${pole.name} (${pole.zoneName})**\n- **Status**: ${pole.status}\n- **Soil Moisture**: ${pole.telemetry.moisture}%\n- **Soil Temp**: ${pole.telemetry.temperature}°C\n- **NPK Levels**: N:${pole.telemetry.nitrogen} P:${pole.telemetry.phosphorus} K:${pole.telemetry.potassium} mg/kg\n- **pH**: ${pole.telemetry.ph} | **EC**: ${pole.telemetry.ec} dS/m\n- **Battery**: ${pole.battery}% (${pole.solarStatus})`;
      }
    }

    // 2. Lowest moisture question
    if (q.includes('lowest moisture') || q.includes('driest') || q.includes('lowest reading')) {
      const sorted = [...farmState.poles].sort((a, b) => a.telemetry.moisture - b.telemetry.moisture);
      const lowest = sorted[0];
      return `The lowest soil moisture is recorded at **${lowest.name} (${lowest.zoneName})** with **${lowest.telemetry.moisture}%** moisture. Irrigation is recommended for this node.`;
    }

    // 3. Zone irrigation requirement
    if (q.includes('irrigation') || q.includes('which zone') || q.includes('need water') || q.includes('recommend')) {
      const rec = farmState.systemControl.recommendation;
      return `**Irrigation Recommendation:**\n${rec.reason}\n- **Recommended Zone**: ${rec.zoneName}\n- **Suggested Duration**: ${rec.suggestedDurationMinutes} minutes\n- **Current Pump Status**: ${farmState.systemControl.pumpStatus} (Mode: ${farmState.systemControl.mode})`;
    }

    // 4. Pump status
    if (q.includes('pump') || q.includes('status') || q.includes('active zone')) {
      return `Current Water Pump status is **${farmState.systemControl.pumpStatus}**. Operating in **${farmState.systemControl.mode}** mode. Active zone: **${farmState.systemControl.activeZoneName}**.`;
    }

    // 5. Agronomic default static response
    return `Based on live Dhara AI telemetry across 6 Field Nodes:\n- **Average Farm Moisture**: ${Math.round(farmState.poles.reduce((a, b) => a + b.telemetry.moisture, 0) / 6)}%\n- **Online Nodes**: ${farmState.poles.filter(p => p.status === 'Online').length} / 6\n- **Critical Alerts**: ${farmState.alerts.filter(a => a.severity === 'critical' && a.status === 'active').length}\n\nYou can ask about specific poles (e.g. "What is Pole 3 moisture?"), zone irrigation needs, or pump status.`;
  }
};
