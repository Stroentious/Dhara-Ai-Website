import React from 'react';

const SensorGauge = ({ value, min = 0, max = 100, unit = '', label, color = 'green' }) => {
  const normalizedValue = Math.min(Math.max(value, min), max);
  const percentage = ((normalizedValue - min) / (max - min)) * 100;
  
  // SVG Arc calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // 75% of a circle for a gauge look
  const dashArray = `${(percentage / 100) * (circumference * 0.75)} ${circumference}`;

  const colors = {
    green: 'var(--accent-primary)',
    amber: 'var(--accent-amber)',
    red: 'var(--accent-red)',
    blue: 'var(--accent-blue)',
  };

  const strokeColor = colors[color] || colors.green;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }} className="glass-card">
      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
        <svg viewBox="0 0 100 100" style={{ transform: 'rotate(135deg)' }}>
          {/* Background track */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="var(--bg-secondary)"
            strokeWidth="10"
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active track */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={dashArray}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease-out' }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          transform: 'translateY(5px)'
        }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{value}</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{unit}</span>
        </div>
      </div>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'center' }}>{label}</span>
    </div>
  );
};

export default SensorGauge;
