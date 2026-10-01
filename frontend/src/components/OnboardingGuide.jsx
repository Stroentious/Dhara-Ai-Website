import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useField } from '../context/FieldContext';
import { fieldsAPI } from '../services/api';
import {
  ChevronRight, ChevronLeft, X, Check, Sprout, MapPin,
  Crop, Layers, CheckCircle2, AlertCircle
} from 'lucide-react';

/**
 * Universal & Page-Specific Tour Step Definitions
 * Covers navigation, field info, sensor data, moisture chart, fertilizer/NPK,
 * weather, AI assistant, voice search, and interactive field data registration.
 */
const ROUTE_STEPS = {
  '/dashboard': [
    { id: 'platform-nav', icon: '🧭', keyPrefix: 'step1', selectors: ['[data-tour="sidebar-nav"]', '.sidebar'] },
    { id: 'field-info', icon: '🌱', keyPrefix: 'step2', selectors: ['[data-tour="field-header"]', '[data-tour="field-selector"]'] },
    { id: 'kpi-sensors', icon: '📊', keyPrefix: 'step3', selectors: ['[data-tour="kpi-grid"]', '[data-tour="soil-moisture"]'] },
    { id: 'moisture-chart', icon: '💧', keyPrefix: 'step4', selectors: ['[data-tour="moisture-chart"]'] },
    { id: 'npk-chart', icon: '🧪', keyPrefix: 'step5', selectors: ['[data-tour="fertilizer"]', '[data-tour="npk-sensor"]'] },
    { id: 'weather', icon: '🌦️', keyPrefix: 'step6', selectors: ['[data-tour="weather"]'] },
    { id: 'ask-dhara', icon: '🤖', keyPrefix: 'step7', selectors: ['[data-tour="ask-dhara"]', '.dhara-3d-assistant-container'] },
    { id: 'voice-search', icon: '🎙️', keyPrefix: 'step8', selectors: ['[data-tour="voice-search"]', '.assistant-label-pill', '[data-tour="ask-dhara"]'] },
    { id: 'field-setup', icon: '🌾', keyPrefix: 'step9', selectors: ['[data-tour="field-header"]', '[data-tour="field-selector"]'], isFieldForm: true },
  ],
  '/weather': [
    { id: 'weather', icon: '🌦️', keyPrefix: 'step6', selectors: ['[data-tour="weather"]', '.glass-card', '.page-title'] },
    { id: 'ask-dhara', icon: '🤖', keyPrefix: 'step7', selectors: ['[data-tour="ask-dhara"]', '.dhara-3d-assistant-container'] },
  ],
  '/fertilizer': [
    { id: 'fertilizer', icon: '🧪', keyPrefix: 'step5', selectors: ['[data-tour="fertilizer"]', '.glass-card', '.page-title'] },
    { id: 'ask-dhara', icon: '🤖', keyPrefix: 'step7', selectors: ['[data-tour="ask-dhara"]', '.dhara-3d-assistant-container'] },
  ],
  '/irrigation': [
    { id: 'water', icon: '💧', keyPrefix: 'step4', selectors: ['[data-tour="water"]', '.glass-card', '.page-title'] },
    { id: 'ask-dhara', icon: '🤖', keyPrefix: 'step7', selectors: ['[data-tour="ask-dhara"]', '.dhara-3d-assistant-container'] },
  ],
  '/sensors': [
    { id: 'lora', icon: '📡', keyPrefix: 'step3', selectors: ['[data-tour="lora"]', '[data-tour="kpi-grid"]', '.glass-card'] },
    { id: 'npk-sensor', icon: '🧪', keyPrefix: 'step5', selectors: ['[data-tour="npk-sensor"]', '.glass-card', '.page-title'] },
    { id: 'ask-dhara', icon: '🤖', keyPrefix: 'step7', selectors: ['[data-tour="ask-dhara"]', '.dhara-3d-assistant-container'] },
  ],
  '/fields': [
    { id: 'fields', icon: '🌱', keyPrefix: 'step2', selectors: ['.glass-card', '.page-title'] },
    { id: 'field-setup', icon: '🌾', keyPrefix: 'step9', selectors: ['.glass-card', '.page-title'], isFieldForm: true },
  ],
  '/analytics': [
    { id: 'analytics', icon: '📈', keyPrefix: 'step4', selectors: ['.glass-card', '.chart-container', '.page-title'] },
    { id: 'ask-dhara', icon: '🤖', keyPrefix: 'step7', selectors: ['[data-tour="ask-dhara"]', '.dhara-3d-assistant-container'] },
  ],
  '/chat': [
    { id: 'ask-dhara', icon: '🤖', keyPrefix: 'step7', selectors: ['[data-tour="ask-dhara"]', '.dhara-3d-assistant-container', '.glass-card', 'textarea', 'input'] },
  ],
  '/alerts': [
    { id: 'alerts', icon: '🔔', keyPrefix: 'step1', selectors: ['[data-tour="alerts-bell"]', '.glass-card', '.page-title'] },
    { id: 'ask-dhara', icon: '🤖', keyPrefix: 'step7', selectors: ['[data-tour="ask-dhara"]', '.dhara-3d-assistant-container'] },
  ],
  '/settings': [
    { id: 'settings', icon: '⚙️', keyPrefix: 'step1', selectors: ['.glass-card', '.page-title'] },
    { id: 'ask-dhara', icon: '🤖', keyPrefix: 'step7', selectors: ['[data-tour="ask-dhara"]', '.dhara-3d-assistant-container'] },
  ],
};

