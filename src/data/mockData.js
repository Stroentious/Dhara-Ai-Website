/**
 * Centralized Mock Data Source for Dhara AI
 * Single source of truth across all components and views.
 */

export const initialFarmData = {
  zones: [
    {
      id: 'zone-1',
      name: 'Zone 1 — North Orchard',
      cropType: 'Apple Trees',
      soilType: 'Loam',
      targetMoistureMin: 35,
      targetMoistureMax: 60,
      poleIds: ['pole-1', 'pole-2']
    },
    {
      id: 'zone-2',
      name: 'Zone 2 — Greenhouse Alpha',
      cropType: 'Bell Peppers',
      soilType: 'Sandy Loam',
      targetMoistureMin: 40,
      targetMoistureMax: 65,
      poleIds: ['pole-3', 'pole-4']
    },
    {
      id: 'zone-3',
      name: 'Zone 3 — South Field',
      cropType: 'Wheat / Grain',
      soilType: 'Silt Loam',
      targetMoistureMin: 30,
      targetMoistureMax: 55,
      poleIds: ['pole-5', 'pole-6']
    }
  ],
  poles: [
    {
      id: 'pole-1',
      name: 'Pole 1',
      zoneId: 'zone-1',
      zoneName: 'Zone 1 — North Orchard',
      status: 'Online',
      lastUpdated: '2 mins ago',
      battery: 92,
      solarStatus: 'Charging',
      signalStrength: -68, // dBm
      telemetry: {
        moisture: 48, // %
        temperature: 22.4, // °C
        nitrogen: 145, // mg/kg
        phosphorus: 42, // mg/kg
        potassium: 180, // mg/kg
        ph: 6.7,
        ec: 1.4 // dS/m
      }
    },
    {
      id: 'pole-2',
      name: 'Pole 2',
      zoneId: 'zone-1',
      zoneName: 'Zone 1 — North Orchard',
      status: 'Online',
      lastUpdated: '5 mins ago',
      battery: 88,
      solarStatus: 'Charging',
      signalStrength: -72,
      telemetry: {
        moisture: 45,
        temperature: 23.1,
        nitrogen: 138,
        phosphorus: 39,
        potassium: 175,
        ph: 6.6,
        ec: 1.3
      }
    },
    {
      id: 'pole-3',
      name: 'Pole 3',
      zoneId: 'zone-2',
      zoneName: 'Zone 2 — Greenhouse Alpha',
      status: 'Online',
      lastUpdated: '1 min ago',
      battery: 96,
      solarStatus: 'Charging',
      signalStrength: -58,
      telemetry: {
        moisture: 24, // Low moisture! Needs irrigation
        temperature: 26.8,
        nitrogen: 110,
        phosphorus: 28,
        potassium: 140,
        ph: 6.2,
        ec: 1.8
      }
    },
    {
      id: 'pole-4',
      name: 'Pole 4',
      zoneId: 'zone-2',
      zoneName: 'Zone 2 — Greenhouse Alpha',
      status: 'Warning',
      lastUpdated: '3 mins ago',
      battery: 34, // Low battery warning
      solarStatus: 'Idle',
      signalStrength: -84,
      telemetry: {
        moisture: 28, // Low moisture
        temperature: 27.2,
        nitrogen: 115,
        phosphorus: 30,
        potassium: 148,
        ph: 6.3,
        ec: 1.9
      }
    },
    {
      id: 'pole-5',
      name: 'Pole 5',
      zoneId: 'zone-3',
      zoneName: 'Zone 3 — South Field',
      status: 'Online',
      lastUpdated: '4 mins ago',
      battery: 81,
      solarStatus: 'Charging',
      signalStrength: -76,
      telemetry: {
        moisture: 42,
        temperature: 21.5,
        nitrogen: 155,
        phosphorus: 48,
        potassium: 192,
        ph: 6.8,
        ec: 1.2
      }
    },
    {
      id: 'pole-6',
      name: 'Pole 6',
      zoneId: 'zone-3',
      zoneName: 'Zone 3 — South Field',
      status: 'Offline',
      lastUpdated: '45 mins ago',
      battery: 12,
      solarStatus: 'Low Power',
      signalStrength: -110,
      telemetry: {
        moisture: 38,
        temperature: 20.8,
        nitrogen: 142,
        phosphorus: 44,
        potassium: 185,
        ph: 6.7,
        ec: 1.3
      }
    }
  ],
  systemControl: {
    pumpStatus: 'OFF', // 'ON' | 'OFF'
    mode: 'AUTOMATIC', // 'MANUAL' | 'AUTOMATIC'
    activeZoneId: 'zone-2',
    activeZoneName: 'Zone 2 — Greenhouse Alpha',
    lastIrrigated: '3 hours ago',
    recommendation: {
      zoneId: 'zone-2',
      zoneName: 'Zone 2 — Greenhouse Alpha',
      reason: 'Average soil moisture (26%) in Zone 2 is below configured threshold (40%).',
      suggestedDurationMinutes: 25,
      isIrrigationNeeded: true
    }
  },
  alerts: [
    {
      id: 'alt-101',
      title: 'Critical Soil Moisture Deficit',
      description: 'Pole 3 (Greenhouse Alpha) registered moisture level of 24%, critically below the 40% threshold.',
      zoneId: 'zone-2',
      zoneName: 'Zone 2 — Greenhouse Alpha',
      poleId: 'pole-3',
      severity: 'critical',
      timestamp: '15 mins ago',
      status: 'active'
    },
    {
      id: 'alt-102',
      title: 'Field Node Disconnected',
      description: 'Pole 6 (South Field) missed 3 consecutive LoRa heartbeat cycles. Last recorded battery level 12%.',
      zoneId: 'zone-3',
      zoneName: 'Zone 3 — South Field',
      poleId: 'pole-6',
      severity: 'warning',
      timestamp: '45 mins ago',
      status: 'active'
    },
    {
      id: 'alt-103',
      title: 'Low Battery Level',
      description: 'Pole 4 battery dropped to 34%. Solar panel charging efficiency decreased.',
      zoneId: 'zone-2',
      zoneName: 'Zone 2 — Greenhouse Alpha',
      poleId: 'pole-4',
      severity: 'warning',
      timestamp: '2 hours ago',
      status: 'active'
    },
    {
      id: 'alt-104',
      title: 'Fertigation Cycle Complete',
      description: 'Automated NPK nutrient dosing finished successfully for Zone 1.',
      zoneId: 'zone-1',
      zoneName: 'Zone 1 — North Orchard',
      poleId: 'pole-1',
      severity: 'info',
      timestamp: '5 hours ago',
      status: 'resolved'
    }
  ],
  historicalTelemetry: [
    { time: '00:00', moisture: 44, temp: 18.2, ph: 6.6, ec: 1.4, nitrogen: 140, phosphorus: 40, potassium: 170, waterUsage: 0 },
    { time: '03:00', moisture: 42, temp: 17.5, ph: 6.6, ec: 1.4, nitrogen: 140, phosphorus: 40, potassium: 170, waterUsage: 0 },
    { time: '06:00', moisture: 39, temp: 19.1, ph: 6.5, ec: 1.5, nitrogen: 138, phosphorus: 39, potassium: 168, waterUsage: 120 },
    { time: '09:00', moisture: 35, temp: 23.4, ph: 6.5, ec: 1.5, nitrogen: 135, phosphorus: 38, potassium: 165, waterUsage: 0 },
    { time: '12:00', moisture: 31, temp: 27.8, ph: 6.4, ec: 1.6, nitrogen: 132, phosphorus: 37, potassium: 162, waterUsage: 0 },
    { time: '15:00', moisture: 28, temp: 28.5, ph: 6.4, ec: 1.7, nitrogen: 130, phosphorus: 36, potassium: 160, waterUsage: 0 },
    { time: '18:00', moisture: 37, temp: 24.2, ph: 6.5, ec: 1.5, nitrogen: 142, phosphorus: 40, potassium: 172, waterUsage: 250 },
    { time: '21:00', moisture: 38, temp: 21.0, ph: 6.6, ec: 1.4, nitrogen: 140, phosphorus: 40, potassium: 170, waterUsage: 0 }
  ]
};
