import React, { useState, useRef, useMemo, useCallback } from 'react';
import { CommandContext } from './CommandContext';
import { cn } from '../../lib/utils';
import { useCommandNavigation } from '../../hooks/useCommandNavigation';
import { useCommandSearch } from '../../hooks/useCommandSearch';

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Label for accessibility (aria-label) */
    label?: string;
    /** Whether to loop navigation when reaching the end of the list */
    loop?: boolean;
    /** Custom filter function */
    filter?: (value: string, search: string, keywords?: string[]) => number;
    /** Controlled value (active item) */
    value?: string;
    /** Event handler for value change */
    onValueChange?: (value: string) => void;
    /** Should filtering be disabled? (e.g. for external filtering) */
    shouldFilter?: boolean;
    /** Controlled search query */
    search?: string;
    /** Event handler for search query change */
    onSearchChange?: (search: string) => void;
    /** Event handler for ESC key press */
    onEscape?: () => void;
    /** Whether to trim the search query before filtering (default: true) */
    shouldTrim?: boolean;
}

export function Command({
    children,
    className,
    label,
    loop = true,
    filter,
    value: controlledValue,
    onValueChange,
    search: controlledSearch,
    onSearchChange,
    shouldFilter = true,
    shouldTrim = true,
    onKeyDown,
    onEscape,
    ...props
}: CommandProps) {
    const [internalQuery, setInternalQuery] = useState('');
    const query = controlledSearch !== undefined ? controlledSearch : internalQuery;

    const setQuery = useCallback((q: string) => {
        if (controlledSearch === undefined) {
            setInternalQuery(q);
        }
        onSearchChange?.(q);
    }, [controlledSearch, onSearchChange]);

    const [activeValue, setActiveValueState] = useState<string | undefined>(controlledValue);
    const [activeItemId, setActiveItemId] = useState<string | undefined>();
    const listId = React.useId();
    const itemsRef = useRef<Map<string, { value: string; keywords?: string[]; ref: React.RefObject<HTMLElement | null> }>>(new Map());

    // Handle controlled vs uncontrolled active value
    const activeValueFinal = controlledValue !== undefined ? controlledValue : activeValue;
    const setActiveValueCallback = useCallback((val: string | undefined) => {
        setActiveValueState(val);
        onValueChange?.(val || '');
    }, [onValueChange]);

    const [itemsVersion, setItemsVersion] = useState(0);

    // Context Actions
    const registerItem = useCallback((id: string, value: string, ref: React.RefObject<HTMLElement | null>, keywords?: string[]) => {
        itemsRef.current.set(id, { value, ref, keywords });
        setItemsVersion(v => v + 1);
    }, []);

    const unregisterItem = useCallback((id: string) => {
        itemsRef.current.delete(id);
        setItemsVersion(v => v + 1);
        if (activeItemId === id) setActiveItemId(undefined);
    }, [activeItemId]);

    // Search Logic
    const { ids: filteredIds, duration: filterDuration } = useCommandSearch({
        query,
        items: itemsRef.current,
        shouldFilter,
        filter,
        version: itemsVersion,
        shouldTrim
    });

    // Navigation Logic
    const { onKeyDown: handleKeyDown } = useCommandNavigation({
        items: itemsRef.current,
        activeValue: activeValueFinal,
        setActiveValue: setActiveValueCallback,
        onEscape,
    });

    // Construct Context Value
    const contextValue = useMemo(() => ({
        query,
        setQuery,
        activeValue: activeValueFinal,
        setActiveValue: setActiveValueCallback,
        activeItemId,
        setActiveItemId,
        listId,
        items: itemsRef.current,
        registerItem,
        unregisterItem,
        filteredIds,
        isFiltering: shouldFilter && query.length > 0,
        filterDuration,
    }), [query, activeValueFinal, setActiveValueCallback, activeItemId, listId, registerItem, unregisterItem, filteredIds, shouldFilter, filterDuration]);

    return (
        <CommandContext.Provider value={contextValue}>
            <div
                className={cn(
                    "flex h-full w-full flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground will-change-transform",
                    className
                )}
                cmdk-root=""
                onKeyDown={(e) => {
                    handleKeyDown(e);
                    onKeyDown?.(e);
                }}
                aria-label={label}
                {...props}
            >
                {children}
            </div>
        </CommandContext.Provider>
    );
}
