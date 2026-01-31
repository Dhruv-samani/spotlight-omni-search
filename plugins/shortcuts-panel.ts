import { ReactNode } from 'react';
import { SpotlightPlugin } from '../types/plugin';
import { SpotlightItem } from '../types';
import { ScoredItem } from '../lib/fuzzySearch';

export interface ShortcutsPanelOptions {
  /**
   * Key to trigger the shortcuts panel
   * @default '?'
   */
  triggerKey?: string;
  /**
   * Custom shortcuts to display
   */
  customShortcuts?: KeyboardShortcut[];
  /**
   * Show default Spotlight shortcuts
   * @default true
   */
  showDefaultShortcuts?: boolean;
  /**
   * Custom icon for shortcuts panel command
   */
  icon?: ReactNode;
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  category?: string;
}

const defaultShortcuts: KeyboardShortcut[] = [
  { key: '⌘K / Ctrl+K', description: 'Open Spotlight', category: 'General' },
  { key: 'Esc', description: 'Close Spotlight', category: 'General' },
  { key: '↑ / ↓', description: 'Navigate results', category: 'Navigation' },
  { key: 'Enter', description: 'Select item', category: 'Navigation' },
  { key: 'Tab', description: 'Next group', category: 'Navigation' },
  { key: 'Shift+Tab', description: 'Previous group', category: 'Navigation' },
  { key: 'Ctrl+N / Ctrl+P', description: 'Next/Previous item', category: 'Navigation' },
  { key: '1-9', description: 'Quick select (if enabled)', category: 'Quick Actions' },
  { key: 'Ctrl+R', description: 'Toggle regex search', category: 'Search' },
  { key: 'Ctrl+G', description: 'Filter by group', category: 'Search' },
  { key: '?', description: 'Show keyboard shortcuts', category: 'Help' },
];

export const ShortcutsPanelPlugin = (options: ShortcutsPanelOptions = {}): SpotlightPlugin => {
  const {
    triggerKey = '?',
    customShortcuts = [],
    showDefaultShortcuts = true,
    icon,
  } = options;

  const allShortcuts = [
    ...(showDefaultShortcuts ? defaultShortcuts : []),
    ...customShortcuts,
  ];

  // Group shortcuts by category
  const groupedShortcuts = allShortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  // Store the last query and shortcuts
  let lastQuery = '';
  let lastShortcuts: SpotlightItem[] | null = null;
  let pluginContext: import('../types/plugin').PluginContext | null = null;

  return {
    name: 'spotlight-shortcuts-panel',
    version: '1.0.0',

    onInit: (context) => {
      pluginContext = context;
    },

    onBeforeSearch: (query, items) => {
      
      // Store query
      lastQuery = query;
      
      // Check if user typed the trigger key
      if (query.trim() === triggerKey) {
        
        // Generate shortcuts
        const shortcutItems: SpotlightItem[] = [];
        
        Object.entries(groupedShortcuts).forEach(([category, shortcuts]) => {
          shortcuts.forEach((shortcut, index) => {
            shortcutItems.push({
              id: `shortcut-${category}-${index}`,
              label: shortcut.key,
              description: shortcut.description,
              type: 'info',
              group: category,
              // No action - these are informational only
            });
          });
        });

        lastShortcuts = shortcutItems;
        
        // Return empty items - we'll add shortcuts in onAfterSearch
        return [];
      }

      // Reset shortcuts if not trigger
      lastShortcuts = null;

      // Add "Keyboard Shortcuts" command to normal search
      const shortcutsCommand: SpotlightItem = {
        id: 'show-keyboard-shortcuts',
        label: 'Keyboard Shortcuts',
        description: `Press ${triggerKey} to view all keyboard shortcuts`,
        type: 'action',
        group: 'Help',
        keywords: ['shortcuts', 'keys', 'help', 'commands', 'hotkeys'],
        shortcut: triggerKey,
        ...(icon && { icon }),
        action: () => {
          // Set query to trigger key to show shortcuts
          if (pluginContext) {
            pluginContext.setQuery(triggerKey);
          }
        },
      };

      return [shortcutsCommand, ...items];
    },

    onAfterSearch: (results) => {
      // If we have shortcuts to show, return them instead of search results
      if (lastShortcuts && lastShortcuts.length > 0) {
        
        // Convert to ScoredItem format
        const scoredShortcuts: ScoredItem[] = lastShortcuts.map(item => ({
          item,
          score: 1000,
          matches: []
        }));
        
        return scoredShortcuts;
      }
      
      return results;
    },

    renderAfterList: () => {
      // This could render a modal when triggered
      // For now, we'll just add the command to the list
      return null;
    },
  };
};

/**
 * Export utility to get all shortcuts
 */
export const getKeyboardShortcuts = (includeDefaults = true, custom: KeyboardShortcut[] = []): KeyboardShortcut[] => {
  return [
    ...(includeDefaults ? defaultShortcuts : []),
    ...custom,
  ];
};
