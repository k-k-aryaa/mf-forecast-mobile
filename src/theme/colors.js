// Theme colors ported from mf-forecast-frontend/src/index.css
// Exact same hex values for both dark and light modes

export const darkColors = {
  // Backgrounds
  bgPrimary: '#050507',
  bgSecondary: '#0a0a0f',
  bgCard: 'rgba(18, 18, 28, 0.92)',
  bgCardHover: 'rgba(25, 25, 35, 0.95)',
  bgElevated: '#1a1a24',

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
  borderPrimary: 'rgba(255, 255, 255, 0.18)',
  borderSubtle: 'rgba(255, 255, 255, 0.10)',
  borderGlow: 'rgba(6, 182, 212, 0.5)',

  // Surfaces
  surfaceHover: 'rgba(255, 255, 255, 0.07)',
  surfaceActive: 'rgba(255, 255, 255, 0.12)',
  borderHover: 'rgba(255, 255, 255, 0.22)',
  borderActive: 'rgba(255, 255, 255, 0.28)',

  // Special
  glassBg: 'rgba(13, 13, 18, 0.6)',
  tickerBg: 'rgba(0, 0, 0, 0.2)',
  indexCardBg: 'rgba(255, 255, 255, 0.05)',
  indexCardHover: 'rgba(255, 255, 255, 0.06)',
  headerBg: 'rgba(13, 14, 20, 0.6)',
  bottomBarBg: 'rgba(10, 10, 15, 0.9)',

  // Chart colors
  chartGreen: '#22c55e',
  chartRed: '#ef4444',
  chartCyan: '#06b6d4',
};

export const lightColors = {
  // Backgrounds (fully opaque to prevent Android elevation shadow bleed)
  bgPrimary: '#ffffff',
  bgSecondary: '#f4f4f5',
  bgCard: '#f8f8fa',
  bgCardHover: '#ffffff',
  bgElevated: '#ffffff',

  // Accents
  accentCyan: '#0284c7',
  accentPurple: '#7c3aed',
  accentNeonGreen: '#059669',
  accentNeonGreenDim: '#e6f5ef',
  accentGreen: '#10b981',
  accentRed: '#ef4444',
  accentRedDim: '#fdecec',
  accentBlue: '#3b82f6',

  // Text
  textPrimary: '#09090b',
  textSecondary: '#52525b',
  textMuted: '#71717a',
  textDim: '#a1a1aa',

  // Borders
  borderPrimary: '#c4c4c7',
  borderSubtle: '#dcdcdf',
  borderGlow: '#7bbfe0',

  // Surfaces
  surfaceHover: '#f5f5f6',
  surfaceActive: '#ececed',
  borderHover: '#c4c4c7',
  borderActive: '#a8a8ac',

  // Special
  glassBg: '#f5f5f5',
  tickerBg: '#f8f8f8',
  indexCardBg: '#fafafa',
  indexCardHover: '#f3f3f4',
  headerBg: '#f9f9f9',
  bottomBarBg: '#fdfdfd',

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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 16,
  },
};
