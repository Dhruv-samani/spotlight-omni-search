import { ReactNode } from 'react';
import { SpotlightPlugin } from '../types/plugin';
import { SpotlightItem } from '../types';

export interface BookmarksOptions {
  /**
   * Maximum number of bookmarks to store
   * @default 20
   */
  maxBookmarks?: number;
  /**
   * Show bookmarks at the top of results
   * @default true
   */
  showAtTop?: boolean;
  /**
   * Keyboard shortcut to bookmark current item
   * @default 'Ctrl+B' or 'Cmd+B'
   */
  bookmarkKey?: string;
  /**
   * Custom storage key for localStorage
   * @default 'spotlight-bookmarks'
   */
  storageKey?: string;
  /**
   * Custom icon for bookmarked items
   */
  bookmarkIcon?: ReactNode;
  /**
   * Enable obfuscation for privacy
   * @default true
   */
  enableObfuscation?: boolean;
}

interface BookmarkedItem {
  itemId: string;
  label: string;
  description?: string;
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

export const BookmarksPlugin = (options: BookmarksOptions = {}): SpotlightPlugin => {
  const {
    maxBookmarks = 20,
    showAtTop = true,
    storageKey = 'spotlight-bookmarks',
    bookmarkIcon,
    enableObfuscation = true,
  } = options;

  let bookmarks: BookmarkedItem[] = [];
  let bookmarkedIds = new Set<string>();

  // Load bookmarks from storage
  const loadBookmarks = (): BookmarkedItem[] => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return [];
      
      const data = enableObfuscation ? deobfuscate(stored) : stored;
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

  // Save bookmarks to storage
  const saveBookmarks = (items: BookmarkedItem[]) => {
    try {
      const data = JSON.stringify(items);
      const toStore = enableObfuscation ? obfuscate(data) : data;
      localStorage.setItem(storageKey, toStore);
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  };

  // Add a bookmark
  const addBookmark = (item: SpotlightItem) => {
    if (bookmarkedIds.has(item.id)) return;

    const bookmark: BookmarkedItem = {
      itemId: item.id,
      label: item.label,
      description: item.description,
      timestamp: Date.now(),
    };

    bookmarks = [bookmark, ...bookmarks].slice(0, maxBookmarks);
    bookmarkedIds.add(item.id);
    saveBookmarks(bookmarks);
  };

  // Remove a bookmark
  const removeBookmark = (itemId: string) => {
    bookmarks = bookmarks.filter(b => b.itemId !== itemId);
    bookmarkedIds.delete(itemId);
    saveBookmarks(bookmarks);
  };

  // Toggle bookmark
  const toggleBookmark = (item: SpotlightItem) => {
    if (bookmarkedIds.has(item.id)) {
      removeBookmark(item.id);
    } else {
      addBookmark(item);
    }
  };

  // Clear all bookmarks
  const clearBookmarks = () => {
    bookmarks = [];
    bookmarkedIds.clear();
    localStorage.removeItem(storageKey);
  };

  return {
    name: 'spotlight-bookmarks',
    version: '1.0.0',

    onInit: () => {
      bookmarks = loadBookmarks();
      bookmarkedIds = new Set(bookmarks.map(b => b.itemId));
    },

    onBeforeSearch: (query, items) => {
      // Add bookmark management commands
      const bookmarkCommands: SpotlightItem[] = [];

      if (bookmarks.length > 0) {
        // Add "Manage Bookmarks" command
        bookmarkCommands.push({
          id: 'manage-bookmarks',
          label: 'Manage Bookmarks',
          description: `View and manage ${bookmarks.length} bookmark${bookmarks.length === 1 ? '' : 's'}`,
          type: 'action',
          group: 'Bookmarks',
          keywords: ['bookmarks', 'favorites', 'starred'],
          action: () => {
            console.log('Manage bookmarks - show modal or navigate');
          },
        });

        // Add "Clear All Bookmarks" command
        bookmarkCommands.push({
          id: 'clear-bookmarks',
          label: 'Clear All Bookmarks',
          description: `Remove ${bookmarks.length} bookmark${bookmarks.length === 1 ? '' : 's'}`,
          type: 'action',
          group: 'Bookmarks',
          keywords: ['clear', 'delete', 'remove', 'bookmarks'],
          confirm: {
            title: 'Clear All Bookmarks?',
            message: `This will remove all ${bookmarks.length} bookmarks. This action cannot be undone.`,
            type: 'warning',
          },
          action: clearBookmarks,
        });
      }

      // If showing at top and query is empty, show bookmarked items
      if (showAtTop && !query.trim() && bookmarks.length > 0) {
        // Find the actual items from the items list
        const bookmarkedItems = items.filter(item => bookmarkedIds.has(item.id));
        
        // Mark them as bookmarked (add visual indicator)
        const markedItems = bookmarkedItems.map(item => ({
          ...item,
          group: 'Bookmarks',
          ...(bookmarkIcon && { icon: bookmarkIcon }),
        }));

        // Remove bookmarked items from main list to avoid duplicates
        const nonBookmarkedItems = items.filter(item => !bookmarkedIds.has(item.id));

        return [...markedItems, ...bookmarkCommands, ...nonBookmarkedItems];
      }

      // Add bookmark commands to the end
      return [...items, ...bookmarkCommands];
    },

    onSelect: (item) => {
      // Check if this is a bookmark toggle action
      // This would require keyboard shortcut handling in the main component
      return true; // Allow default action
    },
  };
};

/**
 * Export utility function to check if an item is bookmarked
 */
export const isBookmarked = (itemId: string, storageKey = 'spotlight-bookmarks'): boolean => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return false;
    
    const data = JSON.parse(decodeURIComponent(atob(stored)));
    return data.some((b: BookmarkedItem) => b.itemId === itemId);
  } catch {
    return false;
  }
};
