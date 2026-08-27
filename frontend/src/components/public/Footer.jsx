import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowUp, ShieldCheck, Radio, LayoutDashboard, LogIn, Heart } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-glass)',
      paddingTop: '4.5rem',
      paddingBottom: '2.5rem',
      position: 'relative'
    }}>
      <div className="site-container">
        
        {/* Top Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>
          
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Leaf color="#ffffff" size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                DHARA AI
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Full-stack precision agriculture intelligence platform connecting 7-in-1 subterranean soil probes, LoRa mesh telemetry, and grounded agronomic AI models.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span className="sensor-dot online" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                System Operational • All Telemetry Gateways Online
              </span>
            </div>
          </div>

          {/* Quick Ecosystem Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <a href="#story" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>The Farmer Problem</a>
              </li>
              <li>
                <a href="#ecosystem" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>7-Stage Ecosystem Flow</a>
              </li>
              <li>
                <a href="#soil-intelligence" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>7-in-1 NPK Soil Telemetry</a>
              </li>
              <li>
                <a href="#dashboard-preview" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Live Dashboard Preview</a>
              </li>
              <li>
                <a href="#ai-assistant" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Dhara AI Assistant</a>
              </li>
              <li>
                <a href="#hardware" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Hardware Ecosystem</a>
              </li>
              <li>
                <a href="#technology" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Architecture & Specs</a>
              </li>
              <li>
                <a href="#sustainability" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Ecological Stewardship</a>
              </li>
            </ul>
          </div>

          {/* Direct Applications */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Application Suite
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/dashboard" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <LayoutDashboard size={14} color="var(--accent-primary)" />
                  <span>Main Farm Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/sensors" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Live Sensor Telemetry</Link>
              </li>
              <li>
                <Link to="/irrigation" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Irrigation Controller</Link>
              </li>
              <li>
                <Link to="/fertilizer" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>NPK Fertilizer Management</Link>
              </li>
              <li>
                <Link to="/chat" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Agronomy Chatbot</Link>
              </li>
              <li>
                <Link to="/login" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <LogIn size={14} color="var(--accent-primary)" />
                  <span>Farmer Account Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Demo Disclaimer & Data Notice */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Demonstration Notice
            </h4>
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}>
              <strong>[DEMO / DEVELOPMENT DATA]</strong>
              <p style={{ margin: '0.4rem 0 0 0' }}>
                All sensor values, NPK curves, and moisture trends displayed in this public demonstration are simulated for verification. Standard RS485/Modbus physical adapters are integrated in the backend codebase.
              </p>
            </div>

            <button
              onClick={scrollToTop}
              className="btn-secondary"
              style={{
                marginTop: '1rem',
                width: '100%',
                fontSize: '0.8rem',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <ArrowUp size={14} />
              <span>Back to Top</span>
            </button>
          </div>

        </div>

        {/* Bottom Copyright & Status */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} DHARA AI • Smart Agriculture IoT & Intelligence Platform.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Empowering growers through real field data</span>
            <Leaf size={14} color="var(--accent-primary)" />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
