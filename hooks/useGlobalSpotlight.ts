import { useSpotlightContext } from '../providers/SpotlightContext';

/**
 * useGlobalSpotlight - Simplified hook for accessing Spotlight state
 * 
 * Must be used within SpotlightProvider
 * 
 * @example
 * ```tsx
 * const { open, close, toggle, isOpen } = useGlobalSpotlight();
 * 
 * <button onClick={open}>Open Search</button>
 * ```
 */
export function useGlobalSpotlight() {
    return useSpotlightContext();
}
