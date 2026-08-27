import React from 'react';

const StatusBadge = ({ status, label }) => {
  const normalizedStatus = status.toLowerCase();
  let badgeClass = 'badge-info';
  let dotClass = '';

  if (normalizedStatus === 'online' || normalizedStatus === 'connected' || normalizedStatus === 'healthy') {
    badgeClass = 'badge-online';
    dotClass = 'online';
  } else if (normalizedStatus === 'offline' || normalizedStatus === 'error' || normalizedStatus === 'disconnected') {
    badgeClass = 'badge-offline';
    dotClass = 'offline';
  } else if (normalizedStatus === 'warning' || normalizedStatus === 'low') {
    badgeClass = 'badge-warning';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {dotClass && <span className={`sensor-dot ${dotClass}`}></span>}
      {label || status}
    </span>
  );
};

export default StatusBadge;
