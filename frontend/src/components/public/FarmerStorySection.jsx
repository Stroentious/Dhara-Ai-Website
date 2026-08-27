import React from 'react';
import { 
  HelpCircle, 
  Droplets, 
  FlaskConical, 
  ThermometerSun, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  LineChart,
  Layers,
  Leaf
} from 'lucide-react';

const FarmerStorySection = () => {
  const farmerDilemmas = [
    {
      icon: Droplets,
      color: 'var(--accent-blue)',
      question: 'Is the root zone too dry or over-saturated?',
      context: 'Surface soil often looks dry while root zones remain damp, leading to over-watering, electricity waste, and root rot.'
    },
    {
      icon: FlaskConical,
      color: 'var(--accent-primary)',
      question: 'Are NPK nutrients balanced or leaching away?',
      context: 'Applying urea or DAP blindly without knowing active soil nitrogen and phosphorus leads to high input costs and soil degradation.'
    },
    {
      icon: ThermometerSun,
      color: 'var(--accent-amber)',
      question: 'Is soil pH locking out critical micronutrients?',
      context: 'If pH shifts acidic or alkaline, crops cannot absorb added fertilizer even when present in the soil.'
    },
    {
      icon: AlertTriangle,
      color: 'var(--accent-red)',
      question: 'Can field stress be detected days before visual damage?',
      context: 'By the time leaves curl or yellow, yield loss is already locked in. Early soil and microclimate telemetry reveals stress beforehand.'
    }
  ];

  return (
    <section id="story" className="site-section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Leaf size={14} />
            <span>The Human Reality of Agriculture</span>
          </div>
          <h2 className="section-title">
            Farming is Full of Critical Decisions Every Single Day.
          </h2>
          <p className="section-subtitle">
            Every morning, a farmer faces complex agronomic questions with real financial and crop yield consequences. Traditional farming relies on visual intuition and post-damage reactions. Dhara AI brings clarity through continuous field data.
          </p>
        </div>

        {/* 2-Column Comparison Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'stretch'
        }}>
          
          {/* Left: The Farmer's Daily Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HelpCircle size={22} color="var(--accent-amber)" />
              <span>The Questions Every Grower Needs Answered:</span>
            </h3>

            {farmerDilemmas.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="glass-card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderLeft: `4px solid ${item.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={18} style={{ color: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.question}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '1.75rem', lineHeight: 1.5 }}>
                    {item.context}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: How Dhara AI Resolves the Dilemmas */}
          <div 
            className="glass-card" 
            style={{
              padding: '2.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(145deg, var(--bg-card), var(--bg-tertiary))',
              border: '1px solid var(--border-glass)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '1rem',
                textTransform: 'uppercase'
              }}>
                <CheckCircle size={14} />
                <span>The Dhara AI Resolution</span>
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Bringing Physical Soil Signals Together in One Unified Interface.
              </h3>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                Instead of guessing soil conditions from surface appearance, Dhara AI connects subterranean 7-in-1 NPK probes and microclimate stations directly to your phone. 
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <CheckCircle size={14} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)' }}>Precision Irrigation Timing:</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Know precisely when root zones reach depletion threshold before wilting occurs.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <CheckCircle size={14} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)' }}>Targeted Nutrient Dosing:</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Understand real-time Nitrogen (N), Phosphorus (P), and Potassium (K) availability.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <CheckCircle size={14} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)' }}>Agronomy AI Assistant:</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Ask questions in plain language and get recommendations rooted in your field's live sensor data.</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Field Intelligence Status</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Continuous 24/7 Soil Monitoring</div>
              </div>
              <a 
                href="#ecosystem" 
                className="btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem' }}
              >
                <span>See Ecosystem</span>
                <ArrowRight size={14} />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default FarmerStorySection;
