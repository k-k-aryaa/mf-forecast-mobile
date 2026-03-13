// Theme colors ported from mf-forecast-frontend/src/index.css
// Exact same hex values for both dark and light modes

export const darkColors = {
  // Backgrounds
  bgPrimary: '#050507',
  bgSecondary: '#0a0a0f',
  bgCard: 'rgba(13, 13, 18, 0.85)',
  bgCardHover: 'rgba(20, 20, 28, 0.9)',
  bgElevated: '#15151a',

  // Accents
  accentCyan: '#06b6d4',
  accentPurple: '#8b5cf6',
  accentNeonGreen: '#39ff14',
  accentNeonGreenDim: 'rgba(57, 255, 20, 0.15)',
  accentGreen: '#22c55e',
  accentRed: '#ef4444',
  accentRedDim: 'rgba(239, 68, 68, 0.15)',
  accentBlue: '#3b82f6',

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textDim: '#475569',

  // Borders
  borderPrimary: 'rgba(255, 255, 255, 0.1)',
  borderSubtle: 'rgba(255, 255, 255, 0.05)',
  borderGlow: 'rgba(6, 182, 212, 0.3)',

  // Surfaces
  surfaceHover: 'rgba(255, 255, 255, 0.05)',
  surfaceActive: 'rgba(255, 255, 255, 0.1)',
  borderHover: 'rgba(255, 255, 255, 0.15)',
  borderActive: 'rgba(255, 255, 255, 0.2)',

  // Special
  glassBg: 'rgba(13, 13, 18, 0.6)',
  tickerBg: 'rgba(0, 0, 0, 0.2)',
  indexCardBg: 'rgba(255, 255, 255, 0.03)',
  indexCardHover: 'rgba(255, 255, 255, 0.06)',
  headerBg: 'rgba(13, 14, 20, 0.6)',
  bottomBarBg: 'rgba(10, 10, 15, 0.9)',

  // Chart colors
  chartGreen: '#22c55e',
  chartRed: '#ef4444',
  chartCyan: '#06b6d4',
};

export const lightColors = {
  // Backgrounds
  bgPrimary: '#ffffff',
  bgSecondary: '#f4f4f5',
  bgCard: 'rgba(255, 255, 255, 0.85)',
  bgCardHover: 'rgba(255, 255, 255, 1)',
  bgElevated: '#ffffff',

  // Accents
  accentCyan: '#0284c7',
  accentPurple: '#7c3aed',
  accentNeonGreen: '#059669',
  accentNeonGreenDim: 'rgba(5, 150, 105, 0.1)',
  accentGreen: '#10b981',
  accentRed: '#ef4444',
  accentRedDim: 'rgba(239, 68, 68, 0.1)',
  accentBlue: '#3b82f6',

  // Text
  textPrimary: '#09090b',
  textSecondary: '#52525b',
  textMuted: '#71717a',
  textDim: '#a1a1aa',

  // Borders
  borderPrimary: 'rgba(9, 9, 11, 0.25)',
  borderSubtle: 'rgba(9, 9, 11, 0.12)',
  borderGlow: 'rgba(2, 132, 199, 0.2)',

  // Surfaces
  surfaceHover: 'rgba(9, 9, 11, 0.04)',
  surfaceActive: 'rgba(9, 9, 11, 0.08)',
  borderHover: 'rgba(9, 9, 11, 0.35)',
  borderActive: 'rgba(9, 9, 11, 0.45)',

  // Special
  glassBg: 'rgba(255, 255, 255, 0.75)',
  tickerBg: 'rgba(255, 255, 255, 0.6)',
  indexCardBg: 'rgba(9, 9, 11, 0.02)',
  indexCardHover: 'rgba(9, 9, 11, 0.06)',
  headerBg: 'rgba(255, 255, 255, 0.75)',
  bottomBarBg: 'rgba(255, 255, 255, 0.95)',

  // Chart colors
  chartGreen: '#10b981',
  chartRed: '#ef4444',
  chartCyan: '#0284c7',
};

// Spacing scale matching frontend
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// Border radius
export const radii = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 28,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 12,
  },
};
