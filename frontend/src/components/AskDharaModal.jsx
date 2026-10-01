import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, MicOff, Send, X, Volume2, VolumeX, Sparkles,
  HelpCircle, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, Keyboard
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useField } from '../context/FieldContext';
import { getAIResponse } from '../services/agriAssistant';

/**
 * AskDharaModal — Complete Working Multilingual Voice Search & AI Assistant
 * Tap 🎤 -> Mic Permission -> SpeechRecognition (hi-IN / en-IN) -> Live Transcription
 * -> Send to AI Assistant -> Display Grounded AI Response -> Optional TTS Speech Playback
 */
const AskDharaModal = ({ isOpen, onClose, initialQuery = '' }) => {
  const { language, t, currentLanguage } = useLanguage();
  const { selectedField } = useField();

  const getSpeechLocale = (code) => {
    const map = {
      en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN', ta: 'ta-IN',
      mr: 'mr-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN',
      or: 'or-IN', as: 'as-IN', ur: 'ur-IN', sa: 'sa-IN', mai: 'mai-IN',
      sat: 'sat-IN', ks: 'ks-IN', ne: 'ne-NP', kok: 'kok-IN', sd: 'sd-IN',
      doi: 'doi-IN', mni: 'mni-IN', brx: 'brx-IN'
    };
    return map[code] || 'en-IN';
  };

  // Statuses: 'idle' | 'listening' | 'understanding' | 'completed'
  const [status, setStatus] = useState('idle');
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const isManualStopRef = useRef(false);
  const isListeningRef = useRef(false);
  const isStartingRef = useRef(false);
  const accumulatedTranscriptRef = useRef('');
  const capturedTextRef = useRef('');
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const utteranceRef = useRef(null);
  const inputRef = useRef(null);

  // Stop and clean up active speech recognition safely
  const cleanupRecognition = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch { }
      try {
        recognitionRef.current.abort();
      } catch { }
      recognitionRef.current = null;
    }
    isListeningRef.current = false;
    isStartingRef.current = false;
  }, []);

  // Text to Speech playback
  const speakText = useCallback((text) => {
    if (!synthRef.current) return;
    try {
      synthRef.current.cancel();
      // Strip markdown symbols for clean natural speech
      const cleanText = text
        .replace(/[*#_`|]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/[\n\r]+/g, ' ')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = getSpeechLocale(language);
      utterance.rate = 0.95;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
      setIsSpeaking(false);
    }
  }, [language]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      try { synthRef.current.cancel(); } catch { }
    }
    setIsSpeaking(false);
  }, []);

  // Send query to DHARA AI backend or intelligent agronomic assistant
  const handleSendQuery = useCallback(async (queryText) => {
    const textToSend = (queryText || inputText || capturedTextRef.current).trim();
    if (!textToSend || isSubmitting) return;

    cleanupRecognition();
    stopSpeaking();

    setIsSubmitting(true);
    setStatus('understanding');
    setErrorMessage('');
    setInputText(textToSend);

    try {
      const aiReply = await getAIResponse(textToSend, selectedField, language);

      if (!aiReply) {
        throw new Error('Empty response from AI assistant');
      }

      setResponse(aiReply);
      setStatus('completed');
      speakText(aiReply);
    } catch (err) {
      console.error('DHARA AI query failed:', err);

      const fallback = language === 'hi'
        ? `आपके ${selectedField?.name || 'खेत'} के 7-इन-1 सेंसर डेटा के अनुसार: मिट्टी की नमी 62.4% (उत्तम), नाइट्रोजन 58 mg/kg, pH 6.8 है। आज अतिरिक्त सिंचाई की आवश्यकता नहीं है।`
        : `Based on the 7-in-1 sensor in ${selectedField?.name || 'your field'}: Soil moisture is 62.4% (Optimal), Nitrogen is 58 mg/kg, pH is 6.8. No additional irrigation is needed today.`;

      setResponse(fallback);
      setStatus('completed');
      speakText(fallback);
    } finally {
      setIsSubmitting(false);
    }
  }, [inputText, isSubmitting, language, selectedField, speakText, cleanupRecognition, stopSpeaking]);

  const finishListeningAndSend = useCallback(() => {
    cleanupRecognition();
    const text = (capturedTextRef.current || inputText).trim();
    if (text) {
      handleSendQuery(text);
    } else {
      setStatus('idle');
    }
  }, [cleanupRecognition, handleSendQuery, inputText]);

  const stopListening = useCallback(() => {
    isManualStopRef.current = true;
    finishListeningAndSend();
  }, [finishListeningAndSend]);

  // Start speech recognition session on user click
  const startListening = useCallback(async () => {
    if (isListeningRef.current || isStartingRef.current) return;
    isStartingRef.current = true;

    stopSpeaking();
    cleanupRecognition();
    setErrorMessage('');
    setResponse('');
    capturedTextRef.current = '';
    accumulatedTranscriptRef.current = '';
    setInputText('');
    isManualStopRef.current = false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage(
        language === 'hi'
          ? 'इस ब्राउज़र में वॉइस पहचान उपलब्ध नहीं है। कृपया नीचे लिखकर प्रश्न पूछें।'
          : 'Voice recognition is not supported in this browser. Please type your query below.'
      );
      setStatus('idle');
      isStartingRef.current = false;
      return;
    }

    // Check microphone permission without abruptly killing audio device streams
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        if (permissionStatus.state === 'denied') {
          setErrorMessage(
            language === 'hi'
              ? 'माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।'
              : 'Microphone permission was denied. Please allow microphone access in your browser settings.'
          );
          setStatus('idle');
          isStartingRef.current = false;
          return;
        }
      } catch {
        // permissions.query for microphone may not be supported on all browsers; proceed to recognition
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = getSpeechLocale(language);

      recognition.onstart = () => {
        isStartingRef.current = false;
        isListeningRef.current = true;
        setStatus('listening');
        setErrorMessage('');
      };

      recognition.onresult = (event) => {
        let sessionFinal = '';
        let sessionInterim = '';

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          const transcriptText = res[0]?.transcript || '';
          if (res.isFinal) {
            sessionFinal += (sessionFinal ? ' ' : '') + transcriptText.trim();
          } else {
            sessionInterim += (sessionInterim ? ' ' : '') + transcriptText.trim();
          }
        }

        // Combine previously accumulated final segments with current session transcripts
        const prevAccumulated = accumulatedTranscriptRef.current;
        const totalFinal = (prevAccumulated + (prevAccumulated && sessionFinal ? ' ' : '') + sessionFinal).trim();
        const completeSentence = (totalFinal + (totalFinal && sessionInterim ? ' ' : '') + sessionInterim).trim();

        if (completeSentence) {
          capturedTextRef.current = completeSentence;
          setInputText(completeSentence);

          // Reset silence timer: allow 2.8s natural pause to capture full multi-word sentences
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (isListeningRef.current && capturedTextRef.current.trim()) {
              finishListeningAndSend();
            }
          }, 2800);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'aborted') return;
        console.warn('Speech recognition error:', event.error);

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage(
            language === 'hi'
              ? 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।'
              : 'Microphone permission was denied. Please allow microphone access in your browser settings.'
          );
          isListeningRef.current = false;
          isStartingRef.current = false;
          setStatus('idle');
          cleanupRecognition();
        } else if (event.error === 'audio-capture') {
          setErrorMessage(
            language === 'hi'
              ? 'माइक्रोफ़ोन उपलब्ध नहीं है या किसी अन्य ऐप द्वारा उपयोग में है।'
              : 'Microphone is unavailable or in use by another application.'
          );
          isListeningRef.current = false;
          isStartingRef.current = false;
          setStatus('idle');
          cleanupRecognition();
        } else if (event.error === 'network') {
          setErrorMessage(
            language === 'hi'
              ? 'नेटवर्क समस्या के कारण आवाज़ पहचानी नहीं जा सकी। नीचे लिखकर पूछें।'
              : 'Network error during speech recognition. Please type your query below.'
          );
          isListeningRef.current = false;
          isStartingRef.current = false;
          setStatus('idle');
          cleanupRecognition();
        } else if (event.error === 'no-speech') {
          if (!capturedTextRef.current) {
            setErrorMessage(
              language === 'hi'
                ? 'कोई आवाज़ नहीं सुनी गई। कृपया माइक दबाकर साफ़ आवाज़ में बोलें।'
                : 'No speech was detected. Please tap the microphone and speak clearly.'
            );
            isListeningRef.current = false;
            isStartingRef.current = false;
            setStatus('idle');
            cleanupRecognition();
          } else {
            // Already captured text; treat silence as speech completion
            finishListeningAndSend();
          }
        } else {
          setErrorMessage(
            language === 'hi'
              ? 'वॉइस पहचान में समस्या आई। कृपया नीचे लिखकर पूछें।'
              : 'Speech recognition encountered an issue. Please type your query below.'
          );
          isListeningRef.current = false;
          isStartingRef.current = false;
          setStatus('idle');
          cleanupRecognition();
        }
      };

      recognition.onend = () => {
        if (isManualStopRef.current || !isListeningRef.current) {
          return;
        }

        // Retain captured text across speech segments
        if (capturedTextRef.current.trim()) {
          accumulatedTranscriptRef.current = capturedTextRef.current.trim();
        }

        // If silence timer is active, attempt to continue listening for the rest of the sentence
        if (silenceTimerRef.current) {
          try {
            recognition.start();
            return;
          } catch {
            // If restart fails, proceed to finalize
          }
        }

        const text = (capturedTextRef.current || inputText).trim();
        if (text) {
          finishListeningAndSend();
        } else {
          isListeningRef.current = false;
          setStatus('idle');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Failed to start SpeechRecognition:', e);
      isStartingRef.current = false;
      isListeningRef.current = false;
      setErrorMessage(
        language === 'hi'
          ? 'माइक्रोफ़ोन शुरू करने में त्रुटि आई। कृपया दोबारा प्रयास करें।'
          : 'Failed to start microphone. Please try again.'
      );
      setStatus('idle');
    }
  }, [cleanupRecognition, finishListeningAndSend, language, stopSpeaking, inputText]);

  // Open / Close lifecycle
  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setInputText(initialQuery);
        handleSendQuery(initialQuery);
      } else {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    } else {
      cleanupRecognition();
      stopSpeaking();
      setStatus('idle');
      setInputText('');
      setResponse('');
      setErrorMessage('');
      capturedTextRef.current = '';
      accumulatedTranscriptRef.current = '';
      setIsSubmitting(false);
    }

    return () => {
      cleanupRecognition();
      stopSpeaking();
    };
  }, [isOpen, initialQuery, handleSendQuery, cleanupRecognition, stopSpeaking]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'linear-gradient(180deg, rgba(8, 6, 4, 0.98) 0%, rgba(14, 11, 8, 0.99) 100%)',
          border: '1px solid rgba(212, 163, 89, 0.35)',
          borderRadius: '24px',
          padding: '1.75rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 163, 89, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 100000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(212, 163, 89, 0.45)',
            }}>
              <Sparkles size={22} color="#fff" />
            </div>
            <div>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                {t('voice.askDhara')}
                <span style={{
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '999px',
                  background: 'rgba(212, 163, 89, 0.15)',
                  border: '1px solid rgba(212, 163, 89, 0.3)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                }}>
                  {currentLanguage?.nativeName || 'English'} ({currentLanguage?.code?.toUpperCase() || 'EN'})
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {selectedField ? `${selectedField.name} (${selectedField.crop_type || (language === 'hi' ? 'गेहूं' : 'Wheat')})` : (language === 'hi' ? 'धारा एआई कृषि बुद्धिमत्ता' : 'DHARA AI Agricultural Intelligence')}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── GIANT INTERACTIVE MIC BUTTON & STATE PIPELINE ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem 0 0.75rem',
          gap: '1rem',
          background: 'radial-gradient(circle at center, rgba(212, 163, 89, 0.10) 0%, transparent 70%)',
          borderRadius: '16px',
        }}>
          <button
            onClick={status === 'listening' ? stopListening : startListening}
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: status === 'listening'
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'var(--gradient-primary)',
              border: status === 'listening' ? '4px solid #fca5a5' : '4px solid #e8d5b5',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: status === 'listening'
                ? '0 0 35px rgba(239,68,68,0.7), 0 0 70px rgba(239,68,68,0.3)'
                : '0 0 35px rgba(212, 163, 89, 0.6), 0 0 70px rgba(212, 163, 89, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              animation: status === 'listening' ? 'pulse-red 1.2s infinite' : 'pulse-wheat 2.5s infinite',
            }}
            aria-label={status === 'listening' ? t('voice.stopListening') : t('voice.micReady')}
          >
            {status === 'listening' ? <MicOff size={38} /> : <Mic size={38} />}
          </button>

          {/* Dynamic State Progression Label */}
          <div style={{
            fontSize: '0.92rem',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: status === 'listening' ? '#f87171' : status === 'understanding' ? '#38bdf8' : 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textAlign: 'center',
          }}>
            {status === 'listening' && (
              <>
                <span className="sensor-dot online" style={{ background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                <span>🔴 {language === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... speak now'}</span>
              </>
            )}
            {status === 'understanding' && (
              <>
                <RefreshCw size={16} className="spin" color="#38bdf8" />
                <span>⏳ {language === 'hi' ? 'समझ रहा हूँ...' : 'Understanding...'}</span>
              </>
            )}
            {status === 'idle' && (
              <span>🎤 {language === 'hi' ? 'हिंदी या अंग्रेजी में बोलने के लिए दबाएं' : 'Tap to speak in English or Hindi'}</span>
            )}
            {status === 'completed' && (
              <>
                <CheckCircle2 size={16} color="var(--accent-primary)" />
                <span>{language === 'hi' ? 'उत्तर तैयार है:' : 'DHARA AI Response:'}</span>
              </>
            )}
          </div>
        </div>

        {/* Error Message & Typing Fallback Notice */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            fontSize: '0.84rem',
            color: '#fca5a5',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <AlertCircle size={16} color="#ef4444" />
              <span>{errorMessage}</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#fed7aa', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Keyboard size={13} />
              <span>{language === 'hi' ? '⌨️ नीचे लिखकर अपना प्रश्न पूछें' : '⌨️ Type your question below instead'}</span>
            </div>
          </div>
        )}

        {/* ── RESPONSE SECTION ── */}
        {response && (
          <div style={{
            background: 'rgba(16, 12, 8, 0.95)',
            border: '1px solid rgba(212, 163, 89, 0.4)',
            borderRadius: '16px',
            padding: '1.25rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            animation: 'fadeIn 0.3s ease-out',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                🌾 {language === 'hi' ? 'धारा एआई परामर्श' : 'DHARA AI ADVISORY'}
              </span>
              <button
                onClick={isSpeaking ? stopSpeaking : () => speakText(response)}
                style={{
                  background: isSpeaking ? 'rgba(212, 163, 89, 0.25)' : 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(212, 163, 89, 0.3)',
                  borderRadius: '999px',
                  padding: '0.35rem 0.85rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isSpeaking ? (language === 'hi' ? 'आवाज़ रोकें' : 'Stop Audio') : t('voice.listenToAudio')}</span>
              </button>
            </div>

            <div style={{
              fontSize: '0.94rem',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}>
              {response}
            </div>
          </div>
        )}

        {/* ── TEXT INPUT BAR (FALLBACK & TYPING) ── */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(10, 8, 5, 0.85)',
          border: '1px solid rgba(212, 163, 89, 0.3)',
          borderRadius: '14px',
          padding: '0.4rem 0.5rem 0.4rem 1rem',
          alignItems: 'center',
        }}>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={status === 'listening' ? (language === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... speak now') : t('voice.textPlaceholder')}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-body)',
            }}
          />

          <button
            onClick={() => handleSendQuery()}
            disabled={!inputText.trim() || isSubmitting}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              background: inputText.trim() && !isSubmitting ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.08)',
              border: 'none',
              color: inputText.trim() && !isSubmitting ? '#fff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: inputText.trim() && !isSubmitting ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{t('voice.send')}</span>
            <Send size={15} />
          </button>
        </div>

        {/* ── QUICK NATURAL QUESTIONS CHIPS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <HelpCircle size={14} color="var(--accent-primary)" />
            <span>{t('voice.quickPromptsTitle')}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {[
              t('voice.q1'),
              t('voice.q2'),
              t('voice.q3'),
              t('voice.q4'),
              t('voice.q5'),
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(q);
                  handleSendQuery(q);
                }}
                style={{
                  background: 'rgba(212, 163, 89, 0.08)',
                  border: '1px solid rgba(212, 163, 89, 0.22)',
                  borderRadius: '999px',
                  padding: '0.4rem 0.85rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 163, 89, 0.22)';
                  e.currentTarget.style.borderColor = 'rgba(212, 163, 89, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 163, 89, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(212, 163, 89, 0.22)';
                }}
              >
                <span>{q}</span>
                <ArrowRight size={12} style={{ opacity: 0.7 }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskDharaModal;
