import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ChevronDown, ArrowRight, Sprout } from 'lucide-react';

/**
 * ScrollNarrative Component — Narrative Storyline Overlay
 * Professional Medium Typography Scale:
 * - Hero heading: clamp(1.45rem, 2.6vw, 2.05rem)
 * - Subtitles: clamp(0.82rem, 1.0vw, 0.94rem)
 * - Section headings: clamp(1.02rem, 1.4vw, 1.24rem)
 * - Body text: 0.78rem - 0.80rem with clean line-height
 * - Buttons: 0.80rem - 0.82rem
 * - No text dominance over the 3D seed/tree growth scene
 */

export default function ScrollNarrative({ progress, onOpenPortal }) {
  const { language, t } = useLanguage();

  const getStageOpacity = (start, end, fadeSpan = 0.06) => {
    if (progress < start) {
      if (progress < start - fadeSpan) return 0;
      return (progress - (start - fadeSpan)) / fadeSpan;
    }
    if (progress > end) {
      if (progress > end + fadeSpan) return 0;
      return 1 - (progress - end) / fadeSpan;
    }
    return 1;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 15,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '4.8rem 2rem 2rem 2rem',
      }}
    >
      {/* ── STAGE 0: SEED RESTING & SETTLING (0% - 20%) ── */}
      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: getStageOpacity(0.0, 0.18, 0.05),
          transition: 'opacity 0.2s ease-out',
          pointerEvents: getStageOpacity(0.0, 0.18, 0.05) > 0.5 ? 'auto' : 'none',
          maxWidth: '500px',
          width: '86%',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(34, 197, 94, 0.10)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            borderRadius: '999px',
            padding: '0.24rem 0.72rem',
            fontSize: '0.62rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.6rem',
            boxShadow: '0 0 14px rgba(34, 197, 94, 0.10)',
          }}
        >
          <Sprout size={11} />
          <span>{language === 'hi' ? 'बीज से शुरुआत' : 'Seed to Harvest'}</span>
        </div>

        {/* Medium-Large Hero Heading */}
        <h1
          style={{
            fontSize: 'clamp(1.45rem, 2.6vw, 2.05rem)',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, #ffffff 0%, #86efac 60%, #22c55e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.2,
            marginBottom: '0.45rem',
            letterSpacing: '-0.01em',
          }}
        >
          DHARA AI
        </h1>

        {/* Medium Subheading */}
        <p
          style={{
            fontSize: 'clamp(0.82rem, 1.0vw, 0.94rem)',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            lineHeight: 1.45,
            maxWidth: '380px',
            margin: '0 auto 1.2rem auto',
          }}
        >
          {language === 'hi'
            ? 'कृषि में गहराई से निहित बुद्धिमत्ता।'
            : 'Intelligence rooted in agriculture.'}
        </p>

        {/* Scroll Scrubbing Hint */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            color: 'var(--text-muted)',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.03em',
            animation: 'bounce 2.2s infinite ease-in-out',
          }}
        >
          <span>{language === 'hi' ? 'विकास देखने के लिए नीचे स्क्रॉल करें' : 'Scroll down to scrub growth timeline'}</span>
          <ChevronDown size={13} color="var(--accent-primary)" />
        </div>
      </div>

      {/* ── STAGE 1: GERMINATION & SEED CRACKING (20% - 35%) ── */}
      <div
        style={{
          position: 'absolute',
          top: '28%',
          left: '8%',
          maxWidth: '320px',
          opacity: getStageOpacity(0.20, 0.35, 0.05),
          transition: 'opacity 0.2s ease-out',
          pointerEvents: getStageOpacity(0.20, 0.35, 0.05) > 0.5 ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            fontSize: '0.60rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            marginBottom: '0.3rem',
          }}
        >
          {language === 'hi' ? '०१ • अंकुरण एवं भूमि प्रवेश' : '01 • Germination & Radicle'}
        </div>
        <h2
          style={{
            fontSize: 'clamp(1.02rem, 1.4vw, 1.24rem)',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: '#fff',
            lineHeight: 1.28,
            marginBottom: '0.35rem',
          }}
        >
          {language === 'hi' ? 'बीज का नवजीवन' : 'The Awakening Embryo'}
        </h2>
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
          }}
        >
          {language === 'hi'
            ? 'बीज का आवरण खुलता है और पहली जैविक जड़ भूमि की गहराई में उतरती है।'
            : 'The seed hull cracks open, releasing the embryo radicle deep into fertile soil nutrients.'}
        </p>
      </div>

      {/* ── STAGE 2: UNDERGROUND ROOTS (35% - 50%) ── */}
      <div
        style={{
          position: 'absolute',
          top: '28%',
          right: '8%',
          maxWidth: '320px',
          textAlign: 'right',
          opacity: getStageOpacity(0.36, 0.50, 0.05),
          transition: 'opacity 0.2s ease-out',
          pointerEvents: getStageOpacity(0.36, 0.50, 0.05) > 0.5 ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            fontSize: '0.60rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            marginBottom: '0.3rem',
          }}
        >
          {language === 'hi' ? '०२ • भूगर्भ संवेदन' : '02 • Deep Root Sensing'}
        </div>
        <h2
          style={{
            fontSize: 'clamp(1.02rem, 1.4vw, 1.24rem)',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: '#fff',
            lineHeight: 1.28,
            marginBottom: '0.35rem',
          }}
        >
          {language === 'hi' ? 'भूमि से जुड़ा डिजिटल जाल' : 'Root Network Telemetry'}
        </h2>
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
          }}
        >
          {language === 'hi'
            ? 'जड़ें मिट्टी की नमी, NPK पोषक तत्वों और सूक्ष्मजीव स्वास्थ्य को लगातार मैप करती हैं।'
            : 'Spreading root network continuously senses volumetric moisture, NPK vitality, and underground pH.'}
        </p>
      </div>

      {/* ── STAGE 3: SHOOT & TRUNK EMERGENCE (50% - 65%) ── */}
      <div
        style={{
          position: 'absolute',
          top: '28%',
          left: '8%',
          maxWidth: '320px',
          opacity: getStageOpacity(0.51, 0.65, 0.05),
          transition: 'opacity 0.2s ease-out',
          pointerEvents: getStageOpacity(0.51, 0.65, 0.05) > 0.5 ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            fontSize: '0.60rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            marginBottom: '0.3rem',
          }}
        >
          {language === 'hi' ? '०३ • तना एवं दृढ़ता' : '03 • Shoot & Trunk Emergence'}
        </div>
        <h2
          style={{
            fontSize: 'clamp(1.02rem, 1.4vw, 1.24rem)',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: '#fff',
            lineHeight: 1.28,
            marginBottom: '0.35rem',
          }}
        >
          {language === 'hi' ? 'ऊर्ध्वमुखी स्वायत्त विकास' : 'Autonomous Trunk Growth'}
        </h2>
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
          }}
        >
          {language === 'hi'
            ? 'हरा अंकुर मिट्टी को चीरकर बाहर आता है और एक मजबूत तने में परिपक्व होता है।'
            : 'Tender green shoot breaks through surface soil and thickens into a sturdy resilient trunk.'}
        </p>
      </div>

      {/* ── STAGE 4: BRANCHES & LEAF CANOPY (65% - 85%) ── */}
      <div
        style={{
          position: 'absolute',
          top: '28%',
          right: '8%',
          maxWidth: '320px',
          textAlign: 'right',
          opacity: getStageOpacity(0.66, 0.84, 0.05),
          transition: 'opacity 0.2s ease-out',
          pointerEvents: getStageOpacity(0.66, 0.84, 0.05) > 0.5 ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            fontSize: '0.60rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            marginBottom: '0.3rem',
          }}
        >
          {language === 'hi' ? '०४ • शाखायें एवं पत्तियाँ' : '04 • Canopy Expansion'}
        </div>
        <h2
          style={{
            fontSize: 'clamp(1.02rem, 1.4vw, 1.24rem)',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: '#fff',
            lineHeight: 1.28,
            marginBottom: '0.35rem',
          }}
        >
          {language === 'hi' ? 'सघन पर्णसमूह का विस्तार' : 'Precision Branching & Leaves'}
        </h2>
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
          }}
        >
          {language === 'hi'
            ? 'हवा के साथ झूमती प्राकृतिक पत्तियाँ और मौसम के अनुसार ढलती शाखायें।'
            : 'GPU instanced foliage uncurls and unfurls into a dense canopy reacting gracefully to ambient wind.'}
        </p>
      </div>

      {/* ── STAGE 5: MATURE HARVEST & ENTER PORTAL (85% - 100%) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: getStageOpacity(0.85, 1.0, 0.05),
          transition: 'opacity 0.2s ease-out',
          pointerEvents: getStageOpacity(0.85, 1.0, 0.05) > 0.5 ? 'auto' : 'none',
          maxWidth: '500px',
          width: '86%',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(1.18rem, 1.8vw, 1.48rem)',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, #ffffff 0%, #86efac 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.25,
            marginBottom: '0.4rem',
          }}
        >
          {language === 'hi' ? 'एक बीज से समृद्ध फसल तक।' : 'From one seed to a smarter harvest.'}
        </h2>
        <p
          style={{
            fontSize: '0.80rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.95rem',
            lineHeight: 1.45,
          }}
        >
          {language === 'hi'
            ? 'लाखों किसानों के लिए अगली पीढ़ी का स्वायत्त AI कृषि समाधान।'
            : 'Empowering farmers with next-generation autonomous agricultural intelligence.'}
        </p>

        {/* Medium CTA Button */}
        <button
          onClick={onOpenPortal}
          className="btn-primary"
          style={{
            pointerEvents: 'auto',
            padding: '0.58rem 1.45rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            borderRadius: '999px',
            boxShadow: '0 6px 20px rgba(34, 197, 94, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
          }}
        >
          <Sparkles size={14} />
          <span>{t('login.enterPortal')}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* ── TIMELINE VERTICAL PROGRESS INDICATOR (Right Edge) ── */}
      <div
        style={{
          position: 'fixed',
          right: '1.4rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: '0.58rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
          {Math.round(progress * 100)}%
        </div>
        <div
          style={{
            width: '2.5px',
            height: '90px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '99px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${Math.max(4, progress * 100)}%`,
              background: 'linear-gradient(180deg, #22c55e, #86efac)',
              borderRadius: '99px',
              boxShadow: '0 0 8px #22c55e',
              transition: 'height 0.08s linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}