const FALLBACK_TITLES = {
  step1: 'Navigation & Platform Overview',
  step2: 'Active Field & Plot Selector',
  step3: '7-in-1 Root Zone Telemetry',
  step4: '24-Hour Soil Moisture & Temperature',
  step5: '7-Day NPK Nutrient Trends',
  step6: 'Hyperlocal Weather Station',
  step7: 'DHARA Neural AI Assistant',
  step8: 'Multilingual Voice Search',
  step9: 'Register Your First Field Plot',
};

const FALLBACK_DESCS = {
  step1: 'Access your farm management console: view active fields, sensors, irrigation, fertilizer recommendations, weather, analytics, and AI chat.',
  step2: 'Monitor your currently selected field plot, area (hectares), location, and quick switcher to switch between multiple registered farm plots.',
  step3: 'Real-time dielectric sensor telemetry: soil moisture, soil temperature, pH balance, nitrogen (N), phosphorus (P), potassium (K), and electrical conductivity (EC).',
  step4: 'Temporal dynamic charts tracking moisture depletion and thermal root stress to calibrate timely automated irrigation.',
  step5: 'Multi-day soil chemistry trends helping you plan targeted fertilizer dosage and prevent soil degradation.',
  step6: 'Real-time on-field temperature, atmospheric humidity, wind speed, rain probability, and a 6-day meteorological projection.',
  step7: 'Your personal agronomic advisor. Click the 3D floating orb at any time for instant field recommendations, disease diagnosis, and mandi market prices.',
  step8: 'Speak directly to DHARA AI in English or Hindi! Tap the microphone button to ask natural-language questions about your field.',
  step9: 'Enter your farm details so DHARA AI can calibrate irrigation schedules and soil nutrition specifically for your crop.',
};

const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Silt', 'Red', 'Black', 'Laterite', 'Alluvial', 'Peaty', 'Saline'];
const CROP_SUGGESTIONS = ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Maize', 'Soybean', 'Tomato', 'Potato', 'Onion', 'Groundnut', 'Mustard', 'Chickpea', 'Millet', 'Jowar', 'Bajra'];

const CROP_MAP_HI = {
  'Wheat': 'गेहूं',
  'Rice': 'धान',
  'Sugarcane': 'गन्ना',
  'Cotton': 'कपास',
  'Maize': 'मक्का',
  'Corn': 'मक्का',
  'Soybean': 'सोयाबीन',
  'Tomato': 'टमाटर',
  'Potato': 'आलू',
  'Onion': 'प्याज',
  'Groundnut': 'मूंगफली',
  'Mustard': 'सरसों',
  'Chickpea': 'चना',
  'Millet': 'बाजरा',
  'Jowar': 'ज्वार',
  'Bajra': 'बाजरा',
};

