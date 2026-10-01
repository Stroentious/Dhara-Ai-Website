import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';
import { INDIAN_LANGUAGES, getLanguageByCode } from '../data/languages';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('dhara_lang');
    if (saved && (saved in translations)) {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (code) => {
    if (translations[code]) {
      setLanguageState(code);
    } else {
      setLanguageState('en');
    }
  };

  useEffect(() => {
    localStorage.setItem('dhara_lang', language);
    document.documentElement.lang = language;
    const meta = getLanguageByCode(language);
    document.documentElement.dir = meta?.dir || 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  // Safe nested translation lookup with fallback to English
  const t = (key, params = {}) => {
    if (!key) return '';
    const keys = key.split('.');
    let current = translations[language] || translations.en;
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            return key;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string' && typeof current !== 'number') {
      return key;
    }

    let result = String(current);
    for (const [paramKey, paramVal] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    }
    return result;
  };

  // Terminology helper functions for dynamic data
  const tCrop = (cropName) => {
    if (!cropName) return '';
    const tr = translations[language]?.crops?.[cropName] || translations.en?.crops?.[cropName];
    return tr || cropName;
  };

  const tSoil = (soilName) => {
    if (!soilName) return '';
    const tr = translations[language]?.soils?.[soilName] || translations.en?.soils?.[soilName];
    return tr || soilName;
  };

  const tWeather = (desc) => {
    if (!desc) return '';
    const tr = translations[language]?.weatherDesc?.[desc] || translations.en?.weatherDesc?.[desc];
    return tr || desc;
  };

  const tDay = (day) => {
    if (!day) return '';
    const tr = translations[language]?.days?.[day] || translations.en?.days?.[day];
    return tr || day;
  };

  const tStatus = (statusKey) => {
    if (!statusKey) return '';
    const lower = String(statusKey).toLowerCase();
    const tr = translations[language]?.status?.[lower] || translations.en?.status?.[lower];
    return tr || statusKey;
  };

  const tTimeAgo = (minutes) => {
    if (minutes === 0 || minutes === 'justNow') {
      return t('time.justNow');
    }
    if (typeof minutes === 'number') {
      if (minutes < 60) {
        return t('time.minsAgo', { n: minutes });
      }
      const hours = Math.floor(minutes / 60);
      if (hours < 24) {
        return t('time.hoursAgo', { n: hours });
      }
      const days = Math.floor(hours / 24);
      return t('time.daysAgo', { n: days });
    }
    return String(minutes);
  };

  const currentLanguage = getLanguageByCode(language);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      t,
      tCrop,
      tSoil,
      tWeather,
      tDay,
      tStatus,
      tTimeAgo,
      currentLanguage,
      languages: INDIAN_LANGUAGES,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
