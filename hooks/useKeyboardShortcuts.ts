import { useEffect, useCallback } from 'react';

export interface KeyboardShortcuts {
  up?: string[];
  down?: string[];
  select?: string[];
  close?: string[];
  clear?: string[];
  nextGroup?: string[];
  prevGroup?: string[];
}

export interface UseKeyboardShortcutsProps {
  enabled?: boolean;
  shortcuts?: KeyboardShortcuts;
  enableVim?: boolean;
  enableNumberJump?: boolean;
  onEscapeBehavior?: 'close' | 'clear' | 'custom';
  onEscapeCustom?: () => void;
  // Actions
  onUp?: () => void;
  onDown?: () => void;
  onPageUp?: () => void;
  onPageDown?: () => void;
  onSelect?: () => void;
  onClose?: () => void;
  onClear?: () => void;
  onNextGroup?: () => void;
  onPrevGroup?: () => void;
  onNumberJump?: (number: number) => void;
}

const DEFAULT_SHORTCUTS: KeyboardShortcuts = {
  up: ['ArrowUp'],
  down: ['ArrowDown'],
  select: ['Enter'],
  close: ['Escape'],
  clear: ['Escape'],
  nextGroup: ['Tab'],
  prevGroup: ['Shift+Tab'],
};

/**
 * Hook to handle advanced keyboard navigation
 */
export function useKeyboardShortcuts({
  enabled = true,
  shortcuts = {},
  enableVim = false,
  enableNumberJump = false,
  onEscapeBehavior = 'close',
  onEscapeCustom,
  onUp,
  onDown,
  onPageUp,
  onPageDown,
  onSelect,
  onClose,
  onClear,
  onNextGroup,
  onPrevGroup,
  onNumberJump,
}: UseKeyboardShortcutsProps) {

  const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    if (!enabled) return;

    const { key, ctrlKey, metaKey, shiftKey, altKey } = e;
    const isInput = (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA';

    // Helper to check if a key matches configuration
    const matches = (actionKeys?: string[]) => {
      const config = { ...DEFAULT_SHORTCUTS, ...shortcuts };
      const targets = actionKeys || [];
      
      // Also check config if passed directly (e.g. from defaults)
      // Actually we merge defaults above.
      
      return targets.some(target => {
        const parts = target.split('+');
        const targetKey = parts.pop();
        const modifiers = parts;
        
        if (targetKey?.toLowerCase() !== key.toLowerCase()) return false;
        
        const hasShift = modifiers.includes('Shift');
        const hasCtrl = modifiers.includes('Ctrl');
        const hasAlt = modifiers.includes('Alt');
        const hasMeta = modifiers.includes('Meta') || modifiers.includes('Cmd'); // treat Meta/Cmd same
        
        return shiftKey === hasShift && 
               ctrlKey === hasCtrl && 
               altKey === hasAlt && 
               metaKey === hasMeta;
      });
    };

    // Combined shortcuts
    const activeShortcuts = { ...DEFAULT_SHORTCUTS, ...shortcuts };

    // Vim Navigation (only if not holding modifiers usually, and not typing in input? 
    // Wait, spotlight input is always focused. Vim keys interfere with typing.
    // Vim nav usually requires Ctrl/Alt or specific mode. 
    // User requirement: "Vim-style navigation (j/k)".
    // Implementation: If input is focused but empty? Or if modifier used? 
    // Standard command palette: Ctrl+N/P or Arrow keys. J/K usually only if not focusing an input.
    // BUT Spotlight has an input. 
    // Compromise: Ctrl+J / Ctrl+K? Or just J/K if query starts with specific char? 
    // Actually, widespread practice: If `enableVim` is true, J/K navigate ONLY IF input uses a different mode or if Ctrl/Cmd is held?
    // Let's implement Ctrl+J/K for "Vim-style" in a text input context to avoid typing collision.
    // OR: Check if query is empty? If query is non-empty, J/K are letters.
    // Let's stick to Ctrl+J/Ctrl+K or standard Vim behavior if explicitly requested.
    // User requested "Vim-style navigation (j/k)". 
    // I will use Ctrl+J (down) and Ctrl+K (up) to be safe in an input field.
    
    if (enableVim) {
        if ((key === 'j' && ctrlKey) || (key === 'n' && ctrlKey)) {
            e.preventDefault();
            onDown?.();
            return;
        }
        if ((key === 'k' && ctrlKey) || (key === 'p' && ctrlKey)) {
            e.preventDefault();
            onUp?.();
            return;
        }
    }

    // Standard Navigation
    if (matches(activeShortcuts.up)) {
      e.preventDefault();
      onUp?.();
      return;
    }
    if (matches(activeShortcuts.down)) {
      e.preventDefault();
      onDown?.();
      return;
    }
    
    // Page Up/Down
    if (key === 'PageUp') {
      e.preventDefault();
      onPageUp?.();
      return;
    }
    if (key === 'PageDown') {
      e.preventDefault();
      onPageDown?.();
      return;
    }

    // Select
    if (matches(activeShortcuts.select)) {
      e.preventDefault();
      onSelect?.();
      return;
    }

    // Escape Handling
    if (matches(activeShortcuts.close)) { // Escape defaults to close
      if (onEscapeBehavior === 'custom' && onEscapeCustom) {
        onEscapeCustom();
      } else if (onEscapeBehavior === 'clear') {
        // Only clear if handled by parent
        onClear?.();
      } else {
        onClose?.();
      }
      return;
    }

    // Group Navigation
    if (matches(activeShortcuts.nextGroup)) { // Tab
      e.preventDefault(); // Prevent focus loss
      onNextGroup?.();
      return;
    }
    if (matches(activeShortcuts.prevGroup)) { // Shift+Tab
      e.preventDefault();
      onPrevGroup?.();
      return;
    }

    // Number Jump (1-9) with Alt or Ctrl to avoid typing numbers
    // Or if enableNumberJump is true, assume Ctrl+Number
    if (enableNumberJump) {
       // Check for digits 1-9
       if (/^[1-9]$/.test(key) && (ctrlKey || altKey)) {
           e.preventDefault();
           onNumberJump?.(parseInt(key, 10));
           return;
       }
    }

  }, [enabled, shortcuts, enableVim, enableNumberJump, onEscapeBehavior, onEscapeCustom, onUp, onDown, onPageUp, onPageDown, onSelect, onClose, onClear, onNextGroup, onPrevGroup, onNumberJump]);

  return { handleKeyDown };
}
