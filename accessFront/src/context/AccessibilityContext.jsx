import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setHighContrast(parsed.highContrast || false);
      setLargeText(parsed.largeText || false);
      setReduceMotion(parsed.reduceMotion || false);
      setScreenReader(parsed.screenReader || false);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify({
      highContrast,
      largeText,
      reduceMotion,
      screenReader
    }));
  }, [highContrast, largeText, reduceMotion, screenReader]);

  const value = {
    highContrast,
    setHighContrast,
    largeText,
    setLargeText,
    reduceMotion,
    setReduceMotion,
    screenReader,
    setScreenReader,
    resetSettings: () => {
      setHighContrast(false);
      setLargeText(false);
      setReduceMotion(false);
      setScreenReader(false);
    }
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
