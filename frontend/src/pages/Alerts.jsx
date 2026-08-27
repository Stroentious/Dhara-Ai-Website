import React, { useEffect, useState } from 'react';
import AlertItem from '../components/AlertItem';
import { mockAlerts } from '../data/mockData';
import { Filter, CheckCircle } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) headerTitle.textContent = 'System Alerts';
  }, []);

  const handleResolve = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, is_resolved: true } : a));
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ACTIVE') return !a.is_resolved;
    if (filter === 'RESOLVED') return a.is_resolved;
    if (filter === 'CRITICAL') return a.severity === 'HIGH' || a.severity === 'CRITICAL';
    return true;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Active</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-red)' }}>{alerts.filter(a => !a.is_resolved).length}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Critical</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-amber)' }}>{alerts.filter(a => (a.severity === 'HIGH' || a.severity === 'CRITICAL') && !a.is_resolved).length}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Resolved (7d)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{alerts.filter(a => a.is_resolved).length}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--text-secondary)" />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 'auto' }}>
            <option value="ALL">All Alerts</option>
            <option value="ACTIVE">Active Only</option>
            <option value="CRITICAL">Critical & High</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0' }}>
        {filteredAlerts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No alerts matching the selected filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredAlerts.map((alert, index) => (
              <div key={alert.id} style={{ 
                padding: '1rem 1.5rem', 
                borderBottom: index < filteredAlerts.length - 1 ? '1px solid var(--border-glass)' : 'none'
              }}>
                <AlertItem alert={alert} onResolve={handleResolve} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Alerts;
