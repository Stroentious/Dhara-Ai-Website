import React from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  BarChart3, 
  Droplets, 
  Bell, 
  Bot, 
  Radio, 
  Leaf
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, theme }) => {
  const isLight = theme === 'light';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Farm Monitoring', icon: Sprout },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'irrigation', label: 'Irrigation Control', icon: Droplets },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'chatbot', label: 'AI Assistant', icon: Bot },
  ];

  return (
    <aside className={`w-64 flex flex-col justify-between h-screen sticky top-0 z-30 transition-colors border-r ${
      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-agri-900 border-agri-800 text-slate-100'
    }`}>
      {/* Brand Header */}
      <div>
        <div className={`p-6 border-b flex items-center gap-3 ${isLight ? 'border-slate-200' : 'border-agri-800'}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black shadow-md shadow-emerald-500/20">
            <Leaf className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              DHARA <span className="text-emerald-600 text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">AI</span>
            </h1>
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400/80 tracking-wide uppercase">Smart Fertigation</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/30'
                    : isLight
                    ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-slate-300 hover:bg-agri-850 hover:text-emerald-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Hardware Telemetry Footer */}
      <div className={`p-4 border m-4 rounded-xl transition-colors ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-agri-950/60 border-agri-850 text-slate-300'
      }`}>
        <div className="flex items-center gap-2.5 text-xs font-medium">
          <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>Substation ESP32-S3</span>
        </div>
        <div className="mt-2 text-[11px] flex items-center justify-between">
          <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>LoRa Network:</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active (868 MHz)</span>
        </div>
      </div>
    </aside>
  );
};
