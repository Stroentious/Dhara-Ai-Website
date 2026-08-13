import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { RefreshCw, Wifi, Droplets, Sun, Moon } from 'lucide-react';

export const Header = ({ activeTab, summary, onRefresh, theme, onToggleTheme }) => {
  const titles = {
    dashboard: 'Farm Status Overview',
    monitoring: 'Zone & Field Node Monitoring',
    analytics: 'Soil & Sensor Analytics',
    irrigation: 'Irrigation & Fertigation Control',
    alerts: 'Farm Alerts & System Notifications',
    chatbot: 'Dhara AI Agricultural Assistant',
  };

  const isLight = theme === 'light';

  return (
    <header className={`h-16 px-8 flex items-center justify-between sticky top-0 z-20 transition-colors border-b ${
      isLight ? 'bg-white/90 border-slate-200 text-slate-900 shadow-sm backdrop-blur' : 'bg-agri-900/90 border-agri-800 text-white backdrop-blur'
    }`}>
      <div>
        <h2 className="text-lg font-bold">{titles[activeTab] || 'Dhara AI Dashboard'}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            isLight
              ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              : 'bg-agri-850 border-agri-800 text-emerald-300 hover:bg-agri-800'
          }`}
          title={isLight ? 'Switch to Dark Agriculture Theme' : 'Switch to Minimal White Theme'}
        >
          {isLight ? (
            <>
              <Moon className="w-4 h-4 text-slate-700" />
              <span>Dark Theme</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>White Minimal</span>
            </>
          )}
        </button>

        {/* Pump Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-agri-950 border-agri-800'
        }`}>
          <Droplets className="w-3.5 h-3.5 text-blue-500" />
          <span className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400 font-medium'}>Pump:</span>
          <StatusBadge status={summary?.pumpStatus || 'OFF'} size="sm" />
        </div>

        {/* MQTT Broker Connection Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-agri-950 border-agri-800'
        }`}>
          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
          <span className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400 font-medium'}>MQTT:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Connected</span>
        </div>

        {/* Refresh Sync Button */}
        <button
          onClick={onRefresh}
          className={`p-2 rounded-lg border transition-colors ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
              : 'bg-agri-850 hover:bg-agri-800 text-slate-300 border-agri-800'
          }`}
          title="Refresh Telemetry Data"
        >
          <RefreshCw className="w-4 h-4 text-emerald-500" />
        </button>
      </div>
    </header>
  );
};
