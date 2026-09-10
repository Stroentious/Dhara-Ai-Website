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
  Layers,
  CloudSun,
  Wind,
  Thermometer,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sliders,
  AlertTriangle,
  SunMedium,
} from 'lucide-react';
import { mockSensorReading, mockWeather, mockField } from '../../data/mockData';

/**
 * LandingScrollContent Component
 * 
 * Outer-Edge Side-Column Layout:
 * - Cards sit comfortably at the far left and right edges (maxWidth: 380px - 390px)
 * - Container spans full width with responsive outer gutter padding (clamp(1.5rem, 5.5vw, 7rem))
 * - Central ~65% viewport corridor is completely clear for the 3D Banyan Tree
 */
export default function LandingScrollContent({ progress = 0, isLight = false }) {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [simulationMode, setSimulationMode] = useState('optimal');
  const isHindi = language === 'hi';

  const handleLaunch = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  // Dynamic telemetry for sandbox
  const telemetry = {
    nitrogen: simulationMode === 'dry' ? 42.1 : simulationMode === 'fertilizer' ? 78.4 : mockSensorReading.nitrogen,
    phosphorus: simulationMode === 'dry' ? 24.5 : simulationMode === 'fertilizer' ? 46.2 : mockSensorReading.phosphorus,
    potassium: simulationMode === 'dry' ? 142.0 : simulationMode === 'fertilizer' ? 210.5 : mockSensorReading.potassium,
    moisture: simulationMode === 'dry' ? 24.8 : simulationMode === 'fertilizer' ? 58.2 : mockSensorReading.soil_moisture,
    temp: simulationMode === 'dry' ? 29.4 : mockSensorReading.soil_temperature,
    ph: mockSensorReading.ph,
    ec: simulationMode === 'fertilizer' ? 1.85 : mockSensorReading.ec,
  };

  // Sleek, compact glass card style
  const cardStyle = {
    background: isLight ? 'rgba(255, 255, 255, 0.82)' : 'rgba(6, 18, 12, 0.78)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: isLight ? '1px solid rgba(34, 197, 94, 0.30)' : '1px solid rgba(34, 197, 94, 0.20)',
    borderRadius: '14px',
    boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.08)' : '0 14px 40px rgba(0, 0, 0, 0.45)',
    padding: '1.20rem 1.30rem',
    transition: 'background 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
  };

  const titleColor = isLight ? '#0f172a' : '#ffffff';
  const subtitleColor = isLight ? '#334155' : 'rgba(248, 250, 252, 0.88)';
  const mutedColor = isLight ? '#64748b' : '#94a3b8';

  return (
    <div
      className="landing-scroll-content"
      style={{
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'auto',
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0 clamp(1.25rem, 5.5vw, 7.5rem) 5rem clamp(1.25rem, 5.5vw, 7.5rem)',
        color: isLight ? '#0f172a' : '#f8fafc',
        boxSizing: 'border-box',
      }}
    >
      {/* ── SECTION 1: COMPACT HERO INTRO (0% - 12%) ── */}
      <section
        id="section-hero"
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: '6.5rem',
          paddingBottom: '3rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.40rem',
            background: isLight ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.10)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            borderRadius: '999px',
            padding: '0.28rem 0.85rem',
            fontSize: '0.64rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.85rem',
            boxShadow: '0 0 16px rgba(34, 197, 94, 0.15)',
          }}
        >
          <Sprout size={12} />
          <span>{isHindi ? 'बीज से फसल तक • स्वायत्त कृषि AI' : 'Seed to Harvest • Autonomous Agri-AI'}</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.85rem, 3.8vw, 3.0rem)',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            background: isLight
              ? 'linear-gradient(135deg, #0f172a 0%, #15803d 60%, #16a34a 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #86efac 60%, #22c55e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.15,
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
            maxWidth: '700px',
          }}
        >
          DHARA AI
        </h1>

        <p
          style={{
            fontSize: 'clamp(0.85rem, 1.1vw, 1.02rem)',
            color: subtitleColor,
            fontWeight: 500,
            lineHeight: 1.5,
            maxWidth: '560px',
            marginBottom: '1.75rem',
          }}
        >
          {isHindi
            ? 'मिट्टी में गहराई से निहित बुद्धिमत्ता। 7-इन-1 डाइइलेक्ट्रिक सेंसिंग और 15 किमी LoRaWAN वायरलेस से संचालित स्वायत्त कृषि निर्णय प्रणाली।'
            : 'Deep agronomic intelligence rooted in agriculture. Real-time 7-in-1 dielectric sensing, 15 km LoRaWAN telemetry, and neural AI transforming field soil into optimal yields.'}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <button
            onClick={handleLaunch}
            id="hero-launch-btn"
            className="btn-primary"
            style={{
              padding: '0.55rem 1.4rem',
              fontSize: '0.80rem',
              fontWeight: 800,
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.40rem',
              boxShadow: '0 0 18px rgba(34, 197, 94, 0.35)',
            }}
          >
            <span>{currentUser ? t('nav.dashboard') : (isHindi ? 'धारा AI में प्रवेश करें' : 'Launch Platform')}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Scroll Prompt */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.30rem',
            color: mutedColor,
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            animation: 'bounce 2.2s infinite ease-in-out',
          }}
        >
          <span>{isHindi ? 'विकास यात्रा देखने के लिए नीचे स्क्रॉल करें' : 'Scroll down to scrub the growth journey'}</span>
          <ChevronDown size={14} color="var(--accent-primary)" />
        </div>
      </section>

      {/* ── SECTION 2: LEFT COLUMN — UNDERGROUND CHALLENGE (12% - 28%) ── */}
      <section
        id="section-problem"
        style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '3rem 0',
        }}
      >
        <div style={{ ...cardStyle, maxWidth: '380px', width: '100%', marginLeft: '0', marginRight: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.40rem', color: '#f59e0b', fontSize: '0.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
            <AlertTriangle size={13} />
            <span>{isHindi ? '०१ • भूगर्भ अदृश्य चुनौतियाँ' : '01 • Subsurface Blindspot'}</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.10rem, 1.5vw, 1.35rem)', fontWeight: 800, fontFamily: 'var(--font-display)', color: titleColor, marginBottom: '0.50rem', lineHeight: 1.25 }}>
            {isHindi ? 'जड़ों की गहराई में छुपी समस्याएं' : 'Subsurface Agricultural Challenges'}
          </h2>

          <p style={{ fontSize: '0.76rem', color: subtitleColor, lineHeight: 1.45, marginBottom: '1.0rem' }}>
            {isHindi
              ? 'जैसे ही बीज भूमि में जड़ें फैलाता है, मिट्टी के भीतर पानी और पोषक तत्वों की अदृश्य कमी पैदावार को 30% से 50% तक घटा देती है।'
              : 'As roots anchor into soil, unseen fluctuations in moisture, NPK depletion, and salinity damage crops before visible stress appears.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.50rem' }}>
            <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', borderLeft: '3px solid #ef4444', borderRadius: '6px', padding: '0.50rem 0.65rem' }}>
              <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.70rem', marginBottom: '0.10rem' }}>
                {isHindi ? '४०% पानी की बर्बादी' : '40% Water Inefficiency'}
              </div>
              <div style={{ fontSize: '0.66rem', color: subtitleColor, lineHeight: 1.35 }}>
                {isHindi ? 'नमी की सटीक जानकारी न होने से अत्यधिक सिंचाई होती है।' : 'Blind flood irrigation causes root suffocation and water loss.'}
              </div>
            </div>

            <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', borderLeft: '3px solid #f59e0b', borderRadius: '6px', padding: '0.50rem 0.65rem' }}>
              <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.70rem', marginBottom: '0.10rem' }}>
                {isHindi ? 'उर्वरक असंतुलन' : 'Uncalibrated Fertilizer'}
              </div>
              <div style={{ fontSize: '0.66rem', color: subtitleColor, lineHeight: 1.35 }}>
                {isHindi ? 'NPK का असंतुलित उपयोग मिट्टी की उर्वरता बिगाड़ता है।' : 'Overuse of synthetic NPK degrades soil biology and cost.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: RIGHT COLUMN — 7-IN-1 SOIL SENSOR (28% - 48%) ── */}
      <section
        id="section-sensor-strata"
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '3rem 0',
        }}
      >
        <div style={{ ...cardStyle, maxWidth: '390px', width: '100%', marginLeft: 'auto', marginRight: '0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.40rem', color: 'var(--accent-primary)', fontSize: '0.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <Layers size={13} />
              <span>{isHindi ? '०२ • भौतिक मृदा संवेदन' : '02 • 7-in-1 Soil Sensing'}</span>
            </div>
            <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'var(--accent-primary)', border: '1px solid rgba(34, 197, 94, 0.35)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.56rem', fontWeight: 800 }}>
              IP68 • SS316
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.10rem, 1.5vw, 1.35rem)', fontWeight: 800, fontFamily: 'var(--font-display)', color: titleColor, marginBottom: '0.45rem', lineHeight: 1.25 }}>
            {isHindi ? '7-इन-1 डाइइलेक्ट्रिक प्रोब' : 'Dielectric Root Telemetry'}
          </h2>

          <p style={{ fontSize: '0.76rem', color: subtitleColor, lineHeight: 1.45, marginBottom: '0.85rem' }}>
            {isHindi
              ? 'मजबूत तने के साथ ऊपर बढ़ते वृक्ष की तरह, धारा AI के इलेक्ट्रोड जड़ क्षेत्र में नमी, NPK, pH और तापमान का मापन करते हैं।'
              : 'Directly in the active root horizon (8-25 cm), stainless steel electrode prongs measure high-frequency dielectric permittivity.'}
          </p>

          {/* Mini Telemetry Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.50rem' }}>
            <div style={{ background: isLight ? 'rgba(56, 189, 248, 0.10)' : 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.45rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.54rem', color: '#38bdf8', fontWeight: 700 }}>{isHindi ? 'मृदा नमी' : 'Soil Moisture'}</div>
              <div style={{ fontSize: '0.90rem', fontWeight: 800, color: titleColor }}>{telemetry.moisture}%</div>
              <div style={{ fontSize: '0.48rem', color: mutedColor }}>{telemetry.moisture < 30 ? (isHindi ? 'कम' : 'Low') : (isHindi ? 'अनुकूल' : 'Optimal')}</div>
            </div>

            <div style={{ background: isLight ? 'rgba(74, 222, 128, 0.10)' : 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74, 222, 128, 0.25)', borderRadius: '8px', padding: '0.45rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.54rem', color: '#4ade80', fontWeight: 700 }}>{isHindi ? 'नाइट्रोजन [N]' : 'Nitrogen [N]'}</div>
              <div style={{ fontSize: '0.90rem', fontWeight: 800, color: titleColor }}>{telemetry.nitrogen} <span style={{ fontSize: '0.50rem' }}>ppm</span></div>
              <div style={{ fontSize: '0.48rem', color: mutedColor }}>{isHindi ? 'संतुलित' : 'Balanced'}</div>
            </div>

            <div style={{ background: isLight ? 'rgba(251, 191, 36, 0.10)' : 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: '8px', padding: '0.45rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.54rem', color: '#fbbf24', fontWeight: 700 }}>{isHindi ? 'पोटैशियम [K]' : 'Potassium [K]'}</div>
              <div style={{ fontSize: '0.90rem', fontWeight: 800, color: titleColor }}>{telemetry.potassium} <span style={{ fontSize: '0.50rem' }}>ppm</span></div>
              <div style={{ fontSize: '0.48rem', color: mutedColor }}>{isHindi ? 'प्रचुर' : 'Rich'}</div>
            </div>

            <div style={{ background: isLight ? 'rgba(168, 85, 247, 0.10)' : 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '8px', padding: '0.45rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.54rem', color: '#c084fc', fontWeight: 700 }}>{isHindi ? 'मृदा pH / EC' : 'pH / EC'}</div>
              <div style={{ fontSize: '0.90rem', fontWeight: 800, color: titleColor }}>{telemetry.ph} / {telemetry.ec}</div>
              <div style={{ fontSize: '0.48rem', color: mutedColor }}>{isHindi ? 'तटस्थ' : 'Safe'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: LEFT COLUMN — LORAWAN WIRELESS (48% - 64%) ── */}
      <section
        id="section-lora"
        style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '3rem 0',
        }}
      >
        <div style={{ ...cardStyle, maxWidth: '380px', width: '100%', marginLeft: '0', marginRight: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.40rem', color: '#38bdf8', fontSize: '0.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
            <Radio size={13} />
            <span>{isHindi ? '०३ • वायरलेस तकनीक' : '03 • 15 km LoRaWAN Link'}</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.10rem, 1.5vw, 1.35rem)', fontWeight: 800, fontFamily: 'var(--font-display)', color: titleColor, marginBottom: '0.45rem', lineHeight: 1.25 }}>
            {isHindi ? '15 किमी सब-गीगाहर्ट्ज़ लिंक' : 'Sub-GHz Wireless Telemetry'}
          </h2>

          <p style={{ fontSize: '0.76rem', color: subtitleColor, lineHeight: 1.45, marginBottom: '0.85rem' }}>
            {isHindi
              ? 'खेत में बिना किसी वाई-फाई या महंगे सिम कार्ड के, सब-गीगाहर्ट्ज़ LoRa तरंगें मिट्टी के सेंसर से डेटा सीधे केंद्रीय प्लेटफॉर्म तक पहुंचाती हैं।'
              : 'Zero Wi-Fi or cellular SIM cards required in the field. Encrypted Sub-GHz LoRa chirp packets transmit across dense canopies directly to the cloud.'}
          </p>

          <div style={{ display: 'flex', gap: '0.45rem', fontSize: '0.64rem' }}>
            <div style={{ flex: 1, background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', padding: '0.40rem 0.55rem', borderRadius: '6px', borderLeft: '2px solid #38bdf8' }}>
              <div style={{ color: mutedColor }}>RSSI:</div>
              <strong style={{ color: '#38bdf8' }}>-78 dBm (Strong)</strong>
            </div>
            <div style={{ flex: 1, background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', padding: '0.40rem 0.55rem', borderRadius: '6px', borderLeft: '2px solid #22c55e' }}>
              <div style={{ color: mutedColor }}>Battery:</div>
              <strong style={{ color: '#22c55e' }}>5+ Yrs Solar</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: RIGHT COLUMN — NEURAL AI PIPELINE (64% - 78%) ── */}
      <section
        id="section-pipeline"
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '3rem 0',
        }}
      >
        <div style={{ ...cardStyle, maxWidth: '390px', width: '100%', marginLeft: 'auto', marginRight: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.40rem', color: '#fbbf24', fontSize: '0.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
            <Sparkles size={13} />
            <span>{isHindi ? '०४ • AI कृषि निर्णय' : '04 • Neural Agronomic Engine'}</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.10rem, 1.5vw, 1.35rem)', fontWeight: 800, fontFamily: 'var(--font-display)', color: titleColor, marginBottom: '0.45rem', lineHeight: 1.25 }}>
            {isHindi ? 'कच्चे डेटा से सटीक निर्णय' : 'Autonomous Decision Pipeline'}
          </h2>

          <p style={{ fontSize: '0.76rem', color: subtitleColor, lineHeight: 1.45, marginBottom: '0.85rem' }}>
            {isHindi
              ? 'हमारा न्यूरल इंजन मिट्टी के डेटा, मौसम पूर्वानुमान और वाष्पोत्सर्जन को जोड़कर सटीक कृषि सलाह प्रदान करता है।'
              : 'Our neural network correlates subsurface moisture and NPK with VPD curves to orchestrate automated precision irrigation.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.40rem' }}>
            <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: '1px solid rgba(56, 189, 248, 0.20)', borderRadius: '6px', padding: '0.45rem 0.55rem' }}>
              <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.66rem' }}>
                1. {isHindi ? 'इनपुट:' : 'Input:'} <span style={{ fontFamily: 'monospace', fontWeight: 400 }}>[M:42.8% | NPK:Bal]</span>
              </div>
            </div>

            <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: '1px solid rgba(34, 197, 94, 0.20)', borderRadius: '6px', padding: '0.45rem 0.55rem' }}>
              <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.66rem' }}>
                2. {isHindi ? 'निदान:' : 'Diagnostic:'} <span style={{ fontWeight: 400, color: subtitleColor }}>{isHindi ? 'पर्याप्त नमी (36h)' : 'Moisture stable'}</span>
              </div>
            </div>

            <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: '1px solid rgba(251, 191, 36, 0.20)', borderRadius: '6px', padding: '0.45rem 0.55rem' }}>
              <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.66rem' }}>
                3. {isHindi ? 'लाभ:' : 'Impact:'} <span style={{ fontWeight: 400, color: subtitleColor }}>{isHindi ? '१४,२००L बचत • +१८% उपज' : '14,200L Saved • +18% Yield'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: LEFT COLUMN — WEATHER & FIELD HEALTH (78% - 88%) ── */}
      <section
        id="section-weather-matrix"
        style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '3rem 0',
        }}
      >
        <div style={{ ...cardStyle, maxWidth: '380px', width: '100%', marginLeft: '0', marginRight: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.40rem', color: 'var(--accent-primary)', fontSize: '0.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <CloudSun size={13} />
              <span>{isHindi ? '०५ • मौसम व ओज' : '05 • Climate & Vitality'}</span>
            </div>
            <div style={{ background: 'rgba(34, 197, 94, 0.18)', border: '1px solid #22c55e', color: '#22c55e', padding: '0.12rem 0.45rem', borderRadius: '4px', fontSize: '0.60rem', fontWeight: 800 }}>
              92% {isHindi ? 'ओज' : 'OPTIMAL'}
            </div>
          </div>

          <h2 style={{ fontSize: 'clamp(1.10rem, 1.5vw, 1.35rem)', fontWeight: 800, fontFamily: 'var(--font-display)', color: titleColor, marginBottom: '0.45rem', lineHeight: 1.25 }}>
            {isHindi ? 'उत्तर प्रक्षेत्र • स्वास्थ्य सूचकांक' : `${mockField.name} • Vitality Matrix`}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
            <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '0.45rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.20rem', color: '#f59e0b', fontSize: '0.56rem', fontWeight: 700 }}>
                <Thermometer size={11} />
                <span>{isHindi ? 'तापमान' : 'Temp'}</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: titleColor, margin: '0.10rem 0 0 0' }}>{mockWeather.temperature}°C</div>
              <div style={{ fontSize: '0.48rem', color: mutedColor }}>{mockWeather.description}</div>
            </div>

            <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '0.45rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.20rem', color: '#38bdf8', fontSize: '0.56rem', fontWeight: 700 }}>
                <Droplets size={11} />
                <span>{isHindi ? 'नमी' : 'Humidity'}</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: titleColor, margin: '0.10rem 0 0 0' }}>{mockWeather.humidity}%</div>
              <div style={{ fontSize: '0.48rem', color: mutedColor }}>{isHindi ? 'सामान्य' : 'Normal'}</div>
            </div>

            <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '0.45rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.20rem', color: '#818cf8', fontSize: '0.56rem', fontWeight: 700 }}>
                <Wind size={11} />
                <span>{isHindi ? 'बारिश' : 'Rain'}</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: titleColor, margin: '0.10rem 0 0 0' }}>{mockWeather.rain_probability}%</div>
              <div style={{ fontSize: '0.48rem', color: mutedColor }}>24h</div>
            </div>

            <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '0.45rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.20rem', color: '#a3e635', fontSize: '0.56rem', fontWeight: 700 }}>
                <SunMedium size={11} />
                <span>{isHindi ? 'ओज' : 'Canopy'}</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: titleColor, margin: '0.10rem 0 0 0' }}>99.2%</div>
              <div style={{ fontSize: '0.48rem', color: mutedColor }}>Peak</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: RIGHT COLUMN — INTERACTIVE SANDBOX (88% - 94%) ── */}
      <section
        id="section-interactive-sandbox"
        style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '3rem 0',
        }}
      >
        <div style={{ ...cardStyle, maxWidth: '390px', width: '100%', marginLeft: 'auto', marginRight: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.40rem', color: 'var(--accent-primary)', fontSize: '0.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
            <Sliders size={13} />
            <span>{isHindi ? '०६ • सिमुलेशन सैंडबॉक्स' : '06 • Field Sandbox'}</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.10rem, 1.5vw, 1.35rem)', fontWeight: 800, fontFamily: 'var(--font-display)', color: titleColor, marginBottom: '0.45rem', lineHeight: 1.25 }}>
            {isHindi ? 'खेत की स्थितियों का परीक्षण' : 'Test Dynamic Conditions'}
          </h2>

          {/* Mode Toggle Buttons */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <button
              onClick={() => setSimulationMode('optimal')}
              style={{
                background: simulationMode === 'optimal' ? 'var(--accent-primary)' : 'rgba(0,0,0,0.06)',
                color: simulationMode === 'optimal' ? '#040a06' : subtitleColor,
                border: '1px solid rgba(34, 197, 94, 0.40)',
                borderRadius: '999px',
                padding: '0.22rem 0.55rem',
                fontSize: '0.62rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isHindi ? 'अनुकूल' : 'Optimal'}
            </button>
            <button
              onClick={() => setSimulationMode('dry')}
              style={{
                background: simulationMode === 'dry' ? '#f59e0b' : 'rgba(0,0,0,0.06)',
                color: simulationMode === 'dry' ? '#040a06' : subtitleColor,
                border: '1px solid rgba(245, 158, 11, 0.40)',
                borderRadius: '999px',
                padding: '0.22rem 0.55rem',
                fontSize: '0.62rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isHindi ? 'कम नमी' : 'Dry Stress'}
            </button>
            <button
              onClick={() => setSimulationMode('fertilizer')}
              style={{
                background: simulationMode === 'fertilizer' ? '#38bdf8' : 'rgba(0,0,0,0.06)',
                color: simulationMode === 'fertilizer' ? '#040a06' : subtitleColor,
                border: '1px solid rgba(56, 189, 248, 0.40)',
                borderRadius: '999px',
                padding: '0.22rem 0.55rem',
                fontSize: '0.62rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isHindi ? 'उच्च पोषण' : 'Peak NPK'}
            </button>
          </div>

          <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '0.55rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.64rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.10rem' }}>
              {isHindi ? 'स्वायत्त AI प्रतिक्रिया:' : 'Autonomous Advisory:'}
            </div>
            <div style={{ fontSize: '0.68rem', color: subtitleColor, lineHeight: 1.35 }}>
              {simulationMode === 'dry'
                ? (isHindi ? '⚠️ नमी 24.8% पर गिर गई। ड्रिप वाल्व 45 मिनट के लिए सक्रिय।' : '⚠️ Root moisture at 24.8%. Autonomous drip cycle triggered.')
                : simulationMode === 'fertilizer'
                ? (isHindi ? '🌿 नाइट्रोजन 78.4 ppm। पोषण आदर्श स्थिति में।' : '🌿 Elevated NPK detected (78.4 ppm). Optimal assimilation.')
                : (isHindi ? '✅ सभी पैरामीटर आदर्श सीमा में हैं।' : '✅ All parameters in optimal range. Zero intervention needed.')}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: LEFT COLUMN — FINAL HARVEST REVEAL & CTA (94% - 100%) ── */}
      <section
        id="section-final-harvest"
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'flex-start', // Elevated to upper portion of viewport
          justifyContent: 'flex-start',
          padding: '1.5rem 0 3rem 0',
          marginTop: '-3.5rem', // Pulled upward
        }}
      >
        <div
          style={{
            ...cardStyle,
            maxWidth: '380px',
            width: '100%',
            marginLeft: '0',
            marginRight: 'auto',
            textAlign: 'left',
            transform: 'translateY(-1.5rem)', // Lifted higher
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid #22c55e',
              borderRadius: '999px',
              padding: '0.18rem 0.55rem',
              fontSize: '0.60rem',
              fontWeight: 800,
              color: 'var(--accent-primary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.45rem',
            }}
          >
            <Sparkles size={11} />
            <span>{isHindi ? '०७ • संपूर्ण फसल व विशेषताएं' : '07 • Harvest Intelligence'}</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.10rem, 1.5vw, 1.35rem)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              background: isLight
                ? 'linear-gradient(135deg, #0f172a 0%, #15803d 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #86efac 60%, #22c55e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2,
              marginBottom: '0.40rem',
            }}
          >
            {isHindi ? 'धारा AI के चार प्रमुख स्तंभ' : 'Autonomous Precision Agriculture'}
          </h2>

          <p style={{ fontSize: '0.74rem', color: subtitleColor, lineHeight: 1.4, marginBottom: '1.0rem' }}>
            {isHindi
              ? 'जैसे ही पेड़ पर पके फल धरती पर गिरते हैं, धारा AI के चार मुख्य स्तंभ आपके सामने खुलते हैं।'
              : 'Interact with the four telemetry cards popping open around the base of the mature tree.'}
          </p>

          <button
            onClick={handleLaunch}
            className="btn-primary"
            style={{
              padding: '0.45rem 1.2rem',
              fontSize: '0.76rem',
              fontWeight: 800,
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 0 18px rgba(34, 197, 94, 0.35)',
            }}
          >
            <span>{currentUser ? t('nav.dashboard') : (isHindi ? 'धारा AI में प्रवेश करें' : 'Enter Farm Console')}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </section>
    </div>
  );
}
