'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilitySettings } from '@/lib/types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  toggleDyslexiaFont: () => void;
  toggleDarkMode: () => void;
  toggleTextOnly: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    dyslexiaFont: false,
    darkMode: false,
    textOnly: false,
  });

  useEffect(() => {
    // Load theme from localStorage on mount (client-side only)
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setSettings((prev) => ({ ...prev, darkMode: true }));
      }
    }
  }, []);

  useEffect(() => {
    // Apply settings to document body and html
    if (settings.dyslexiaFont) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }

    // Use data-theme attribute instead of class (client-side only)
    if (typeof window !== 'undefined') {
      const theme = settings.darkMode ? 'dark' : 'light';
      const el = document.documentElement;
      el.removeAttribute('class'); // Remove any dark class
      el.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }

    if (settings.textOnly) {
      document.body.classList.add('text-only');
    } else {
      document.body.classList.remove('text-only');
    }
  }, [settings]);

  const toggleDyslexiaFont = () => {
    setSettings((prev) => ({ ...prev, dyslexiaFont: !prev.dyslexiaFont }));
  };

  const toggleDarkMode = () => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const toggleTextOnly = () => {
    setSettings((prev) => ({ ...prev, textOnly: !prev.textOnly }));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        toggleDyslexiaFont,
        toggleDarkMode,
        toggleTextOnly,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
