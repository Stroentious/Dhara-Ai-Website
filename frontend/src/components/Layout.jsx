import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Radio, Droplets, FlaskConical, 
  CloudSun, LineChart, Bell, MessageSquare, Settings, 
  LogOut, Menu, X, Leaf, User, Sun, Moon, Globe, ExternalLink 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useField } from '../context/FieldContext';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, currentUser } = useAuth();
  const { fields, selectedField, setSelectedField } = useField();
  const { theme, toggleTheme, actualTheme } = useTheme();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/fields', label: 'Fields', icon: Map },
    { path: '/sensors', label: 'Sensors', icon: Radio },
    { path: '/irrigation', label: 'Irrigation', icon: Droplets },
    { path: '/fertilizer', label: 'Fertilizer & NPK', icon: FlaskConical },
    { path: '/weather', label: 'Weather', icon: CloudSun },
    { path: '/analytics', label: 'Analytics', icon: LineChart },
    { path: '/alerts', label: 'Alerts', icon: Bell },
    { path: '/chat', label: 'DHARA AI Chat', icon: MessageSquare },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: 'var(--bg-primary)' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          onClick={closeSidebar}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(4px)' }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: '260px',
        backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-glass)',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease', zIndex: 50, display: 'flex', flexDirection: 'column'
      }} className="sidebar">
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-glass)' }}>
          <div style={{ background: 'var(--gradient-primary)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
            <Leaf color="#fff" size={22} />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DHARA AI
          </h1>
          <button onClick={closeSidebar} className="mobile-close" style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-primary)', display: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.9rem',
                  borderRadius: '8px', textDecoration: 'none', 
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  background: isActive ? 'var(--gradient-primary)' : 'transparent',
                  fontWeight: isActive ? 700 : 500, transition: 'var(--transition)',
                  fontSize: '0.9rem'
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Link to Public Website */}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 0.9rem',
                borderRadius: '8px',
                color: 'var(--accent-primary)',
                backgroundColor: 'var(--accent-light)',
                fontSize: '0.825rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Globe size={16} />
              <span>Public Website</span>
              <ExternalLink size={12} style={{ marginLeft: 'auto' }} />
            </Link>
          </div>
        </nav>

        {/* User Footer */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-glass)', backgroundColor: 'var(--bg-tertiary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} color="#fff" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {currentUser?.name || 'Demo Farmer'}
              </p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {currentUser?.email || 'demo@dhara.ai'}
              </p>
            </div>
          </div>
          <button 
            onClick={logout} 
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'none', 
              border: 'none', 
              color: 'var(--accent-red)', 
              cursor: 'pointer', 
              padding: '0.35rem 0',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main App Canvas */}
      <main style={{ flex: 1, marginLeft: window.innerWidth > 768 ? '260px' : '0', display: 'flex', flexDirection: 'column', transition: 'margin 0.3s' }}>
        
        {/* Sticky Top App Bar */}
        <header style={{ 
          height: '65px', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 1.5rem', 
          background: actualTheme === 'dark' ? 'rgba(10, 15, 13, 0.85)' : 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setSidebarOpen(true)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} 
              className="mobile-menu-btn"
            >
              <Menu size={22} />
            </button>
            <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }} className="page-title">
              Dashboard
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Field Dropdown */}
            {fields && fields.length > 0 && (
              <select 
                value={selectedField?.id || ''} 
                onChange={(e) => setSelectedField(fields.find(f => f.id == e.target.value))}
                style={{ 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-glass)', 
                  padding: '0.4rem 0.75rem', 
                  borderRadius: '6px', 
                  color: 'var(--text-primary)', 
                  outline: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                {fields.map(f => <option key={f.id} value={f.id}>{f.name} ({f.crop_type})</option>)}
              </select>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch Theme (${theme})`}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {actualTheme === 'dark' ? <Sun size={16} color="var(--accent-amber)" /> : <Moon size={16} color="var(--accent-primary)" />}
            </button>
            
            {/* Notifications Bell */}
            <Link to="/alerts" style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Bell size={19} color="var(--text-secondary)" />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--accent-red)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
            </Link>
          </div>
        </header>

        {/* Page Content Outlet */}
        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (min-width: 769px) {
          .sidebar { transform: translateX(0) !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-close { display: none !important; }
        }
        @media (max-width: 768px) {
          main { margin-left: 0 !important; }
          .mobile-close { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
