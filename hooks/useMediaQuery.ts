import { useState, useEffect } from 'react';

export interface MediaQueryOptions {
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
}

export interface MediaQueryResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersDarkMode: boolean;
}

/**
 * Hook to detect responsive breakpoints and user preferences
 */
export function useMediaQuery(options: MediaQueryOptions = {}): MediaQueryResult {
  const {
    mobileBreakpoint = 640,
    tabletBreakpoint = 1024,
  } = options;

  const [result, setResult] = useState<MediaQueryResult>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        prefersReducedMotion: false,
        prefersHighContrast: false,
        prefersDarkMode: false,
      };
    }

    return {
      isMobile: window.innerWidth < mobileBreakpoint,
      isTablet: window.innerWidth >= mobileBreakpoint && window.innerWidth < tabletBreakpoint,
      isDesktop: window.innerWidth >= tabletBreakpoint,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
      prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateMediaQuery = () => {
      setResult({
        isMobile: window.innerWidth < mobileBreakpoint,
        isTablet: window.innerWidth >= mobileBreakpoint && window.innerWidth < tabletBreakpoint,
        isDesktop: window.innerWidth >= tabletBreakpoint,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      });
    };

    // Listen for window resize
    window.addEventListener('resize', updateMediaQuery);

    // Listen for media query changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleReducedMotionChange = () => updateMediaQuery();
    const handleHighContrastChange = () => updateMediaQuery();
    const handleDarkModeChange = () => updateMediaQuery();

    // Modern browsers
    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
      highContrastQuery.addEventListener('change', handleHighContrastChange);
      darkModeQuery.addEventListener('change', handleDarkModeChange);
    } else {
      // Fallback for older browsers
      reducedMotionQuery.addListener(handleReducedMotionChange);
      highContrastQuery.addListener(handleHighContrastChange);
      darkModeQuery.addListener(handleDarkModeChange);
    }

    return () => {
      window.removeEventListener('resize', updateMediaQuery);
      
      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
        highContrastQuery.removeEventListener('change', handleHighContrastChange);
        darkModeQuery.removeEventListener('change', handleDarkModeChange);
      } else {
        reducedMotionQuery.removeListener(handleReducedMotionChange);
        highContrastQuery.removeListener(handleHighContrastChange);
        darkModeQuery.removeListener(handleDarkModeChange);
      }
    };
  }, [mobileBreakpoint, tabletBreakpoint]);

  return result;
}
