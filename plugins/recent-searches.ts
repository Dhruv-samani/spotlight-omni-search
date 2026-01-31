import { ReactNode } from 'react';
import { SpotlightPlugin } from '../types/plugin';
import { SpotlightItem } from '../types';

export interface RecentSearchesOptions {
  /**
   * Maximum number of recent searches to store
   * @default 10
   */
  maxSearches?: number;
  /**
   * Show recent searches in results when query is empty
   * @default true
   */
  showInResults?: boolean;
  /**
   * Clear recent searches after selecting one
   * @default false
   */
  clearOnSelect?: boolean;
  /**
   * Custom storage key for localStorage
   * @default 'spotlight-recent-searches'
   */
  storageKey?: string;
  /**
   * Custom icon for recent search items
   */
  icon?: ReactNode;
  /**
   * Enable obfuscation for privacy
   * @default true
   */
  enableObfuscation?: boolean;
}

interface RecentSearch {
  query: string;
  timestamp: number;
}

/**
 * Simple obfuscation for privacy (Base64 encoding)
 */
function obfuscate(data: string): string {
  try {
    return btoa(encodeURIComponent(data));
  } catch {
    return data;
  }
}

function deobfuscate(data: string): string {
  try {
    return decodeURIComponent(atob(data));
  } catch {
    return data;
  }
}

export const RecentSearchesPlugin = (options: RecentSearchesOptions = {}): SpotlightPlugin => {
  const {
    maxSearches = 10,
    showInResults = true,
    clearOnSelect = false,
    storageKey = 'spotlight-recent-searches',
    icon,
    enableObfuscation = true,
  } = options;

  let recentSearches: RecentSearch[] = [];

  // Load recent searches from storage
  const loadRecentSearches = (): RecentSearch[] => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return [];
      
      const data = enableObfuscation ? deobfuscate(stored) : stored;
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

  // Save recent searches to storage
  const saveRecentSearches = (searches: RecentSearch[]) => {
    try {
      const data = JSON.stringify(searches);
      const toStore = enableObfuscation ? obfuscate(data) : data;
      localStorage.setItem(storageKey, toStore);
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  };

  // Add a search to recent searches
  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;

    // Remove duplicates and add to front
    recentSearches = [
      { query: query.trim(), timestamp: Date.now() },
      ...recentSearches.filter(s => s.query !== query.trim())
    ].slice(0, maxSearches);

    saveRecentSearches(recentSearches);
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    recentSearches = [];
    localStorage.removeItem(storageKey);
  };

  return {
    name: 'spotlight-recent-searches',
    version: '1.0.0',

    onInit: () => {
      recentSearches = loadRecentSearches();
    },

    onBeforeSearch: (query, items) => {
      // If query is empty and showInResults is enabled, show recent searches
      if (!query.trim() && showInResults && recentSearches.length > 0) {
        const recentItems: SpotlightItem[] = recentSearches.map((search, index) => ({
          id: `recent-search-${index}`,
          label: search.query,
          description: 'Recent search',
          type: 'action',
          group: 'Recent Searches',
          ...(icon && { icon }),
          action: () => {
            // Re-run the search by setting the query
            // This will be handled by the context
            if (clearOnSelect) {
              clearRecentSearches();
            }
          },
        }));

        // Add "Clear Recent Searches" action
        const clearAction: SpotlightItem = {
          id: 'clear-recent-searches',
          label: 'Clear Recent Searches',
          description: `Clear ${recentSearches.length} recent search${recentSearches.length === 1 ? '' : 'es'}`,
          type: 'action',
          group: 'Recent Searches',
          action: clearRecentSearches,
        };

        return [...recentItems, clearAction, ...items];
      }

      return items;
    },

    onSelect: (item) => {
      // Track the search query when an item is selected
      // We'll track this on close instead to capture the final query
      return true; // Allow default action
    },

    onClose: () => {
      // Save the current query as a recent search
      // Note: We need access to the current query from context
      // This will be handled by the context in onInit
    },
  };
};
