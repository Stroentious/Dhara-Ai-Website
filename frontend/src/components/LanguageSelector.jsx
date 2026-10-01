import React, { useState, useEffect, useRef } from 'react';
import { Globe, Check, Search, X, ChevronDown, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { INDIAN_LANGUAGES } from '../data/languages';

/**
 * Enterprise Farmer-Friendly Indian Language Selector
 * Supports all 22 Eighth Schedule languages + English
 */
const LanguageSelector = ({ variant = 'button', className = '', style = {} }) => {
  const { language, setLanguage, currentLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'major', 'north', 'south', 'east', 'west'
  const modalRef = useRef(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when modal open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Filter languages
  const filteredLanguages = INDIAN_LANGUAGES.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.nativeName.toLowerCase().includes(q) ||
      item.region.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q)
    );
  });

  // Popular / Primary Quick Picks
  const popularCodes = ['en', 'hi', 'pa', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml'];

  // Button styles depending on variant
  const getTriggerStyle = () => {
    if (variant === 'light') {
      return {
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        background: 'rgba(255, 255, 255, 0.92)',
        border: '1px solid rgba(212, 163, 89, 0.45)',
        color: '#0f172a',
        borderRadius: '999px',
        padding: '0.35rem 0.85rem',
        fontSize: '0.78rem',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease',
        ...style,
      };
    }

    if (variant === 'compact') {
      return {
        height: '34px',
        padding: '0 0.65rem',
        borderRadius: '8px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-glass)',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        cursor: 'pointer',
        fontSize: '0.78rem',
        fontWeight: 700,
        transition: 'var(--transition)',
        ...style,
      };
    }

    // Default button style
    return {
      height: '38px',
      padding: '0 0.85rem',
      borderRadius: '8px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-glass)',
      color: 'var(--text-primary)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.45rem',
      cursor: 'pointer',
      fontSize: '0.82rem',
      fontWeight: 700,
      transition: 'var(--transition)',
      boxShadow: 'var(--shadow-sm)',
      ...style,
    };
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
        style={getTriggerStyle()}
        title={`${t('common.selectLanguage')} (22 Indian Languages + English)`}
        aria-label="Select Language"
      >
        <Globe size={16} color="var(--accent-primary, #d4a359)" />
        <span style={{ fontWeight: 700 }}>
          {currentLanguage?.nativeName || 'English'}
        </span>
        <ChevronDown size={14} opacity={0.65} />
      </button>

      {/* Fullscreen Accessible Language Selection Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(8, 12, 18, 0.78)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            ref={modalRef}
            style={{
              width: '100%',
              maxWidth: '860px',
              maxHeight: '90vh',
              background: 'var(--bg-card, #141b24)',
              border: '1px solid var(--border-glass, rgba(212, 163, 89, 0.28))',
              borderRadius: '18px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              color: 'var(--text-primary, #ffffff)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-glass, rgba(255, 255, 255, 0.08))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(212, 163, 89, 0.12) 0%, transparent 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(212, 163, 89, 0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(212, 163, 89, 0.4)',
                  }}
                >
                  <Globe size={22} color="var(--accent-primary, #d4a359)" />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary, #fff)',
                    }}
                  >
                    {t('common.selectLanguage')} • भाषा चुनें
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #94a3b8)', marginTop: '2px' }}>
                    22 Indian Eighth Schedule Languages + English • संविधान मान्यता प्राप्त भाषाएं
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: 'var(--text-secondary, #94a3b8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title={t('common.close')}
              >
                <X size={18} />
              </button>
            </div>

            {/* Search & Quick Filter Bar */}
            <div
              style={{
                padding: '1rem 1.5rem 0.75rem',
                borderBottom: '1px solid var(--border-glass, rgba(255, 255, 255, 0.06))',
                background: 'rgba(0, 0, 0, 0.15)',
              }}
            >
              {/* Search Box */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.85rem',
                }}
              >
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    color: 'var(--accent-primary, #d4a359)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('common.searchLanguage')}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-glass, rgba(212, 163, 89, 0.25))',
                    color: 'var(--text-primary, #fff)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted, #64748b)',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Quick Pills for Common Languages */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  overflowX: 'auto',
                  paddingBottom: '0.35rem',
                  scrollbarWidth: 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--text-muted, #64748b)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    marginRight: '0.25rem',
                  }}
                >
                  <Sparkles size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                  Quick:
                </span>
                {popularCodes.map((code) => {
                  const lang = INDIAN_LANGUAGES.find((l) => l.code === code);
                  if (!lang) return null;
                  const isSelected = language === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleSelect(code)}
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: isSelected ? 700 : 500,
                        background: isSelected
                          ? 'var(--accent-primary, #d4a359)'
                          : 'rgba(255, 255, 255, 0.05)',
                        color: isSelected ? '#000000' : 'var(--text-secondary, #cbd5e1)',
                        border: isSelected
                          ? '1px solid var(--accent-primary, #d4a359)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {lang.nativeName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Languages Grid */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.25rem 1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '0.85rem',
                alignContent: 'start',
              }}
            >
              {filteredLanguages.length === 0 ? (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: 'var(--text-muted, #64748b)',
                  }}
                >
                  <Globe size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
                    No matching language found for "{searchQuery}"
                  </p>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem' }}>
                    Try searching by language name or state (e.g. Hindi, Punjabi, Bengali, Gujarat)
                  </p>
                </div>
              ) : (
                filteredLanguages.map((item) => {
                  const isSelected = language === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleSelect(item.code)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        textAlign: 'left',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(212, 163, 89, 0.22) 0%, rgba(212, 163, 89, 0.08) 100%)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected
                          ? '1.5px solid var(--accent-primary, #d4a359)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        position: 'relative',
                        boxShadow: isSelected ? '0 4px 15px rgba(212, 163, 89, 0.15)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'rgba(212, 163, 89, 0.4)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        }
                      }}
                    >
                      {/* Selected check badge */}
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'var(--accent-primary, #d4a359)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={13} color="#000000" strokeWidth={3} />
                        </div>
                      )}

                      {/* Prominent Native Script */}
                      <span
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: isSelected ? 'var(--accent-primary, #d4a359)' : 'var(--text-primary, #ffffff)',
                          marginBottom: '0.2rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.nativeName}
                      </span>

                      {/* English Name */}
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: 'var(--text-secondary, #94a3b8)',
                          marginBottom: '0.35rem',
                        }}
                      >
                        {item.name}
                      </span>

                      {/* Region Tag */}
                      <span
                        style={{
                          fontSize: '0.68rem',
                          color: 'var(--text-muted, #64748b)',
                          background: 'rgba(255, 255, 255, 0.04)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.region}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '0.85rem 1.5rem',
                borderTop: '1px solid var(--border-glass, rgba(255, 255, 255, 0.06))',
                background: 'rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: 'var(--text-secondary, #94a3b8)',
              }}
            >
              <span>
                {t('settings.selectedLang')} <strong style={{ color: 'var(--accent-primary, #d4a359)' }}>{currentLanguage?.nativeName} ({currentLanguage?.name})</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-secondary"
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '0.8rem',
                  height: 'auto',
                }}
              >
                {t('common.done')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSelector;
