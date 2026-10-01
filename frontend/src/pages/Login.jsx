import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Leaf, Eye, EyeOff, ArrowLeft, Sparkles, Globe } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

/**
 * Login Component — Authentication & Account Setup View
 * Fully Multilingual with instant language switching and new-user onboarding triggers
 */
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const { actualTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Enforce fixed dark theme on document root while on Login page; restore global theme on unmount
  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute('data-theme') || actualTheme || 'dark';
    
    root.setAttribute('data-theme', 'dark');

    return () => {
      root.setAttribute('data-theme', previousTheme);
    };
  }, [actualTheme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
        // Check if this user has already completed/skipped onboarding
        const userKey = 'dhara_onboarding_completed_' + email.trim().toLowerCase();
        const hasCompleted = localStorage.getItem(userKey) || localStorage.getItem('dhara_onboarding_completed');
        if (!hasCompleted) {
          localStorage.setItem('dhara_is_new_user', 'true');
        }
      } else {
        if (!name.trim()) { 
          setError(t('login.errorRequired') || 'Full name is required.'); 
          setLoading(false); 
          return; 
        }
        result = await register(email, password, name);
        // Explicit new registration: automatically triggers interactive guide
        localStorage.setItem('dhara_is_new_user', 'true');
        localStorage.removeItem('dhara_onboarding_completed_' + email.trim().toLowerCase());
        localStorage.removeItem('dhara_onboarding_completed');
      }
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(t('login.errorFailed') || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(t('login.unexpectedError') || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestDemo = async () => {
    setLoading(true);
    await login('demo@dhara.ai', 'demo123');
    // Allow guest demo to experience onboarding if not previously completed
    const hasCompleted = localStorage.getItem('dhara_onboarding_completed_demo@dhara.ai') || localStorage.getItem('dhara_onboarding_completed');
    if (!hasCompleted) {
      localStorage.setItem('dhara_is_new_user', 'true');
    }
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#f0fdf4',
        fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3.5rem',
          background: 'linear-gradient(145deg, #181108 0%, #0a0704 100%)',
          position: 'relative',
          overflow: 'hidden',
          borderRight: '1px solid rgba(212, 163, 89, 0.15)',
        }}
        className="hide-on-mobile"
      >
        {/* Back Link */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} />
            <span>{t('login.returnHome')}</span>
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div
              style={{
                background: 'var(--gradient-primary)',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                boxShadow: '0 0 16px rgba(212, 163, 89, 0.4)',
              }}
            >
              <Leaf size={28} color="#fff" />
            </div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>DHARA AI</span>
          </div>

          <h2 style={{ fontSize: '2.25rem', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 800, lineHeight: 1.2 }}>
            {t('login.heroTitle', 'Intelligent Agriculture,')}<br />
            <span style={{ color: 'var(--accent-primary)' }}>
              {t('login.heroSubtitle', 'Powered by Real Field Data.')}
            </span>
          </h2>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '440px' }}>
            {t('login.heroDesc', 'Connect 7-in-1 NPK soil telemetry, microclimate forecasts, and conversational agronomy AI in one unified platform.')}
          </p>
        </div>

        {/* Feature Badges */}
        <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 10 }}>
          {[
            { label: t('login.featSoil', '7-in-1 Soil Telemetry'), icon: '🌱' },
            { label: t('login.featLora', 'LoRa Mesh Network'), icon: '📡' },
            { label: t('login.featAi', 'Agronomy AI'), icon: '🤖' }
          ].map((f) => (
            <div key={f.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{f.icon}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form (Fixed Dark Aesthetic with Language Toggle) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
        
        {/* Language Switcher in Top Right (22 Indian Languages + English) */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
          <LanguageSelector />
        </div>

        <div
          className="fade-in"
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: '2.5rem',
            backgroundColor: '#0a0805',
            border: '1px solid rgba(212, 163, 89, 0.25)',
            borderRadius: '18px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 163, 89, 0.1)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div
                style={{
                  background: 'var(--gradient-primary)',
                  padding: '10px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  boxShadow: '0 0 14px rgba(212, 163, 89, 0.35)',
                }}
              >
                <Leaf size={24} color="#fff" />
              </div>
            </div>
            <h2 style={{ fontSize: '1.65rem', marginBottom: '0.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {isLogin ? t('login.signInTitle') : t('login.signUpTitle')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {isLogin ? t('login.signInSubtitle', 'Sign in to access your field telemetry dashboard') : t('login.signUpSubtitle', 'Start monitoring your crops with precision sensors')}
            </p>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

          {/* One-Click Guest Demo Button */}
          <button
            type="button"
            onClick={handleGuestDemo}
            disabled={loading}
            className="btn-secondary"
            style={{
              width: '100%',
              marginBottom: '1.25rem',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              backgroundColor: 'rgba(212, 163, 89, 0.08)',
              border: '1px solid rgba(212, 163, 89, 0.25)',
              color: 'var(--text-primary)',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={16} color="var(--accent-primary)" />
            <span>{t('login.guestDemoBtn')}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t('login.orEmail', 'OR SIGN IN WITH EMAIL')}
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {t('login.fullName')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder={t('login.fullNamePlaceholder')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(212, 163, 89, 0.25)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {t('login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('login.emailPlaceholder')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(212, 163, 89, 0.25)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {t('login.password')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t('login.passwordPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.75rem 0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(212, 163, 89, 0.25)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '0.8rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              {loading ? (isLogin ? t('login.loggingIn') : t('login.registering')) : (isLogin ? t('login.signInBtn') : t('login.signUpBtn'))}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isLogin ? t('login.needAccount') : t('login.alreadyHaveAccount')}{' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {isLogin ? t('login.signUp') : t('login.signIn')}
            </button>
          </p>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
              ← {t('login.returnHome')}
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .hide-on-mobile { display: none !important; } }
      `}</style>
    </div>
  );
};

export default Login;
