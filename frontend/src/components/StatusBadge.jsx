import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const STATUS_MAP_HI = {
  online: 'ऑनलाइन',
  connected: 'कनेक्टेड',
  healthy: 'स्वस्थ',
  optimal: 'अनुकूल',
  offline: 'ऑफ़लाइन',
  disconnected: 'डिस्कनेक्टेड',
  error: 'त्रुटि',
  warning: 'चेतावनी',
  low: 'कम',
};

const StatusBadge = ({ status = '', label }) => {
  const { language } = useLanguage();
  const normalizedStatus = (status || '').toLowerCase();
  let badgeClass = 'badge-info';
  let dotClass = '';

  if (normalizedStatus === 'online' || normalizedStatus === 'connected' || normalizedStatus === 'healthy' || normalizedStatus === 'optimal') {
    badgeClass = 'badge-online';
    dotClass = 'online';
  } else if (normalizedStatus === 'offline' || normalizedStatus === 'error' || normalizedStatus === 'disconnected') {
    badgeClass = 'badge-offline';
    dotClass = 'offline';
  } else if (normalizedStatus === 'warning' || normalizedStatus === 'low') {
    badgeClass = 'badge-warning';
  }

  const displayLabel = label || (language === 'hi' && STATUS_MAP_HI[normalizedStatus] ? STATUS_MAP_HI[normalizedStatus] : status);

  return (
    <span className={`badge ${badgeClass}`}>
      {dotClass && <span className={`sensor-dot ${dotClass}`}></span>}
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
