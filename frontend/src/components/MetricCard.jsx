import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const MetricCard = ({ title, value, unit, icon: Icon, trend, trendValue, color = 'green', className = '' }) => {
  const colors = {
    green: 'var(--accent-primary)',
    amber: 'var(--accent-amber)',
    red: 'var(--accent-red)',
    blue: 'var(--accent-blue)',
  };

  const activeColor = colors[color] || colors.green;

  return (
    <div className={`glass-card ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{title}</span>
        <div style={{ 
          background: `rgba(${color === 'green' ? '34, 197, 94' : color === 'amber' ? '245, 158, 11' : color === 'red' ? '239, 68, 68' : '59, 130, 246'}, 0.15)`,
          padding: '0.5rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {Icon && <Icon size={20} color={activeColor} />}
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{value}</h3>
        {unit && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{unit}</span>}
      </div>
      
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: trend === 'up' ? 'var(--accent-primary)' : trend === 'down' ? 'var(--accent-red)' : 'var(--text-muted)' }}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : trend === 'down' ? <ArrowDownRight size={14} /> : <Minus size={14} />}
          <span>{trendValue} from last week</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
