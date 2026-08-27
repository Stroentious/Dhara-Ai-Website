import React, { useEffect, useState } from 'react';
import { useField } from '../context/FieldContext';
import MetricCard from '../components/MetricCard';
import { mockWaterData } from '../data/mockData';
import { Droplets, Calendar, Clock, CloudRain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Irrigation = () => {
  const { selectedField } = useField();
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) headerTitle.textContent = 'Irrigation Management';
  }, []);

  const handleLog = (e) => {
    e.preventDefault();
    alert('Irrigation logged successfully! (Mock)');
    setAmount(''); setDuration(''); setNotes('');
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ background: 'var(--gradient-primary)', padding: '1.5rem', borderRadius: '16px', color: '#fff', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '50%' }}>
          <Droplets size={48} color="#fff" />
        </div>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Smart Recommendation</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Based on current soil moisture (62%) and upcoming rain probability (20%), <strong>irrigation is not needed today</strong>.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <MetricCard title="Current Moisture" value="62.4" unit="%" icon={Droplets} color="blue" />
        <MetricCard title="Recommended (Today)" value="0" unit="L" icon={CloudRain} color="blue" />
        <MetricCard title="Next Scheduled" value="Tomorrow" unit="06:00 AM" icon={Calendar} color="amber" />
        <MetricCard title="Total Month" value="4,250" unit="L" icon={Clock} color="green" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Water Usage (Last 30 Days)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWaterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="supplied" name="Supplied (L)" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recommended" name="Recommended (L)" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem' }}>Log Manual Irrigation</h3>
          <form onSubmit={handleLog} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Amount (Liters)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="e.g. 500" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Duration (Minutes)</label>
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} required placeholder="e.g. 45" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." rows={3}></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: 'auto' }}>Save Irrigation Log</button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Irrigation;
