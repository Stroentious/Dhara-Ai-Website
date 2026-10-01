import React, { useState, useEffect } from 'react';
import { useField } from '../context/FieldContext';
import { useLanguage } from '../context/LanguageContext';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import { mockSensorReading, mockHistory, mockWeather } from '../data/mockData';
import { Droplets, Thermometer, Beaker, FlaskConical, Zap, CloudSun } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const CROP_MAP_HI = {
  'Wheat': 'गेहूं',
  'Rice': 'धान',
  'Cotton': 'कपास',
  'Corn': 'मक्का',
  'Maize': 'मक्का',
  'Soybean': 'सोयाबीन',
  'Mustard': 'सरसों',
  'Sugarcane': 'गन्ना',
  'Tomato': 'टमाटर',
  'Potato': 'आलू',
};

const DESC_MAP_HI = {
  'Sunny': 'धूप खिली हुई',
  'Partly Cloudy': 'आंशिक बादल',
  'Cloudy': 'बादल छाए रहेंगे',
  'Light Rain': 'हल्की बारिश',
  'Rain': 'बारिश',
  'Clear': 'साफ़ मौसम',
  'Scattered Showers': 'रुक-रुक कर बारिश',
};

const DAY_MAP_HI = {
  'Mon': 'सोम',
  'Tue': 'मंगल',
  'Wed': 'बुध',
  'Thu': 'गुरु',
  'Fri': 'शुक्र',
  'Sat': 'शनि',
  'Sun': 'रवि',
  'Today': 'आज',
  'Tomorrow': 'कल',
};

const Dashboard = () => {
  const { selectedField } = useField();
  const { t, language, tCrop, tWeather, tDay } = useLanguage();
  const isHi = language !== 'en';
  const [reading, setReading] = useState(null);
  const [history, setHistory] = useState([]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // In real app, fetch from API. Using mock data for reliable demo
    setReading(mockSensorReading);
    setHistory(mockHistory.slice(-24)); // Last 24 hours
    setWeather(mockWeather);
    
    // Set page title (would normally be in Layout, but handled here via document for simplicity)
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) headerTitle.textContent = t('nav.dashboard');
  }, [selectedField, t]);

  if (!selectedField || !reading) return null;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Row 1: Field Info Header */}
      <div data-tour="field-header" className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: '0 0 0.25rem 0' }}>{selectedField.name}</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {tCrop(selectedField.crop_type)} • {selectedField.location} • {selectedField.area_hectares} {t('dashboard.hectares')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {t('dashboard.lastUpdate')}
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              {new Date(reading.timestamp).toLocaleTimeString(`${language}-IN`)}
            </p>
          </div>
          <StatusBadge status={reading.device_status} label={t('dashboard.sensorOnline')} />
        </div>
      </div>

      {/* Row 2: KPI Metrics */}
      <div data-tour="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div data-tour="soil-moisture">
          <MetricCard
            title={t('dashboard.soilMoisture')}
            value={reading.soil_moisture.toFixed(1)}
            unit="%"
            icon={Droplets}
            color="blue"
            trend="down"
            trendValue="2%"
          />
        </div>
        <MetricCard
          title={t('dashboard.soilTemp')}
          value={reading.soil_temperature.toFixed(1)}
          unit="°C"
          icon={Thermometer}
          color="amber"
        />
        <MetricCard
          title={t('dashboard.phLevel')}
          value={reading.ph.toFixed(1)}
          unit=""
          icon={Beaker}
          color="green"
        />
        <div data-tour="npk-sensor">
          <MetricCard
            title={t('dashboard.nitrogen')}
            value={reading.nitrogen.toFixed(0)}
            unit="mg/kg"
            icon={FlaskConical}
            color="green"
            trend="up"
            trendValue="5%"
          />
        </div>
        <MetricCard
          title={t('dashboard.phosphorus')}
          value={reading.phosphorus.toFixed(0)}
          unit="mg/kg"
          icon={FlaskConical}
          color="amber"
          trend="down"
          trendValue="1%"
        />
        <MetricCard
          title={t('dashboard.potassium')}
          value={reading.potassium.toFixed(0)}
          unit="mg/kg"
          icon={FlaskConical}
          color="green"
        />
        <div data-tour="lora">
          <MetricCard
            title={t('dashboard.ec')}
            value={reading.ec.toFixed(1)}
            unit="dS/m"
            icon={Zap}
            color="amber"
          />
        </div>
        <div data-tour="water">
          <MetricCard
            title={t('dashboard.waterSupplied')}
            value="2,450"
            unit="L"
            icon={Droplets}
            color="blue"
          />
        </div>
      </div>

      {/* Row 3: Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
        <div data-tour="moisture-chart" className="glass-card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            {t('dashboard.moistureChartTitle')}
          </h3>
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
                <Area yAxisId="left" type="monotone" dataKey="soil_moisture" name={t('dashboard.soilMoisture') + ' (%)'} stroke="var(--accent-blue)" fillOpacity={1} fill="url(#colorMoisture)" />
                <Area yAxisId="right" type="monotone" dataKey="soil_temperature" name={t('dashboard.soilTemp') + ' (°C)'} stroke="var(--accent-amber)" fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div data-tour="fertilizer" className="glass-card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            {t('dashboard.npkChartTitle')}
          </h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history.filter((_,i) => i%4 === 0).slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="nitrogen" name={t('dashboard.nitrogen')} fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="phosphorus" name={t('dashboard.phosphorus')} fill="var(--accent-amber)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="potassium" name={t('dashboard.potassium')} fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Local Weather Forecast */}
      <div data-tour="weather" className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CloudSun size={18} color="var(--accent-amber)" /> {t('dashboard.weatherTitle')}
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {t('dashboard.weatherSubtitle')}
          </span>
        </div>
        {weather && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.1 }}>{weather.temperature}°C</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem', fontWeight: 500 }}>
                  {isHi ? (DESC_MAP_HI[weather.description] || weather.description) : weather.description}
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div>{t('dashboard.humidity')}: <strong style={{ color: 'var(--text-primary)' }}>{weather.humidity}%</strong></div>
                <div>{t('dashboard.windSpeed')}: <strong style={{ color: 'var(--text-primary)' }}>{weather.wind_speed} {isHi ? 'किमी/घंटा' : 'km/h'}</strong></div>
                <div>{t('dashboard.rainProb')}: <strong style={{ color: 'var(--text-primary)' }}>{weather.rain_probability}%</strong></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              {weather.forecast.slice(0, 6).map((day, i) => (
                <div key={i} style={{ flex: 1, minWidth: '65px', textAlign: 'center', padding: '0.65rem 0.5rem', background: 'var(--bg-glass)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    {isHi ? (DAY_MAP_HI[day.day] || day.day) : day.day}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{day.high}°</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{day.rain_probability}% 🌧</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
