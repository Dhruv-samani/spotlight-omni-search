import { useEffect, useRef, useCallback } from 'react';

// Screen Reader Announcement
export function announceToScreenReader(message: string, politeness: 'polite' | 'assertive' = 'polite') {
  const announcer = document.getElementById('spotlight-announcer');
  if (announcer) {
    announcer.setAttribute('aria-live', 'off'); // Toggle to force read
    announcer.setAttribute('aria-live', politeness);
    announcer.textContent = message;
  } else {
    const div = document.createElement('div');
    div.id = 'spotlight-announcer';
    div.setAttribute('aria-live', politeness);
    div.setAttribute('role', 'status');
    div.style.position = 'absolute';
    div.style.width = '1px';
    div.style.height = '1px';
    div.style.padding = '0';
    div.style.overflow = 'hidden';
    div.style.clip = 'rect(0, 0, 0, 0)';
    div.style.whiteSpace = 'nowrap';
    div.style.border = '0';
    div.textContent = message;
    document.body.appendChild(div);
  }
}

// Focus Trap Hook
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Focusable elements selector
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // Save previous active element
    const previousActiveElement = document.activeElement as HTMLElement;

    // Focus the first element (usually the input)
    const focusableElements = container.querySelectorAll(focusableSelectors);
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusables = Array.from(container.querySelectorAll(focusableSelectors));
      const first = focusables[0] as HTMLElement;
      const last = focusables[focusables.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      // Restore focus
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}

// Generate ARIA ID
export function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