const SOIL_MAP_HI = {
  'Loamy': 'दोमट मिट्टी',
  'Clay': 'चिकनी मिट्टी',
  'Sandy': 'बलुई मिट्टी',
  'Silt': 'गाद मिट्टी',
  'Red': 'लाल मिट्टी',
  'Black': 'काली मिट्टी',
  'Laterite': 'लैटेराइट मिट्टी',
  'Alluvial': 'जलोढ़ मिट्टी',
  'Peaty': 'पीट मिट्टी',
  'Saline': 'लवणीय मिट्टी',
};
const LOCATION_SUGGESTIONS = [
  'Punjab, India',
  'Ludhiana, Punjab, India',
  'Amritsar, Punjab, India',
  'Jalandhar, Punjab, India',
  'Karnal, Haryana, India',
  'Hisar, Haryana, India',
  'Nashik, Maharashtra, India',
  'Pune, Maharashtra, India',
  'Rajkot, Gujarat, India',
  'Mandya, Karnataka, India',
  'Guntur, Andhra Pradesh, India',
  'Indore, Madhya Pradesh, India',
  'Meerut, Uttar Pradesh, India',
  'Agra, Uttar Pradesh, India',
  'Lucknow, Uttar Pradesh, India',
];

/**
 * OnboardingGuide — Complete Interactive Onboarding & New User Flow
 */
