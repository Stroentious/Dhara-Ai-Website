import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  MessageSquare, 
  Send, 
  Leaf, 
  HelpCircle, 
  CheckCircle2, 
  ShieldAlert,
  ArrowRight,
  User,
  Bot
} from 'lucide-react';

const AiAssistantSection = () => {
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);

  const demoConversations = [
    {
      id: 0,
      question: 'Why is soil moisture dropping faster than usual in North Field?',
      category: 'Irrigation & Drainage',
      answer: 'Based on your 7-in-1 sensor telemetry in North Field Alpha, soil moisture decreased from 68% to 54% over the last 36 hours. This coincides with a 4.2°C ambient temperature rise and 16 km/h dry winds recorded by the weather node. The loamy soil drainage curve indicates normal evapotranspiration for wheat at crown root initiation. No pipe leaks detected.',
      recommendation: 'Target next irrigation cycle for tomorrow morning between 5:00 AM – 7:30 AM to minimize evaporative loss.',
      confidence: 'High • Grounded on 24h Sensor History'
    },
    {
      id: 1,
      question: 'What does a soil pH of 5.8 mean for my wheat crop?',
      category: 'Soil Chemistry',
      answer: 'A pH of 5.8 indicates moderately acidic soil conditions. For Wheat (ideal range 6.2–7.2), this level reduces phosphorus availability by approximately 25% and slows beneficial nitrogen-fixing microbial activity. However, potassium and iron remain readily absorbable.',
      recommendation: 'Consider applying agricultural lime (calcium carbonate) at 1.5 tonnes/ha during land preparation post-harvest, or use nitrate-based fertilizers rather than high-acidifying ammonium sulfate.',
      confidence: 'Agronomic Model • Crop: Wheat'
    },
    {
      id: 2,
      question: 'Explain NPK status for 4.5 hectares of loamy soil.',
      category: 'Fertilizer Optimization',
      answer: 'Current telemetry for your 4.5 ha loamy plot shows: Nitrogen (N) at 58 mg/kg (Adequate), Phosphorus (P) at 34 mg/kg (Below target of 40 mg/kg), and Potassium (K) at 187 mg/kg (Optimal). The N:P:K ratio is slightly skewed on phosphorus.',
      recommendation: 'Apply 50 kg of DAP (Di-Ammonium Phosphate) per hectare via fertigation or placement before the second irrigation to restore phosphorus balance without overloading nitrogen.',
      confidence: 'Soil Telemetry + Phenology Stage'
    },
    {
      id: 3,
      question: 'Should I irrigate today given the 20% rain forecast?',
      category: 'Weather + Sensor Fusion',
      answer: 'Sensor telemetry reports 62.4% volumetric soil moisture, which provides 3.5 days of buffer before reaching the 50% management allowed depletion threshold. With 20% rain probability and high cloud cover reducing evapotranspiration, irrigation is not urgently required today.',
      recommendation: 'Hold irrigation today. Dhara AI will re-evaluate tomorrow morning post-microclimate update.',
      confidence: 'Microclimate + Soil Moisture Fusion'
    }
  ];

  const currentConvo = demoConversations[selectedPromptIdx];

  return (
    <section id="ai-assistant" className="site-section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Sparkles size={14} />
            <span>Context-Aware Agronomy Intelligence</span>
          </div>
          <h2 className="section-title">
            Ask Your Field. Ask Dhara.
          </h2>
          <p className="section-subtitle">
            Dhara AI translates raw sensor telemetry into conversational agronomic guidance. Ask natural questions about soil chemistry, irrigation timing, and crop stress.
          </p>
        </div>

        {/* 2-Column Interactive Sandbox */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'stretch'
        }}>
          
          {/* Left Column: Sample Agronomic Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} color="var(--accent-primary)" />
              <span>Select an Agricultural Query to Test:</span>
            </h3>

            {demoConversations.map((item, idx) => {
              const isSelected = selectedPromptIdx === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedPromptIdx(idx)}
                  className="glass-card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderLeft: isSelected ? '4px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                    backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                    {isSelected && (
                      <span className="badge badge-online" style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}>
                        Active Query
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    "{item.question}"
                  </span>
                </button>
              );
            })}

            {/* Launch Real Chat Assistant Link */}
            <div style={{ marginTop: '0.5rem' }}>
              <Link 
                to="/chat" 
                className="btn-primary" 
                style={{ width: '100%', padding: '0.85rem' }}
              >
                <MessageSquare size={18} />
                <span>Launch Full Dhara AI Chat Assistant</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Live Simulated Chat Response Terminal */}
          <div 
            className="glass-card" 
            style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div>
              {/* Chat Terminal Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--border-glass)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Leaf size={18} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      DHARA AI Agronomic Engine
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      ● Connected to North Field 7-in-1 Sensor
                    </div>
                  </div>
                </div>

                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {currentConvo.confidence}
                </span>
              </div>

              {/* Farmer Message Bubble */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={16} color="var(--text-muted)" />
                </div>
                <div style={{
                  padding: '0.85rem 1.15rem',
                  borderRadius: '12px 12px 12px 2px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.925rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  maxWidth: '85%'
                }}>
                  {currentConvo.question}
                </div>
              </div>

              {/* Dhara AI Response Bubble */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={16} color="#ffffff" />
                </div>
                <div style={{
                  padding: '1.25rem',
                  borderRadius: '12px 12px 2px 12px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <p style={{ fontSize: '0.925rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                    {currentConvo.answer}
                  </p>

                  <div style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(22, 163, 74, 0.08)',
                    borderLeft: '3px solid var(--accent-primary)'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      🌾 Suggested Farm Action
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {currentConvo.recommendation}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Responsible AI Disclaimer */}
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <ShieldAlert size={16} color="var(--accent-amber)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                <strong>Responsible AI:</strong> Dhara AI recommendations assist growers with field calculations and do not replace certified agronomist lab consultations.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AiAssistantSection;
