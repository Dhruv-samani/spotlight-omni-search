import { SpotlightItem } from '../types';
import { SpotlightPlugin, PluginContext } from '../types/plugin';

interface NestedPluginOptions {
    /**
     * Key to use for escaping back to parent (default: 'Backspace')
     */
    backKey?: 'Backspace' | 'Escape';
}

export const NestedCommandsPlugin = (options: NestedPluginOptions = {}): SpotlightPlugin => {
    // Internal State
    let context: PluginContext | null = null;
    let stack: SpotlightItem[] = [];
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!context) return;
        
        const backKey = options.backKey || 'Backspace';

        // Go back if stack is not empty and back key is pressed
        // For Backspace, only go back if query is empty (to allow deleting text)
        if (e.key === backKey && stack.length > 0) {
            if (backKey === 'Backspace' && context.query.length > 0) {
                return; // Allow deleting text
            }

            e.preventDefault();
            e.stopPropagation();
            
            // Pop stack
            stack.pop();
            
            // Force re-render/search update by clearing query (or triggering update)
            // Ideally we'd trigger a re-filter without changing query, but 
            // setQuery('') is the easiest way to reset the view for the previous level
            context.setQuery('');
        }
    };

    return {
        name: 'spotlight-nested',
        version: '1.0.0',

        onInit: (ctx) => {
            context = ctx;
            if (typeof window !== 'undefined') {
                // We attach to window/document keydown to capture back actions
                // BUT Spotlight might handle events first. 
                // ideally we attach to the input, but we don't have ref access here directly.
                // Window capture phase is robust enough for now if checking isOpen.
                window.addEventListener('keydown', handleKeyDown, true);
            }
        },

        onBeforeSearch: (query, items) => {
            // Logic:
            // 1. If stack is empty, return regular items.
            // 2. If stack has items, the 'source' items are the children of the last item in stack.
            
            if (stack.length > 0) {
                const parent = stack[stack.length - 1];
                // Return children. 
                // Note: We ignore the original 'items' passed in (root items) 
                // effectively "zooming in" to this branch.
                return parent.items || [];
            }
            
            return items;
        },

        onSelect: (item) => {
            if (item.items && item.items.length > 0) {
                // Navigate Down
                stack.push(item);
                
                // Clear query to show all children immediately
                context?.setQuery(''); 
                
                return false; // Prevent default (closing)
            }
            return true; // Execute leaf
        },

        onClose: () => {
            // Reset stack when closed so next open is fresh
            stack = [];
        },

        onDestroy: () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('keydown', handleKeyDown, true);
            }
        }
    };
};
