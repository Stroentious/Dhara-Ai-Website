import React from 'react';
import { 
  Cpu, 
  Radio, 
  Sun, 
  Layers, 
  Droplets, 
  ShieldCheck, 
  Sliders, 
  Zap, 
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const HardwareSection = () => {
  const { language } = useLanguage();
  const isHi = language !== 'en';

  const hardwareItemsEn = [
    {
      title: '7-in-1 NPK Soil Sensor',
      category: 'Root-Zone Probe',
      icon: Layers,
      color: 'var(--accent-primary)',
      description: 'Industrial-grade stainless steel SS316 probe with vacuum-potted epoxy sealing for multi-year subterranean durability.',
      specs: ['RS485 Modbus RTU Protocol', 'IP68 Submersible Sealing', 'Measures N, P, K, pH, EC, VWC%, Temp'],
      integrationBadge: 'Modbus Standard'
    },
    {
      title: 'Solar Telemetry Pole',
      category: 'Field Transceiver Node',
      icon: Sun,
      color: 'var(--accent-amber)',
      description: 'Ruggedized outdoor field station with built-in solar panel, lithium iron phosphate (LiFePO4) battery, and LoRa mesh node.',
      specs: ['5W High-Efficiency Monocrystalline Panel', 'LoRaWAN 868 / 915 MHz Long Range', '5+ Days Energy Autonomy during Monsoons'],
      integrationBadge: 'Solar Autonomous'
    },
    {
      title: 'Industrial LoRa Gateway',
      category: 'Farm Edge Station',
      icon: Radio,
      color: 'var(--accent-blue)',
      description: 'Central farm gateway receiving packet uplinks from dozens of field nodes up to 5-10 km away across open agricultural terrain.',
      specs: ['8-Channel SX1302 Concentrator', 'Ethernet / 4G LTE Fallback Backhaul', 'Local Edge Buffering for Zero Data Loss'],
      integrationBadge: 'Long Range Mesh'
    },
    {
      title: 'Substation & Pump Relay',
      category: 'Actuation Controller',
      icon: Zap,
      color: 'var(--accent-secondary)',
      description: 'Microcontroller relay module interfacing with submersible pump starters, pressure gauges, and electricity phase monitors.',
      specs: ['Dry Contact 3-Phase Relay Interfaces', 'Overload & Phase Loss Protection', 'Manual Override Switch on Panel'],
      integrationBadge: 'Pump Interlock'
    },
    {
      title: 'Automated Solenoid Valves',
      category: 'Zone Actuators',
      icon: Droplets,
      color: 'var(--accent-blue)',
      description: 'Latching solenoid valves controlling pressurized water flow across individual field drip manifolds and micro-sprinklers.',
      specs: ['12V DC Pulse Actuated (Ultra-Low Power)', 'Corrosion-Resistant Reinforced Nylon Body', 'Pressure rating up to 10 Bar'],
      integrationBadge: 'Drip Integration'
    },
    {
      title: 'Venturi Fertigation Unit',
      category: 'Nutrient Dosing',
      icon: Sliders,
      color: 'var(--accent-primary)',
      description: 'Differential pressure injection unit for proportional liquid fertilizer and micronutrient blending into the irrigation stream.',
      specs: ['Adjustable Flow Suction 10–250 L/h', 'Acid & Chemical Resistant Seals', 'Flow Meter Feedback Loop'],
      integrationBadge: 'Precision Dosing'
    }
  ];

  const hardwareItemsHi = [
    {
      title: '7-इन-1 NPK मृदा सेंसर',
      category: 'जड़-क्षेत्र प्रोब',
      icon: Layers,
      color: 'var(--accent-primary)',
      description: 'कई वर्षों के भूमिगत टिकाऊपन के लिए वैक्यूम-पॉटेड एपॉक्सी सीलिंग के साथ औद्योगिक-ग्रेड स्टेनलेस स्टील SS316 प्रोब।',
      specs: ['RS485 मॉडबस RTU प्रोटोकॉल', 'IP68 जलरोधी सबमर्सिबल सीलिंग', 'मापता है: N, P, K, pH, EC, VWC% नमी, तापमान'],
      integrationBadge: 'मॉडबस मानक'
    },
    {
      title: 'सोलर टेलीमेट्री पोल',
      category: 'फील्ड ट्रांसीवर नोड',
      icon: Sun,
      color: 'var(--accent-amber)',
      description: 'इनबिल्ट सोलर पैनल, लिथियम आयरन फॉस्फेट (LiFePO4) बैटरी और LoRa मेश नोड के साथ मजबूत आउटडोर फील्ड स्टेशन।',
      specs: ['5W उच्च-दक्षता मोनोक्रिस्टलाइन पैनल', 'LoRaWAN 868 / 915 MHz लंबी दूरी', 'मानसून के दौरान 5+ दिनों की ऊर्जा स्वायत्तता'],
      integrationBadge: 'सौर स्वायत्त'
    },
    {
      title: 'औद्योगिक LoRa गेटवे',
      category: 'फार्म एज स्टेशन',
      icon: Radio,
      color: 'var(--accent-blue)',
      description: 'खुले कृषि क्षेत्र में 5-10 किमी दूर तक दर्जनों फील्ड नोड्स से पैकेट अपलिंक प्राप्त करने वाला केंद्रीय फार्म गेटवे।',
      specs: ['8-चैनल SX1302 कंसंट्रेटर', 'ईथरनेट / 4G LTE बैकहॉल', 'शून्य डेटा हानि के लिए स्थानीय एज बफरिंग'],
      integrationBadge: 'लंबी दूरी मेश'
    },
    {
      title: 'सबस्टेशन एवं पंप रिले',
      category: 'एक्चुएशन नियंत्रक',
      icon: Zap,
      color: 'var(--accent-secondary)',
      description: 'सबमर्सिबल पंप स्टार्टर्स, प्रेशर गेज और बिजली फेज मॉनिटर के साथ इंटरफेस करने वाला माइक्रोकंट्रोलर रिले मॉड्यूल।',
      specs: ['ड्राई कॉन्टैक्ट 3-फेज रिले इंटरफेस', 'ओवरलोड और फेज लॉस सुरक्षा', 'पैनल पर मैनुअल ओवरराइड स्विच'],
      integrationBadge: 'पंप इंटरलॉक'
    },
    {
      title: 'स्वचालित सोलेनोइड वाल्व',
      category: 'जोन एक्चुएटर्स',
      icon: Droplets,
      color: 'var(--accent-blue)',
      description: 'व्यक्तिगत खेत ड्रिप मैनिफोल्ड्स और माइक्रो-स्प्रिंकलर्स में दबावयुक्त पानी के प्रवाह को नियंत्रित करने वाले लैचिंग सोलेनोइड वाल्व।',
      specs: ['12V DC पल्स संचालित (अल्ट्रा-लो पावर)', 'संक्षारण प्रतिरोधी प्रबलित नायलॉन बॉडी', '10 बार तक दबाव रेटिंग'],
      integrationBadge: 'ड्रिप एकीकरण'
    },
    {
      title: 'वेंचुरी फर्टिगेशन यूनिट',
      category: 'पोषक खुराक',
      icon: Sliders,
      color: 'var(--accent-primary)',
      description: 'सिंचाई धारा में आनुपातिक तरल उर्वरक और सूक्ष्म पोषक तत्वों के सम्मिश्रण के लिए विभेदक दबाव इंजेक्शन इकाई।',
      specs: ['समायोज्य प्रवाह सक्शन 10-250 L/घंटा', 'अम्ल एवं रसायन प्रतिरोधी सील', 'फ्लो मीटर फीडबैक लूप'],
      integrationBadge: 'सटीक खुराक'
    }
  ];

  const hardwareItems = isHi ? hardwareItemsHi : hardwareItemsEn;

  return (
    <section id="hardware" className="site-section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <HardDrive size={14} />
            <span>{isHi ? 'हार्डवेयर पारिस्थितिकी तंत्र' : 'Hardware Ecosystem'}</span>
          </div>
          <h2 className="section-title">
            {isHi ? 'कठिन कृषि परिस्थितियों के लिए विशेष रूप से निर्मित।' : 'Engineered for Harsh Agricultural Realities.'}
          </h2>
          <p className="section-subtitle">
            {isHi 
              ? 'धारा एआई को मजबूत व टिकाऊ ऑन-फील्ड हार्डवेयर के साथ निर्बाध रूप से जोड़ने के लिए डिज़ाइन किया गया है—जो कम बिजली वाले वायरलेस मेश को औद्योगिक सेंसिंग के साथ जोड़ता है।'
              : 'Dhara AI is architected to interface seamlessly with ruggedized, off-the-shelf field hardware—combining low-power wireless mesh with industrial sensing.'}
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <span className="badge badge-demo">
              {isHi ? '⚡ मॉडबस RS485 एवं LoRaWAN खुले औद्योगिक मानकों के अनुरूप' : '⚡ Designed for Modbus RS485 & LoRaWAN Open Industrial Standards'}
            </span>
          </div>
        </div>

        {/* 2 Featured Photographic Visuals */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3.5rem'
        }}>
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-glass)'
          }}>
            <img
              src="/images/field_iot_pole.jpg"
              alt="Solar-powered agricultural IoT telemetry station installed in a crop field"
              style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1rem',
              background: 'linear-gradient(to top, rgba(10, 15, 13, 0.85), transparent)',
              color: '#ffffff'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#86efac', textTransform: 'uppercase' }}>
                {isHi ? 'फील्ड स्टेशन' : 'Field Station'}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                {isHi ? 'सौर-ऊर्जा संचालित LoRa मेश नोड' : 'Solar-Powered LoRa Mesh Node'}
              </div>
            </div>
          </div>

          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-glass)'
          }}>
            <img
              src="/images/drip_irrigation.jpg"
              alt="Precision agricultural drip irrigation line delivering water directly to root zones"
              style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1rem',
              background: 'linear-gradient(to top, rgba(10, 15, 13, 0.85), transparent)',
              color: '#ffffff'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#86efac', textTransform: 'uppercase' }}>
                {isHi ? 'स्वचालन' : 'Actuation'}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                {isHi ? 'स्वचालित सटीक ड्रिप नियंत्रण' : 'Automated Precision Drip Control'}
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Specification Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem'
        }}>
          {hardwareItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--accent-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={20} style={{ color: item.color }} />
                    </div>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {item.integrationBadge}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                    {item.category}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0 0.5rem 0', color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {item.description}
                  </p>
                </div>

                {/* Specs List */}
                <div style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-glass)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  {item.specs.map((spec, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={13} color="var(--accent-primary)" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HardwareSection;
