import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Bell, HardDrive, Shield, Globe, Check } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

const Settings = () => {
  const { currentUser } = useAuth();
  const { language, setLanguage, currentLanguage, t } = useLanguage();

  useEffect(() => {
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) headerTitle.textContent = t('nav.settings');
  }, [t]);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Language & Localization Setting Card */}
      <div className="glass-card" style={{ border: '1px solid rgba(212, 163, 89, 0.45)', background: 'rgba(212, 163, 89, 0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
              <Globe size={20} color="var(--accent-primary)" /> {t('settings.languageTitle')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0.35rem 0 0', fontSize: '0.88rem' }}>
              {t('settings.languageDesc')}
            </p>
          </div>
          <LanguageSelector />
        </div>

        <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span>{t('settings.selectedLang')} <strong style={{ color: 'var(--accent-primary)' }}>{currentLanguage?.nativeName} ({currentLanguage?.name})</strong></span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{currentLanguage?.region}</span>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="glass-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <User size={20} color="var(--accent-primary)" /> {t('settings.profileTitle')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              {t('settings.name')}
            </label>
            <input type="text" defaultValue={currentUser?.name || 'Farmer Demo'} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              {t('settings.email')}
            </label>
            <input type="email" defaultValue={currentUser?.email || 'demo@dhara.ai'} />
          </div>
        </div>
        <button className="btn-primary" style={{ marginTop: '1.5rem' }}>
          {t('settings.saveChanges')}
        </button>
      </div>

      {/* Notifications */}
      <div className="glass-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Bell size={20} color="var(--accent-amber)" /> {t('settings.notificationsTitle')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ width: 'auto' }} />
            <span>{t('settings.notifEmailAlerts')}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ width: 'auto' }} />
            <span>{t('settings.notifWeeklyReports')}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <input type="checkbox" style={{ width: 'auto' }} />
            <span>{t('settings.notifSmsAlerts')}</span>
          </label>
        </div>
      </div>

      {/* Hardware Integration */}
      <div className="glass-card" style={{ border: '1px solid rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.05)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <HardDrive size={20} color="var(--accent-blue)" /> {t('settings.hardwareTitle')}
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {t('settings.hardwareDesc')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              {t('settings.gatewayKey')}
            </label>
            <input type="password" placeholder={t('settings.gatewayPlaceholder')} />
          </div>
        </div>
        <button className="btn-secondary" style={{ marginTop: '1rem' }}>
          {t('settings.testConn')}
        </button>
      </div>

      {/* System Info */}
      <div className="glass-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Shield size={20} color="var(--text-muted)" /> {t('settings.systemInfo')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>{t('settings.version')}</div>
          <div>{t('settings.apiConn')} <span style={{ color: 'var(--accent-primary)' }}>{t('settings.apiActive')}</span></div>
          <div>{t('settings.reactVersion')}</div>
          <div>{t('settings.selectedLang')} <strong style={{ color: 'var(--accent-primary)' }}>{currentLanguage?.nativeName} ({currentLanguage?.name})</strong></div>
        </div>
      </div>

    </div>
  );
};

export default Settings;
