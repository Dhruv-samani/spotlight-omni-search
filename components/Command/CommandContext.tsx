import { createContext, useContext, RefObject } from 'react';

export type CommandState = {
    /** The current search query */
    query: string;
    /** The value of the currently selected item (keyboard focus) */
    activeValue: string | undefined; // Using value as ID is common in cmdk, allows simpler API
    /** Map of registered items: id -> metadata */
    items: Map<string, { value: string; keywords?: string[]; ref: RefObject<HTMLElement | null> }>;
    /** Set of IDs that match the current filter. Null implies all items match (no filter). */
    filteredIds: Set<string> | null;
    /** Whether the list is currently filtering */
    isFiltering: boolean;
    /** Duration of the last filter operation in ms */
    filterDuration?: number;
    /** Stable ID for the listbox element for accessibility linking */
    listId?: string;
    /** The DOM ID of the currently active item for aria-activedescendant */
    activeItemId?: string;
};

export type CommandActions = {
    setQuery: (query: string) => void;
    setActiveValue: (value: string | undefined) => void;
    setActiveItemId: (id: string | undefined) => void;
    registerItem: (id: string, value: string, ref: RefObject<HTMLElement | null>, keywords?: string[]) => void;
    unregisterItem: (id: string) => void;
};

// Create the context
export const CommandContext = createContext<(CommandState & CommandActions) | null>(null);

// Hook for consuming the context
export const useCommand = () => {
    const context = useContext(CommandContext);
    if (!context) {
        throw new Error('useCommand must be used within a <Command /> provider');
    }
    return context;
};

// Helper hook to access specific state slices (optimization)
export const useCommandState = () => {
    const context = useContext(CommandContext);
    if (!context) {
        throw new Error('useCommandState must be used within a <Command /> provider');
    }
    return {
        query: context.query,
        activeValue: context.activeValue,
        isFiltering: context.isFiltering,
    };
};
