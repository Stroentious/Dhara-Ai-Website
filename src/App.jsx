import React, { useState, useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { IrrigationPage } from './pages/IrrigationPage';
import { AlertsPage } from './pages/AlertsPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { farmService } from './services/farmService';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Theme State ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dhara_theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('dhara_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [summary, setSummary] = useState(null);
  const [zones, setZones] = useState([]);
  const [poles, setPoles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [systemControl, setSystemControl] = useState({
    pumpStatus: 'OFF',
    mode: 'AUTOMATIC',
    activeZoneId: 'zone-2',
    activeZoneName: 'Zone 2 — Greenhouse Alpha',
    lastIrrigated: '3 hours ago',
    recommendation: {
      zoneId: 'zone-2',
      zoneName: 'Zone 2 — Greenhouse Alpha',
      reason: 'Average soil moisture (26%) in Zone 2 is below configured threshold (40%).',
      suggestedDurationMinutes: 25,
      isIrrigationNeeded: true
    }
  });

  const [selectedPoleId, setSelectedPoleId] = useState(null);
  const [poleDetails, setPoleDetails] = useState(null);

  // Initial Data Load
  const loadData = async () => {
    const sum = await farmService.getFarmSummary();
    const zn = await farmService.getZones();
    const pl = await farmService.getPoles();
    const alt = await farmService.getAlerts();

    setSummary(sum);
    setZones(zn);
    setPoles(pl);
    setAlerts(alt);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pole Selection Handler
  const handleSelectPole = async (poleId) => {
    setSelectedPoleId(poleId);
    try {
      const details = await farmService.getPoleDetails(poleId);
      setPoleDetails(details);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClosePoleDetails = () => {
    setSelectedPoleId(null);
    setPoleDetails(null);
  };

  // Irrigation Action Handlers
  const handleTogglePump = async (newStatus) => {
    const updated = await farmService.updatePumpState(newStatus);
    setSystemControl(updated);
    loadData();
  };

  const handleSelectZone = async (zoneId) => {
    const updated = await farmService.updatePumpState(systemControl.pumpStatus, zoneId);
    setSystemControl(updated);
  };

  const handleToggleMode = async (newMode) => {
    const updated = await farmService.updateControlMode(newMode);
    setSystemControl(updated);
  };

  const handleApplyRecommendation = async () => {
    const updated = await farmService.updatePumpState('ON', systemControl.recommendation.zoneId);
    setSystemControl(updated);
    loadData();
  };

  return (
    <MainLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      summary={summary}
      onRefresh={loadData}
      theme={theme}
      onToggleTheme={handleToggleTheme}
    >
      {activeTab === 'dashboard' && (
        <DashboardPage
          summary={summary}
          zones={zones}
          poles={poles}
          alerts={alerts}
          onSelectPole={handleSelectPole}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === 'monitoring' && (
        <MonitoringPage
          zones={zones}
          poles={poles}
          poleDetails={poleDetails}
          selectedPoleId={selectedPoleId}
          onSelectPole={handleSelectPole}
          onClosePoleDetails={handleClosePoleDetails}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsPage
          zones={zones}
          poles={poles}
        />
      )}

      {activeTab === 'irrigation' && (
        <IrrigationPage
          systemControl={systemControl}
          zones={zones}
          onTogglePump={handleTogglePump}
          onSelectZone={handleSelectZone}
          onToggleMode={handleToggleMode}
          onApplyRecommendation={handleApplyRecommendation}
        />
      )}

      {activeTab === 'alerts' && (
        <AlertsPage />
      )}

      {activeTab === 'chatbot' && (
        <ChatbotPage />
      )}
    </MainLayout>
  );
}

export default App;
