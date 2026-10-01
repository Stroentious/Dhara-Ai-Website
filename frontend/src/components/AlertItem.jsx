import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';

const ALERT_TYPE_MAP_HI = {
  'LOW_MOISTURE': 'कम मृदा नमी चेतावनी',
  'NUTRIENT_DEFICIENCY': 'पोषक तत्वों की कमी',
  'SENSOR_DISCONNECTED': 'सेंसर डिस्कनेक्ट',
  'HIGH_TEMPERATURE': 'उच्च तापमान चेतावनी',
  'IRRIGATION_NEEDED': 'सिंचाई आवश्यक',
};

const ALERT_MSG_MAP_HI = {
  'Soil moisture below 30% in North Field': 'उत्तर प्रक्षेत्र में मिट्टी की नमी 30% से कम हो गई है',
  'Phosphorus levels dropping - consider fertilization': 'फास्फोरस स्तर घट रहा है - उर्वरक देने पर विचार करें',
  'Sensor NPK-001 last seen 2 hours ago': 'सेंसर NPK-001 का अंतिम सिग्नल 2 घंटे पहले मिला था',
};

const AlertItem = ({ alert, onResolve }) => {
  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  const getSeverityConfig = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return { color: 'var(--accent-red)', icon: AlertCircle };
      case 'MEDIUM':
        return { color: 'var(--accent-amber)', icon: AlertTriangle };
      case 'LOW':
        return { color: 'var(--accent-blue)', icon: Info };
      default:
        return { color: 'var(--text-muted)', icon: Info };
    }
  };

  const config = alert.is_resolved ? { color: 'var(--accent-primary)', icon: CheckCircle } : getSeverityConfig(alert.severity);
  const Icon = config.icon;

  const timeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + (isHi ? ' वर्ष पहले' : ' years ago');
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + (isHi ? ' महीने पहले' : ' months ago');
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + (isHi ? ' दिन पहले' : ' days ago');
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + (isHi ? ' घंटे पहले' : ' hours ago');
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + (isHi ? ' मिनट पहले' : ' minutes ago');
    return Math.floor(seconds) + (isHi ? ' सेकंड पहले' : ' seconds ago');
  };

  const alertTitle = isHi 
    ? (ALERT_TYPE_MAP_HI[alert.alert_type] || alert.alert_type.replace(/_/g, ' '))
    : alert.alert_type.replace(/_/g, ' ');

  const alertMessage = isHi 
    ? (ALERT_MSG_MAP_HI[alert.message] || alert.message)
    : alert.message;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid var(--border-glass)',
      borderLeft: `4px solid ${config.color}`,
      borderRadius: '8px',
      padding: '1rem',
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start',
      transition: 'var(--transition)'
    }}>
      <div style={{ color: config.color, marginTop: '0.25rem' }}>
        <Icon size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{alertTitle}</h4>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Clock size={12} />
            {timeAgo(alert.created_at)}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{alertMessage}</p>
      </div>
      {!alert.is_resolved && onResolve && (
        <button 
          onClick={() => onResolve(alert.id)}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-primary)',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={e => e.target.style.background = 'transparent'}
        >
          {t('alerts.resolve')}
        </button>
      )}
    </div>
  );
};

export default AlertItem;
