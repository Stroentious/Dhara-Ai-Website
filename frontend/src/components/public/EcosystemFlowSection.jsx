import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MapPin, 
  Radio, 
  LineChart, 
  BellRing, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Activity
} from 'lucide-react';

const EcosystemFlowSection = () => {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState(1);

  const flowSteps = language !== 'en' ? [
    {
      id: 0,
      badge: 'चरण 01',
      title: 'कृषि खेत व भूखंड',
      icon: MapPin,
      color: 'var(--accent-primary)',
      summary: 'वास्तविक कृषि भूमि, मिट्टी के क्षेत्र और विभिन्न फसलें (गेहूं, कपास, धान, मक्का)।',
      detail: 'खेत को मिट्टी की बनावट (दोमट, चिकनी, रेतीली) और फसल वृद्धि चरण के अनुसार सूक्ष्म क्षेत्रों में विभाजित किया जाता है।',
      metrics: ['खेत का क्षेत्रफल (हेक्टेयर)', 'फसल विकास चरण', 'मिट्टी की बनावट का प्रकार']
    },
    {
      id: 1,
      badge: 'चरण 02',
      title: '7-इन-1 मृदा सेंसर',
      icon: Radio,
      color: 'var(--accent-secondary)',
      summary: 'भूमिगत प्रोब जो हर कुछ मिनटों में 7 प्रमुख मृदा स्वास्थ्य मानकों को मापते हैं।',
      detail: 'सक्रिय जड़ क्षेत्र में स्थापित औद्योगिक-ग्रेड RS485/Modbus स्टेनलेस स्टील सेंसर नमी, तापमान, pH, विद्युत चालकता (EC) और उपलब्ध NPK को मापते हैं।',
      metrics: ['मृदा नमी (0–100%)', 'NPK स्तर (mg/kg)', 'मृदा pH (3–9)', 'तापमान एवं EC']
    },
    {
      id: 2,
      badge: 'चरण 03',
      title: 'लो-पावर टेलीमेट्री',
      icon: Zap,
      color: 'var(--accent-blue)',
      summary: 'सौर ऊर्जा से चलने वाले LoRa नोड सेलुलर नेटवर्क के बिना लंबी दूरी तक पैकेट भेजते हैं।',
      detail: 'खेत के नोड सेंसर डेटा को पैकेटाइज करते हैं और 868/915 MHz LoRa मेश के जरिए खेत के गेटवे तक पहुंचाते हैं।',
      metrics: ['LoRaWAN 868/915 MHz', 'सौर ऊर्जा स्वायत्तता', 'शून्य डेटा लागत मेश']
    },
    {
      id: 3,
      badge: 'चरण 04',
      title: 'डेटा विश्लेषण इंजन',
      icon: LineChart,
      color: 'var(--accent-amber)',
      summary: 'टेलीमेट्री इंजन समय-श्रृंखला रुझानों और सूक्ष्म जलवायु पूर्वानुमानों को एकत्रित करता है।',
      detail: 'डेटा को उच्च-प्रदर्शन डेटाबेस में संग्रहीत किया जाता है और 24 घंटे व 7 दिनों के पानी के उपभोग की गणना की जाती है।',
      metrics: ['सब-सेकंड डेटा अंतर्ग्रहण', 'नमी हास वक्र', 'पोषक तत्व क्षरण रुझान']
    },
    {
      id: 4,
      badge: 'चरण 05',
      title: 'सक्रिय खेत अलर्ट',
      icon: BellRing,
      color: 'var(--accent-red)',
      summary: 'स्वचालित सीमा निगरानी फसल में तनाव आने से पहले ही किसान को सूचित करती है।',
      detail: 'जब नमी मुरझाने के बिंदु से नीचे जाती है या उर्वरक कम होता है, तो त्वरित सूचना भेजी जाती है ताकि नुकसान से बचा जा सके।',
      metrics: ['SMS और WhatsApp अलर्ट', 'थ्रेसहोल्ड ट्रिगर', 'शून्य गलत अलार्म']
    },
    {
      id: 5,
      badge: 'चरण 06',
      title: 'धारा AI इंजन',
      icon: Sparkles,
      color: 'var(--accent-primary)',
      summary: 'विशिष्ट एग्रोनॉमिक AI लाइव मिट्टी के संकेतों और मौसम का विश्लेषण करता है।',
      detail: 'धारा AI फसल-विशिष्ट कृषि ज्ञान को खेत के लाइव सेंसर रीडिंग और 7-दिवसीय मौसम पूर्वानुमान के साथ जोड़कर सलाह देता है।',
      metrics: ['सटीक LLM रीजनिंग', 'फसल-विशिष्ट आधार रेखा', 'ऐतिहासिक संदर्भ']
    },
    {
      id: 6,
      badge: 'चरण 07',
      title: 'कार्रवाई योग्य निर्णय',
      icon: CheckCircle2,
      color: 'var(--accent-secondary)',
      summary: 'स्पष्ट और ठोस निर्णय: सटीक सिंचाई करें, सही NPK दें, उपज सुरक्षित रखें।',
      detail: 'किसान को स्पष्ट कार्ययोजना मिलती है: उदा., "आज रात 45 मिनट के लिए ड्रिप चलाएं; बारिश के बाद शुक्रवार तक DAP का प्रयोग रोकें।"',
      metrics: ['30-40% पानी की बचत', 'उर्वरक का अनुकूलन', 'सुरक्षित फसल उपज']
    }
  ] : [
    {
      id: 0,
      badge: 'Step 01',
      title: 'Agricultural Field',
      icon: MapPin,
      color: 'var(--accent-primary)',
      summary: 'The physical farmland, soil zones, and crop varieties (Wheat, Cotton, Rice, Maize).',
      detail: 'The field is mapped into micro-zones according to soil texture (loamy, clay, sandy) and crop growth stage. Physical boundaries and irrigation blocks are established.',
      metrics: ['Field Area (Hectares)', 'Crop Phenology Stage', 'Soil Texture Type']
    },
    {
      id: 1,
      badge: 'Step 02',
      title: '7-in-1 Soil Sensors',
      icon: Radio,
      color: 'var(--accent-secondary)',
      summary: 'Subterranean probes measuring 7 core soil health parameters every few minutes.',
      detail: 'Industrial-grade RS485/Modbus stainless steel sensors embedded in the active root zone monitor moisture, temperature, pH, electrical conductivity (EC), and available Nitrogen, Phosphorus, and Potassium.',
      metrics: ['Moisture (0–100%)', 'NPK (mg/kg)', 'pH (3–9)', 'Temp & EC']
    },
    {
      id: 2,
      badge: 'Step 03',
      title: 'Low-Power Telemetry',
      icon: Zap,
      color: 'var(--accent-blue)',
      summary: 'Solar-powered LoRa nodes transmit packets over long distances without cellular dependency.',
      detail: 'Field nodes packetize sensor telemetry and broadcast via 868/915 MHz LoRa mesh to an on-farm gateway, operating reliably through heavy foliage and adverse weather with multi-year solar autonomy.',
      metrics: ['LoRaWAN 868/915 MHz', 'Solar Autonomy', 'Zero Data Cost Mesh']
    },
    {
      id: 3,
      badge: 'Step 04',
      title: 'Ingestion & Analytics',
      icon: LineChart,
      color: 'var(--accent-amber)',
      summary: 'FastAPI telemetry engine aggregates time-series trends and microclimate forecasts.',
      detail: 'Telemetry is validated, stored in high-performance time-series databases, and fed into evapotranspiration models to predict root zone water consumption over 24-hour and 7-day windows.',
      metrics: ['Sub-second Ingestion', 'Moisture Curves', 'Nutrient Depletion Trends']
    },
    {
      id: 4,
      badge: 'Step 05',
      title: 'Proactive Field Alerts',
      icon: BellRing,
      color: 'var(--accent-red)',
      summary: 'Automated threshold monitoring notifies growers before crop stress occurs.',
      detail: 'Instant notifications are dispatched when moisture drops below permanent wilting point, fertilizer levels drop, or sensor health is compromised—preventing yield loss before visible signs appear.',
      metrics: ['SMS & WhatsApp Alerts', 'Threshold Triggers', 'Zero False Positives']
    },
    {
      id: 5,
      badge: 'Step 06',
      title: 'Dhara AI Engine',
      icon: Sparkles,
      color: 'var(--accent-primary)',
      summary: 'Domain-specific agronomic AI reasons across live soil signals and weather.',
      detail: "Dhara AI combines crop-specific agronomic knowledge with your field's live sensor readings and 7-day weather forecasts to generate contextual, grounded recommendations.",
      metrics: ['Grounded LLM Reasoning', 'Crop-Specific Baselines', 'Historical Context']
    },
    {
      id: 6,
      badge: 'Step 07',
      title: 'Actionable Decision',
      icon: CheckCircle2,
      color: 'var(--accent-secondary)',
      summary: 'Clear, confident farm actions: irrigate precisely, apply NPK, protect yield.',
      detail: 'The farmer receives a definitive action plan: e.g., "Run Drip Zone A for 45 minutes tonight; delay DAP application until Friday after expected rainfall passes."',
      metrics: ['30-40% Water Saved', 'Optimized Fertilizer', 'Protected Crop Yield']
    }
  ];

  const current = flowSteps[activeStep] || flowSteps[0];
  const CurrentIcon = current.icon;

  return (
    <section id="ecosystem" className="site-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Activity size={14} />
            <span>{language === 'hi' ? 'कनेक्टेड कृषि आर्किटेक्चर' : 'Connected Agricultural Architecture'}</span>
          </div>
          <h2 className="section-title">
            {language === 'hi' ? 'खेत से बुद्धिमत्ता तक: धारा AI कैसे काम करता है' : 'From Field to Intelligence: How Dhara AI Works'}
          </h2>
          <p className="section-subtitle">
            {language === 'hi'
              ? 'एक सहज इकोसिस्टम जो जमीन की मिट्टी से लेकर आपके फोन या कंप्यूटर पर बुद्धिमान निर्णय सहायता तक सब कुछ जोड़ता है।'
              : 'A seamless ecosystem connecting physical soil in the ground all the way to intelligent decision support on your phone or laptop.'}
          </p>
        </div>

        {/* Interactive Step Navigator Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '2.5rem',
          scrollbarWidth: 'thin'
        }}>
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-card)',
                  backgroundColor: isActive ? 'var(--bg-secondary)' : 'var(--bg-card)',
                  border: isActive ? '2px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                  boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                  cursor: 'pointer',
                  minWidth: '130px',
                  flex: 1,
                  transition: 'var(--transition)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)'
                }}>
                  <Icon size={18} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {step.badge}
                  </div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    {step.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Spotlight */}
        <div 
          className="glass-card" 
          style={{
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)'
          }}
        >
          {/* Left: Summary & Detail */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'var(--accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CurrentIcon size={24} color="var(--accent-primary)" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  {current.badge} • {language === 'hi' ? 'धारा इकोसिस्टम में' : 'In The Dhara Ecosystem'}
                </span>
                <h3 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {current.title}
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
              {current.summary}
            </p>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.75rem' }}>
              {current.detail}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => setActiveStep(prev => (prev > 0 ? prev - 1 : flowSteps.length - 1))}
                className="btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                {language === 'hi' ? 'पिछला चरण' : 'Previous Stage'}
              </button>
              <button 
                onClick={() => setActiveStep(prev => (prev < flowSteps.length - 1 ? prev + 1 : 0))}
                className="btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
              >
                <span>{language === 'hi' ? 'अगला चरण' : 'Next Stage'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right: Key Telemetry Parameters Card */}
          <div style={{
            padding: '2rem',
            borderRadius: 'var(--radius-card)',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                {language === 'hi' ? 'प्रमुख परिचालन संकेत' : 'Key Operational Signals'}
              </span>
              <span className="badge badge-online">
                {language === 'hi' ? 'सक्रिय टेलीमेट्री' : 'Active Telemetry'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {current.metrics.map((m, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  <CheckCircle2 size={16} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {m}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(212, 163, 89, 0.08)',
              border: '1px dashed var(--accent-primary)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}>
              {language === 'hi'
                ? '🌿 जमीन के स्तर से क्लाउड बुद्धिमत्ता तक सहज द्विदिशी डेटा प्रवाह।'
                : '🌿 Seamless bidirectional data flow from ground level to cloud intelligence.'}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default EcosystemFlowSection;
