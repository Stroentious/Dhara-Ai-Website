import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { mockHistory } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Analytics = () => {
  const { language, t } = useLanguage();
  const [range, setRange] = useState('7');
  const [tab, setTab] = useState('soil');

  useEffect(() => {
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) headerTitle.textContent = t('nav.analytics');
  }, [t]);

  const tabs = [
    { id: 'soil', label: t('analytics.tabSoil', 'Soil Health (pH & EC)') },
    { id: 'npk', label: t('analytics.tabNpk', 'Nutrients (NPK)') },
    { id: 'temp', label: t('analytics.tabTemp', 'Moisture & Temp') }
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
          {tabs.map(item => (
            <button 
              key={item.id}
              onClick={() => setTab(item.id)}
              style={{
                background: tab === item.id ? 'var(--bg-card)' : 'transparent',
                color: tab === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer',
                fontWeight: tab === item.id ? 600 : 400, transition: 'var(--transition)',
                boxShadow: tab === item.id ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <select 
          value={range} 
          onChange={e => setRange(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="7">{t('analytics.last7d', 'Last 7 Days')}</option>
          <option value="30">{t('analytics.last30d', 'Last 30 Days')}</option>
          <option value="90">{t('analytics.last90d', 'Last 90 Days')}</option>
        </select>
      </div>

      <div className="glass-card" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '1rem' }}>{t('analytics.historicalTrends', 'Historical Trends')}</h3>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockHistory.filter((_,i) => i%6===0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              
              {tab === 'soil' && (
                <>
                  <YAxis yAxisId="left" stroke="var(--text-muted)" domain={[5, 8]} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" domain={[0, 3]} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)' }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="ph" name={t('sensors.ph', 'pH Level')} stroke="var(--accent-primary)" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="ec" name={t('sensors.ec', 'EC (dS/m)')} stroke="var(--accent-amber)" strokeWidth={2} dot={false} />
                </>
              )}

              {tab === 'npk' && (
                <>
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="nitrogen" name={t('fertilizer.nitrogen', 'Nitrogen (N)')} stroke="var(--accent-primary)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="phosphorus" name={t('fertilizer.phosphorus', 'Phosphorus (P)')} stroke="var(--accent-amber)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="potassium" name={t('fertilizer.potassium', 'Potassium (K)')} stroke="var(--accent-blue)" strokeWidth={2} dot={false} />
                </>
              )}

              {tab === 'temp' && (
                <>
                  <YAxis yAxisId="left" stroke="var(--text-muted)" domain={[20, 100]} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" domain={[10, 40]} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)' }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="soil_moisture" name={t('sensors.moisture', 'Moisture %')} stroke="var(--accent-blue)" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="soil_temperature" name={t('sensors.temp', 'Temperature °C')} stroke="var(--accent-amber)" strokeWidth={2} dot={false} />
                </>
              )}

            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card">
        <h3>{t('analytics.aiAnalysisTitle', 'AI Trend Analysis')}</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '1rem' }}>
          {t('analytics.aiAnalysisDesc', 'Based on the selected timeframe, nitrogen levels have been highly volatile, showing rapid depletion within 14 days of fertilizer application. Consider switching to a slow-release nitrogen fertilizer. Soil moisture retention is excellent, suggesting current irrigation schedules can be extended by 20% without impacting yield.')}
        </p>
      </div>
    </div>
  );
};

export default Analytics;
