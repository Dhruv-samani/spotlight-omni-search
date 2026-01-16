import "./index.css";

// Main component
export { Spotlight } from './Spotlight';

// Hooks
export { useSpotlight } from './hooks/useSpotlight';
export { useRecentItems } from './hooks/useRecentItems';
export { useSearchHistory } from './hooks/useSearchHistory';
export { useMediaQuery } from './hooks/useMediaQuery';
export { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
export { useTouchGestures } from './hooks/useTouchGestures';

// Simplified API (v2.3+)
export { SpotlightProvider } from './providers/SpotlightProvider';
export type { SpotlightProviderProps } from './providers/SpotlightProvider';
export { SearchTrigger } from './components/SearchTrigger';
export type { SearchTriggerProps } from './components/SearchTrigger';
export { useGlobalSpotlight } from './hooks/useGlobalSpotlight';


// Types
export type { SpotlightProps, SpotlightItem, SpotlightItemType, KeyboardShortcuts } from './types';

// Utilities
export { fuzzyFilter, fuzzyFilterItems, fuzzyMatch, type ScoredItem, type FuzzyMatchResult } from './lib/fuzzySearch';
export { highlightMatches, highlightQuery } from './lib/searchHighlight';

// Existing exports not explicitly modified but still needed
export * from "./adapters/routes";
export * from "./actions/commonActions";
