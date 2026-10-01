import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LoadingSpinner = ({ message, fullScreen = false }) => {
  const { language, t } = useLanguage();
  const defaultMsg = t('common.loading') || (language !== 'en' ? 'लोड हो रहा है...' : 'Loading...');
  const displayMsg = message !== undefined ? message : defaultMsg;

  const containerStyle = fullScreen 
    ? { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }
    : { padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' };

  return (
    <div style={containerStyle}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(212, 163, 89, 0.25)',
        borderTop: '3px solid var(--accent-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      {displayMsg && <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>{displayMsg}</p>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
