import { useState, useEffect, useCallback } from 'react';
import { spotlightStorage } from '../lib/storage';

export interface SearchHistoryOptions {
  enabled?: boolean;
  maxItems?: number;
  storageKey?: string;
}

export interface SearchHistoryResult {
  history: string[];
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  getSuggestions: (query: string) => string[];
}

/**
 * Hook to manage search history in localStorage
 */
export function useSearchHistory(options: SearchHistoryOptions = {}): SearchHistoryResult {
  const {
    enabled = true,
    maxItems = 20,
    storageKey = 'spotlight-search-history',
  } = options;

  const [history, setHistory] = useState<string[]>(() => {
    if (!enabled || typeof window === 'undefined') {
      return [];
    }

    try {
      return spotlightStorage.getItem<string[]>(storageKey) || [];
    } catch (error) {
      return [];
    }
  });

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    try {
      spotlightStorage.setItem(storageKey, history);
    } catch (error) {
    }
  }, [history, enabled, storageKey]);

  const addToHistory = useCallback((query: string) => {
    if (!enabled || !query.trim()) return;

    setHistory((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter((item) => item !== query);
      
      // Add to beginning
      const updated = [query, ...filtered];
      
      // Limit size
      return updated.slice(0, maxItems);
    });
  }, [enabled, maxItems]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    
    if (typeof window !== 'undefined') {
      try {
        spotlightStorage.removeItem(storageKey);
      } catch (error) {
      }
    }
  }, [storageKey]);

  const getSuggestions = useCallback((query: string): string[] => {
    if (!enabled || !query.trim()) return [];

    const queryLower = query.toLowerCase();
    
    return history
      .filter((item) => item.toLowerCase().includes(queryLower) && item !== query)
      .slice(0, 5); // Return top 5 suggestions
  }, [history, enabled]);

  return {
    history,
    addToHistory,
    clearHistory,
    getSuggestions,
  };
}
