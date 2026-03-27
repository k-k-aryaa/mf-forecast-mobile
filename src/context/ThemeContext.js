import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../api/config';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); // 'light' | 'dark' | null
  // themePreference: 'auto' | 'light' | 'dark'
  const [themePreference, setThemePreference] = useState('auto');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto') {
          setThemePreference(savedTheme);
        }
        // If no saved preference, stays 'auto' (follows system)
      } catch (e) {
        // default to auto
      }
      setIsLoaded(true);
    };
    loadTheme();
  }, []);

  // Resolve the actual theme based on preference
  const resolvedTheme =
    themePreference === 'auto'
      ? (systemColorScheme || 'dark') // follow system, fallback to dark
      : themePreference;

  const toggleTheme = async () => {
    // Cycle: auto → light → dark → auto
    const next =
      themePreference === 'auto' ? 'light' : themePreference === 'light' ? 'dark' : 'auto';
    setThemePreference(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, next);
    } catch (e) {
      // ignore
    }
  };

  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        themePreference,
        toggleTheme,
        isDark: resolvedTheme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
