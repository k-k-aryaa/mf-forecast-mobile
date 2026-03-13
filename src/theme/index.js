import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { darkColors, lightColors, spacing, radii, shadows } from './colors';
import { fontSizes } from './typography';

export const useColors = () => {
  const { isDark } = useTheme();
  return useMemo(() => (isDark ? darkColors : lightColors), [isDark]);
};

export { darkColors, lightColors, spacing, radii, shadows, fontSizes };
