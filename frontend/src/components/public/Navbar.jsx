import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, Sun, Moon, Sparkles, LayoutDashboard, LogIn, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, actualTheme } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Solutions', href: '#story' },
    { label: 'Ecosystem', href: '#ecosystem' },
    { label: 'Soil Intelligence', href: '#soil-intelligence' },
    { label: 'Live Preview', href: '#dashboard-preview' },
    { label: 'Dhara AI', href: '#ai-assistant' },
    { label: 'Hardware', href: '#hardware' },
    { label: 'Technology', href: '#technology' },
    { label: 'Sustainability', href: '#sustainability' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'all 0.3s ease',
          backgroundColor: isScrolled
            ? (actualTheme === 'dark' ? 'rgba(10, 15, 13, 0.88)' : 'rgba(248, 250, 247, 0.88)')
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--border-glass)' : '1px solid transparent',
          padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
        }}
      >
        <div className="site-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
            }}>
              <Leaf color="#ffffff" size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', display: 'block', lineHeight: 1 }}>
                DHARA AI
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Agri-Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  transition: 'color 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Current theme: ${theme} (Click to toggle)`}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'var(--transition)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}
            >
              {actualTheme === 'dark' ? <Sun size={18} color="var(--accent-amber)" /> : <Moon size={18} color="var(--accent-primary)" />}
            </button>

            {/* Dashboard / Demo CTA Button */}
            <Link
              to="/dashboard"
              className="btn-primary desktop-cta"
              style={{
                fontSize: '0.875rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <LayoutDashboard size={16} />
              <span>{currentUser ? 'Go to Dashboard' : 'View Demo'}</span>
            </Link>

            {/* Login Link if not logged in */}
            {!currentUser && (
              <Link
                to="/login"
                className="btn-secondary desktop-cta"
                style={{
                  fontSize: '0.875rem',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <LogIn size={15} />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            backgroundColor: 'rgba(10, 15, 13, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '80%',
              maxWidth: '320px',
              height: '100%',
              backgroundColor: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-glass)',
              padding: '6rem 1.75rem 2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: 'var(--shadow-lg)',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Navigation
              </span>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                {link.label}
              </a>
            ))}

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.5rem' }}>
              <Link
                to="/dashboard"
                className="btn-primary"
                onClick={() => setMobileMenuOpen(false)}
                style={{ width: '100%' }}
              >
                <LayoutDashboard size={18} />
                <span>{currentUser ? 'Go to Dashboard' : 'Launch Demo'}</span>
              </Link>

              <Link
                to="/login"
                className="btn-secondary"
                onClick={() => setMobileMenuOpen(false)}
                style={{ width: '100%' }}
              >
                <LogIn size={16} />
                <span>Farmer Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 991px) {
          .mobile-menu-toggle { display: flex !important; }
          .desktop-cta { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
