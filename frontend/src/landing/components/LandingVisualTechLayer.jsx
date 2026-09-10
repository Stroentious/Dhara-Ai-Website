import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Droplets,
  Sprout,
  Activity,
  Sparkles,
  Radio,
  Cpu,
  Database,
  CloudSun,
  Wind,
  Thermometer,
  Gauge,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Signal,
  Layers,
  SunMedium,
  Compass,
  Wifi,
  Smartphone,
  Laptop,
  Flame,
  Clock,
  ChevronRight,
  Sliders,
  TrendingUp,
} from 'lucide-react';
import { mockSensorReading, mockWeather, mockField } from '../../data/mockData';

/**
 * LandingVisualTechLayer Component
 * 
 * High-Impact Pictorial & Visual Representation Layer for DHARA AI:
 * 1. 7-in-1 Agricultural Soil Sensor & Stratified Subsurface Soil Horizon Cross-Section
 * 2. Long-Range Sub-GHz LoRaWAN Telemetry Wireless Link
 * 3. 4-Stage Intelligence Pipeline: Raw Sensor Data -> Neural Processing -> Actionable Advisory
 * 4. Soil Moisture & NPK Scientific Visualization with Live Range Indicators
 * 5. Hyperlocal Weather & Composite Field Health Matrix (92% Score)
 * 6. End-to-End Storytelling Flow: Physical Soil -> Sensor -> LoRa -> AI -> Dashboard -> Farmer
 * 7. Interactive Live Field Telemetry Sandbox & Launch CTA
 */
