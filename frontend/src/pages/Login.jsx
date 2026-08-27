import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Leaf, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';

/**
 * Login Component — Authentication & Account Setup View
 * 
 * Theme Implementation:
 * - Uses a FIXED, signature dark agricultural theme.
 * - No dark/light mode toggle or controls rendered.
 * - Restores the global theme seamlessly when navigating to other pages.
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
      } else {
        if (!name.trim()) { setError('Full name is required.'); setLoading(false); return; }
        result = await register(email, password, name);
      }
      if (result.success) navigate('/dashboard');
      else setError('Login failed. Please check your credentials.');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestDemo = async () => {
    setLoading(true);
    await login('demo@dhara.ai', 'demo123');
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#040a06',
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
          background: 'linear-gradient(145deg, #0f2e1b 0%, #0a1c12 100%)',
          position: 'relative',
          overflow: 'hidden',
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
              color: '#86efac',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Public Website</span>
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                boxShadow: '0 0 16px rgba(34, 197, 94, 0.4)',
              }}
            >
              <Leaf size={28} color="#fff" />
            </div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f0fdf4' }}>DHARA AI</span>
          </div>

          <h2 style={{ fontSize: '2.25rem', color: '#f0fdf4', marginBottom: '1rem', fontWeight: 800, lineHeight: 1.2 }}>
            Intelligent Agriculture,<br />
            <span style={{ color: '#4ade80' }}>Powered by Real Field Data.</span>
          </h2>

          <p style={{ fontSize: '1rem', color: '#a7f3d0', lineHeight: 1.6, maxWidth: '440px' }}>
            Connect 7-in-1 NPK soil telemetry, microclimate forecasts, and conversational agronomy AI in one unified platform.
          </p>
        </div>

        {/* Feature Badges */}
        <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 10 }}>
          {[
            { label: '7-in-1 Soil Telemetry', icon: '🌱' },
            { label: 'LoRa Mesh Network', icon: '📡' },
            { label: 'Agronomy AI', icon: '🤖' }
          ].map((f) => (
            <div key={f.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{f.icon}</div>
              <div style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 600 }}>{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form (Fixed Dark Aesthetic) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div
          className="fade-in"
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: '2.5rem',
            backgroundColor: '#07130a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  padding: '10px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  boxShadow: '0 0 14px rgba(34, 197, 94, 0.35)',
                }}
              >
                <Leaf size={24} color="#fff" />
              </div>
            </div>
            <h2 style={{ fontSize: '1.65rem', marginBottom: '0.25rem', fontWeight: 800, color: '#f0fdf4' }}>
              {isLogin ? 'Farmer Sign In' : 'Create Account'}
            </h2>
            <p style={{ color: '#4b7c5a', fontSize: '0.875rem' }}>
              {isLogin ? 'Sign in to access your field telemetry dashboard' : 'Start monitoring your crops with precision sensors'}
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
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#f0fdf4',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={16} color="#22c55e" />
            <span>Instant Guest Demo (1-Click)</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
            <span style={{ fontSize: '0.75rem', color: '#4b7c5a', fontWeight: 600 }}>OR SIGN IN WITH EMAIL</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: '#86efac' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="e.g. Gurpreet Singh"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f0fdf4',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: '#86efac' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="farmer@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f0fdf4',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: '#86efac' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.75rem 0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f0fdf4',
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
                    color: '#4b7c5a',
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
                backgroundColor: '#22c55e',
                color: '#040a06',
                fontWeight: 700,
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#4b7c5a' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#22c55e',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <Link to="/" style={{ fontSize: '0.8rem', color: '#4b7c5a', textDecoration: 'none' }}>
              ← Return to DHARA AI Homepage
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
