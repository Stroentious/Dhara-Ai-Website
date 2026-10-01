import React from 'react';
import { 
  Leaf, 
  Droplets, 
  Sprout, 
  Sun, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2,
  TreeDeciduous
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SustainabilitySection = () => {
  const { language } = useLanguage();
  const isHi = language !== 'en';

  const pillarsEn = [
    {
      title: 'Water Resource Stewardship',
      icon: Droplets,
      metric: '30% – 40%',
      metricLabel: 'Reduction in Irrigation Water Use',
      color: 'var(--accent-blue)',
      description: 'By irrigating only when root zone sensors detect moisture depletion, growers eliminate over-watering, reduce electricity consumption on diesel/electric tube-wells, and protect precious groundwater tables.'
    },
    {
      title: 'Balanced Nutrient Application',
      icon: Sprout,
      metric: '20% – 25%',
      metricLabel: 'Fertilizer Input Cost Savings',
      color: 'var(--accent-primary)',
      description: 'Real-time Nitrogen, Phosphorus, and Potassium monitoring prevents unnecessary top-dressing of urea and DAP—eliminating nitrate runoff into rural drinking water and halting soil acidification.'
    },
    {
      title: 'Early Crop Stress Detection',
      icon: ShieldCheck,
      metric: '3 to 5 Days',
      metricLabel: 'Earlier Warning Before Crop Wilting',
      color: 'var(--accent-amber)',
      description: 'Subterranean telemetry identifies moisture and thermal stress before visible leaf yellowing or stunted growth occurs—allowing proactive micro-irrigation and protecting yield potential.'
    },
    {
      title: 'Generational Soil Health',
      icon: TreeDeciduous,
      metric: '100% Data-Driven',
      metricLabel: 'Continuous Soil Quality Tracking',
      color: 'var(--accent-secondary)',
      description: 'Maintaining neutral soil pH and monitoring electrical conductivity ensures organic soil biology thrives, preserving farmland productivity for future farming generations.'
    }
  ];

  const pillarsHi = [
    {
      title: 'जल संसाधन प्रबंधन',
      icon: Droplets,
      metric: '३०% – ४०%',
      metricLabel: 'सिंचाई जल उपयोग में कमी',
      color: 'var(--accent-blue)',
      description: 'केवल तभी सिंचाई करके जब जड़ क्षेत्र के सेंसर नमी की कमी का पता लगाते हैं, किसान अत्यधिक पानी देने से बचते हैं, ट्यूबवेल पर बिजली/डीजल की खपत कम करते हैं, और भूजल स्तर की रक्षा करते हैं।'
    },
    {
      title: 'संतुलित पोषक अनुप्रयोग',
      icon: Sprout,
      metric: '२०% – २५%',
      metricLabel: 'उर्वरक इनपुट लागत में बचत',
      color: 'var(--accent-primary)',
      description: 'वास्तविक समय नाइट्रोजन, फास्फोरस और पोटेशियम निगरानी यूरिया और डीएपी की अनावश्यक टॉप-ड्रेसिंग को रोकती है—पीने के पानी में नाइट्रेट के बहाव को रोकती है और मिट्टी के अम्लीकरण को थामती है।'
    },
    {
      title: 'प्रारंभिक फसल तनाव पहचान',
      icon: ShieldCheck,
      metric: '३ से ५ दिन',
      metricLabel: 'फसल मुरझाने से पहले पूर्व चेतावनी',
      color: 'var(--accent-amber)',
      description: 'भूमिगत टेलीमेट्री पत्तियों के पीले पड़ने या विकास रुकने से पहले ही नमी और तापीय तनाव की पहचान कर लेती है—जिससे समय पर सूक्ष्म सिंचाई संभव होती है और उपज क्षमता की रक्षा होती है।'
    },
    {
      title: 'पीढ़ीगत मृदा स्वास्थ्य',
      icon: TreeDeciduous,
      metric: '१००% डेटा-संचालित',
      metricLabel: 'निरंतर मृदा गुणवत्ता ट्रैकिंग',
      color: 'var(--accent-secondary)',
      description: 'मिट्टी के तटस्थ pH को बनाए रखना और विद्युत चालकता की निगरानी करना सुनिश्चित करता है कि जैविक सूक्ष्मजीव पनपें, जिससे भविष्य की पीढ़ियों के लिए कृषि भूमि की उत्पादकता सुरक्षित रहती है।'
    }
  ];

  const pillars = isHi ? pillarsHi : pillarsEn;

  return (
    <section id="sustainability" className="site-section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Leaf size={14} />
            <span>{isHi ? 'पारिस्थितिक एवं आर्थिक प्रभाव' : 'Ecological & Economic Impact'}</span>
          </div>
          <h2 className="section-title">
            {isHi ? 'धरातलीय स्थिरता: पानी, ईंधन और मिट्टी का संरक्षण।' : 'Grounded Sustainability: Saving Water, Fuel, and Soil.'}
          </h2>
          <p className="section-subtitle">
            {isHi 
              ? 'सटीक कृषि केवल पैदावार बढ़ाने के बारे में नहीं है—यह न्यूनतम संभावित संसाधनों के उपयोग के साथ अधिकतम उत्पादन प्राप्त करने के बारे में है।'
              : 'Precision agriculture is not just about maximizing yield—it is about achieving maximum output with the least possible resource consumption.'}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="glass-card"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <div>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <Icon size={24} style={{ color: item.color }} />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {item.description}
                  </p>
                </div>

                <div style={{
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border-glass)'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>
                    {item.metric}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {item.metricLabel}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SustainabilitySection;
