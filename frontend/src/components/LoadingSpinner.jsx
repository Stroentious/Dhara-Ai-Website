import React from 'react';

const LoadingSpinner = ({ message = "Loading...", fullScreen = false }) => {
  const containerStyle = fullScreen 
    ? { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }
    : { padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' };

  return (
    <div style={containerStyle}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(34, 197, 94, 0.2)',
        borderTop: '3px solid var(--accent-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      {message && <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>{message}</p>}
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