export default function LandingVisualTechLayer({ isLight = false }) {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('sensors');
  const [simulationMode, setSimulationMode] = useState('optimal'); // 'optimal', 'dry', 'fertilizer'

  const isHindi = language === 'hi';

  const handleLaunch = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  // Dynamic simulation values based on mode
  const telemetry = {
    nitrogen: simulationMode === 'dry' ? 42.1 : simulationMode === 'fertilizer' ? 78.4 : mockSensorReading.nitrogen,
    phosphorus: simulationMode === 'dry' ? 24.5 : simulationMode === 'fertilizer' ? 46.2 : mockSensorReading.phosphorus,
    potassium: simulationMode === 'dry' ? 142.0 : simulationMode === 'fertilizer' ? 210.5 : mockSensorReading.potassium,
    moisture: simulationMode === 'dry' ? 24.8 : simulationMode === 'fertilizer' ? 58.2 : mockSensorReading.soil_moisture,
    temp: simulationMode === 'dry' ? 29.4 : mockSensorReading.soil_temperature,
    ph: mockSensorReading.ph,
    ec: simulationMode === 'fertilizer' ? 1.85 : mockSensorReading.ec,
  };

  return (
    <section
      className="landing-visual-tech-layer"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '5rem 1.5rem 6rem 1.5rem',
        maxWidth: '1240px',
        margin: '0 auto',
        fontFamily: 'var(--font-body)',
        color: isLight ? '#0f172a' : '#f8fafc',
      }}
    >
      {/* ── SECTION HEADER & BLUEPRINT EYEBROW ── */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: isLight ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.10)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            borderRadius: '999px',
            padding: '0.30rem 0.90rem',
            fontSize: '0.68rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.85rem',
            boxShadow: '0 0 16px rgba(34, 197, 94, 0.15)',
          }}
        >
          <Layers size={13} />
          <span>{isHindi ? 'तकनीकी वास्तुकला एवं डेटा प्रवाह' : 'Physical Sensing • LoRa Telemetry • Neural Agronomy'}</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            background: isLight
              ? 'linear-gradient(135deg, #0f172a 0%, #15803d 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #86efac 60%, #22c55e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.18,
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}
        >
          {isHindi ? 'धारा AI बायोस्फीयर इंजन की वास्तविक कार्यप्रणाली' : 'Inside the DHARA AI Biosphere Engine'}
        </h2>

        <p
          style={{
            fontSize: 'clamp(0.86rem, 1.1vw, 1.0rem)',
            color: isLight ? '#475569' : 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.55,
          }}
        >
          {isHindi
            ? 'मिट्टी की 7-इन-1 डाइइलेक्ट्रिक सेंसिंग, 15 किमी लंबी दूरी की LoRaWAN वायरलेस कनेक्टिविटी और न्यूरल एग्रोनॉमिक मॉडल जो भौतिक मिट्टी को सटीक निर्णयों में बदलते हैं।'
            : 'Explore how 7-in-1 subsurface dielectric sensing, 15 km long-range LoRaWAN telemetry, and deep agronomic AI transform raw field soil into autonomous farm decisions.'}
        </p>

        {/* Live Simulation Mode Selector */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: isLight ? 'rgba(255,255,255,0.90)' : 'rgba(6, 18, 12, 0.85)',
            border: '1px solid var(--border-glass)',
            borderRadius: '999px',
            padding: '0.30rem',
            marginTop: '1.5rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', paddingLeft: '0.65rem' }}>
            {isHindi ? 'लाइव सिमुलेशन:' : 'Live Telemetry Simulation:'}
          </span>
          <button
            onClick={() => setSimulationMode('optimal')}
            style={{
              background: simulationMode === 'optimal' ? 'var(--accent-primary)' : 'transparent',
              color: simulationMode === 'optimal' ? '#040a06' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '999px',
              padding: '0.25rem 0.70rem',
              fontSize: '0.70rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {isHindi ? 'अनुकूलतम स्थिति' : 'Optimal Field'}
          </button>
          <button
            onClick={() => setSimulationMode('dry')}
            style={{
              background: simulationMode === 'dry' ? '#f59e0b' : 'transparent',
              color: simulationMode === 'dry' ? '#040a06' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '999px',
              padding: '0.25rem 0.70rem',
              fontSize: '0.70rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {isHindi ? 'कम नमी चेतावनी' : 'Low Moisture Alert'}
          </button>
          <button
            onClick={() => setSimulationMode('fertilizer')}
            style={{
              background: simulationMode === 'fertilizer' ? '#38bdf8' : 'transparent',
              color: simulationMode === 'fertilizer' ? '#040a06' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '999px',
              padding: '0.25rem 0.70rem',
              fontSize: '0.70rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {isHindi ? 'NPK पोषण पीक' : 'High Nutrition Peak'}
          </button>
        </div>
      </div>

      {/* ── 1. SENSOR PROBE + STRATIFIED SOIL CROSS-SECTION (VISUAL SECTION) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
          marginBottom: '3.5rem',
        }}
      >
        {/* Left Card: 7-in-1 Soil Cross Section & Dielectric Measurement Diagram */}
        <div
          className="glass-card"
          style={{
            background: isLight ? 'rgba(255,255,255,0.92)' : 'linear-gradient(165deg, rgba(8, 24, 16, 0.90) 0%, rgba(4, 12, 8, 0.95) 100%)',
            border: '1.5px solid rgba(34, 197, 94, 0.30)',
            borderRadius: '16px',
            padding: '1.75rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.72rem', fontWeight: 700 }}>
                <Sprout size={14} />
                <span>{isHindi ? 'भौतिक मृदा क्रॉस-सेक्शन' : 'Physical Soil Horizon Cross-Section'}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: '0.25rem 0 0 0' }}>
                {isHindi ? '7-इन-1 NPK डाइइलेक्ट्रिक प्रोब' : '7-in-1 NPK Dielectric Soil Probe'}
              </h3>
            </div>
            <span
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                padding: '0.20rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.62rem',
                fontWeight: 700,
              }}
            >
              IP68 • SS316 PROBES
            </span>
          </div>

          {/* SVG Stratified Soil Cross-Section Diagram */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '240px',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'linear-gradient(180deg, #1c130c 0%, #2b1a10 25%, #3a2215 60%, #1e120b 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '1.25rem',
            }}
          >
            {/* SVG Soil Layers & Probe */}
            <svg width="100%" height="100%" viewBox="0 0 400 240" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
              {/* Layer 1: Humus Horizon (0 - 45px) */}
              <rect x="0" y="0" width="400" height="48" fill="#1f140c" opacity="0.95" />
              {/* Layer 2: Root-Zone Horizon (48 - 145px) */}
              <rect x="0" y="48" width="400" height="100" fill="#2d1c12" opacity="0.95" />
              {/* Layer 3: Subsoil Mineral Horizon (148 - 240px) */}
              <rect x="0" y="148" width="400" height="92" fill="#180e07" opacity="0.98" />

              {/* Stratum Separation Lines */}
              <line x1="0" y1="48" x2="400" y2="48" stroke="#4ade80" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <line x1="0" y1="148" x2="400" y2="148" stroke="#eab308" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

              {/* Subterranean Plant Roots */}
              <path d="M 120 0 Q 130 50 110 90 Q 95 120 105 160" stroke="#85532d" strokeWidth="2.5" fill="none" opacity="0.85" />
              <path d="M 120 40 Q 155 70 170 110" stroke="#754826" strokeWidth="1.8" fill="none" opacity="0.8" />
              <path d="M 280 0 Q 270 45 295 95 Q 310 130 300 170" stroke="#85532d" strokeWidth="2.5" fill="none" opacity="0.85" />
              <path d="M 280 40 Q 245 75 230 115" stroke="#754826" strokeWidth="1.8" fill="none" opacity="0.8" />

              {/* Dielectric Electrical Measurement Wave Field Arcs */}
              <circle cx="200" cy="115" r="35" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
                <animate attributeName="r" values="20;50;20" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.1;0.8" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="200" cy="115" r="65" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 5" opacity="0.4">
                <animate attributeName="r" values="35;75;35" dur="3.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.05;0.6" dur="3.5s" repeatCount="indefinite" />
              </circle>

              {/* ── 7-IN-1 INDUSTRIAL SENSOR PROBE BODY ── */}
              {/* Sensor IP68 Aluminum Shell Top */}
              <rect x="180" y="8" width="40" height="52" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              {/* Status LED */}
              <circle cx="200" cy="22" r="3.5" fill="#22c55e">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
              </circle>
              {/* OLED Telemetry Screen on Probe */}
              <rect x="184" y="32" width="32" height="20" rx="2" fill="#020905" stroke="#0f766e" strokeWidth="1" />
              <text x="200" y="44" fill="#2dd4bf" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DHARA</text>
              <text x="200" y="49" fill="#4ade80" fontSize="5" fontFamily="monospace" textAnchor="middle">7-IN-1</text>

              {/* Stainless Steel Prongs (SS316) Penetrating Soil Root Zone */}
              <line x1="188" y1="60" x2="188" y2="135" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />
              <line x1="200" y1="60" x2="200" y2="140" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />
              <line x1="212" y1="60" x2="212" y2="135" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />

              {/* Antenna on Top */}
              <line x1="200" y1="8" x2="200" y2="-10" stroke="#94a3b8" strokeWidth="2.5" />
              <circle cx="200" cy="-10" r="3" fill="#38bdf8" />
            </svg>

            {/* Subsurface Layer Badges */}
            <div style={{ position: 'absolute', top: '10px', left: '12px', fontSize: '0.62rem', color: '#a7f3d0', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px' }}>
              {isHindi ? 'ह्यूमस परत (0-8 सेमी)' : 'Layer A: Humus (0-8 cm)'}
            </div>
            <div style={{ position: 'absolute', top: '65px', left: '12px', fontSize: '0.62rem', color: '#93c5fd', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px' }}>
              {isHindi ? 'सक्रिय जड़ क्षेत्र (8-25 सेमी)' : 'Layer B: Active Root Zone (8-25 cm)'}
            </div>
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', fontSize: '0.62rem', color: '#fde047', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px' }}>
              {isHindi ? 'खनिज उपमृदा (25-50 सेमी)' : 'Layer C: Mineral Subsoil (25-50 cm)'}
            </div>
          </div>

          {/* Live Sensor Telemetry Badge Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.10)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.58rem', color: '#38bdf8', fontWeight: 700 }}>{isHindi ? 'मृदा नमी' : 'Moisture'}</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>{telemetry.moisture}%</div>
              <div style={{ fontSize: '0.52rem', color: '#94a3b8' }}>{telemetry.moisture < 30 ? (isHindi ? 'कम' : 'Low') : (isHindi ? 'अनुकूल' : 'Optimal')}</div>
            </div>
            <div style={{ background: 'rgba(74, 222, 128, 0.10)', border: '1px solid rgba(74, 222, 128, 0.25)', borderRadius: '8px', padding: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.58rem', color: '#4ade80', fontWeight: 700 }}>{isHindi ? 'नाइट्रोजन [N]' : 'Nitrogen [N]'}</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>{telemetry.nitrogen} <span style={{ fontSize: '0.55rem' }}>ppm</span></div>
              <div style={{ fontSize: '0.52rem', color: '#94a3b8' }}>{isHindi ? 'संतुलित' : 'Balanced'}</div>
            </div>
            <div style={{ background: 'rgba(251, 191, 36, 0.10)', border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: '8px', padding: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.58rem', color: '#fbbf24', fontWeight: 700 }}>{isHindi ? 'पोटैशियम [K]' : 'Potassium [K]'}</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>{telemetry.potassium} <span style={{ fontSize: '0.55rem' }}>ppm</span></div>
              <div style={{ fontSize: '0.52rem', color: '#94a3b8' }}>{isHindi ? 'प्रचुर' : 'Rich'}</div>
            </div>
          </div>
        </div>

        {/* Right Card: NPK & Moisture Scientific Metrics & Dynamic Range Gauges */}
        <div
          className="glass-card"
          style={{
            background: isLight ? 'rgba(255,255,255,0.92)' : 'linear-gradient(165deg, rgba(8, 24, 16, 0.90) 0%, rgba(4, 12, 8, 0.95) 100%)',
            border: '1.5px solid rgba(34, 197, 94, 0.30)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.72rem', fontWeight: 700 }}>
              <Activity size={14} />
              <span>{isHindi ? 'वैज्ञानिक पोषण एवं नमी विश्लेषण' : 'Scientific Telemetry & Agronomic Gauges'}</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: '0.25rem 0 1.2rem 0' }}>
              {isHindi ? 'मृदा पोषण एवं नमी सीमा स्तर' : 'Real-Time Soil Health Breakdown'}
            </h3>

            {/* Moisture Spectrum Bar */}
            <div style={{ marginBottom: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                <span>{isHindi ? 'मृदा नमी स्तर' : 'Volumetric Soil Moisture (VWC)'}</span>
                <span style={{ color: telemetry.moisture < 30 ? '#f59e0b' : '#38bdf8' }}>{telemetry.moisture}%</span>
              </div>
              <div style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', position: 'relative', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${telemetry.moisture}%`,
                    background: telemetry.moisture < 30
                      ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                      : 'linear-gradient(90deg, #38bdf8, #22c55e)',
                    borderRadius: '99px',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                <span>{isHindi ? 'शुष्क (0-30%)' : 'Dry (<30%)'}</span>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>{isHindi ? 'अनुकूल क्षेत्र (50-75%)' : 'Optimal Zone (50-75%)'}</span>
                <span>{isHindi ? 'अत्यधिक (>85%)' : 'Saturated (>85%)'}</span>
              </div>
            </div>

            {/* NPK Comparative Progression Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Nitrogen */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <span style={{ color: '#4ade80' }}>{isHindi ? 'नाइट्रोजन (N) • वानस्पतिक वृद्धि' : 'Nitrogen (N) • Vegetative Growth'}</span>
                  <span>{telemetry.nitrogen} / 70 ppm</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (telemetry.nitrogen / 70) * 100)}%`, background: '#4ade80', borderRadius: '99px' }} />
                </div>
              </div>

              {/* Phosphorus */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <span style={{ color: '#a3e635' }}>{isHindi ? 'फास्फोरस (P) • जड़ एवं कल्ले' : 'Phosphorus (P) • Root & Tiller Vigor'}</span>
                  <span>{telemetry.phosphorus} / 50 ppm</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (telemetry.phosphorus / 50) * 100)}%`, background: '#a3e635', borderRadius: '99px' }} />
                </div>
              </div>

              {/* Potassium */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <span style={{ color: '#fbbf24' }}>{isHindi ? 'पोटैशियम (K) • रोग प्रतिरोधक क्षमता' : 'Potassium (K) • Stress & Disease Defense'}</span>
                  <span>{telemetry.potassium} / 220 ppm</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (telemetry.potassium / 220) * 100)}%`, background: '#fbbf24', borderRadius: '99px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Soil Properties Grid */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              padding: '0.65rem 1rem',
              marginTop: '1.2rem',
              fontSize: '0.68rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)' }}>{isHindi ? 'मृदा pH:' : 'Soil pH:'} </span>
              <strong style={{ color: '#22c55e' }}>{telemetry.ph} (Neutral)</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>{isHindi ? 'लवणता EC:' : 'EC:'} </span>
              <strong style={{ color: '#38bdf8' }}>{telemetry.ec} dS/m</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>{isHindi ? 'तापमान:' : 'Temp:'} </span>
              <strong style={{ color: '#fbbf24' }}>{telemetry.temp}°C</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. LORAWAN WIRELESS LINK & 4-STAGE DATA -> AI TRANSFORMATION (PICTORIAL) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
          marginBottom: '3.5rem',
        }}
      >
        {/* Left: LoRa Wireless Transmission Diagram */}
        <div
          className="glass-card"
          style={{
            background: isLight ? 'rgba(255,255,255,0.92)' : 'linear-gradient(165deg, rgba(8, 24, 16, 0.90) 0%, rgba(4, 12, 8, 0.95) 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.30)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700 }}>
            <Radio size={14} />
            <span>{isHindi ? 'लंबी दूरी की वायरलेस कनेक्टिविटी' : 'Long-Range Wireless IoT Link'}</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: '0.25rem 0 0.85rem 0' }}>
            {isHindi ? 'सब-गीगाहर्ट्ज़ LoRaWAN टेलीमेट्री' : 'Sub-GHz LoRaWAN Field Telemetry'}
          </h3>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.2rem' }}>
            {isHindi
              ? 'बिना सिम कार्ड या वाई-फाई के 15 किलोमीटर दूर तक खेत के सेंसर सीधे सोलर गेटवे को एन्क्रिप्टेड सिग्नल भेजते हैं।'
              : 'Zero Wi-Fi or cellular SIM needed in the dirt. Sub-GHz LoRa chirps transmit real-time telemetry up to 15 km directly to the solar gateway.'}
          </p>

          {/* SVG Animated LoRa Wireless Diagram */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '140px',
              borderRadius: '10px',
              background: 'rgba(2, 8, 5, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.20)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 2rem',
              marginBottom: '1rem',
            }}
          >
            {/* Field Sensor Icon */}
            <div style={{ textAlign: 'center', zIndex: 2 }}>
              <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'rgba(34, 197, 94, 0.20)', border: '1px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.3rem auto' }}>
                <Sprout size={20} color="#4ade80" />
              </div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#f8fafc' }}>{isHindi ? 'खेत सेंसर' : 'Field Sensor'}</div>
              <div style={{ fontSize: '0.50rem', color: '#94a3b8' }}>868 MHz Node</div>
            </div>

            {/* Animated Radio Wavefront Pulse */}
            <div style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="100%" height="80" viewBox="0 0 160 80">
                <path d="M 10 40 Q 45 10 80 40 T 150 40" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" opacity="0.8">
                  <animate attributeName="stroke-dashoffset" values="40;0" dur="1.2s" repeatCount="indefinite" />
                </path>
                <circle cx="80" cy="40" r="18" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6">
                  <animate attributeName="r" values="6;32;6" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
              <div style={{ position: 'absolute', top: '15px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', padding: '2px 8px', borderRadius: '99px', fontSize: '0.54rem', color: '#38bdf8', fontWeight: 800 }}>
                15 KM RANGE
              </div>
            </div>

            {/* Gateway & Cloud Platform Icon */}
            <div style={{ textAlign: 'center', zIndex: 2 }}>
              <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'rgba(56, 189, 248, 0.20)', border: '1px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.3rem auto' }}>
                <Cpu size={20} color="#38bdf8" />
              </div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#f8fafc' }}>{isHindi ? 'धारा AI गेटवे' : 'DHARA AI Core'}</div>
              <div style={{ fontSize: '0.50rem', color: '#94a3b8' }}>Neural Engine</div>
            </div>
          </div>

          {/* LoRa Specs Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', fontSize: '0.68rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.45rem 0.6rem', borderRadius: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{isHindi ? 'सिग्नल क्षमता RSSI:' : 'Signal RSSI:'} </span>
              <strong style={{ color: '#38bdf8' }}>-78 dBm (Strong)</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.45rem 0.6rem', borderRadius: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{isHindi ? 'बैटरी लाइफ:' : 'Battery Life:'} </span>
              <strong style={{ color: '#22c55e' }}>5+ Years (Solar)</strong>
            </div>
          </div>
        </div>

        {/* Right: Data -> AI Transformation Pipeline */}
        <div
          className="glass-card"
          style={{
            background: isLight ? 'rgba(255,255,255,0.92)' : 'linear-gradient(165deg, rgba(8, 24, 16, 0.90) 0%, rgba(4, 12, 8, 0.95) 100%)',
            border: '1.5px solid rgba(251, 191, 36, 0.30)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.72rem', fontWeight: 700 }}>
              <Sparkles size={14} />
              <span>{isHindi ? 'डेटा से बुद्धिमत्ता का परिवर्तन' : 'Data-to-Intelligence Pipeline'}</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: '0.25rem 0 1.1rem 0' }}>
              {isHindi ? 'कच्चे डेटा से स्वायत्त निर्णय' : 'From Raw Telemetry to Action'}
            </h3>

            {/* 4-Step Transformation Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* Step 1: Raw Data */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(255,255,255,0.03)', padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '5px', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800 }}>
                  1
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#f8fafc' }}>{isHindi ? 'कच्चा टेलीमेट्री इनपुट' : 'Raw Sensor Ingestion'}</div>
                  <div style={{ fontSize: '0.58rem', fontFamily: 'monospace', color: '#38bdf8' }}>
                    [N:{telemetry.nitrogen} | P:{telemetry.phosphorus} | K:{telemetry.potassium} | M:{telemetry.moisture}%]
                  </div>
                </div>
              </div>

              {/* Step 2: AI Evaluation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(255,255,255,0.03)', padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '5px', background: 'rgba(168,85,247,0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800 }}>
                  2
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#f8fafc' }}>{isHindi ? 'न्यूरल एग्रोनॉमिक मॉडल' : 'Neural Agronomic Processing'}</div>
                  <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>
                    {isHindi ? 'फसल की आवश्यकता एवं मौसम वाष्पीकरण का विश्लेषण' : 'Evaluating Wheat phenology vs. 48hr VPD weather curves'}
                  </div>
                </div>
              </div>

              {/* Step 3: Insight Diagnosis */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(34,197,94,0.08)', padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.25)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '5px', background: 'rgba(34,197,94,0.20)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800 }}>
                  3
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4ade80' }}>
                    {simulationMode === 'dry'
                      ? (isHindi ? 'मृदा नमी में कमी का पता चला' : 'Moisture Deficit Detected')
                      : (isHindi ? 'मृदा की स्थिति अनुकूल एवं संतुलित है' : 'Root Hydration & NPK in Optimal Zone')}
                  </div>
                  <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.85)' }}>
                    {simulationMode === 'dry'
                      ? (isHindi ? 'जड़ों में नमी 24.8% है - तुरंत सिंचाई की सिफारिश।' : 'VWC at 24.8% - trigger micro-drip cycle.')
                      : (isHindi ? 'अगले 36 घंटों तक किसी अतिरिक्त सिंचाई की आवश्यकता नहीं।' : 'Hydration reserve sufficient for 36 hours.')}
                  </div>
                </div>
              </div>

              {/* Step 4: Action & Farmer Impact */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(251,191,36,0.08)', padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(251,191,36,0.25)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '5px', background: 'rgba(251,191,36,0.20)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800 }}>
                  4
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fcd34d' }}>{isHindi ? 'स्वायत्त निर्णय एवं किसान लाभ' : 'Autonomous Action & Farmer Impact'}</div>
                  <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.85)' }}>
                    {simulationMode === 'dry'
                      ? (isHindi ? 'स्वचालित ड्रिप वाल्व सक्रिय • फसल जल तनाव से सुरक्षित' : 'Autonomous drip valve opened • Crop stress prevented')
                      : (isHindi ? '14,200 लीटर पानी की बचत • +18.4% अनुमानित पैदावार' : '14,200 Litres water saved • +18.4% yield optimization')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. HYPERLOCAL WEATHER & COMPOSITE FIELD HEALTH MATRIX ── */}
      <div
        className="glass-card"
        style={{
          background: isLight ? 'rgba(255,255,255,0.92)' : 'linear-gradient(165deg, rgba(8, 24, 16, 0.90) 0%, rgba(4, 12, 8, 0.95) 100%)',
          border: '1.5px solid rgba(34, 197, 94, 0.30)',
          borderRadius: '16px',
          padding: '1.75rem',
          marginBottom: '3.5rem',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.72rem', fontWeight: 700 }}>
              <CloudSun size={14} />
              <span>{isHindi ? 'अति-स्थानीय मौसम एवं समग्र फसल स्वास्थ्य' : 'Hyperlocal Weather & Composite Field Health Matrix'}</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: '0.25rem 0 0 0' }}>
              {isHindi ? 'उत्तर प्रक्षेत्र अल्फा • फसल स्वास्थ्य सूचकांक: 92%' : `${mockField.name} • 92% Composite Vitality Score`}
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#22c55e', padding: '0.35rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>
              92 / 100 • {isHindi ? 'उत्कृष्ट स्वास्थ्य' : 'OPTIMAL HEALTH'}
            </div>
          </div>
        </div>

        {/* Combined Weather + Sensor Matrix Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          {/* Temperature */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.68rem', fontWeight: 700 }}>
              <Thermometer size={14} />
              <span>{isHindi ? 'तापमान' : 'Temperature'}</span>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: '0.35rem 0 0.1rem 0' }}>
              {mockWeather.temperature}°C
            </div>
            <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>{mockWeather.description}</div>
          </div>

          {/* Humidity */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.68rem', fontWeight: 700 }}>
              <Droplets size={14} />
              <span>{isHindi ? 'हवा में नमी' : 'Rel. Humidity'}</span>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: '0.35rem 0 0.1rem 0' }}>
              {mockWeather.humidity}%
            </div>
            <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>{isHindi ? 'वाष्पोत्सर्जन सामान्य' : 'Normal Transpiration'}</div>
          </div>

          {/* Rain Probability */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', fontSize: '0.68rem', fontWeight: 700 }}>
              <Wind size={14} />
              <span>{isHindi ? 'बारिश की संभावना' : 'Rain Forecast'}</span>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: '0.35rem 0 0.1rem 0' }}>
              {mockWeather.rain_probability}%
            </div>
            <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>{isHindi ? 'अगले 24 घंटों में' : 'Next 24 Hours'}</div>
          </div>

          {/* Photosynthetic Vitality */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a3e635', fontSize: '0.68rem', fontWeight: 700 }}>
              <SunMedium size={14} />
              <span>{isHindi ? 'प्रकाश-संश्लेषण' : 'Canopy Vitality'}</span>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: '0.35rem 0 0.1rem 0' }}>
              99.2%
            </div>
            <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>{isHindi ? 'उत्तम पर्णहरिम ओज' : 'Peak Chlorophyll Index'}</div>
          </div>
        </div>
      </div>

      {/* ── 4. END-TO-END STORYTELLING ARCHITECTURE (FIELD TO FARMER) ── */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
          <TrendingUp size={13} />
          <span>{isHindi ? 'शुरुआत से अंत तक की यात्रा' : 'Full Architecture Flow'}</span>
        </div>
        <h3 style={{ fontSize: 'clamp(1.35rem, 2.4vw, 1.85rem)', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
          {isHindi ? 'खेत से किसान तक: धारा AI का संपूर्ण डिजिटल सफर' : 'From Subsurface Dirt to Farmer Action: The Complete Journey'}
        </h3>
      </div>

      {/* 6-Stage Journey Timeline Flow */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1rem',
          marginBottom: '4rem',
        }}
      >
        {[
          {
            step: '01',
            title: isHindi ? 'भौतिक खेत' : 'Physical Field',
            desc: isHindi ? 'पंजाब में 4.5 हेक्टेयर गेहूं का खेत' : '4.5 Ha Wheat in North Field Alpha',
            icon: Sprout,
            color: '#4ade80',
          },
          {
            step: '02',
            title: isHindi ? '7-इन-1 सेंसर' : '7-in-1 NPK Probe',
            desc: isHindi ? 'जड़ों में नमी, NPK, pH एवं तापमान की पैमाइश' : 'Dielectric root sensing NPK & moisture',
            icon: Zap,
            color: '#38bdf8',
          },
          {
            step: '03',
            title: isHindi ? 'LoRaWAN लिंक' : 'LoRa Telemetry',
            desc: isHindi ? '15 किमी तक सुरक्षित वायरलेस प्रसारण' : '15 km sub-GHz long-range wireless link',
            icon: Radio,
            color: '#818cf8',
          },
          {
            step: '04',
            title: isHindi ? 'न्यूरल AI मॉडल' : 'Neural AI Core',
            desc: isHindi ? 'वाष्पीकरण एवं फसल पोषण का गहन विश्लेषण' : 'Evapotranspiration & agronomy modeling',
            icon: Cpu,
            color: '#c084fc',
          },
          {
            step: '05',
            title: isHindi ? 'धारा डैशबोर्ड' : 'Web Dashboard',
            desc: isHindi ? '24/7 लाइव टेलीमेट्री एवं स्वचालित वाल्व नियंत्रण' : 'Real-time telemetry & valve automation',
            icon: Laptop,
            color: '#fbbf24',
          },
          {
            step: '06',
            title: isHindi ? 'किसान परामर्श' : 'Farmer Advisory',
            desc: isHindi ? 'हिंदी/अंग्रेजी में सटीक आवाज व SMS सलाह' : 'Actionable voice & bilingual mobile guidance',
            icon: Smartphone,
            color: '#22c55e',
          },
        ].map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                background: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(8, 24, 16, 0.85)',
                border: `1.2px solid ${item.color}35`,
                borderRadius: '12px',
                padding: '1.2rem 1rem',
                textAlign: 'center',
                position: 'relative',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '10px',
                  fontSize: '0.62rem',
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                }}
              >
                {item.step}
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '9px',
                  background: `${item.color}18`,
                  border: `1px solid ${item.color}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem auto',
                }}
              >
                <IconComponent size={18} color={item.color} />
              </div>
              <div style={{ fontSize: '0.80rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
