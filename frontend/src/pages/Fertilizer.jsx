import React, { useEffect, useState } from 'react';
import { useField } from '../context/FieldContext';
import MetricCard from '../components/MetricCard';
import { mockFertilizerData } from '../data/mockData';
import { FlaskConical, AlertTriangle, CheckCircle, Leaf } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Fertilizer = () => {
  const { selectedField } = useField();
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) headerTitle.textContent = 'Fertilizer & NPK';
  }, []);

  const handleLog = (e) => {
    e.preventDefault();
    alert('Fertilizer logged successfully! (Mock)');
    setType(''); setAmount('');
  };

  const radarData = [
    { subject: 'Nitrogen', A: 58, B: 80, fullMark: 150 },
    { subject: 'Phosphorus', A: 34, B: 40, fullMark: 150 },
    { subject: 'Potassium', A: 187, B: 150, fullMark: 200 },
    { subject: 'pH Level', A: 6.8, B: 6.5, fullMark: 14 },
    { subject: 'Soil Organic', A: 2.1, B: 3.0, fullMark: 5 },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <MetricCard title="Current Nitrogen" value="58.3" unit="mg/kg" icon={FlaskConical} color="green" />
        <MetricCard title="Current Phosphorus" value="34.7" unit="mg/kg" icon={FlaskConical} color="amber" />
        <MetricCard title="Current Potassium" value="187.2" unit="mg/kg" icon={FlaskConical} color="green" />
      </div>

      <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '1rem', color: 'var(--accent-amber)', alignItems: 'center' }}>
        <AlertTriangle size={24} />
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0' }}>Phosphorus Deficiency Detected</h4>
          <span style={{ fontSize: '0.9rem' }}>Current levels (34.7 mg/kg) are below the optimal range (40-60 mg/kg) for Wheat at the tillering stage. Consider applying DAP fertilizer.</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Leaf size={18} color="var(--accent-primary)"/> Soil Health Radar (Current vs Target)
          </h3>
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="var(--border-glass)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                <Radar name="Current" dataKey="A" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.4} />
                <Radar name="Target" dataKey="B" stroke="var(--accent-blue)" fill="var(--accent-blue)" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem' }}>Log Fertilizer Application</h3>
          <form onSubmit={handleLog} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Fertilizer Type</label>
              <select value={type} onChange={e => setType(e.target.value)} required>
                <option value="">Select type...</option>
                <option value="Urea">Urea (46-0-0)</option>
                <option value="DAP">DAP (18-46-0)</option>
                <option value="MOP">MOP (0-0-60)</option>
                <option value="NPK_20_20_20">NPK 20-20-20</option>
                <option value="Compost">Organic Compost</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Amount (kg)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="e.g. 50" />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Log Application</button>
          </form>

          <h3 style={{ margin: '2rem 0 1rem 0', fontSize: '1rem' }}>Recent History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1 }}>
            {mockFertilizerData.slice(0, 3).map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-glass)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle size={16} color="var(--accent-primary)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{f.fertilizer_type}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.date}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 600 }}>{f.amount_kg.toFixed(0)} kg</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Fertilizer;
