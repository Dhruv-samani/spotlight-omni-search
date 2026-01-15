import { SpotlightItem } from '../types';
import { 
  Moon, 
  Sun, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Printer, 
  RotateCw 
} from 'lucide-react';

export interface ThemeActionsOptions {
  /**
   * Callback when theme is toggled
   */
  onToggle?: (theme: 'light' | 'dark') => void;
  /**
   * Current theme (to show correct icon)
   */
  currentTheme?: 'light' | 'dark';
}

/**
 * Creates theme toggle actions
 */
export function createThemeActions(options: ThemeActionsOptions = {}): SpotlightItem[] {
  const { onToggle, currentTheme = 'light' } = options;

  return [
    {
      id: 'action-theme-toggle',
      label: currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode',
      description: 'Toggle between light and dark theme',
      icon: currentTheme === 'light' ? Moon({ size: 20 }) : Sun({ size: 20 }),
      type: 'action',
      group: 'Theme',
      keywords: ['theme', 'dark', 'light', 'mode'],
      action: () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        onToggle?.(newTheme);
      },
    },
  ];
}

/**
 * Creates browser navigation actions
 */
export function createNavigationActions(): SpotlightItem[] {
  return [
    {
      id: 'action-nav-back',
      label: 'Go Back',
      description: 'Navigate to previous page',
      icon: ArrowLeft({ size: 20 }),
      type: 'action',
      group: 'Navigation',
      keywords: ['back', 'previous', 'history'],
      action: () => window.history.back(),
    },
    {
      id: 'action-nav-forward',
      label: 'Go Forward',
      description: 'Navigate to next page',
      icon: ArrowRight({ size: 20 }),
      type: 'action',
      group: 'Navigation',
      keywords: ['forward', 'next', 'history'],
      action: () => window.history.forward(),
    },
  ];
}

/**
 * Creates scroll actions
 */
export function createScrollActions(): SpotlightItem[] {
  return [
    {
      id: 'action-scroll-top',
      label: 'Scroll to Top',
      description: 'Scroll to the top of the page',
      icon: ArrowUp({ size: 20 }),
      type: 'action',
      group: 'Navigation',
      keywords: ['scroll', 'top', 'up'],
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
    {
      id: 'action-scroll-bottom',
      label: 'Scroll to Bottom',
      description: 'Scroll to the bottom of the page',
      icon: ArrowDown({ size: 20 }),
      type: 'action',
      group: 'Navigation',
      keywords: ['scroll', 'bottom', 'down'],
      action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
    },
  ];
}

/**
 * Creates utility actions
 */
export function createUtilityActions(): SpotlightItem[] {
  return [
    {
      id: 'action-copy-url',
      label: 'Copy Current URL',
      description: 'Copy the current page URL to clipboard',
      icon: Copy({ size: 20 }),
      type: 'action',
      group: 'Utilities',
      keywords: ['copy', 'url', 'link', 'clipboard'],
      action: async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
        } catch (error) {
          console.error('Failed to copy URL:', error);
        }
      },
    },
    {
      id: 'action-print',
      label: 'Print Page',
      description: 'Print the current page',
      icon: Printer({ size: 20 }),
      type: 'action',
      group: 'Utilities',
      keywords: ['print', 'pdf'],
      action: () => window.print(),
    },
    {
      id: 'action-reload',
      label: 'Reload Page',
      description: 'Reload the current page',
      icon: RotateCw({ size: 20 }),
      type: 'action',
      group: 'Utilities',
      keywords: ['reload', 'refresh', 'restart'],
      action: () => window.location.reload(),
    },
  ];
}

/**
 * Creates all common actions
 */
export function createCommonActions(themeOptions?: ThemeActionsOptions): SpotlightItem[] {
  return [
    ...createThemeActions(themeOptions),
    ...createNavigationActions(),
    ...createScrollActions(),
    ...createUtilityActions(),
  ];
}
