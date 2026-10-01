import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { mockWeather } from '../data/mockData';
import { CloudRain, Wind, Droplets, Sun, Cloud, CloudLightning } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DAY_MAP_HI = {
  'Mon': 'सोम',
  'Tue': 'मंगल',
  'Wed': 'बुध',
  'Thu': 'गुरु',
  'Fri': 'शुक्र',
  'Sat': 'शनि',
  'Sun': 'रवि',
  'Today': 'आज',
  'Tomorrow': 'कल'
};

const DESC_MAP_HI = {
  'Sunny': 'धूप खिली',
  'Partly Cloudy': 'आंशिक बादल',
  'Cloudy': 'बादल छाए',
  'Scattered Showers': 'हल्की बौछारें',
  'Rain': 'बारिश',
  'Thunderstorm': 'तूफान / आंधी',
  'Clear': 'साफ मौसम',
  'Optimal microclimate with moderate humidity and sunshine': 'अनुकूल सूक्ष्म जलवायु, मध्यम आर्द्रता और खिली धूप'
};

const Weather = () => {
  const { language, t, tWeather, tDay } = useLanguage();

  useEffect(() => {
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) headerTitle.textContent = t('nav.weather');
  }, [t]);

  const getWeatherIcon = (desc = '') => {
    const d = desc.toLowerCase();
    if (d.includes('rain') || d.includes('shower')) return <CloudRain size={32} color="var(--accent-blue)" />;
    if (d.includes('cloud')) return <Cloud size={32} color="var(--text-secondary)" />;
    if (d.includes('storm')) return <CloudLightning size={32} color="var(--accent-amber)" />;
    return <Sun size={32} color="var(--accent-amber)" />;
  };

  const getLocalizedDesc = (desc) => {
    return tWeather(desc) || desc;
  };

  const getLocalizedDay = (day) => {
    return tDay(day) || day;
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Current conditions large */}
      <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(20,15,10,0.9), rgba(212,163,89,0.1))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {getWeatherIcon(mockWeather.description)}
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1 }}>{mockWeather.temperature}°C</div>
            <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
              {getLocalizedDesc(mockWeather.description)}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
              <Droplets size={20} color="var(--accent-blue)" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('dashboard.humidity')}</div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{mockWeather.humidity}%</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
              <Wind size={20} color="var(--text-secondary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('dashboard.windSpeed')}</div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{mockWeather.wind_speed} km/h</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
              <CloudRain size={20} color="var(--accent-blue)" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('dashboard.rainProb')}</div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{mockWeather.rain_probability}%</div>
            </div>
          </div>
        </div>
      </div>

      <p style={{ margin: '-0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
        {t('weather.sourceNotice')}
      </p>

      {/* Forecast Cards */}
      <h3>{t('weather.forecastTitle')}</h3>
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'thin' }}>
        {mockWeather.forecast.map((day, i) => (
          <div key={i} className="glass-card" style={{ minWidth: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 1rem' }}>
            <span style={{ fontWeight: 600 }}>{getLocalizedDay(day.day)}</span>
            {getWeatherIcon(day.description)}
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '1.1rem' }}>
              <span style={{ fontWeight: 700 }}>{day.high}°</span>
              <span style={{ color: 'var(--text-muted)' }}>{day.low}°</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Droplets size={10} /> {day.rain_probability}%
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card">
        <h3 style={{ marginBottom: '1rem' }}>{t('weather.trendsTitle')}</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockWeather.forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
              <XAxis dataKey="day" tickFormatter={getLocalizedDay} stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="high" name={t('weather.maxTemp')} stroke="var(--accent-amber)" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="left" type="monotone" dataKey="low" name={t('weather.minTemp')} stroke="var(--text-muted)" strokeWidth={2} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="rain_probability" name={t('weather.rainProbPercent')} stroke="var(--accent-blue)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Weather;
