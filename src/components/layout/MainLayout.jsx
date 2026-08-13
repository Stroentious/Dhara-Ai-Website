import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout = ({ activeTab, setActiveTab, summary, onRefresh, theme, onToggleTheme, children }) => {
  return (
    <div className={`flex min-h-screen transition-colors ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-agri-950 text-slate-100'}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeTab={activeTab} summary={summary} onRefresh={onRefresh} theme={theme} onToggleTheme={onToggleTheme} />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
