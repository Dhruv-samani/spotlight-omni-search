import { useState, useEffect, useCallback } from 'react';

export interface UseSpotlightOptions {
  /**
   * Initial open state
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Keyboard shortcut to toggle spotlight
   * Format: 'cmd+k', 'ctrl+shift+p', etc.
   * @default 'cmd+k' (Mac) / 'ctrl+k' (Windows/Linux)
   */
  shortcut?: string;
  /**
   * Enable keyboard shortcut
   * @default true
   */
  enableShortcut?: boolean;
}

export interface UseSpotlightReturn {
  /**
   * Current open state
   */
  isOpen: boolean;
  /**
   * Open the spotlight
   */
  open: () => void;
  /**
   * Close the spotlight
   */
  close: () => void;
  /**
   * Toggle the spotlight open/closed
   */
  toggle: () => void;
}

/**
 * Hook to manage Spotlight state and keyboard shortcuts
 * 
 * @example
 * ```tsx
 * const { isOpen, open, close, toggle } = useSpotlight();
 * 
 * return <Spotlight isOpen={isOpen} onClose={close} ... />;
 * ```
 */
export function useSpotlight(options: UseSpotlightOptions = {}): UseSpotlightReturn {
  const {
    defaultOpen = false,
    shortcut = 'cmd+k',
    enableShortcut = true,
  } = options;

  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!enableShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Parse shortcut string
      const parts = shortcut.toLowerCase().split('+');
      const key = parts[parts.length - 1];
      const needsCmd = parts.includes('cmd') || parts.includes('meta');
      const needsCtrl = parts.includes('ctrl');
      const needsShift = parts.includes('shift');
      const needsAlt = parts.includes('alt');

      // Check if all modifiers match
      const cmdMatch = needsCmd ? (e.metaKey || e.ctrlKey) : !e.metaKey;
      const ctrlMatch = needsCtrl ? e.ctrlKey : true;
      const shiftMatch = needsShift ? e.shiftKey : !e.shiftKey;
      const altMatch = needsAlt ? e.altKey : !e.altKey;
      const keyMatch = e.key.toLowerCase() === key;

      // For default 'cmd+k', handle both Mac (metaKey) and Windows (ctrlKey)
      if (shortcut === 'cmd+k') {
        if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
          e.preventDefault();
          toggle();
        }
      } else if (cmdMatch && ctrlMatch && shiftMatch && altMatch && keyMatch) {
        e.preventDefault();
        toggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableShortcut, shortcut, toggle]);

  return { isOpen, open, close, toggle };
}
