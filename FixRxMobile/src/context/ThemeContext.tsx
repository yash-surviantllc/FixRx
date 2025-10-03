import React, { createContext, useContext, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    border: string;
    card: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always use light mode to avoid any issues
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const theme: 'light' | 'dark' = 'light'; // Force light mode

  // Always use light mode colors
  const colors = {
    background: '#F8F9FA',
    text: '#1F2937',
    primary: '#2563EB',
    secondary: '#F3F4F6',
    border: '#E5E7EB',
    card: '#FFFFFF',
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
