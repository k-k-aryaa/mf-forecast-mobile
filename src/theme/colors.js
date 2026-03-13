/**
 * Theme Color System
 * Exactly matches the web frontend CSS variables from index.css
 */

export const darkColors = {
    // Backgrounds
    background: '#050507',
    bgSecondary: '#0a0a0f',
    surface: 'rgba(13, 13, 18, 0.7)',
    surfaceHover: 'rgba(20, 20, 28, 0.8)',
    bgElevated: '#15151a',
    card: 'rgba(13, 13, 18, 0.7)',
    cardHover: 'rgba(20, 20, 28, 0.8)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',

    // Text
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    textDim: '#475569',

    // Primary / Accents
    primary: '#06b6d4',       // accent-cyan
    primaryDim: 'rgba(6, 182, 212, 0.15)',
    accentCyan: '#06b6d4',
    accentPurple: '#8b5cf6',
    accentNeonGreen: '#39ff14',
    accentNeonGreenDim: 'rgba(57, 255, 20, 0.15)',
    accentGreen: '#22c55e',
    accentGreenDim: 'rgba(34, 197, 94, 0.15)',
    accentRed: '#ef4444',
    accentRedDim: 'rgba(239, 68, 68, 0.15)',
    accentBlue: '#3b82f6',

    // Gradients (for LinearGradient components)
    gradientAiStart: '#06b6d4',
    gradientAiEnd: '#8b5cf6',
    gradientAiColors: ['#06b6d4', '#8b5cf6'],

    // Borders
    borderPrimary: 'rgba(255, 255, 255, 0.1)',
    borderSubtle: 'rgba(255, 255, 255, 0.05)',
    borderGlow: 'rgba(6, 182, 212, 0.3)',
    borderHover: 'rgba(255, 255, 255, 0.15)',
    borderActive: 'rgba(255, 255, 255, 0.2)',
    borderSecondary: 'rgba(255, 255, 255, 0.05)',

    // Glassmorphism / Overlays
    glassBg: 'rgba(13, 13, 18, 0.6)',
    tickerBg: 'rgba(0, 0, 0, 0.2)',
    indexCardBg: 'rgba(255, 255, 255, 0.03)',
    indexCardHover: 'rgba(255, 255, 255, 0.06)',
    headerBg: 'rgba(13, 14, 20, 0.6)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    backdrop: 'rgba(0, 0, 0, 0.8)',
    surfaceHoverOverlay: 'rgba(255, 255, 255, 0.05)',
    surfaceActive: 'rgba(255, 255, 255, 0.1)',

    // Status
    statusOpen: '#22c55e',
    statusClosed: '#64748b',
    statusPre: '#eab308',

    // Tab / Nav
    tabActive: '#06b6d4',
    tabInactive: '#64748b',
    bottomBar: 'rgba(10, 10, 15, 0.9)',
    mobileMenuBg: 'rgba(10, 10, 15, 0.95)',

    // Shadows / Glows
    shadowGlowCyan: 'rgba(6, 182, 212, 0.4)',
    shadowGlowPurple: 'rgba(139, 92, 246, 0.4)',
    shadowGlowGreen: 'rgba(57, 255, 20, 0.4)',
};

export const lightColors = {
    // Backgrounds
    background: '#ffffff',
    bgSecondary: '#f4f4f5',
    surface: 'rgba(255, 255, 255, 0.85)',
    surfaceHover: 'rgba(255, 255, 255, 1)',
    bgElevated: '#ffffff',
    card: 'rgba(255, 255, 255, 0.85)',
    cardHover: 'rgba(255, 255, 255, 1)',
    cardBorder: 'rgba(9, 9, 11, 0.25)',

    // Text
    textPrimary: '#09090b',
    textSecondary: '#52525b',
    textMuted: '#71717a',
    textDim: '#a1a1aa',

    // Primary / Accents
    primary: '#0284c7',
    primaryDim: 'rgba(2, 132, 199, 0.1)',
    accentCyan: '#0284c7',
    accentPurple: '#7c3aed',
    accentNeonGreen: '#059669',
    accentNeonGreenDim: 'rgba(5, 150, 105, 0.1)',
    accentGreen: '#10b981',
    accentGreenDim: 'rgba(16, 185, 129, 0.1)',
    accentRed: '#ef4444',
    accentRedDim: 'rgba(239, 68, 68, 0.1)',
    accentBlue: '#3b82f6',

    // Gradients
    gradientAiStart: '#0284c7',
    gradientAiEnd: '#7c3aed',
    gradientAiColors: ['#0284c7', '#7c3aed'],

    // Borders
    borderPrimary: 'rgba(9, 9, 11, 0.25)',
    borderSubtle: 'rgba(9, 9, 11, 0.12)',
    borderGlow: 'rgba(2, 132, 199, 0.2)',
    borderHover: 'rgba(9, 9, 11, 0.35)',
    borderActive: 'rgba(9, 9, 11, 0.45)',
    borderSecondary: 'rgba(9, 9, 11, 0.12)',

    // Glassmorphism / Overlays
    glassBg: 'rgba(255, 255, 255, 0.75)',
    tickerBg: 'rgba(255, 255, 255, 0.6)',
    indexCardBg: 'rgba(9, 9, 11, 0.02)',
    indexCardHover: 'rgba(9, 9, 11, 0.06)',
    headerBg: 'rgba(255, 255, 255, 0.75)',
    overlay: 'rgba(0, 0, 0, 0.3)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    surfaceHoverOverlay: 'rgba(9, 9, 11, 0.04)',
    surfaceActive: 'rgba(9, 9, 11, 0.08)',

    // Status
    statusOpen: '#10b981',
    statusClosed: '#71717a',
    statusPre: '#ca8a04',

    // Tab / Nav
    tabActive: '#0284c7',
    tabInactive: '#71717a',
    bottomBar: 'rgba(255, 255, 255, 0.95)',
    mobileMenuBg: 'rgba(255, 255, 255, 0.98)',

    // Shadows / Glows
    shadowGlowCyan: 'rgba(2, 132, 199, 0.2)',
    shadowGlowPurple: 'rgba(124, 58, 237, 0.2)',
    shadowGlowGreen: 'rgba(5, 150, 105, 0.2)',
};

export const getColors = (theme) => theme === 'dark' ? darkColors : lightColors;

export default { darkColors, lightColors, getColors };
