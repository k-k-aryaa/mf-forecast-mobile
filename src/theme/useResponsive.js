import { useState, useEffect, useMemo } from 'react';
import { Dimensions } from 'react-native';

const TABLET_BREAKPOINT = 600;

/**
 * Responsive utility hook for tablet adaptation.
 * Provides scaling functions and layout helpers.
 */
export default function useResponsive() {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const isTablet = screenWidth >= TABLET_BREAKPOINT;

  return useMemo(() => ({
    isTablet,
    screenWidth,

    /** Scale a value by 1.3× on tablet (good for fonts, icons) */
    scale: (value) => (isTablet ? Math.round(value * 1.3) : value),

    /** Moderate scale — 1.15× on tablet (for subtle bumps) */
    moderateScale: (value) => (isTablet ? Math.round(value * 1.15) : value),

    /** Max content width style — constrains content on tablets */
    maxContentWidth: isTablet
      ? { maxWidth: 680, alignSelf: 'center', width: '100%' }
      : {},

    /** Wider max content width for full-bleed screens */
    wideContentWidth: isTablet
      ? { maxWidth: 800, alignSelf: 'center', width: '100%' }
      : {},

    /** Returns style for a 2-column grid on tablet */
    tabletColumns: isTablet
      ? { flexDirection: 'row', flexWrap: 'wrap', gap: 16 }
      : {},

    /** Returns style for a single item in a 2-column tablet grid */
    tabletHalfWidth: isTablet
      ? { width: '48%' }
      : { width: '100%' },
  }), [isTablet, screenWidth]);
}
