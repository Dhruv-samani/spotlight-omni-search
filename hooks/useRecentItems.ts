import { useState, useEffect, useCallback } from 'react';
import { SpotlightItem } from '../types';
import { spotlightStorage } from '../lib/storage';

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
      const stored = spotlightStorage.getItem<SpotlightItem[]>(storageKey);
      if (stored) {
        setRecentItems(Array.isArray(stored) ? stored : []);
      }
    } catch (error) {
    }
  }, [storageKey, enabled]);

  // Save to localStorage when items change
  useEffect(() => {
    if (!enabled) return;

    try {
      spotlightStorage.setItem(storageKey, recentItems);
    } catch (error) {
    }
  }, [recentItems, storageKey, enabled]);

  const addRecentItem = useCallback((item: SpotlightItem) => {
    if (!enabled) return;

    setRecentItems((prev) => {
      // Create a sanitized copy for storage (remove React nodes and functions)
      // We only store the data needed to identify and display the text
      const sanitizedItem: SpotlightItem = {
          id: item.id,
          label: item.label,
          description: item.description,
          type: item.type,
          group: item.group,
          keywords: item.keywords,
          shortcut: item.shortcut,
          // Exclude icon, action, component, etc.
          // If we need an icon, we can rely on re-hydrating it from a registry if needed, 
          // or just store a string identifier if the system supported it.
          // For now, recent items might lose their dynamic icon if it was a ReactNode.
      };

      // Remove if already exists (to move to top)
      const filtered = prev.filter((i) => i.id !== item.id);
      
      // Add to beginning
      const updated = [sanitizedItem, ...filtered];
      
      // Limit to maxItems
      return updated.slice(0, maxItems);
    });
  }, [enabled, maxItems]);

  const clearRecent = useCallback(() => {
    setRecentItems([]);
    try {
      spotlightStorage.removeItem(storageKey);
    } catch (error) {
    }
  }, [storageKey]);

  return {
    recentItems: enabled ? recentItems : [],
    addRecentItem,
    clearRecent,
  };
}
