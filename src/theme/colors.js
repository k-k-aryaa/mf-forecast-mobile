/**
 * Theme Color System
 * Matches the web frontend CSS variables for consistent design.
 */

export const darkColors = {
    background: '#0a0a0f',
    surface: 'rgba(255, 255, 255, 0.03)',
    surfaceHover: 'rgba(255, 255, 255, 0.06)',
    card: 'rgba(255, 255, 255, 0.04)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',

    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',

    primary: '#22d3ee',
    primaryDim: 'rgba(34, 211, 238, 0.1)',

    accentGreen: '#22c55e',
    accentGreenDim: 'rgba(34, 197, 94, 0.1)',
    accentRed: '#ef4444',
    accentRedDim: 'rgba(239, 68, 68, 0.1)',

    gradientAiStart: '#8b5cf6',
    gradientAiEnd: '#22d3ee',

    borderPrimary: 'rgba(255, 255, 255, 0.08)',
    borderSecondary: 'rgba(255, 255, 255, 0.04)',

    statusOpen: '#22c55e',
    statusClosed: '#71717a',
    statusPre: '#eab308',

    overlay: 'rgba(0, 0, 0, 0.6)',
    backdrop: 'rgba(0, 0, 0, 0.8)',

    tabActive: '#22d3ee',
    tabInactive: '#71717a',
    bottomBar: 'rgba(10, 10, 15, 0.95)',
};

export const lightColors = {
    background: '#f5f5f7',
    surface: '#ffffff',
    surfaceHover: '#f0f0f2',
    card: '#ffffff',
    cardBorder: 'rgba(0, 0, 0, 0.12)',

    textPrimary: '#1a1a2e',
    textSecondary: '#4a4a5a',
    textMuted: '#6b7280',

    primary: '#0891b2',
    primaryDim: 'rgba(8, 145, 178, 0.1)',

    accentGreen: '#16a34a',
    accentGreenDim: 'rgba(22, 163, 74, 0.1)',
    accentRed: '#dc2626',
    accentRedDim: 'rgba(220, 38, 38, 0.1)',

    gradientAiStart: '#7c3aed',
    gradientAiEnd: '#0891b2',

    borderPrimary: 'rgba(0, 0, 0, 0.12)',
    borderSecondary: 'rgba(0, 0, 0, 0.06)',

    statusOpen: '#16a34a',
    statusClosed: '#6b7280',
    statusPre: '#ca8a04',

    overlay: 'rgba(0, 0, 0, 0.3)',
    backdrop: 'rgba(0, 0, 0, 0.5)',

    tabActive: '#0891b2',
    tabInactive: '#6b7280',
    bottomBar: 'rgba(255, 255, 255, 0.95)',
};

export const getColors = (theme) => theme === 'dark' ? darkColors : lightColors;

export default { darkColors, lightColors, getColors };
