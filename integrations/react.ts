/**
 * React Integration for Spotlight
 * 
 * Simplified API for React applications
 */

export { SpotlightProvider } from '../providers/SpotlightProvider';
export type { SpotlightProviderProps } from '../providers/SpotlightProvider';

export { SearchTrigger } from '../components/SearchTrigger';
export type { SearchTriggerProps } from '../components/SearchTrigger';

export { useGlobalSpotlight } from '../hooks/useGlobalSpotlight';

// Re-export core types for convenience
export type { SpotlightItem, SpotlightProps } from '../types';
