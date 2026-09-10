import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Leaf, Globe, LogIn } from 'lucide-react';

import GrowthScene from './components/GrowthScene';
import LandingScrollContent from './components/LandingScrollContent';
import './styles/landing.css';

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
      className="landing-page-root"
    >
      {/* ── 1. FIXED BACKGROUND 3D SEED → BANYAN TREE CANVAS (Runs behind all content) ── */}
      <div className="landing-canvas-wrapper">
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
      <header className="landing-top-bar">
        {/* Logo Brand */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="landing-brand-badge"
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
        <div className="landing-nav-actions">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="landing-lang-btn"
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
          >
            <LogIn size={12} />
            <span>{currentUser ? t('nav.dashboard') : (language === 'hi' ? 'लॉग इन करें' : 'Login')}</span>
          </button>
        </div>
      </header>

      {/* ── 3. FLOATING RIGHT-EDGE TIMELINE SCRUB INDICATOR ── */}
      <div className="landing-timeline-scrub">
        <div className="scrub-label">
          {Math.round(uiProgress * 100)}%
        </div>
        <div className="scrub-track">
          <div
            className="scrub-fill"
            style={{
              height: `${Math.max(4, uiProgress * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* ── 4. FOREGROUND SCROLLABLE NARRATIVE & TECHNICAL LAYER ── */}
      <LandingScrollContent progress={uiProgress} isLight={true} />
    </div>
  );
}
