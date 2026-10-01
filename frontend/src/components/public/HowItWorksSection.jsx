import React from 'react';
import { 
  CheckCircle2, 
  Radio, 
  SignalHigh, 
  LineChart, 
  BellRing, 
  MessageSquareText, 
  ArrowRight,
  ListOrdered
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const HowItWorksSection = () => {
  const { language } = useLanguage();
  const isHi = language !== 'en';

  const stepsEn = [
    {
      step: '01',
      title: 'Connect the Field',
      icon: Radio,
      color: 'var(--accent-primary)',
      desc: "Embed the 7-in-1 stainless probe into your crop's active root zone and mount the compact solar node on the field perimeter."
    },
    {
      step: '02',
      title: 'Collect Field Data',
      icon: SignalHigh,
      color: 'var(--accent-secondary)',
      desc: 'The solar telemetry node transmits soil moisture, NPK, pH, and temperature data over long-range LoRaWAN frequencies.'
    },
    {
      step: '03',
      title: 'Understand Soil & Environment',
      icon: LineChart,
      color: 'var(--accent-blue)',
      desc: 'View real-time moisture depletion curves, nutrient balances, and 7-day microclimate weather forecasts in the web dashboard.'
    },
    {
      step: '04',
      title: 'Receive Alerts & Insights',
      icon: BellRing,
      color: 'var(--accent-amber)',
      desc: 'Get immediate push notifications when root moisture drops below trigger thresholds or nutrient deficiencies are detected.'
    },
    {
      step: '05',
      title: 'Ask Dhara AI',
      icon: MessageSquareText,
      color: 'var(--accent-primary)',
      desc: "Ask questions about fertilizer dosage, irrigation timing, and crop health grounded in your field's live telemetry."
    }
  ];

  const stepsHi = [
    {
      step: '01',
      title: 'खेत से जुड़ें',
      icon: Radio,
      color: 'var(--accent-primary)',
      desc: '7-इन-1 स्टेनलेस स्टील प्रोब को अपनी फसल के सक्रिय जड़ क्षेत्र में लगाएं और कॉम्पैक्ट सोलर नोड को खेत की परिधि पर स्थापित करें।'
    },
    {
      step: '02',
      title: 'खेत का डेटा एकत्र करें',
      icon: SignalHigh,
      color: 'var(--accent-secondary)',
      desc: 'सोलर टेलीमेट्री नोड लंबी दूरी की LoRaWAN आवृत्तियों पर मिट्टी की नमी, NPK, pH और तापमान का डेटा प्रसारित करता है।'
    },
    {
      step: '03',
      title: 'मिट्टी और पर्यावरण को समझें',
      icon: LineChart,
      color: 'var(--accent-blue)',
      desc: 'वेब डैशबोर्ड में रीयल-टाइम नमी में कमी के कर्व, पोषक तत्वों के संतुलन और 7-दिवसीय सूक्ष्म मौसम पूर्वानुमान देखें।'
    },
    {
      step: '04',
      title: 'अलर्ट और सुझाव प्राप्त करें',
      icon: BellRing,
      color: 'var(--accent-amber)',
      desc: 'जब जड़ की नमी सीमा से नीचे गिरती है या पोषक तत्वों की कमी का पता चलता है, तो तुरंत पुश सूचनाएं प्राप्त करें।'
    },
    {
      step: '05',
      title: 'धारा एआई से पूछें',
      icon: MessageSquareText,
      color: 'var(--accent-primary)',
      desc: 'अपने खेत की लाइव टेलीमेट्री पर आधारित उर्वरक खुराक, सिंचाई के समय और फसल स्वास्थ्य के बारे में प्रश्न पूछें।'
    }
  ];

  const steps = isHi ? stepsHi : stepsEn;

  return (
    <section id="how-it-works" className="site-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <ListOrdered size={14} />
            <span>{isHi ? 'कार्यान्वयन प्रक्रिया' : 'Implementation Journey'}</span>
          </div>
          <h2 className="section-title">
            {isHi ? 'धारा एआई 5 आसान चरणों में कैसे काम करता है' : 'How Dhara AI Works in 5 Simple Steps'}
          </h2>
          <p className="section-subtitle">
            {isHi 
              ? 'मिट्टी में भौतिक स्थापना से लेकर आपके मोबाइल फोन पर स्वचालित अलर्ट तक, शुरुआत करने के लिए किसी जटिल आईटी बुनियादी ढांचे की आवश्यकता नहीं है।'
              : 'From physical deployment in the soil to automated alerts on your mobile phone, getting started requires no complex IT infrastructure.'}
          </p>
        </div>

        {/* 5-Step Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          position: 'relative'
        }}>
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  position: 'relative',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                {/* Step Number Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--accent-secondary)',
                    fontFamily: 'JetBrains Mono, monospace',
                    lineHeight: 1
                  }}>
                    {item.step}
                  </span>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div style={{
          marginTop: '3.5rem',
          textAlign: 'center'
        }}>
          <Link to="/dashboard" className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
            <span>{isHi ? 'लाइव डेमो प्लेटफॉर्म देखें' : 'Explore the Live Demo Platform'}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
