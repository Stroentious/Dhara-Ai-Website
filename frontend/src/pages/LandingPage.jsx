import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Leaf, Globe, LogIn } from 'lucide-react';

import GrowthScene from '../components/growth/GrowthScene';
import LandingScrollContent from '../components/growth/LandingScrollContent';

/**
 * LandingPage — Default Home View (Route: /)
 * - Publicly accessible without authentication
 * - Houses the continuous background 3D Seed -> Banyan Tree growth experience
 * - Full-page scroll narrative & technological deep-dive layer
 * - 100% Reversible scroll scrubbing (down to grow, up to reverse)
 * - Uses a fixed, vibrant daytime agricultural light mode (dark mode removed from landing page)
 */
export default function LandingPage() {
  const [uiProgress, setUiProgress] = useState(0);
  const [quality, setQuality] = useState('high');

  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const cursorRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const containerRef = useRef(null);

  const { currentUser } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { actualTheme } = useTheme();
  const navigate = useNavigate();

  const isHindi = language === 'hi';

  // Enforce light mode on document root while on Landing page; restore global theme on unmount
  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute('data-theme') || actualTheme || 'dark';

    root.setAttribute('data-theme', 'light');

    return () => {
      root.setAttribute('data-theme', previousTheme);
    };
  }, [actualTheme]);

  // Detect device quality level
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;
    const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    if (isMobile || isLowPower) {
      setQuality('low');
    } else if (isTablet) {
      setQuality('medium');
    } else {
      setQuality('high');
    }
  }, []);

  // Passive Scroll & RAF Progress Lerp Engine across the entire landing page
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalDocHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      if (totalDocHeight > 0) {
        targetProgressRef.current = Math.min(1, Math.max(0, scrollY / totalDocHeight));
      }
    };

    const handlePointerMove = (e) => {
      cursorRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      cursorRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Initial check
    handleScroll();

    let animId;
    let lastUiUpdate = 0;

    const tick = (time) => {
      // Lerp smooth progress (fluid exponential damping)
      const target = targetProgressRef.current;
      const current = smoothProgressRef.current;
      const diff = target - current;
      smoothProgressRef.current += diff * 0.08;

      // Lerp cursor
      cursorRef.current.x += (cursorRef.current.targetX - cursorRef.current.x) * 0.06;
      cursorRef.current.y += (cursorRef.current.targetY - cursorRef.current.y) * 0.06;

      // Update HTML UI state at throttled rate (~24fps)
      if (time - lastUiUpdate > 40) {
        setUiProgress(smoothProgressRef.current);
        lastUiUpdate = time;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleNavigateLogin = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #dbeafe 0%, #e0f2fe 30%, #edf4ec 65%, #e4ece1 100%)',
        fontFamily: 'var(--font-body)',
        overflowX: 'hidden',
      }}
    >
      {/* ── 1. FIXED BACKGROUND 3D SEED → BANYAN TREE CANVAS (Runs behind all content) ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <GrowthScene
          progressRef={smoothProgressRef}
          cursorRef={cursorRef}
          quality={quality}
          onTreeClick={handleNavigateLogin}
          isBW={true}
          language={language}
        />
      </div>

      {/* ── 2. FIXED TOP BRAND BAR & AUTH CONTROLS ── */}
      <header
        className="landing-top-bar"
        style={{
          position: 'fixed',
          top: '1.15rem',
          left: '1.75rem',
          right: '1.75rem',
          zIndex: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          background: 'transparent',
          border: 'none',
        }}
      >
        {/* Logo Brand */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            pointerEvents: 'auto',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.88)',
            padding: '0.35rem 0.75rem',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              background: 'var(--gradient-primary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px var(--accent-glow-strong)',
            }}
          >
            <Leaf size={15} color="#fff" />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.0rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
                letterSpacing: '0.01em',
              }}
            >
              DHARA AI
            </div>
            <div style={{ fontSize: '0.54rem', color: '#64748b', letterSpacing: '0.12em', marginTop: '1px' }}>
              AGRI-AI PLATFORM
            </div>
          </div>
        </div>

        {/* Top-Right Controls & LOGIN BUTTON (Theme Toggle Removed) */}
        <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center', pointerEvents: 'auto' }}>
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(255, 255, 255, 0.88)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              color: '#0f172a',
              borderRadius: '999px',
              padding: '0.35rem 0.70rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(10px)',
            }}
            title={language === 'en' ? 'Switch to Hindi (हिंदी)' : 'अंग्रेजी में बदलें (English)'}
          >
            <Globe size={12} color="#16a34a" />
            <span>{language === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}</span>
          </button>

          {/* TOP-RIGHT LOGIN BUTTON */}
          <button
            onClick={handleNavigateLogin}
            className="btn-primary landing-top-login-btn"
            id="landing-top-login-btn"
            style={{
              padding: '0.44rem 1.05rem',
              fontSize: '0.76rem',
              fontWeight: 700,
              borderRadius: '999px',
              boxShadow: '0 0 16px rgba(34, 197, 94, 0.35)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <LogIn size={12} />
            <span>{currentUser ? t('nav.dashboard') : (language === 'hi' ? 'लॉग इन करें' : 'Login')}</span>
          </button>
        </div>
      </header>

      {/* ── 3. FLOATING RIGHT-EDGE TIMELINE SCRUB INDICATOR ── */}
      <div
        style={{
          position: 'fixed',
          right: '1.25rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          zIndex: 40,
          pointerEvents: 'none',
          background: 'rgba(255, 255, 255, 0.88)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '999px',
          padding: '0.55rem 0.35rem',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div style={{ fontSize: '0.56rem', color: '#16a34a', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
          {Math.round(uiProgress * 100)}%
        </div>
        <div
          style={{
            width: '3px',
            height: '80px',
            background: 'rgba(0, 0, 0, 0.08)',
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
              height: `${Math.max(4, uiProgress * 100)}%`,
              background: 'linear-gradient(180deg, #22c55e, #86efac)',
              borderRadius: '99px',
              boxShadow: '0 0 8px #22c55e',
              transition: 'height 0.08s linear',
            }}
          />
        </div>
      </div>

      {/* ── 4. FOREGROUND SCROLLABLE NARRATIVE & TECHNICAL LAYER ── */}
      <LandingScrollContent progress={uiProgress} isLight={true} />

      {/* Scoped Responsive Styles */}
      <style>{`
        @media (max-width: 640px) {
          .landing-top-bar {
            top: 0.75rem !important;
            left: 0.75rem !important;
            right: 0.75rem !important;
          }
          .btn-label-text {
            display: none !important;
          }
          .landing-top-login-btn {
            padding: 0.38rem 0.80rem !important;
            font-size: 0.72rem !important;
          }
        }
        @media (max-width: 420px) {
          .landing-top-bar {
            top: 0.60rem !important;
            left: 0.60rem !important;
            right: 0.60rem !important;
          }
        }
      `}</style>
    </div>
  );
}
