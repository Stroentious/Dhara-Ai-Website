/**
 * Soil Telemetry Contract
 * Represents high-frequency physical sensor data gathered by ESP32-C3 Field Poles
 * via RS485 Modbus soil sensors.
 */
export interface SoilTelemetryReadings {
  /** Nitrogen content in mg/kg (ppm) */
  nitrogen: number;
  /** Phosphorus content in mg/kg (ppm) */
  phosphorus: number;
  /** Potassium content in mg/kg (ppm) */
  potassium: number;
  /** Soil pH (range 0.0 - 14.0) */
  ph: number;
  /** Electrical Conductivity in uS/cm or dS/m */
  ec: number;
  /** Volumetric Soil Moisture percentage (0.0% - 100.0%) */
  soilMoisture: number;
  /** Soil Temperature in degrees Celsius */
  soilTemperature: number;
}

export interface FieldPoleHealthTelemetry {
  /** Solar panel voltage (mV) */
  solarVoltage: number;
  /** Battery charge percentage (0 - 100) */
  batteryLevel: number;
  /** LoRa Signal Strength Indication (dBm) */
  rssi: number;
  /** Signal-to-Noise Ratio (dB) */
  snr: number;
  /** Device operating uptime in seconds */
  uptimeSeconds: number;
}

export interface FieldPoleTelemetryPacket {
  packetId: string;
  fieldPoleId: string;
  substationId: string;
  zoneId: string;
  fieldId: string;
  farmId: string;
  organizationId: string;
  timestamp: string; // ISO-8601 string
  readings: SoilTelemetryReadings;
  health: FieldPoleHealthTelemetry;
  isSimulated?: boolean;
}
