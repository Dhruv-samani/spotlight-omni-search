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

// Types
export type { SpotlightProps, SpotlightItem, SpotlightItemType, KeyboardShortcuts } from './types';

// Utilities
export { fuzzyFilter, fuzzyFilterItems, fuzzyMatch, type ScoredItem, type FuzzyMatchResult } from './lib/fuzzySearch';
export { highlightMatches, highlightQuery } from './lib/searchHighlight';

// Existing exports not explicitly modified but still needed
export * from "./adapters/routes";
export * from "./actions/commonActions";
