import React, { useEffect, useState } from 'react';
import { mockHistory } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Analytics = () => {
  const [range, setRange] = useState('7');
  const [tab, setTab] = useState('soil');

  useEffect(() => {
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) headerTitle.textContent = 'Data Analytics';
  }, []);

  const tabs = [
    { id: 'soil', label: 'Soil Health (pH & EC)' },
    { id: 'npk', label: 'Nutrients (NPK)' },
    { id: 'temp', label: 'Moisture & Temp' }
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
          {tabs.map(t => (
            <button 
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: tab === t.id ? 'var(--bg-card)' : 'transparent',
                color: tab === t.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer',
                fontWeight: tab === t.id ? 600 : 400, transition: 'var(--transition)',
                boxShadow: tab === t.id ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <select 
          value={range} 
          onChange={e => setRange(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      <div className="glass-card" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '1rem' }}>Historical Trends</h3>
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
                  <Line yAxisId="left" type="monotone" dataKey="ph" name="pH Level" stroke="var(--accent-primary)" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="ec" name="EC (dS/m)" stroke="var(--accent-amber)" strokeWidth={2} dot={false} />
                </>
              )}

              {tab === 'npk' && (
                <>
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="nitrogen" name="Nitrogen (N)" stroke="var(--accent-primary)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="phosphorus" name="Phosphorus (P)" stroke="var(--accent-amber)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="potassium" name="Potassium (K)" stroke="var(--accent-blue)" strokeWidth={2} dot={false} />
                </>
              )}

              {tab === 'temp' && (
                <>
                  <YAxis yAxisId="left" stroke="var(--text-muted)" domain={[20, 100]} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" domain={[10, 40]} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)' }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="soil_moisture" name="Moisture %" stroke="var(--accent-blue)" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="soil_temperature" name="Temperature °C" stroke="var(--accent-amber)" strokeWidth={2} dot={false} />
                </>
              )}

            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card">
        <h3>AI Trend Analysis</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '1rem' }}>
          Based on the selected timeframe, nitrogen levels have been highly volatile, showing rapid depletion within 14 days of fertilizer application. Consider switching to a slow-release nitrogen fertilizer. Soil moisture retention is excellent, suggesting current irrigation schedules can be extended by 20% without impacting yield.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
