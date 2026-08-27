import React from 'react';
import { 
  Leaf, 
  Droplets, 
  Sprout, 
  Sun, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2,
  TreeDeciduous
} from 'lucide-react';

const SustainabilitySection = () => {
  const pillars = [
    {
      title: 'Water Resource Stewardship',
      icon: Droplets,
      metric: '30% – 40%',
      metricLabel: 'Reduction in Irrigation Water Use',
      color: 'var(--accent-blue)',
      description: 'By irrigating only when root zone sensors detect moisture depletion, growers eliminate over-watering, reduce electricity consumption on diesel/electric tube-wells, and protect precious groundwater tables.'
    },
    {
      title: 'Balanced Nutrient Application',
      icon: Sprout,
      metric: '20% – 25%',
      metricLabel: 'Fertilizer Input Cost Savings',
      color: 'var(--accent-primary)',
      description: 'Real-time Nitrogen, Phosphorus, and Potassium monitoring prevents unnecessary top-dressing of urea and DAP—eliminating nitrate runoff into rural drinking water and halting soil acidification.'
    },
    {
      title: 'Early Crop Stress Detection',
      icon: ShieldCheck,
      metric: '3 to 5 Days',
      metricLabel: 'Earlier Warning Before Crop Wilting',
      color: 'var(--accent-amber)',
      description: 'Subterranean telemetry identifies moisture and thermal stress before visible leaf yellowing or stunted growth occurs—allowing proactive micro-irrigation and protecting yield potential.'
    },
    {
      title: 'Generational Soil Health',
      icon: TreeDeciduous,
      metric: '100% Data-Driven',
      metricLabel: 'Continuous Soil Quality Tracking',
      color: 'var(--accent-secondary)',
      description: 'Maintaining neutral soil pH and monitoring electrical conductivity ensures organic soil biology thrives, preserving farmland productivity for future farming generations.'
    }
  ];

  return (
    <section id="sustainability" className="site-section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Leaf size={14} />
            <span>Ecological & Economic Impact</span>
          </div>
          <h2 className="section-title">
            Grounded Sustainability: Saving Water, Fuel, and Soil.
          </h2>
          <p className="section-subtitle">
            Precision agriculture is not just about maximizing yield—it is about achieving maximum output with the least possible resource consumption.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="glass-card"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <div>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <Icon size={24} style={{ color: item.color }} />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {item.description}
                  </p>
                </div>

                <div style={{
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border-glass)'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>
                    {item.metric}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {item.metricLabel}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SustainabilitySection;
