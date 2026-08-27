import React, { useState } from 'react';
import { 
  Droplets, 
  Thermometer, 
  Beaker, 
  Zap, 
  FlaskConical, 
  Info, 
  ShieldCheck, 
  ArrowRight,
  Layers
} from 'lucide-react';

const SoilSensorSection = () => {
  const [activeParam, setActiveParam] = useState('moisture');

  const parameters = [
    {
      id: 'moisture',
      name: 'Soil Moisture',
      symbol: 'VWC %',
      reading: '62.4%',
      status: 'Optimal',
      statusColor: 'var(--accent-primary)',
      idealRange: '55% – 70% (Wheat Tillering)',
      icon: Droplets,
      color: 'var(--accent-blue)',
      description: 'Volumetric water content in the root zone. Prevents both drought stress and root waterlogging.',
      agronomicImpact: 'Controls transpiration, nutrient uptake mobility, and root respiration. Triggering irrigation at 50% available water capacity maximizes grain fill without runoff waste.'
    },
    {
      id: 'nitrogen',
      name: 'Available Nitrogen (N)',
      symbol: 'mg/kg',
      reading: '58.3 mg/kg',
      status: 'Healthy',
      statusColor: 'var(--accent-primary)',
      idealRange: '50 – 80 mg/kg',
      icon: FlaskConical,
      color: 'var(--accent-secondary)',
      description: 'Readily available nitrate and ammonium ions directly absorbed by crop roots for vegetative growth.',
      agronomicImpact: 'Drives chlorophyll production, leaf canopy expansion, and protein synthesis. Real-time telemetry prevents over-application of urea and groundwater leaching.'
    },
    {
      id: 'phosphorus',
      name: 'Available Phosphorus (P)',
      symbol: 'mg/kg',
      reading: '34.7 mg/kg',
      status: 'Slight Deficiency',
      statusColor: 'var(--accent-amber)',
      idealRange: '40 – 60 mg/kg',
      icon: FlaskConical,
      color: 'var(--accent-amber)',
      description: 'Orthophosphate ions essential for early root development, flowering, and energy transfer (ATP).',
      agronomicImpact: 'Critical during early establishment and tillering. Low P delays root rooting; Dhara AI recommends timed DAP/SSP application.'
    },
    {
      id: 'potassium',
      name: 'Available Potassium (K)',
      symbol: 'mg/kg',
      reading: '187.2 mg/kg',
      status: 'Optimal',
      statusColor: 'var(--accent-primary)',
      idealRange: '150 – 220 mg/kg',
      icon: FlaskConical,
      color: 'var(--accent-secondary)',
      description: 'Cation (K+) regulating stomatal opening, drought resilience, and disease resistance.',
      agronomicImpact: 'Fortifies crop stalk strength, reduces lodging during monsoon winds, and enhances final grain weight and shelf-life.'
    },
    {
      id: 'ph',
      name: 'Soil pH Level',
      symbol: 'pH',
      reading: '6.8',
      status: 'Neutral / Ideal',
      statusColor: 'var(--accent-primary)',
      idealRange: '6.2 – 7.2',
      icon: Beaker,
      color: 'var(--accent-primary)',
      description: 'Measures soil acidity or alkalinity, dictating nutrient bioavailability in root solution.',
      agronomicImpact: 'At pH < 6.0, phosphorus and magnesium become locked; at pH > 7.5, micronutrients like zinc and iron become unavailable. Maintaining 6.8 ensures 100% fertilizer uptake efficiency.'
    },
    {
      id: 'ec',
      name: 'Electrical Conductivity (EC)',
      symbol: 'dS/m',
      reading: '1.2 dS/m',
      status: 'Safe Salinity',
      statusColor: 'var(--accent-primary)',
      idealRange: '0.8 – 2.0 dS/m',
      icon: Zap,
      color: 'var(--accent-amber)',
      description: 'Measures total dissolved soluble salts in soil water solution to track salinity and fertigation buildup.',
      agronomicImpact: 'Prevents salt toxicity and osmotic stress where roots cannot absorb water despite moist soil. Crucial for drip fertigation management.'
    },
    {
      id: 'temp',
      name: 'Soil Temperature',
      symbol: '°C',
      reading: '24.6°C',
      status: 'Favorable',
      statusColor: 'var(--accent-primary)',
      idealRange: '18°C – 26°C',
      icon: Thermometer,
      color: 'var(--accent-amber)',
      description: 'Subterranean temperature driving microbial activity, organic matter mineralization, and root growth.',
      agronomicImpact: 'Determines seed germination rate and fertilizer nitrification. Alerts growers during sudden heatwaves or cold snaps.'
    }
  ];

  const current = parameters.find(p => p.id === activeParam) || parameters[0];
  const CurrentIcon = current.icon;

  return (
    <section id="soil-intelligence" className="site-section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Layers size={14} />
            <span>Subterranean Telemetry</span>
          </div>
          <h2 className="section-title">
            Know What Your Soil Is Telling You.
          </h2>
          <p className="section-subtitle">
            7-in-1 precision sensors decode the chemical and physical signals under the soil surface—giving you real-time visibility into root-zone health.
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <span className="badge badge-demo">
              🔬 [DEVELOPMENT / SIMULATED TELEMETRY DATA DEMONSTRATION]
            </span>
          </div>
        </div>

        {/* Main Content Grid: Sensor Image & Parameter Explorer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          
          {/* Left Column: Authentic Sensor Hardware Showcase */}
          <div>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '2px solid var(--border-glass)'
            }}>
              <img
                src="/images/soil_sensor.jpg"
                alt="7-in-1 NPK Soil Sensor Probe installed in fertile farm soil"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                  maxHeight: '440px'
                }}
                loading="lazy"
              />
              
              {/* Sensor Spec Overlay */}
              <div 
                className="glass-card" 
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(10, 15, 13, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 700, textTransform: 'uppercase' }}>
                    Standard Sensor Protocol
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                    RS485 Modbus RTU • 7-in-1 Solid SS316 Probe
                  </div>
                </div>
                <span className="sensor-dot online" />
              </div>
            </div>

            {/* Hardware Note */}
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
              Designed to interface with industry standard Modbus RS485 & LoRaWAN field transmitters.
            </p>
          </div>

          {/* Right Column: Parameter Tabs & Detailed Inspector */}
          <div>
            {/* Horizontal Parameter Selector Pills */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1.75rem'
            }}>
              {parameters.map((param) => {
                const isActive = activeParam === param.id;
                return (
                  <button
                    key={param.id}
                    onClick={() => setActiveParam(param.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      color: isActive ? '#ffffff' : 'var(--text-primary)',
                      border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span>{param.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Parameter Card */}
            <div 
              className="glass-card" 
              style={{
                padding: '2rem',
                border: '1px solid var(--border-glass)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CurrentIcon size={22} style={{ color: current.color }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      {current.name}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Unit: {current.symbol}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                    {current.reading}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: current.statusColor,
                    display: 'inline-block',
                    marginTop: '0.2rem'
                  }}>
                    ● {current.status}
                  </span>
                </div>
              </div>

              {/* Target Range Box */}
              <div style={{
                padding: '0.85rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Target Ideal Range:
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {current.idealRange}
                </span>
              </div>

              {/* Descriptions */}
              <p style={{ fontSize: '0.925rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.75rem', lineHeight: 1.6 }}>
                {current.description}
              </p>

              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(22, 163, 74, 0.06)',
                borderLeft: '3px solid var(--accent-primary)'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Agronomic Significance
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {current.agronomicImpact}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default SoilSensorSection;
