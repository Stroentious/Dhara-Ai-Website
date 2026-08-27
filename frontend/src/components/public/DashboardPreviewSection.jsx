import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Droplets, 
  Thermometer, 
  Beaker, 
  FlaskConical, 
  Zap, 
  CloudSun, 
  Bell, 
  Leaf, 
  ArrowRight, 
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { mockHistory, mockWeather } from '../../data/mockData';

const DashboardPreviewSection = () => {
  const [activeFieldId, setActiveFieldId] = useState(1);

  const demoFields = [
    { id: 1, name: 'North Field Alpha', crop: 'Wheat (PBW 550)', area: '4.5 ha', moisture: 62.4, temp: 24.6, ph: 6.8, n: 58, p: 34, k: 187, status: 'Optimal' },
    { id: 2, name: 'South Orchard Beta', crop: 'Kinnow Mandarin', area: '3.2 ha', moisture: 54.1, temp: 26.2, ph: 7.1, n: 45, p: 48, k: 210, status: 'Irrigation Due' },
    { id: 3, name: 'East Paddock Gamma', crop: 'Cotton (Bt-II)', area: '6.0 ha', moisture: 68.9, temp: 25.1, ph: 6.5, n: 62, p: 41, k: 175, status: 'Healthy' }
  ];

  const currentField = demoFields.find(f => f.id === activeFieldId) || demoFields[0];

  return (
    <section id="dashboard-preview" className="site-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <LayoutDashboard size={14} />
            <span>Product Experience</span>
          </div>
          <h2 className="section-title">
            Here Is What the Farmer Actually Sees.
          </h2>
          <p className="section-subtitle">
            A cohesive farm management interface that turns millions of subterranean data points into intuitive charts, real-time alerts, and proactive AI insights.
          </p>
        </div>

        {/* Live Interactive Preview Container */}
        <div 
          style={{
            borderRadius: 'var(--radius-card)',
            border: '2px solid var(--border-glass)',
            backgroundColor: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}
        >
          {/* Dashboard Preview Browser/App Bar */}
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border-glass)',
            backgroundColor: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                DHARA AI Farm Terminal • Live Telemetry Mode
              </span>
            </div>

            {/* Field Selection Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Field:</span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {demoFields.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFieldId(f.id)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: activeFieldId === f.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      color: activeFieldId === f.id ? '#ffffff' : 'var(--text-primary)',
                      border: '1px solid var(--border-glass)',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Real App CTA */}
            <Link
              to="/dashboard"
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 1rem', borderRadius: '6px', gap: '0.35rem' }}
            >
              <span>Open Full Dashboard</span>
              <Maximize2 size={13} />
            </Link>
          </div>

          {/* Interactive Simulated Dashboard Body */}
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Field Summary Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-glass)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0' }}>{currentField.name}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Crop: <strong>{currentField.crop}</strong> • Area: <strong>{currentField.area}</strong> • Punjab, India
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</div>
                  <span className="badge badge-online">Sensor Active</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Telemetry Uplink</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Just Now</div>
                </div>
              </div>
            </div>

            {/* Live KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              
              <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', marginBottom: '0.4rem' }}>
                  <Droplets size={18} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Moisture</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentField.moisture}%</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 600 }}>● Optimal root zone</div>
              </div>

              <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)', marginBottom: '0.4rem' }}>
                  <Thermometer size={18} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Soil Temp</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentField.temp}°C</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Microbial active</div>
              </div>

              <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>
                  <Beaker size={18} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>pH Level</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentField.ph}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 600 }}>● Neutral / Balanced</div>
              </div>

              <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', marginBottom: '0.4rem' }}>
                  <FlaskConical size={18} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Nitrogen (N)</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentField.n} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>mg/kg</span></div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)' }}>Adequate vegetative</div>
              </div>

              <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)', marginBottom: '0.4rem' }}>
                  <FlaskConical size={18} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Phosphorus (P)</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentField.p} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>mg/kg</span></div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-amber)' }}>Slight deficiency</div>
              </div>

              <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', marginBottom: '0.4rem' }}>
                  <FlaskConical size={18} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Potassium (K)</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentField.k} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>mg/kg</span></div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)' }}>High stalk vigor</div>
              </div>

            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              
              {/* Moisture & Temp 24h Area Chart */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Soil Moisture & Temperature (Last 24 Hours)
                </h4>
                <div style={{ width: '100%', height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockHistory.slice(-18)}>
                      <defs>
                        <linearGradient id="prevMoist" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
                      <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                      <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} domain={[20, 80]} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="soil_moisture" name="Moisture %" stroke="var(--accent-blue)" fill="url(#prevMoist)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Dhara AI Agronomic Insight Box */}
              <div className="glass-card" style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(145deg, var(--bg-card), rgba(22, 163, 74, 0.08))',
                borderLeft: '4px solid var(--accent-primary)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>
                    <Leaf size={18} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      Dhara AI Live Agronomic Recommendation
                    </span>
                  </div>

                  <p style={{ fontSize: '0.925rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    "Root-zone moisture in <strong>{currentField.name}</strong> is currently at <strong>{currentField.moisture}%</strong>. With 20% rain probability forecasted and mild evapotranspiration, skip scheduled irrigation today."
                  </p>

                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <li>Phosphorus is currently 34 mg/kg (target 40 mg/kg). Plan DAP application in 3 days.</li>
                    <li>Soil salinity (EC: 1.2 dS/m) is well within safety thresholds.</li>
                  </ul>
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grounded on live NPK + LoRa data</span>
                  <Link to="/chat" className="btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                    Ask Dhara AI
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default DashboardPreviewSection;
