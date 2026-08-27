export const mockField = {
  id: 1,
  name: "North Field Alpha",
  crop_type: "Wheat",
  location: "Punjab, India",
  area_hectares: 4.5,
  soil_type: "Loamy"
}

export const mockSensorReading = {
  nitrogen: 58.3,
  phosphorus: 34.7,
  potassium: 187.2,
  ph: 6.8,
  ec: 1.2,
  soil_moisture: 62.4,
  soil_temperature: 24.6,
  timestamp: new Date().toISOString(),
  device_status: "online",
  lora_status: "connected",
  last_seen: new Date().toISOString()
}

export const mockWeather = {
  temperature: 31.2,
  humidity: 65,
  rain_probability: 20,
  wind_speed: 12,
  description: "Partly Cloudy",
  source: "mock",
  forecast: [
    { day: "Mon", high: 34, low: 22, rain_probability: 10, description: "Sunny" },
    { day: "Tue", high: 32, low: 21, rain_probability: 30, description: "Partly Cloudy" },
    { day: "Wed", high: 28, low: 19, rain_probability: 70, description: "Rain" },
    { day: "Thu", high: 30, low: 20, rain_probability: 40, description: "Cloudy" },
    { day: "Fri", high: 33, low: 22, rain_probability: 15, description: "Sunny" },
    { day: "Sat", high: 35, low: 23, rain_probability: 5, description: "Sunny" },
    { day: "Sun", high: 31, low: 20, rain_probability: 25, description: "Partly Cloudy" }
  ]
}

export const mockAlerts = [
  { id: 1, alert_type: "LOW_MOISTURE", severity: "HIGH", message: "Soil moisture below 30% in North Field", is_resolved: false, created_at: new Date().toISOString() },
  { id: 2, alert_type: "NUTRIENT_DEFICIENCY", severity: "MEDIUM", message: "Phosphorus levels dropping - consider fertilization", is_resolved: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, alert_type: "SENSOR_DISCONNECTED", severity: "LOW", message: "Sensor NPK-001 last seen 2 hours ago", is_resolved: true, created_at: new Date(Date.now() - 7200000).toISOString() }
]

// Generate 7 days of hourly mock readings for charts
const now = Date.now()
export const mockHistory = Array.from({ length: 168 }, (_, i) => ({
  timestamp: new Date(now - (167 - i) * 3600000).toISOString(),
  time: new Date(now - (167 - i) * 3600000).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}),
  soil_moisture: 45 + Math.sin(i * 0.2) * 15 + Math.random() * 5,
  soil_temperature: 24 + Math.sin(i * 0.15) * 4 + Math.random() * 2,
  ph: 6.5 + Math.sin(i * 0.1) * 0.3,
  nitrogen: 55 + Math.sin(i * 0.3) * 10 + Math.random() * 3,
  phosphorus: 32 + Math.sin(i * 0.25) * 5 + Math.random() * 2,
  potassium: 185 + Math.sin(i * 0.2) * 20 + Math.random() * 5,
  ec: 1.2 + Math.sin(i * 0.1) * 0.2,
}))

export const mockWaterData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(now - (29 - i) * 86400000).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
  supplied: 200 + Math.random() * 100,
  recommended: 250,
  duration_minutes: 45 + Math.random() * 30
}))

export const mockFertilizerData = Array.from({ length: 10 }, (_, i) => ({
  date: new Date(now - i * 7 * 86400000).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
  fertilizer_type: ["NPK 20-20-20", "Urea", "DAP", "MOP"][i % 4],
  amount_kg: 25 + Math.random() * 50,
  nitrogen_content: 20 + Math.random() * 20,
  phosphorus_content: 10 + Math.random() * 15,
  potassium_content: 10 + Math.random() * 15
}))
