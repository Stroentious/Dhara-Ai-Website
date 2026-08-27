import React from 'react';
import { 
  CheckCircle2, 
  Radio, 
  SignalHigh, 
  LineChart, 
  BellRing, 
  MessageSquareText, 
  ArrowRight,
  ListOrdered
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Connect the Field',
      icon: Radio,
      color: 'var(--accent-primary)',
      desc: 'Embed the 7-in-1 stainless probe into your crop\'s active root zone and mount the compact solar node on the field perimeter.'
    },
    {
      step: '02',
      title: 'Collect Field Data',
      icon: SignalHigh,
      color: 'var(--accent-secondary)',
      desc: 'The solar telemetry node transmits soil moisture, NPK, pH, and temperature data over long-range LoRaWAN frequencies.'
    },
    {
      step: '03',
      title: 'Understand Soil & Environment',
      icon: LineChart,
      color: 'var(--accent-blue)',
      desc: 'View real-time moisture depletion curves, nutrient balances, and 7-day microclimate weather forecasts in the web dashboard.'
    },
    {
      step: '04',
      title: 'Receive Alerts & Insights',
      icon: BellRing,
      color: 'var(--accent-amber)',
      desc: 'Get immediate push notifications when root moisture drops below trigger thresholds or nutrient deficiencies are detected.'
    },
    {
      step: '05',
      title: 'Ask Dhara AI',
      icon: MessageSquareText,
      color: 'var(--accent-primary)',
      desc: 'Ask questions about fertilizer dosage, irrigation timing, and crop health grounded in your field\'s live telemetry.'
    }
  ];

  return (
    <section id="how-it-works" className="site-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <ListOrdered size={14} />
            <span>Implementation Journey</span>
          </div>
          <h2 className="section-title">
            How Dhara AI Works in 5 Simple Steps
          </h2>
          <p className="section-subtitle">
            From physical deployment in the soil to automated alerts on your mobile phone, getting started requires no complex IT infrastructure.
          </p>
        </div>

        {/* 5-Step Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          position: 'relative'
        }}>
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  position: 'relative',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                {/* Step Number Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--accent-secondary)',
                    fontFamily: 'JetBrains Mono, monospace',
                    lineHeight: 1
                  }}>
                    {item.step}
                  </span>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div style={{
          marginTop: '3.5rem',
          textAlign: 'center'
        }}>
          <Link to="/dashboard" className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
            <span>Explore the Live Demo Platform</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
