import React, { useEffect, useState } from 'react';
import { useField } from '../context/FieldContext';
import { useLanguage } from '../context/LanguageContext';
import MetricCard from '../components/MetricCard';
import { mockWaterData } from '../data/mockData';
import { Droplets, Calendar, Clock, CloudRain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Irrigation = () => {
  const { selectedField } = useField();
  const { language, t, tDay } = useLanguage();
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) headerTitle.textContent = t('nav.irrigation');
  }, [t]);

  const handleLog = (e) => {
    e.preventDefault();
    alert(t('irrigation.saveLog') + ' ✓');
    setAmount(''); setDuration(''); setNotes('');
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ background: 'var(--gradient-primary)', padding: '1.5rem', borderRadius: '16px', color: '#fff', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '50%' }}>
          <Droplets size={48} color="#fff" />
        </div>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
            {t('irrigation.recommendationTitle')}
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>
            {t('irrigation.scheduleNotice')}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <MetricCard title={t('dashboard.soilMoisture')} value="62.4" unit="%" icon={Droplets} color="blue" />
        <MetricCard title={t('dashboard.waterSupplied')} value="0" unit="L" icon={CloudRain} color="blue" />
        <MetricCard title={t('irrigation.dripCycle')} value={tDay('Tomorrow')} unit="06:00 AM" icon={Calendar} color="amber" />
        <MetricCard title={t('irrigation.waterUsageTitle')} value="4,250" unit="L" icon={Clock} color="green" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>
            {t('irrigation.waterUsageTitle')}
          </h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWaterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="supplied" name={t('dashboard.waterSupplied') + ' (L)'} fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recommended" name={t('irrigation.dripCycle') + ' (L)'} fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem' }}>
            {t('irrigation.logTitle')}
          </h3>
          <form onSubmit={handleLog} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                {t('irrigation.amountLiters')}
              </label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="e.g. 500" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                {t('irrigation.durationMinutes')}
              </label>
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} required placeholder="e.g. 45" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                {t('irrigation.notes')}
              </label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="..." rows={3}></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: 'auto' }}>
              {t('irrigation.saveLog')}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Irrigation;
