import React from 'react';
import { 
  Server, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Cloud, 
  Smartphone, 
  Code2, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TechnologySection = () => {
  const techLayers = [
    {
      layer: 'Edge Sensing Layer',
      tech: 'RS485 / Modbus RTU',
      desc: 'Solid-state stainless probes sample soil physical parameters (VWC%, EC, pH, NPK) with zero drift calibration.',
      color: 'var(--accent-primary)'
    },
    {
      layer: 'Wireless Transport',
      tech: 'LoRaWAN 868 / 915 MHz',
      desc: 'Sub-gigahertz spread spectrum wireless transmits packets up to 10 km with low power consumption.',
      color: 'var(--accent-blue)'
    },
    {
      layer: 'Backend & Ingestion',
      tech: 'FastAPI + Pydantic Engine',
      desc: 'Sub-second asynchronous REST telemetry API with HMAC cryptographic device packet validation.',
      color: 'var(--accent-secondary)'
    },
    {
      layer: 'Time-Series Database',
      tech: 'SQLite / PostgreSQL Hybrid',
      desc: 'Optimized relational schema storing historical soil curves, irrigation logs, and crop phenology records.',
      color: 'var(--accent-amber)'
    },
    {
      layer: 'Agronomy AI Layer',
      tech: 'Context-Aware Agronomy Engine',
      desc: 'Domain-trained agronomic models cross-reference live soil telemetry against FAO crop evapotranspiration baselines.',
      color: 'var(--accent-purple)'
    },
    {
      layer: 'Farmer Interface',
      tech: 'Vite + React 18 SPA',
      desc: 'Ultra-responsive client with real-time Recharts visualizations, offline data caching, and dark/light mode.',
      color: 'var(--accent-primary)'
    }
  ];

  return (
    <section id="technology" className="site-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Code2 size={14} />
            <span>Architecture & Infrastructure</span>
          </div>
          <h2 className="section-title">
            Built for Reliability, Speed, and Agronomic Precision.
          </h2>
          <p className="section-subtitle">
            A battle-tested technology stack combining low-power IoT telemetry with high-performance cloud processing and grounded agronomic AI models.
          </p>
        </div>

        {/* 6-Layer Architecture Stack Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {techLayers.map((item, idx) => (
            <div 
              key={idx}
              className="glass-card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                borderLeft: `4px solid ${item.color}`,
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-glass)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {item.layer}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600,
                  color: item.color,
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px'
                }}>
                  {item.tech}
                </span>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Highlights Bar */}
        <div 
          className="glass-card"
          style={{
            padding: '1.75rem 2rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
              &lt; 50ms
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>API Ingestion Latency</div>
          </div>

          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
              868 / 915 MHz
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Long-Range Radio Band</div>
          </div>

          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-blue)', fontFamily: 'JetBrains Mono, monospace' }}>
              AES-128
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Encrypted Sensor Packets</div>
          </div>

          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'JetBrains Mono, monospace' }}>
              100% Local
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Offline Fallback Capable</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TechnologySection;
