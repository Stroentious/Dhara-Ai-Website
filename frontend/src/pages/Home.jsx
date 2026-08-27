import React, { useEffect } from 'react';
import Navbar from '../components/public/Navbar';
import HeroSection from '../components/public/HeroSection';
import FarmerStorySection from '../components/public/FarmerStorySection';
import EcosystemFlowSection from '../components/public/EcosystemFlowSection';
import SoilSensorSection from '../components/public/SoilSensorSection';
import DashboardPreviewSection from '../components/public/DashboardPreviewSection';
import AiAssistantSection from '../components/public/AiAssistantSection';
import HowItWorksSection from '../components/public/HowItWorksSection';
import HardwareSection from '../components/public/HardwareSection';
import TechnologySection from '../components/public/TechnologySection';
import SustainabilitySection from '../components/public/SustainabilitySection';
import Footer from '../components/public/Footer';

const Home = () => {
  useEffect(() => {
    document.title = 'DHARA AI — Intelligent Agriculture, Powered by Real Field Data';
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sticky Public Header */}
      <Navbar />

      {/* Main Homepage Flow */}
      <main style={{ flex: 1 }}>
        <HeroSection />
        <FarmerStorySection />
        <EcosystemFlowSection />
        <SoilSensorSection />
        <DashboardPreviewSection />
        <AiAssistantSection />
        <HowItWorksSection />
        <HardwareSection />
        <TechnologySection />
        <SustainabilitySection />
      </main>

      {/* Public Footer */}
      <Footer />
    </div>
  );
};

export default Home;
