import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sprout, 
  Droplets, 
  Radio, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Sun,
  Leaf
} from 'lucide-react';

const HeroSection = () => {
  return (
    <section 
      style={{ 
        position: 'relative', 
        paddingTop: '8.5rem', 
        paddingBottom: '5rem',
        overflow: 'hidden',
        background: 'var(--gradient-hero)'
      }}
    >
      {/* Background Decorative Grid/Dots */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(var(--border-glass) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.6,
          pointerEvents: 'none',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }} 
      />

      <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center'
        }}>
          
          {/* Left Column: Storytelling & Hero Copy */}
          <div>
            {/* Category Eyebrow */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--accent-light)',
              border: '1px solid var(--border-glass)',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span className="sensor-dot online" />
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}>
                DHARA AI • Precision Agriculture Intelligence
              </span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.75rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem'
            }}>
              Intelligent Agriculture, Powered by{' '}
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                Real Field Data.
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: '2rem',
              maxWidth: '560px'
            }}>
              Dhara AI connects physical soil sensors, microclimate telemetry, and real-time alerts to a continuous AI intelligence engine—empowering farmers with grounded decision support for irrigation, fertilization, and crop yield protection.
            </p>

            {/* CTA Action Buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.5rem'
            }}>
              <Link 
                to="/dashboard" 
                className="btn-primary"
                style={{
                  fontSize: '1.05rem',
                  padding: '0.9rem 2rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <span>Explore Dhara AI</span>
                <ArrowRight size={18} />
              </Link>

              <a 
                href="#how-it-works"
                className="btn-secondary"
                style={{
                  fontSize: '1.05rem',
                  padding: '0.9rem 1.75rem'
                }}
              >
                <span>View How It Works</span>
              </a>
            </div>

            {/* Key Value Proof Points */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-glass)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  7-in-1 Soil Telemetry
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  LoRa Long-Range Mesh
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Contextual Agronomy AI
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Authentic Agricultural Visual with Live Telemetry Badges */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '2px solid var(--border-glass)'
            }}>
              <img
                src="/images/hero_farmer.jpg"
                alt="Indian farmer inspecting wheat crops in a field with modern Dhara AI telemetry node"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                  maxHeight: '520px'
                }}
                loading="eager"
              />
              
              {/* Subtle Gradient Vignette */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10, 15, 13, 0.45) 0%, transparent 60%)'
              }} />

              {/* Live Overlay Badge 1: Soil Moisture Status */}
              <div 
                className="glass-card" 
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  left: '1.25rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.25)'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(2, 132, 199, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Droplets color="var(--accent-blue)" size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Soil Moisture
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    62.4% <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>• Optimal</span>
                  </div>
                </div>
              </div>

              {/* Live Overlay Badge 2: NPK Nitrogen */}
              <div 
                className="glass-card" 
                style={{
                  position: 'absolute',
                  bottom: '1.25rem',
                  left: '1.25rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.25)'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Leaf color="var(--accent-secondary)" size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Available Nitrogen (N)
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    58.3 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>mg/kg</span>
                  </div>
                </div>
              </div>

              {/* Live Overlay Badge 3: LoRa Signal & Uptime */}
              <div 
                className="glass-card" 
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  padding: '0.6rem 0.9rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.25)'
                }}
              >
                <span className="sensor-dot online" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  LoRa 868MHz • Online
                </span>
              </div>

              {/* Live Overlay Badge 4: Field Health Score */}
              <div 
                className="glass-card" 
                style={{
                  position: 'absolute',
                  bottom: '1.25rem',
                  right: '1.25rem',
                  padding: '0.65rem 0.95rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.25)'
                }}
              >
                <Activity size={18} color="var(--accent-primary)" />
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Field Index</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-primary)' }}>94 / 100</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
