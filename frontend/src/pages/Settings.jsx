import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, HardDrive, Shield } from 'lucide-react';

const Settings = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) headerTitle.textContent = 'Settings & Configuration';
  }, []);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      
      <div className="glass-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <User size={20} color="var(--accent-primary)" /> Profile Settings
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name</label>
            <input type="text" defaultValue={currentUser?.name || 'Admin User'} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
            <input type="email" defaultValue={currentUser?.email || 'admin@dhara.ai'} />
          </div>
        </div>
        <button className="btn-primary" style={{ marginTop: '1.5rem' }}>Save Changes</button>
      </div>

      <div className="glass-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Bell size={20} color="var(--accent-amber)" /> Notifications
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ width: 'auto' }} />
            <span>Email alerts for critical sensor thresholds (e.g. low moisture)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ width: 'auto' }} />
            <span>Weekly AI agricultural insight reports</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <input type="checkbox" style={{ width: 'auto' }} />
            <span>SMS alerts for hardware disconnection</span>
          </label>
        </div>
      </div>

      <div className="glass-card" style={{ border: '1px solid rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.05)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <HardDrive size={20} color="var(--accent-blue)" /> Hardware Integration (LoRaWAN)
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          To view live data from physical 7-in-1 NPK sensors, configure your LoRa gateway details here.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Gateway EUI / Network Server API Key</label>
            <input type="password" placeholder="Enter API Key from TTN or ChirpStack" />
          </div>
        </div>
        <button className="btn-secondary" style={{ marginTop: '1rem' }}>Test Connection</button>
      </div>

      <div className="glass-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Shield size={20} color="var(--text-muted)" /> System Info
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>DHARA AI Frontend Version: 1.0.0</div>
          <div>API Connection: <span style={{ color: 'var(--accent-primary)' }}>Simulated (Mock Mode)</span></div>
          <div>React Version: 18.3.1</div>
        </div>
      </div>

    </div>
  );
};

export default Settings;
