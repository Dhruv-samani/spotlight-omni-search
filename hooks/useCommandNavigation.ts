import { useEffect, RefObject } from 'react';

interface UseCommandNavigationProps {
  items: Map<string, { value: string; ref: RefObject<HTMLElement | null> }>;
  activeValue: string | undefined;
  setActiveValue: (value: string | undefined) => void;
  containerRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
}

export function useCommandNavigation({
  items,
  activeValue,
  setActiveValue,
  containerRef,
  onEscape
}: UseCommandNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Create an array of enabled items
      // Note: In a real implementation, we should sort these by DOM order
      // For now, Map iteration order is insertion order, which usually matches render order if keys are stable.
      // A more robust way is to querySelectorAll('[cmdk-item]') and match with our map.
      
      const domItems = document.querySelectorAll('[cmdk-item]:not([aria-disabled="true"])');
      if (domItems.length === 0) return;

      const itemsArray = Array.from(domItems).map(node => node.getAttribute('data-value')).filter(Boolean) as string[];
      
      if (itemsArray.length === 0) return;

      const currentIndex = activeValue ? itemsArray.indexOf(activeValue) : -1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex + 1;
        if (nextIndex < itemsArray.length) {
          setActiveValue(itemsArray[nextIndex]);
        } else {
             // Loop
             setActiveValue(itemsArray[0]); 
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          setActiveValue(itemsArray[prevIndex]);
        } else {
             // Loop
             setActiveValue(itemsArray[itemsArray.length - 1]);
        }
      } else if (e.key === 'Enter') {
        // Selection is handled by the item's onClick or a global listener
        // We'll let the user handle Enter via onSelect in Item or onValueChange in Root
         if (activeValue) {
            e.preventDefault();
            const activeNode = document.querySelector(`[data-value="${CSS.escape(activeValue)}"]`) as HTMLElement;
            activeNode?.click();
         }
      }
    };

    // Attach to window or a specific container? 
    // Usually Command dialogs capture global keys when open, or just local input keys.
    // Cmdk attaches to the container `onKeyDown`.
    // We should attach to the container ref if provided, or document if not.
    // For this hook, let's assume it's called inside the component rendering the input.
    
    // Actually, best practice: passed event handler to the Root div.
    // We will export a function to be called by the `onKeyDown` prop of the Root.
    
    return () => {
      // cleanup
    };
  }, [items, activeValue, setActiveValue]);

  // Return a handler to be passed to onKeyDown
  const onKeyDown = (e: React.KeyboardEvent) => {
     const domItems = document.querySelectorAll('[cmdk-item]:not([data-disabled="true"]):not([aria-disabled="true"])');
      if (domItems.length === 0) return;

      const itemsArray = Array.from(domItems).map(node => node.getAttribute('data-value')).filter(Boolean) as string[];
      
      if (itemsArray.length === 0) return;

      const currentIndex = activeValue ? itemsArray.indexOf(activeValue) : -1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex + 1;
        if (nextIndex < itemsArray.length) {
          setActiveValue(itemsArray[nextIndex]);
          // Scroll the newly selected item into view
          setTimeout(() => {
            const nextNode = document.querySelector(`[cmdk-item][data-value="${CSS.escape(itemsArray[nextIndex])}"]`);
            nextNode?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 0);
        } else {
             setActiveValue(itemsArray[0]); 
             // Scroll back to top
             setTimeout(() => {
               const firstNode = document.querySelector(`[cmdk-item][data-value="${CSS.escape(itemsArray[0])}"]`);
               firstNode?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
             }, 0);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          setActiveValue(itemsArray[prevIndex]);
          // Scroll the newly selected item into view
          setTimeout(() => {
            const prevNode = document.querySelector(`[cmdk-item][data-value="${CSS.escape(itemsArray[prevIndex])}"]`);
            prevNode?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 0);
        } else {
             setActiveValue(itemsArray[itemsArray.length - 1]);
             // Scroll to bottom
             setTimeout(() => {
               const lastNode = document.querySelector(`[cmdk-item][data-value="${CSS.escape(itemsArray[itemsArray.length - 1])}"]`);
               lastNode?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
             }, 0);
        }
      } else if (e.key === 'Enter') {
         if (activeValue) {
            e.preventDefault();
            // Trigger click on the active item
            // We need to find the specific element. 
            // Since we know the value, let's query it.
            // Note: value might not be unique in some edge cases, ID is better.
            const activeNode = document.querySelector(`[cmdk-item][data-value="${CSS.escape(activeValue)}"]`) as HTMLElement;
            if (activeNode) {
                activeNode.click();
            }
         }
      } else if (e.key === 'Escape') {
         e.preventDefault();
         onEscape?.();
      }
  };

  return { onKeyDown };
}
