import React, { useState } from 'react';
import { 
  MapPin, 
  Radio, 
  Cpu, 
  LineChart, 
  BellRing, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Droplets,
  Layers,
  Zap,
  Activity
} from 'lucide-react';

const EcosystemFlowSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  const flowSteps = [
    {
      id: 0,
      badge: 'Step 01',
      title: 'Agricultural Field',
      icon: MapPin,
      color: 'var(--accent-primary)',
      summary: 'The physical farmland, soil zones, and crop varieties (Wheat, Cotton, Rice, Maize).',
      detail: 'The field is mapped into micro-zones according to soil texture (loamy, clay, sandy) and crop growth stage. Physical boundaries and irrigation blocks are established.',
      metrics: ['Field Area (Hectares)', 'Crop Phenology Stage', 'Soil Texture Type']
    },
    {
      id: 1,
      badge: 'Step 02',
      title: '7-in-1 Soil Sensors',
      icon: Radio,
      color: 'var(--accent-secondary)',
      summary: 'Subterranean probes measuring 7 core soil health parameters every few minutes.',
      detail: 'Industrial-grade RS485/Modbus stainless steel sensors embedded in the active root zone monitor moisture, temperature, pH, electrical conductivity (EC), and available Nitrogen, Phosphorus, and Potassium.',
      metrics: ['Moisture (0–100%)', 'NPK (mg/kg)', 'pH (3–9)', 'Temp & EC']
    },
    {
      id: 2,
      badge: 'Step 03',
      title: 'Low-Power Telemetry',
      icon: Zap,
      color: 'var(--accent-blue)',
      summary: 'Solar-powered LoRa nodes transmit packets over long distances without cellular dependency.',
      detail: 'Field nodes packetize sensor telemetry and broadcast via 868/915 MHz LoRa mesh to an on-farm gateway, operating reliably through heavy foliage and adverse weather with multi-year solar autonomy.',
      metrics: ['LoRaWAN 868/915 MHz', 'Solar Autonomy', 'Zero Data Cost Mesh']
    },
    {
      id: 3,
      badge: 'Step 04',
      title: 'Ingestion & Analytics',
      icon: LineChart,
      color: 'var(--accent-amber)',
      summary: 'FastAPI telemetry engine aggregates time-series trends and microclimate forecasts.',
      detail: 'Telemetry is validated, stored in high-performance time-series databases, and fed into evapotranspiration models to predict root zone water consumption over 24-hour and 7-day windows.',
      metrics: ['Sub-second Ingestion', 'Moisture Curves', 'Nutrient Depletion Trends']
    },
    {
      id: 4,
      badge: 'Step 05',
      title: 'Proactive Field Alerts',
      icon: BellRing,
      color: 'var(--accent-red)',
      summary: 'Automated threshold monitoring notifies growers before crop stress occurs.',
      detail: 'Instant notifications are dispatched when moisture drops below permanent wilting point, fertilizer levels drop, or sensor health is compromised—preventing yield loss before visible signs appear.',
      metrics: ['SMS & WhatsApp Alerts', 'Threshold Triggers', 'Zero False Positives']
    },
    {
      id: 5,
      badge: 'Step 06',
      title: 'Dhara AI Engine',
      icon: Sparkles,
      color: 'var(--accent-primary)',
      summary: 'Domain-specific agronomic AI reasons across live soil signals and weather.',
      detail: 'Dhara AI combines crop-specific agronomic knowledge with your field\'s live sensor readings and 7-day weather forecasts to generate contextual, grounded recommendations.',
      metrics: ['Grounded LLM Reasoning', 'Crop-Specific Baselines', 'Historical Context']
    },
    {
      id: 6,
      badge: 'Step 07',
      title: 'Actionable Decision',
      icon: CheckCircle2,
      color: 'var(--accent-secondary)',
      summary: 'Clear, confident farm actions: irrigate precisely, apply NPK, protect yield.',
      detail: 'The farmer receives a definitive action plan: e.g., "Run Drip Zone A for 45 minutes tonight; delay DAP application until Friday after expected rainfall passes."',
      metrics: ['30-40% Water Saved', 'Optimized Fertilizer', 'Protected Crop Yield']
    }
  ];

  const current = flowSteps[activeStep];
  const CurrentIcon = current.icon;

  return (
    <section id="ecosystem" className="site-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Activity size={14} />
            <span>Connected Agricultural Architecture</span>
          </div>
          <h2 className="section-title">
            From Field to Intelligence: How Dhara AI Works
          </h2>
          <p className="section-subtitle">
            A seamless ecosystem connecting physical soil in the ground all the way to intelligent decision support on your phone or laptop.
          </p>
        </div>

        {/* Interactive Step Navigator Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '2.5rem',
          scrollbarWidth: 'thin'
        }}>
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-card)',
                  backgroundColor: isActive ? 'var(--bg-secondary)' : 'var(--bg-card)',
                  border: isActive ? '2px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                  boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                  cursor: 'pointer',
                  minWidth: '130px',
                  flex: 1,
                  transition: 'var(--transition)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)'
                }}>
                  <Icon size={18} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {step.badge}
                  </div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    {step.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Spotlight */}
        <div 
          className="glass-card" 
          style={{
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)'
          }}
        >
          {/* Left: Summary & Detail */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'var(--accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CurrentIcon size={24} color="var(--accent-primary)" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  {current.badge} In The Dhara Ecosystem
                </span>
                <h3 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {current.title}
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
              {current.summary}
            </p>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.75rem' }}>
              {current.detail}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => setActiveStep(prev => (prev > 0 ? prev - 1 : flowSteps.length - 1))}
                className="btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                Previous Stage
              </button>
              <button 
                onClick={() => setActiveStep(prev => (prev < flowSteps.length - 1 ? prev + 1 : 0))}
                className="btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
              >
                <span>Next Stage</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right: Key Telemetry Parameters Card */}
          <div style={{
            padding: '2rem',
            borderRadius: 'var(--radius-card)',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Key Operational Signals
              </span>
              <span className="badge badge-online">
                Active Telemetry
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {current.metrics.map((m, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  <CheckCircle2 size={16} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {m}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(22, 163, 74, 0.08)',
              border: '1px dashed var(--accent-secondary)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}>
              🌿 Seamless bidirectional data flow from ground level to cloud intelligence.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default EcosystemFlowSection;
