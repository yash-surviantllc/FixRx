import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

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
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  const getActiveTheme = (): 'light' | 'dark' => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  };

  const theme = getActiveTheme();

  const colors = theme === 'dark' 
    ? {
        background: '#000000',
        text: '#FFFFFF',
        primary: '#3B82F6',
        secondary: '#1F2937',
        border: '#374151',
        card: '#1F2937',
      }
    : {
        background: '#FFFFFF',
        text: '#000000',
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
