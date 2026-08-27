import React, { useState, useEffect } from 'react';
import { useField } from '../context/FieldContext';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import AlertItem from '../components/AlertItem';
import { mockSensorReading, mockHistory, mockWeather, mockAlerts } from '../data/mockData';
import { Droplets, Thermometer, Beaker, FlaskConical, Zap, CloudSun, Leaf } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const Dashboard = () => {
  const { selectedField } = useField();
  const [reading, setReading] = useState(null);
  const [history, setHistory] = useState([]);
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // In real app, fetch from API. Using mock data for reliable demo
    setReading(mockSensorReading);
    setHistory(mockHistory.slice(-24)); // Last 24 hours
    setWeather(mockWeather);
    setAlerts(mockAlerts);
    
    // Set page title (would normally be in Layout, but handled here via document for simplicity)
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) headerTitle.textContent = 'Dashboard';
  }, [selectedField]);

  if (!selectedField || !reading) return null;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Row 1: Field Info Header */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: '0 0 0.25rem 0' }}>{selectedField.name}</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {selectedField.crop_type} • {selectedField.location} • {selectedField.area_hectares} ha
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last Update</p>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>{new Date(reading.timestamp).toLocaleTimeString()}</p>
          </div>
          <StatusBadge status={reading.device_status} label="Sensor Online" />
        </div>
      </div>

      {/* Row 2: KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <MetricCard title="Soil Moisture" value={reading.soil_moisture.toFixed(1)} unit="%" icon={Droplets} color="blue" trend="down" trendValue="2%" />
        <MetricCard title="Soil Temp" value={reading.soil_temperature.toFixed(1)} unit="°C" icon={Thermometer} color="amber" />
        <MetricCard title="pH Level" value={reading.ph.toFixed(1)} unit="" icon={Beaker} color="green" />
        <MetricCard title="Nitrogen (N)" value={reading.nitrogen.toFixed(0)} unit="mg/kg" icon={FlaskConical} color="green" trend="up" trendValue="5%" />
        <MetricCard title="Phosphorus (P)" value={reading.phosphorus.toFixed(0)} unit="mg/kg" icon={FlaskConical} color="amber" trend="down" trendValue="1%" />
        <MetricCard title="Potassium (K)" value={reading.potassium.toFixed(0)} unit="mg/kg" icon={FlaskConical} color="green" />
        <MetricCard title="Elec. Cond (EC)" value={reading.ec.toFixed(1)} unit="dS/m" icon={Zap} color="amber" />
        <MetricCard title="Water Supplied" value="2,450" unit="L" icon={Droplets} color="blue" />
      </div>

      {/* Row 3: Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Moisture & Temperature (24h)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-amber)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-amber)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="soil_moisture" name="Moisture %" stroke="var(--accent-blue)" fillOpacity={1} fill="url(#colorMoisture)" />
                <Area yAxisId="right" type="monotone" dataKey="soil_temperature" name="Temp °C" stroke="var(--accent-amber)" fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>NPK Trends (Last 7 Days)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history.filter((_,i) => i%4 === 0).slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="nitrogen" name="Nitrogen (N)" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="phosphorus" name="Phosphorus (P)" fill="var(--accent-amber)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="potassium" name="Potassium (K)" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Weather, Alerts, AI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        
        {/* Weather Mini */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CloudSun size={18} color="var(--accent-amber)" /> Local Weather
          </h3>
          {weather && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{weather.temperature}°C</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{weather.description}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <p style={{ margin: '0 0 0.25rem 0' }}>Humidity: {weather.humidity}%</p>
                  <p style={{ margin: '0 0 0.25rem 0' }}>Wind: {weather.wind_speed} km/h</p>
                  <p style={{ margin: 0 }}>Rain Prob: {weather.rain_probability}%</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
                {weather.forecast.slice(0, 3).map((day, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: 'var(--bg-glass)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{day.day}</div>
                    <div style={{ fontWeight: 600 }}>{day.high}°</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Alerts */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
            Active Alerts
            <span style={{ fontSize: '0.75rem', background: 'var(--accent-red)', padding: '2px 8px', borderRadius: '10px', color: '#fff' }}>{alerts.filter(a => !a.is_resolved).length}</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {alerts.slice(0, 3).map(alert => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass-card" style={{ background: 'linear-gradient(145deg, rgba(15,30,20,0.9), rgba(22,163,74,0.1))' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
            <Leaf size={18} /> DHARA AI Insights
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <li>Soil moisture is optimal. Skip irrigation today as there is a 20% chance of rain.</li>
            <li>Phosphorus levels are slightly below the ideal 40 mg/kg for Wheat at this growth stage.</li>
            <li>Consider applying DAP fertilizer within the next 4 days.</li>
            <li>No pest activity detected based on current thermal and moisture signatures.</li>
          </ul>
          <button className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.85rem' }}>
            Ask DHARA AI for more details
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
