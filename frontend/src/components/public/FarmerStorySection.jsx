import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  HelpCircle, 
  Droplets, 
  FlaskConical, 
  ThermometerSun, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Leaf
} from 'lucide-react';

const FarmerStorySection = () => {
  const { language } = useLanguage();

  const farmerDilemmas = language !== 'en' ? [
    {
      icon: Droplets,
      color: 'var(--accent-blue)',
      question: 'क्या जड़ क्षेत्र बहुत सूखा है या अत्यधिक नम?',
      context: 'सतह की मिट्टी अक्सर सूखी दिखती है जबकि जड़ क्षेत्र में नमी बनी रहती है, जिससे अतिरिक्त पानी, बिजली की बर्बादी और जड़ सड़न होती है।'
    },
    {
      icon: FlaskConical,
      color: 'var(--accent-primary)',
      question: 'क्या NPK पोषक तत्व संतुलित हैं या बह रहे हैं?',
      context: 'मिट्टी में मौजूद सक्रिय नाइट्रोजन और फास्फोरस जाने बिना यूरिया या डीएपी डालने से लागत बढ़ती है और मिट्टी की सेहत बिगड़ती है।'
    },
    {
      icon: ThermometerSun,
      color: 'var(--accent-amber)',
      question: 'क्या मिट्टी का pH आवश्यक सूक्ष्म पोषक तत्वों को रोक रहा है?',
      context: 'यदि pH अम्लीय या क्षारीय हो जाता है, तो मिट्टी में मौजूद होने पर भी फसलें डाले गए उर्वरक को अवशोषित नहीं कर पाती हैं।'
    },
    {
      icon: AlertTriangle,
      color: 'var(--accent-red)',
      question: 'क्या दृश्यमान नुकसान से कुछ दिन पहले फसल तनाव का पता लगाया जा सकता है?',
      context: 'जब तक पत्तियां मुड़ती या पीली पड़ती हैं, तब तक उपज का नुकसान तय हो चुका होता है। प्रारंभिक सेंसर टेलीमेट्री पहले ही तनाव प्रकट कर देती है।'
    }
  ] : [
    {
      icon: Droplets,
      color: 'var(--accent-blue)',
      question: 'Is the root zone too dry or over-saturated?',
      context: 'Surface soil often looks dry while root zones remain damp, leading to over-watering, electricity waste, and root rot.'
    },
    {
      icon: FlaskConical,
      color: 'var(--accent-primary)',
      question: 'Are NPK nutrients balanced or leaching away?',
      context: 'Applying urea or DAP blindly without knowing active soil nitrogen and phosphorus leads to high input costs and soil degradation.'
    },
    {
      icon: ThermometerSun,
      color: 'var(--accent-amber)',
      question: 'Is soil pH locking out critical micronutrients?',
      context: 'If pH shifts acidic or alkaline, crops cannot absorb added fertilizer even when present in the soil.'
    },
    {
      icon: AlertTriangle,
      color: 'var(--accent-red)',
      question: 'Can field stress be detected days before visual damage?',
      context: 'By the time leaves curl or yellow, yield loss is already locked in. Early soil and microclimate telemetry reveals stress beforehand.'
    }
  ];

  return (
    <section id="story" className="site-section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Leaf size={14} />
            <span>{language === 'hi' ? 'कृषि की मानवीय वास्तविकता' : 'The Human Reality of Agriculture'}</span>
          </div>
          <h2 className="section-title">
            {language === 'hi'
              ? 'खेती हर दिन महत्वपूर्ण और सटीक निर्णयों से भरी होती है।'
              : 'Farming is Full of Critical Decisions Every Single Day.'}
          </h2>
          <p className="section-subtitle">
            {language === 'hi'
              ? 'हर सुबह, एक किसान के सामने जटिल कृषि प्रश्न होते हैं जिनके सीधे वित्तीय और फसल उपज परिणाम होते हैं। पारंपरिक खेती दृश्यमान अनुमान पर निर्भर करती है। धारा AI निरंतर खेत डेटा के माध्यम से स्पष्टता लाता है।'
              : 'Every morning, a farmer faces complex agronomic questions with real financial and crop yield consequences. Traditional farming relies on visual intuition and post-damage reactions. Dhara AI brings clarity through continuous field data.'}
          </p>
        </div>

        {/* 2-Column Comparison Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'stretch'
        }}>
          
          {/* Left: The Farmer's Daily Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HelpCircle size={22} color="var(--accent-amber)" />
              <span>{language === 'hi' ? 'वे प्रश्न जिनका उत्तर हर किसान को चाहिए:' : 'The Questions Every Grower Needs Answered:'}</span>
            </h3>

            {farmerDilemmas.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="glass-card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderLeft: `4px solid ${item.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={18} style={{ color: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.question}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '1.75rem', lineHeight: 1.5 }}>
                    {item.context}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: How Dhara AI Resolves the Dilemmas */}
          <div 
            className="glass-card" 
            style={{
              padding: '2.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(145deg, var(--bg-card), var(--bg-tertiary))',
              border: '1px solid var(--border-glass)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '1rem',
                textTransform: 'uppercase'
              }}>
                <CheckCircle size={14} />
                <span>{language === 'hi' ? 'धारा AI समाधान' : 'The Dhara AI Resolution'}</span>
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                {language === 'hi'
                  ? 'भौतिक मृदा संकेतों को एक एकीकृत इंटरफ़ेस में एक साथ लाना।'
                  : 'Bringing Physical Soil Signals Together in One Unified Interface.'}
              </h3>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                {language === 'hi'
                  ? 'सतही दिखावे से मिट्टी की स्थिति का अनुमान लगाने के बजाय, धारा AI भूमिगत 7-इन-1 NPK प्रोब और सूक्ष्म जलवायु स्टेशनों को सीधे आपके फोन से जोड़ता है।'
                  : 'Instead of guessing soil conditions from surface appearance, Dhara AI connects subterranean 7-in-1 NPK probes and microclimate stations directly to your phone.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <CheckCircle size={14} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {language === 'hi' ? 'सटीक सिंचाई समय:' : 'Precision Irrigation Timing:'}
                    </span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {language === 'hi' ? 'मुरझाने से पहले ठीक से जानें कि जड़ क्षेत्र कब पानी की कमी की सीमा तक पहुंचता है।' : 'Know precisely when root zones reach depletion threshold before wilting occurs.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <CheckCircle size={14} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {language === 'hi' ? 'लक्षित पोषक तत्व खुराक:' : 'Targeted Nutrient Dosing:'}
                    </span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {language === 'hi' ? 'वास्तविक समय में नाइट्रोजन (N), फास्फोरस (P) और पोटैशियम (K) की उपलब्धता को समझें।' : 'Understand real-time Nitrogen (N), Phosphorus (P), and Potassium (K) availability.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <CheckCircle size={14} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {language === 'hi' ? 'एग्रोनॉमी AI सहायक:' : 'Agronomy AI Assistant:'}
                    </span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {language === 'hi' ? 'सरल भाषा में प्रश्न पूछें और अपने खेत के लाइव सेंसर डेटा पर आधारित सिफारिशें प्राप्त करें।' : "Ask questions in plain language and get recommendations rooted in your field's live sensor data."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {language === 'hi' ? 'खेत आसूचना स्थिति' : 'Field Intelligence Status'}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {language === 'hi' ? 'निरंतर 24/7 मृदा निगरानी सक्रिय' : 'Continuous 24/7 Soil Monitoring'}
                </div>
              </div>
              <a 
                href="#ecosystem" 
                className="btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem' }}
              >
                <span>{language === 'hi' ? 'इकोसिस्टम देखें' : 'See Ecosystem'}</span>
                <ArrowRight size={14} />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default FarmerStorySection;
