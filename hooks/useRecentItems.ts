import { useState, useEffect, useCallback } from 'react';
import { SpotlightItem } from '../types';

export interface UseRecentItemsOptions {
  /**
   * LocalStorage key for persistence
   * @default 'spotlight-recent-items'
   */
  storageKey?: string;
  /**
   * Maximum number of recent items to track
   * @default 10
   */
  maxItems?: number;
  /**
   * Enable recent items tracking
   * @default true
   */
  enabled?: boolean;
}

export interface UseRecentItemsReturn {
  /**
   * List of recent items
   */
  recentItems: SpotlightItem[];
  /**
   * Add an item to recent history
   */
  addRecentItem: (item: SpotlightItem) => void;
  /**
   * Clear all recent items
   */
  clearRecent: () => void;
}

/**
 * Hook to manage recent items with localStorage persistence
 */
export function useRecentItems(options: UseRecentItemsOptions = {}): UseRecentItemsReturn {
  const {
    storageKey = 'spotlight-recent-items',
    maxItems = 10,
    enabled = true,
  } = options;

  const [recentItems, setRecentItems] = useState<SpotlightItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (!enabled) return;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentItems(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.warn('Failed to load recent items from localStorage:', error);
    }
  }, [storageKey, enabled]);

  // Save to localStorage when items change
  useEffect(() => {
    if (!enabled) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(recentItems));
    } catch (error) {
      console.warn('Failed to save recent items to localStorage:', error);
    }
  }, [recentItems, storageKey, enabled]);

  const addRecentItem = useCallback((item: SpotlightItem) => {
    if (!enabled) return;

    setRecentItems((prev) => {
      // Remove if already exists (to move to top)
      const filtered = prev.filter((i) => i.id !== item.id);
      
      // Add to beginning
      const updated = [item, ...filtered];
      
      // Limit to maxItems
      return updated.slice(0, maxItems);
    });
  }, [enabled, maxItems]);

  const clearRecent = useCallback(() => {
    setRecentItems([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear recent items from localStorage:', error);
    }
  }, [storageKey]);

  return {
    recentItems: enabled ? recentItems : [],
    addRecentItem,
    clearRecent,
  };
}
