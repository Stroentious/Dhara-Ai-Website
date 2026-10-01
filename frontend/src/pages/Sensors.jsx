import React, { useEffect, useState } from 'react';
import { useField } from '../context/FieldContext';
import { useLanguage } from '../context/LanguageContext';
import SensorGauge from '../components/SensorGauge';
import { mockSensorReading, mockHistory } from '../data/mockData';
import { Radio, Battery, Signal, Clock, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatusBadge from '../components/StatusBadge';

const Sensors = () => {
  const { selectedField } = useField();
  const { language, t, tTimeAgo } = useLanguage();
  const [reading, setReading] = useState(mockSensorReading);
  const [history, setHistory] = useState(mockHistory.slice(-24));
  const [chartMetric, setChartMetric] = useState('soil_moisture');

  useEffect(() => {
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) headerTitle.textContent = t('nav.sensors');
  }, [t]);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* hardware info */}
      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(212, 163, 89, 0.1)', borderRadius: '12px' }}>
            <Radio size={24} color="var(--accent-primary)"/>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('sensors.nodeId')}</div>
            <div style={{ fontWeight: 600 }}>NPK-7IN1-001</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
            <Signal size={24} color="var(--accent-blue)"/>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('sensors.loraStatus')}</div>
            <div style={{ fontWeight: 600 }}><StatusBadge status="connected" /></div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
            <Battery size={24} color="var(--accent-amber)"/>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('sensors.batteryLevel')}</div>
            <div style={{ fontWeight: 600 }}>87% ({t('sensors.solarCharging')})</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(156, 163, 175, 0.1)', borderRadius: '12px' }}>
            <Clock size={24} color="#9ca3af"/>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('sensors.lastPacket')}</div>
            <div style={{ fontWeight: 600 }}>{tTimeAgo(2)}</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '1rem', color: 'var(--accent-amber)', alignItems: 'center' }}>
        <AlertTriangle size={20} />
        <span style={{ fontSize: '0.9rem' }}>{t('sensors.hardwareNotice')}</span>
      </div>

      {/* Gauges */}
      <h3 style={{ marginTop: '1rem' }}>{t('sensors.sensorGridTitle')}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        <SensorGauge value={reading.soil_moisture.toFixed(1)} label={t('dashboard.soilMoisture')} unit="%" color="blue" />
        <SensorGauge value={reading.soil_temperature.toFixed(1)} label={t('dashboard.soilTemp')} unit="°C" max={50} color="amber" />
        <SensorGauge value={reading.ph.toFixed(1)} label={t('dashboard.phLevel')} unit="" max={14} color="green" />
        <SensorGauge value={reading.nitrogen.toFixed(0)} label={t('dashboard.nitrogen')} unit="mg/kg" max={200} color="green" />
        <SensorGauge value={reading.phosphorus.toFixed(0)} label={t('dashboard.phosphorus')} unit="mg/kg" max={100} color="amber" />
        <SensorGauge value={reading.potassium.toFixed(0)} label={t('dashboard.potassium')} unit="mg/kg" max={300} color="green" />
        <SensorGauge value={reading.ec.toFixed(1)} label={t('dashboard.ec')} unit="dS/m" max={5} color="amber" />
      </div>

      {/* History Chart */}
      <div className="glass-card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ margin: 0 }}>{t('sensors.title')} (24h)</h3>
          <select 
            value={chartMetric} 
            onChange={e => setChartMetric(e.target.value)}
            style={{ width: 'auto', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}
          >
            <option value="soil_moisture">{t('dashboard.soilMoisture')}</option>
            <option value="soil_temperature">{t('dashboard.soilTemp')}</option>
            <option value="ph">{t('dashboard.phLevel')}</option>
            <option value="nitrogen">{t('dashboard.nitrogen')}</option>
            <option value="phosphorus">{t('dashboard.phosphorus')}</option>
            <option value="potassium">{t('dashboard.potassium')}</option>
            <option value="ec">{t('dashboard.ec')}</option>
          </select>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey={chartMetric} stroke="var(--accent-primary)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default Sensors;
