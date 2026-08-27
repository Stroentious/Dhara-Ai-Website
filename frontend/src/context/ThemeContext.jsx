import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dhara_theme') || 'dark';
  });

  const [actualTheme, setActualTheme] = useState('dark');

  useEffect(() => {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (currentTheme) => {
      let resolved = currentTheme;
      if (currentTheme === 'system') {
        resolved = systemPrefersDark.matches ? 'dark' : 'light';
      }
      root.setAttribute('data-theme', resolved);
      setActualTheme(resolved);
    };

    applyTheme(theme);
    localStorage.setItem('dhara_theme', theme);

    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    systemPrefersDark.addEventListener('change', handleSystemChange);
    return () => systemPrefersDark.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const isBW = actualTheme === 'light';
  const isDark = actualTheme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme, isBW, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
