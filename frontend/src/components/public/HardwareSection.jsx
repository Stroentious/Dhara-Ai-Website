import React from 'react';
import { 
  Cpu, 
  Radio, 
  Sun, 
  Layers, 
  Droplets, 
  ShieldCheck, 
  Sliders, 
  Zap, 
  CheckCircle2,
  HardDrive
} from 'lucide-react';

const HardwareSection = () => {
  const hardwareItems = [
    {
      title: '7-in-1 NPK Soil Sensor',
      category: 'Root-Zone Probe',
      icon: Layers,
      color: 'var(--accent-primary)',
      description: 'Industrial-grade stainless steel SS316 probe with vacuum-potted epoxy sealing for multi-year subterranean durability.',
      specs: ['RS485 Modbus RTU Protocol', 'IP68 Submersible Sealing', 'Measures N, P, K, pH, EC, VWC%, Temp'],
      integrationBadge: 'Modbus Standard'
    },
    {
      title: 'Solar Telemetry Pole',
      category: 'Field Transceiver Node',
      icon: Sun,
      color: 'var(--accent-amber)',
      description: 'Ruggedized outdoor field station with built-in solar panel, lithium iron phosphate (LiFePO4) battery, and LoRa mesh node.',
      specs: ['5W High-Efficiency Monocrystalline Panel', 'LoRaWAN 868 / 915 MHz Long Range', '5+ Days Energy Autonomy during Monsoons'],
      integrationBadge: 'Solar Autonomous'
    },
    {
      title: 'Industrial LoRa Gateway',
      category: 'Farm Edge Station',
      icon: Radio,
      color: 'var(--accent-blue)',
      description: 'Central farm gateway receiving packet uplinks from dozens of field nodes up to 5-10 km away across open agricultural terrain.',
      specs: ['8-Channel SX1302 Concentrator', 'Ethernet / 4G LTE Fallback Backhaul', 'Local Edge Buffering for Zero Data Loss'],
      integrationBadge: 'Long Range Mesh'
    },
    {
      title: 'Substation & Pump Relay',
      category: 'Actuation Controller',
      icon: Zap,
      color: 'var(--accent-secondary)',
      description: 'Microcontroller relay module interfacing with submersible pump starters, pressure gauges, and electricity phase monitors.',
      specs: ['Dry Contact 3-Phase Relay Interfaces', 'Overload & Phase Loss Protection', 'Manual Override Switch on Panel'],
      integrationBadge: 'Pump Interlock'
    },
    {
      title: 'Automated Solenoid Valves',
      category: 'Zone Actuators',
      icon: Droplets,
      color: 'var(--accent-blue)',
      description: 'Latching solenoid valves controlling pressurized water flow across individual field drip manifolds and micro-sprinklers.',
      specs: ['12V DC Pulse Actuated (Ultra-Low Power)', 'Corrosion-Resistant Reinforced Nylon Body', 'Pressure rating up to 10 Bar'],
      integrationBadge: 'Drip Integration'
    },
    {
      title: 'Venturi Fertigation Unit',
      category: 'Nutrient Dosing',
      icon: Sliders,
      color: 'var(--accent-primary)',
      description: 'Differential pressure injection unit for proportional liquid fertilizer and micronutrient blending into the irrigation stream.',
      specs: ['Adjustable Flow Suction 10–250 L/h', 'Acid & Chemical Resistant Seals', 'Flow Meter Feedback Loop'],
      integrationBadge: 'Precision Dosing'
    }
  ];

  return (
    <section id="hardware" className="site-section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <HardDrive size={14} />
            <span>Hardware Ecosystem</span>
          </div>
          <h2 className="section-title">
            Engineered for Harsh Agricultural Realities.
          </h2>
          <p className="section-subtitle">
            Dhara AI is architected to interface seamlessly with ruggedized, off-the-shelf field hardware—combining low-power wireless mesh with industrial sensing.
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <span className="badge badge-demo">
              ⚡ Designed for Modbus RS485 & LoRaWAN Open Industrial Standards
            </span>
          </div>
        </div>

        {/* 2 Featured Photographic Visuals */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3.5rem'
        }}>
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-glass)'
          }}>
            <img
              src="/images/field_iot_pole.jpg"
              alt="Solar-powered agricultural IoT telemetry station installed in a crop field"
              style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1rem',
              background: 'linear-gradient(to top, rgba(10, 15, 13, 0.85), transparent)',
              color: '#ffffff'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#86efac', textTransform: 'uppercase' }}>Field Station</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>Solar-Powered LoRa Mesh Node</div>
            </div>
          </div>

          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-glass)'
          }}>
            <img
              src="/images/drip_irrigation.jpg"
              alt="Precision agricultural drip irrigation line delivering water directly to root zones"
              style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1rem',
              background: 'linear-gradient(to top, rgba(10, 15, 13, 0.85), transparent)',
              color: '#ffffff'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#86efac', textTransform: 'uppercase' }}>Actuation</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>Automated Precision Drip Control</div>
            </div>
          </div>
        </div>

        {/* Hardware Specification Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem'
        }}>
          {hardwareItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--accent-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={20} style={{ color: item.color }} />
                    </div>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {item.integrationBadge}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                    {item.category}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0 0.5rem 0', color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {item.description}
                  </p>
                </div>

                {/* Specs List */}
                <div style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-glass)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  {item.specs.map((spec, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={13} color="var(--accent-primary)" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HardwareSection;