const OnboardingGuide = ({ forceShow = false, onCloseForce }) => {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();
  const { fetchFields, setSelectedField } = useField();
  const location = useLocation();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState(null);
  const [placement, setPlacement] = useState('bottom');

  // Field Data Form state for Step 9
  const [fieldForm, setFieldForm] = useState({
    name: '',
    location: 'Ludhiana, Punjab, India',
    crop_type: 'Wheat',
    soil_type: 'Loamy',
    area_hectares: '2.5',
  });
  const [savingField, setSavingField] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [fieldSuccess, setFieldSuccess] = useState(false);
  const [locSuggestionsOpen, setLocSuggestionsOpen] = useState(false);

  const resizeObserverRef = useRef(null);
  const activeElementRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const rafRef = useRef(null);

  // Derive active steps for the current page route
  const currentPath = location.pathname.toLowerCase();
  const activeSteps = useMemo(() => {
    return ROUTE_STEPS[currentPath] || ROUTE_STEPS['/dashboard'] || [];
  }, [currentPath]);

  // User-specific completion key
  const userKey = currentUser?.email
    ? `dhara_onboarding_completed_${currentUser.email.trim().toLowerCase()}`
    : 'dhara_onboarding_completed';

  // Handle route change: reset target
  useEffect(() => {
    setTargetRect(null);
  }, [location.pathname]);

  // Initialize visibility: triggers automatically for new login/signup, never for completed returning users
  useEffect(() => {
    if (forceShow) {
      setCurrentStepIndex(0);
      setIsVisible(true);
      setTargetRect(null);
    } else {
      const isNewUser = localStorage.getItem('dhara_is_new_user') === 'true';
      const hasCompleted = localStorage.getItem(userKey) || localStorage.getItem('dhara_onboarding_completed');

      if (isNewUser || !hasCompleted) {
        setCurrentStepIndex(0);
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setTargetRect(null);
      }
    }
  }, [forceShow, userKey]);

  // Find the actual visible DOM element from candidate selectors
  const findTargetElement = useCallback((step) => {
    if (!step || !step.selectors) return null;
    for (const selector of step.selectors) {
      try {
        const candidates = document.querySelectorAll(selector);
        for (const el of candidates) {
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          if (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            rect.width > 10 &&
            rect.height > 10
          ) {
            return el;
          }
        }
      } catch {
        continue;
      }
    }
    return null;
  }, []);

  // Compute position from getBoundingClientRect()
  const measureElement = useCallback((el) => {
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    const measured = {
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      bottom: Math.round(rect.bottom),
      right: Math.round(rect.right),
    };

    // Calculate vertical placement (top vs bottom) based on screen space
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedCardHeight = 240;

    if (spaceBelow >= estimatedCardHeight + 20) {
      setPlacement('bottom');
    } else if (spaceAbove >= estimatedCardHeight + 20) {
      setPlacement('top');
    } else {
      setPlacement(spaceBelow >= spaceAbove ? 'bottom' : 'top');
    }

    return measured;
  }, []);

  // Safe element location & scroll routine
  const positionTarget = useCallback((retryCount = 0) => {
    if (!isVisible) return;
    const step = activeSteps[currentStepIndex];
    if (!step || step.isFieldForm) {
      // Step 9 is a centered interactive modal card
      setTargetRect(null);
      return;
    }

    const el = findTargetElement(step);
    if (el) {
      activeElementRef.current = el;

      // Scroll element smoothly into center view if outside visible viewport
      const rect = el.getBoundingClientRect();
      const inView = (
        rect.top >= 60 &&
        rect.bottom <= window.innerHeight - 60 &&
        rect.left >= 0 &&
        rect.right <= window.innerWidth
      );

      if (!inView) {
        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        } catch {}
      }

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      try {
        const ro = new ResizeObserver(() => {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            const m = measureElement(el);
            if (m) setTargetRect(m);
          });
        });
        ro.observe(el);
        resizeObserverRef.current = ro;
      } catch {}

      const measured = measureElement(el);
      if (measured) {
        setTargetRect(measured);
      }
    } else if (retryCount < 5) {
      retryTimeoutRef.current = setTimeout(() => {
        positionTarget(retryCount + 1);
      }, 80);
    } else {
      setTargetRect(null);
    }
  }, [isVisible, activeSteps, currentStepIndex, findTargetElement, measureElement]);

  useEffect(() => {
    if (!isVisible) return;
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    positionTarget(0);

    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    };
  }, [isVisible, currentStepIndex, location.pathname, positionTarget]);

  // Window resize & scroll listeners
  useEffect(() => {
    if (!isVisible) return;

    const handleWindowChange = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (activeElementRef.current) {
          const m = measureElement(activeElementRef.current);
          if (m) setTargetRect(m);
        }
      });
    };

    window.addEventListener('resize', handleWindowChange, { passive: true });
    window.addEventListener('scroll', handleWindowChange, { passive: true, capture: true });
    window.addEventListener('orientationchange', handleWindowChange, { passive: true });

    return () => {
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
      window.removeEventListener('orientationchange', handleWindowChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, measureElement]);

  const handleNext = () => {
    if (currentStepIndex < activeSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = (clearNewUser = true) => {
    localStorage.setItem(userKey, 'true');
    localStorage.setItem('dhara_onboarding_completed', 'true');
    if (clearNewUser) {
      localStorage.removeItem('dhara_is_new_user');
    }
    setIsVisible(false);
    setTargetRect(null);
    setCurrentStepIndex(0);
    if (onCloseForce) onCloseForce();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isVisible) return;
    const currentStep = activeSteps[currentStepIndex];
    if (currentStep?.isFieldForm) return; // Do not intercept typing in form inputs

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleComplete();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, currentStepIndex, activeSteps]);

  // Handle Field Data Submission in Step 9
  const handleSaveFieldData = async (e) => {
    if (e) e.preventDefault();
    if (!fieldForm.name.trim()) {
      setFieldError(language === 'hi' ? 'खेत का नाम आवश्यक है' : 'Field name is required');
      return;
    }

    setSavingField(true);
    setFieldError('');

    const payload = {
      name: fieldForm.name.trim(),
      location: fieldForm.location.trim() || 'Punjab, India',
      crop_type: fieldForm.crop_type.trim() || 'Wheat',
      area_hectares: fieldForm.area_hectares ? parseFloat(fieldForm.area_hectares) : 2.5,
      soil_type: fieldForm.soil_type || 'Loamy'
    };

    try {
      const res = await fieldsAPI.create(payload).catch(() => null);
      if (res && res.data) {
        setSelectedField(res.data);
      } else {
        // Fallback local persistence
        const newField = { id: Date.now(), ...payload };
        setSelectedField(newField);
      }
      try {
        await fetchFields();
      } catch {}
      setFieldSuccess(true);
      setTimeout(() => {
        handleComplete();
      }, 900);
    } catch {
      // Offline fallback
      const fallbackField = { id: Date.now(), ...payload };
      setSelectedField(fallbackField);
      setFieldSuccess(true);
      setTimeout(() => {
        handleComplete();
      }, 900);
    } finally {
      setSavingField(false);
    }
  };

  if (!isVisible || activeSteps.length === 0) return null;

  const currentStep = activeSteps[currentStepIndex] || activeSteps[0];
  const isFieldStep = !!currentStep.isFieldForm;

  // Safe localization with guaranteed English fallback
  const rawTitle = t(`onboarding.${currentStep.keyPrefix}Title`);
  const title = (rawTitle && typeof rawTitle === 'string' && !rawTitle.startsWith('onboarding.'))
    ? rawTitle
    : (FALLBACK_TITLES[currentStep.keyPrefix] || 'DHARA AI Core');

  const rawDesc = t(`onboarding.${currentStep.keyPrefix}Desc`);
  const description = (rawDesc && typeof rawDesc === 'string' && !rawDesc.startsWith('onboarding.'))
    ? rawDesc
    : (FALLBACK_DESCS[currentStep.keyPrefix] || '');

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === activeSteps.length - 1;

  // Spotlight padding around highlighted element
  const pad = 8;
  const radius = 14;

  // Tooltip geometry calculations
  const cardWidth = isFieldStep
    ? Math.min(460, window.innerWidth - 32)
    : Math.min(390, window.innerWidth - 32);
  const cardHeight = isFieldStep ? 460 : 230;

  let cardTop = 100;
  let cardLeft = 16;
  let arrowLeft = 24;

  if (targetRect && !isFieldStep) {
    const targetCenterX = targetRect.left + targetRect.width / 2;
    cardLeft = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, targetCenterX - cardWidth / 2));
    arrowLeft = Math.max(20, Math.min(cardWidth - 28, targetCenterX - cardLeft));

    if (placement === 'bottom') {
      cardTop = Math.min(window.innerHeight - cardHeight - 16, targetRect.bottom + pad + 14);
    } else {
      cardTop = Math.max(16, targetRect.top - pad - cardHeight - 14);
    }
  } else {
    // Centered for step 9 or when target not ready
    cardLeft = Math.max(16, (window.innerWidth - cardWidth) / 2);
    cardTop = Math.max(16, (window.innerHeight - cardHeight) / 2);
  }

  const skipLabel = t('common.skip') && !t('common.skip').startsWith('common.') ? t('common.skip') : 'Skip';
  const backLabel = t('common.back') && !t('common.back').startsWith('common.') ? t('common.back') : 'Back';
  const nextLabel = t('common.next') && !t('common.next').startsWith('common.') ? t('common.next') : 'Next';
  const doneLabel = t('common.done') && !t('common.done').startsWith('common.') ? t('common.done') : 'Done';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        pointerEvents: 'auto',
      }}
    >
      {/* ── CINEMATIC SPOTLIGHT OVERLAY WITH SVG MASK ── */}
      <svg
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99991,
        }}
      >
        <defs>
          <mask id="dhara-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && !isFieldStep && (
              <rect
                x={targetRect.left - pad}
                y={targetRect.top - pad}
                width={targetRect.width + pad * 2}
                height={targetRect.height + pad * 2}
                rx={radius}
                fill="black"
                style={{
                  transition: 'x 0.35s cubic-bezier(0.16, 1, 0.3, 1), y 0.35s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            )}
          </mask>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.84)"
          mask="url(#dhara-spotlight-mask)"
        />
      </svg>

      {/* ── GLOWING FOCUS FRAME ── */}
      {targetRect && !isFieldStep && (
        <div
          style={{
            position: 'fixed',
            top: targetRect.top - pad,
            left: targetRect.left - pad,
            width: targetRect.width + pad * 2,
            height: targetRect.height + pad * 2,
            borderRadius: `${radius}px`,
            border: '2px solid var(--accent-primary)',
            boxShadow: '0 0 25px var(--accent-primary), 0 0 50px rgba(212, 163, 89, 0.4), inset 0 0 15px rgba(212, 163, 89, 0.2)',
            pointerEvents: 'none',
            zIndex: 99995,
            transition: 'top 0.35s cubic-bezier(0.16, 1, 0.3, 1), left 0.35s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      )}

      {/* ── INTERACTIVE GUIDE TOOLTIP CARD ── */}
      <div
        style={{
          position: 'fixed',
          top: cardTop,
          left: cardLeft,
          width: cardWidth,
          background: 'linear-gradient(145deg, rgba(14, 11, 7, 0.98), rgba(8, 6, 4, 0.99))',
          border: '1px solid rgba(212, 163, 89, 0.55)',
          borderRadius: '20px',
          padding: isFieldStep ? '1.4rem 1.5rem' : '1.25rem 1.4rem',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 40px rgba(212, 163, 89, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          zIndex: 99999,
          maxHeight: '92vh',
          overflowY: 'auto',
          transition: 'top 0.35s cubic-bezier(0.16, 1, 0.3, 1), left 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Directional Beacon Arrow Pointing Toward Target */}
        {targetRect && !isFieldStep && (
          <div
            style={{
              position: 'absolute',
              [placement === 'bottom' ? 'top' : 'bottom']: -7,
              left: arrowLeft,
              width: 14,
              height: 14,
              background: 'rgba(14, 11, 7, 0.98)',
              borderLeft: '1px solid rgba(212, 163, 89, 0.55)',
              borderTop: placement === 'bottom' ? '1px solid rgba(212, 163, 89, 0.55)' : 'none',
              borderBottom: placement === 'top' ? '1px solid rgba(212, 163, 89, 0.55)' : 'none',
              transform: 'rotate(45deg)',
              boxShadow: '0 0 10px rgba(212, 163, 89, 0.3)',
            }}
          />
        )}

        {/* Card Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{currentStep.icon}</span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
              background: 'rgba(212, 163, 89, 0.15)',
              border: '1px solid rgba(212, 163, 89, 0.35)',
              padding: '0.15rem 0.55rem',
              borderRadius: '999px',
            }}>
              {language === 'hi'
                ? `चरण ${currentStepIndex + 1} / ${activeSteps.length}`
                : `Step ${currentStepIndex + 1} of ${activeSteps.length}`}
            </span>
          </div>

          <button
            onClick={() => handleComplete()}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              padding: '0.2rem',
            }}
            title={language === 'hi' ? 'टूर समाप्त करें' : 'Close Tour'}
          >
            <span>{skipLabel}</span>
            <X size={15} />
          </button>
        </div>

        {/* Card Title & Desc */}
        <div>
          <h3 style={{
            margin: '0 0 0.35rem 0',
            fontSize: isFieldStep ? '1.15rem' : '1.05rem',
            fontWeight: 800,
            color: '#fff',
            fontFamily: 'var(--font-display)',
          }}>
            {title}
          </h3>
          <p style={{
            margin: 0,
            fontSize: '0.86rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
          }}>
            {description}
          </p>
        </div>

        {/* ── STEP 9: INLINE FIELD DATA REGISTRATION FORM ── */}
        {isFieldStep ? (
          <form onSubmit={handleSaveFieldData} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {fieldError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <AlertCircle size={14} />
                <span>{fieldError}</span>
              </div>
            )}

            {fieldSuccess && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                color: '#4ade80',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <CheckCircle2 size={14} />
                <span>{t('onboarding.fieldSavedSuccess')}</span>
              </div>
            )}

            {/* Field Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {t('fields.fieldName')} *
              </label>
              <input
                type="text"
                value={fieldForm.name}
                onChange={e => setFieldForm(p => ({ ...p, name: e.target.value }))}
                placeholder={language === 'hi' ? 'उदा. मुख्य गेहूं का खेत' : 'e.g., North Acre Wheat Plot'}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(212, 163, 89, 0.35)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Location with autocomplete dropdown */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {t('fields.location')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={fieldForm.location}
                  onChange={e => {
                    const val = e.target.value;
                    setFieldForm(p => ({ ...p, location: val }));
                    setLocSuggestionsOpen(true);
                  }}
                  onFocus={() => setLocSuggestionsOpen(true)}
                  placeholder="Ludhiana, Punjab, India"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem 0.5rem 2rem',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(212, 163, 89, 0.35)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
                <MapPin size={14} color="var(--accent-primary)" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              {locSuggestionsOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  background: 'rgba(18, 14, 10, 0.98)',
                  border: '1px solid rgba(212, 163, 89, 0.4)',
                  borderRadius: '8px',
                  marginTop: '4px',
                  maxHeight: '130px',
                  overflowY: 'auto',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                }}>
                  {LOCATION_SUGGESTIONS.filter(l => l.toLowerCase().includes(fieldForm.location.toLowerCase())).slice(0, 5).map((loc, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setFieldForm(p => ({ ...p, location: loc }));
                        setLocSuggestionsOpen(false);
                      }}
                      style={{
                        padding: '0.45rem 0.75rem',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Crop & Soil Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {t('fields.cropType')}
                </label>
                <select
                  value={fieldForm.crop_type}
                  onChange={e => setFieldForm(p => ({ ...p, crop_type: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(25, 20, 15, 0.95)',
                    border: '1px solid rgba(212, 163, 89, 0.35)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                >
                  {CROP_SUGGESTIONS.map(crop => (
                    <option key={crop} value={crop}>{language === 'hi' ? (CROP_MAP_HI[crop] || crop) : crop}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {t('fields.soilType')}
                </label>
                <select
                  value={fieldForm.soil_type}
                  onChange={e => setFieldForm(p => ({ ...p, soil_type: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(25, 20, 15, 0.95)',
                    border: '1px solid rgba(212, 163, 89, 0.35)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                >
                  {SOIL_TYPES.map(soil => (
                    <option key={soil} value={soil}>{language === 'hi' ? (SOIL_MAP_HI[soil] || soil) : soil}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Area (Hectares) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {t('fields.area')} (ha)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={fieldForm.area_hectares}
                onChange={e => setFieldForm(p => ({ ...p, area_hectares: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(212, 163, 89, 0.35)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.35rem' }}>
              <button
                type="submit"
                disabled={savingField}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                }}
              >
                {savingField ? (
                  <span>{t('common.saving')}</span>
                ) : (
                  <>
                    <Check size={16} />
                    <span>{t('onboarding.saveAndFinish')}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleComplete()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  padding: '0.3rem',
                  textDecoration: 'underline',
                  textAlign: 'center',
                }}
              >
                {t('onboarding.skipField')}
              </button>
            </div>

            {/* Informational reassurance */}
            <p style={{
              margin: '0.1rem 0 0 0',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              lineHeight: 1.35,
            }}>
              {language === 'hi'
                ? 'ℹ️ आप बाद में बाएं मेनू के "खेत" (Fields) टैब से कभी भी अपना खेत जोड़ या बदल सकते हैं।'
                : 'ℹ️ You can add or update your fields anytime later from the "Fields" tab in the navigation menu.'}
            </p>
          </form>
        ) : null}

        {/* Step Progress Dots */}
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', margin: '0.2rem 0' }}>
          {activeSteps.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: idx === currentStepIndex ? 18 : 6,
                height: 6,
                borderRadius: '99px',
                background: idx === currentStepIndex ? 'var(--accent-primary)' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Controls Footer (Steps 1 through 8) */}
        {!isFieldStep && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '0.45rem',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}>
            <button
              onClick={handleBack}
              disabled={isFirst}
              className="btn-secondary"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.78rem',
                opacity: isFirst ? 0.4 : 1,
                cursor: isFirst ? 'default' : 'pointer',
              }}
            >
              <ChevronLeft size={14} />
              <span>{backLabel}</span>
            </button>

            <button
              onClick={handleNext}
              className="btn-primary"
              style={{
                padding: '0.5rem 1.15rem',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <span>{isLast ? doneLabel : nextLabel}</span>
              {isLast ? <Check size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingGuide;
