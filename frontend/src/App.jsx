import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { FieldProvider } from './context/FieldContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import LandingPage from './landing/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Fields from './pages/Fields';
import Sensors from './pages/Sensors';
import Irrigation from './pages/Irrigation';
import Fertilizer from './pages/Fertilizer';
import Weather from './pages/Weather';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import ChatBot from './pages/ChatBot';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!currentUser) return <Navigate to="/login" replace />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* 3D Seed to Banyan Tree Growth Journey Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Farm Management Application Suite */}
      <Route path="/" element={
        <ProtectedRoute>
          <FieldProvider>
            <Layout />
          </FieldProvider>
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="fields" element={<Fields />} />
        <Route path="sensors" element={<Sensors />} />
        <Route path="irrigation" element={<Irrigation />} />
        <Route path="fertilizer" element={<Fertilizer />} />
        <Route path="weather" element={<Weather />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="chat" element={<ChatBot />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Fallback to Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
