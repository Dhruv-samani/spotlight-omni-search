import React, { useState, useEffect, useRef, useMemo, useCallback, ReactNode } from 'react';
import { Search, X, Regex, Filter } from 'lucide-react';
import { cn } from './lib/utils';
import { SpotlightItem, SpotlightProps } from './types';
import { fuzzyFilter, ScoredItem, regexFilter } from './lib/fuzzySearch';
import { useRecentItems } from './hooks/useRecentItems';
import { useSearchHistory } from './hooks/useSearchHistory';
import { highlightMatches } from './lib/searchHighlight';
import { getUniqueGroups, filterItems } from './lib/searchFilters';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTouchGestures } from './hooks/useTouchGestures';
import { useFocusTrap, announceToScreenReader, generateId } from './lib/accessibility';
import { themes } from './themes';
import { usePluginManager } from './hooks/usePluginManager';
import { useDebounce } from './hooks/useDebounce';

export function Spotlight({
    isOpen,
    onClose,
    items,
    onNavigate,
    searchPlaceholder = 'Search pages, actions, commands...',
    enableRecent = true,
    maxRecentItems = 10,
    isLoading = false,
    renderItem,
    // Keyboard props
    keyboardShortcuts,
    enableVimNavigation = false,
    enableNumberJump = false,
    onEscapeBehavior = 'close',
    onEscapeCustom,
    // Accessibility
    ariaLabel = 'Spotlight Search',
    announceResults = true,
    // Custom Rendering
    renderEmpty,
    renderLoading,
    renderHeader,
    renderFooter,
    renderGroupHeader,
    // Theme
    theme,
    // Layout
    layout = 'center',
    // Responsive
    enableTouchGestures = true,
    // Plugins
    plugins = [],
    // Async Search
    onSearch,
    debounceTime = 300,
    debug = false,
    onEvent,
    onToast,
    enableGoogleSearch = false,
}: SpotlightProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [regexMode, setRegexMode] = useState(false);
    const [activeGroup, setActiveGroup] = useState<string | null>(null);
    const [asyncResults, setAsyncResults] = useState<SpotlightItem[]>([]);
    const [isAsyncLoading, setIsAsyncLoading] = useState(false);

    // New states for Phase 3.2 & 3.3
    const [pendingAction, setPendingAction] = useState<{ item: SpotlightItem; args?: string } | null>(null);
    const [toasts, setToasts] = useState<import('./types').SpotlightToast[]>([]);
    const [undoStack, setUndoStack] = useState<string[]>([]);
    const [redoStack, setRedoStack] = useState<string[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const debouncedQuery = useDebounce(query, debounceTime);
    const searchTimeRef = useRef<number>(0);

    // Event Logging Utility
    const logEvent = useCallback((event: string, data?: any) => {
        onEvent?.(event, data);
    }, [onEvent]);

    // Toast utility
    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const toast = { id: Math.random().toString(36).substr(2, 9), message, type, duration: 3000 };
        if (onToast) {
            onToast(toast);
        } else {
            setToasts(prev => [...prev, toast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast.id));
            }, 3000);
        }
    }, [onToast]);

    // IDs for Accessibility
    const listId = useMemo(() => generateId('spotlight-list'), []);
    const inputId = useMemo(() => generateId('spotlight-input'), []);

    // Recent items tracking
    const { recentItems, addRecentItem } = useRecentItems({
        enabled: enableRecent,
        maxItems: maxRecentItems,
    });

    // Search history tracking
    const { addToHistory, getSuggestions } = useSearchHistory({
        enabled: true,
        maxItems: 20,
    });

    // Plugin Manager
    const {
        runOnBeforeSearch,
        runOnAfterSearch,
        runOnSelect,
        runRenderHeader,
        runRenderBeforeList,
        runRenderAfterList
    } = usePluginManager({
        plugins,
        isOpen,
        query,
        setQuery,
        onClose,
        setIsOpen: (open) => !open && onClose(), // Partial support: Plugins can close, but not open (since controlled)
    });

    // Async Search Effect
    useEffect(() => {
        if (!onSearch || !debouncedQuery.trim()) {
            setAsyncResults([]);
            return;
        }

        let isMounted = true;
        const fetchAsync = async () => {
            setIsAsyncLoading(true);
            try {
                const results = await onSearch(debouncedQuery);
                if (isMounted) {
                    setAsyncResults(results);
                }
            } catch (error) {
                if (isMounted) setAsyncResults([]);
            } finally {
                if (isMounted) setIsAsyncLoading(false);
            }
        };

        fetchAsync();

        return () => {
            isMounted = false;
        };
    }, [debouncedQuery, onSearch]);

    // Filter and Sort items using fuzzy search or regex
    const filteredItems = useMemo(() => {
        const start = performance.now();
        let currentItems = items;

        // Plugin Hook: onBeforeSearch
        currentItems = runOnBeforeSearch(query, currentItems);

        // Apply pre-filters (group/type)
        if (activeGroup) {
            currentItems = filterItems(currentItems, { group: activeGroup });
        }

        if (!query.trim()) {
            // No query - show recent items first, then all items
            if (enableRecent && recentItems.length > 0) {
                // Get recent item IDs
                const recentIds = new Set(recentItems.map(r => r.id));

                // Filter out recent items from main list (respecting active filters)
                const nonRecentItems = currentItems.filter(item => !recentIds.has(item.id));

                // Combine: recent first (if they match filter), then rest sorted by group
                const filteredRecent = activeGroup
                    ? filterItems(recentItems, { group: activeGroup })
                    : recentItems;

                const sortedNonRecent = [...nonRecentItems].sort((a, b) => {
                    const groupA = a.group || 'Other';
                    const groupB = b.group || 'Other';
                    if (groupA === groupB) return 0;
                    return groupA.localeCompare(groupB);
                });
                return [...filteredRecent, ...sortedNonRecent].map(item => ({ item, score: 0, matches: [] }));
            }

            // No recent items - return all items sorted by group
            return [...currentItems].sort((a, b) => {
                const groupA = a.group || 'Other';
                const groupB = b.group || 'Other';
                if (groupA === groupB) return 0;
                return groupA.localeCompare(groupB);
            }).map(item => ({ item, score: 0, matches: [] }));
        }

        // Use Regex or Fuzzy search
        if (regexMode) {
            return regexFilter(currentItems, query);
        }

        const results = fuzzyFilter(currentItems, query);

        let finalResults;
        // Merge with async results
        if (asyncResults.length > 0) {
            // Convert async items to ScoredItem format
            const asyncScored: ScoredItem[] = asyncResults.map(item => ({
                item,
                score: 1, // High score for async results (or should it be lower?)
                matches: [] // We don't have matches for async results easily unless we re-run fuzzy
            }));

            // Deduplicate if needed? using item.id
            const existingIds = new Set(results.map(r => r.item.id));
            const uniqueAsync = asyncScored.filter(r => !existingIds.has(r.item.id));

            finalResults = runOnAfterSearch([...results, ...uniqueAsync]);
        } else {
            finalResults = runOnAfterSearch(results);
        }

        // Built-in Google Search
        if (enableGoogleSearch && query.trim()) {
            const googleItem: ScoredItem = {
                item: {
                    id: 'builtin-google-search',
                    label: `Search Google for "${query}"`,
                    description: 'External Search',
                    type: 'action',
                    group: 'Web',
                    action: () => window.open(`https://google.com/search?q=${encodeURIComponent(query)}`, '_blank')
                },
                score: -1, // Always at the bottom
                matches: []
            };
            finalResults = [...finalResults, googleItem];
        }

        searchTimeRef.current = performance.now() - start;
        return finalResults;
    }, [query, items, enableRecent, recentItems, regexMode, activeGroup, runOnBeforeSearch, runOnAfterSearch, asyncResults, enableGoogleSearch]);

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);

            // Immediate scroll reset
            if (listRef.current) {
                listRef.current.scrollTop = 0;
            }

            setTimeout(() => {
                inputRef.current?.focus();
                // Reset scroll position to top again after DOM updates
                if (listRef.current) {
                    listRef.current.scrollTop = 0;
                }
            }, 50);

            // Final scroll reset after render
            setTimeout(() => {
                if (listRef.current) {
                    listRef.current.scrollTop = 0;
                }
            }, 150);
        }
    }, [isOpen]);



    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Handle Action Execution
    const executeItem = (item: SpotlightItem) => {
        logEvent('item_execute_attempt', { id: item.id, label: item.label });

        // Plugin Hook: onSelect
        const shouldProceed = runOnSelect(item);
        if (!shouldProceed) return;

        // Re-hydrate sanitized items (from localStorage) if they match by ID
        let finalItem = item;
        if (!item.action && !item.route) {
            const original = items.find(i => i.id === item.id);
            if (original) finalItem = original;
        }

        // Extract Arguments if needed
        let args: string | undefined;
        if (finalItem.expectsArguments) {
            const label = finalItem.label.toLowerCase();
            const q = query.trim().toLowerCase();
            if (q.startsWith(label)) {
                args = query.trim().substring(label.length).trim();
            } else {
                args = query.trim();
            }
        }

        // Check for Confirmation
        if (finalItem.confirm && !pendingAction) {
            logEvent('confirmation_show', { id: finalItem.id });
            setPendingAction({ item: finalItem, args });
            return;
        }

        performAction(finalItem, args);
    };

    const performAction = (item: SpotlightItem, args?: string) => {
        logEvent('item_execute', { id: item.id, label: item.label, args });

        // Track in recent items
        addRecentItem(item);

        // Track in search history
        if (query.trim()) {
            addToHistory(query);
        }

        if (item.action) {
            try {
                item.action(args);
                logEvent('action_success', { id: item.id });
                showToast(`Executed: ${item.label}`, 'success');
            } catch (error) {
                logEvent('action_error', { id: item.id, error });
                showToast('Action failed to execute', 'error');
            }
            onClose();
        } else if (item.route) {
            onNavigate(item.route);
            logEvent('navigate', { route: item.route });
            onClose();
        }
    };

    // Navigation Actions
    const handleUp = () => {
        interactionMode.current = 'keyboard';
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
    };
    const handleDown = () => {
        interactionMode.current = 'keyboard';
        setSelectedIndex(prev => prev < filteredItems.length - 1 ? prev + 1 : prev);
    };

    const handleSelect = useCallback(() => {
        // Use functional state or latest ref to be absolutely sure
        const scoredItem = filteredItems[selectedIndex];
        if (scoredItem) executeItem(scoredItem.item);
    }, [filteredItems, selectedIndex, executeItem]);

    // Page Up/Down with Standard Jump Size
    const handlePageUp = () => {
        interactionMode.current = 'keyboard';
        setSelectedIndex(prev => Math.max(prev - 10, 0));
    };

    const handlePageDown = () => {
        interactionMode.current = 'keyboard';
        setSelectedIndex(prev => Math.min(prev + 10, filteredItems.length - 1));
    };

    const handleNextGroup = () => {
        if (filteredItems.length === 0) return;
        const currentGroup = filteredItems[selectedIndex]?.item.group;
        // Find next item with different group
        const nextIndex = filteredItems.findIndex((item, i) => i > selectedIndex && item.item.group !== currentGroup);
        if (nextIndex !== -1) {
            setSelectedIndex(nextIndex);
        } else {
            setSelectedIndex(0); // Cycle to start
        }
    };

    const handlePrevGroup = () => {
        if (filteredItems.length === 0) return;
        const currentGroup = filteredItems[selectedIndex]?.item.group;
        // Find start of current group
        const groupStartIndex = filteredItems.findIndex(item => item.item.group === currentGroup);

        if (selectedIndex > groupStartIndex) {
            setSelectedIndex(groupStartIndex);
        } else {
            // Go to start of previous group
            for (let i = groupStartIndex - 1; i >= 0; i--) {
                if (filteredItems[i].item.group !== currentGroup) {
                    const prevGroup = filteredItems[i].item.group;
                    const prevGroupStart = filteredItems.findIndex(item => item.item.group === prevGroup);
                    setSelectedIndex(prevGroupStart);
                    return;
                }
            }
            // Cycle to last item if no prev group
            setSelectedIndex(filteredItems.length - 1);
        }
    };

    const handleNumberJump = (num: number) => {
        const groups = getUniqueGroups(filteredItems.map(s => s.item));
        if (num >= 1 && num <= groups.length) {
            const groupName = groups[num - 1].value;
            const index = filteredItems.findIndex(s => (s.item.group || 'Other') === groupName);
            if (index !== -1) setSelectedIndex(index);
        }
    };

    // Keyboard Navigation Hook
    const { handleKeyDown } = useKeyboardShortcuts({
        enabled: isOpen,
        shortcuts: keyboardShortcuts,
        enableVim: enableVimNavigation,
        enableNumberJump: enableNumberJump,
        onEscapeBehavior: onEscapeBehavior,
        onEscapeCustom: onEscapeCustom,
        onUp: handleUp,
        onDown: handleDown,
        onPageUp: handlePageUp,
        onPageDown: handlePageDown,
        onSelect: handleSelect,
        onClose: onClose,
        onClear: () => setQuery(''),
        onNextGroup: handleNextGroup,
        onPrevGroup: handlePrevGroup,
        onNumberJump: handleNumberJump,
    });

    // Interaction Mode to prevent scroll fighting
    const interactionMode = useRef<'keyboard' | 'mouse'>('keyboard');

    // Scroll into view
    useEffect(() => {
        if (filteredItems.length > 0 && interactionMode.current === 'keyboard') {
            const activeItemId = `${listId}-item-${selectedIndex}`;
            const activeItem = document.getElementById(activeItemId);

            if (activeItem) {
                // Use scrollIntoView with smoother behavior? 
                // block: 'nearest' is standard.
                activeItem.scrollIntoView({
                    block: 'nearest',
                });
            }
        }
    }, [selectedIndex, filteredItems, listId]);

    // Accessibility Hooks
    const modalRef = useFocusTrap(isOpen);


    // Announce results
    useEffect(() => {
        if (announceResults && isOpen && !isLoading) {
            const count = filteredItems.length;
            const message = count === 0 ? 'No results found' : `${count} result${count !== 1 ? 's' : ''} available`;
            announceToScreenReader(message);
        }
    }, [filteredItems.length, isOpen, isLoading, announceResults]);

    // Theme Styles
    const themeStyles = useMemo(() => {
        let variables: Record<string, string> = {};
        if (typeof theme === 'string') {
            if (themes[theme]) {
                variables = themes[theme].variables;
            }
        } else if (theme && typeof theme === 'object') {
            variables = theme.variables || {};
        }

        const styles: React.CSSProperties = {};
        Object.entries(variables).forEach(([key, value]) => {
            (styles as any)[`--spotlight-${key}`] = value;
        });
        return styles;
    }, [theme]);

    // Layout Styles
    const layoutClasses = useMemo(() => {
        const baseOuter = "fixed inset-0 z-50 flex bg-background/80 backdrop-blur-sm transition-all duration-200";
        const baseInner = "relative w-full bg-popover shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200";

        switch (layout) {
            case 'top':
                return {
                    outer: cn(baseOuter, "items-start justify-center pt-[10vh] p-4"),
                    inner: cn(baseInner, "max-w-2xl rounded-xl")
                };
            case 'bottom':
                return {
                    outer: cn(baseOuter, "items-end justify-center pb-0 p-4"),
                    inner: cn(baseInner, "max-w-2xl rounded-t-xl rounded-b-none border-b-0")
                };
            case 'side-left':
                return {
                    outer: cn(baseOuter, "items-stretch justify-start"),
                    inner: cn(baseInner, "h-full w-[400px] max-w-full rounded-r-xl rounded-l-none border-y-0 border-l-0 slide-in-from-left duration-300")
                };
            case 'side-right':
                return {
                    outer: cn(baseOuter, "items-stretch justify-end"),
                    inner: cn(baseInner, "h-full w-[400px] max-w-full rounded-l-xl rounded-r-none border-y-0 border-r-0 slide-in-from-right duration-300")
                };
            case 'fullscreen':
                return {
                    outer: cn(baseOuter, "p-0"),
                    inner: cn(baseInner, "h-full w-full rounded-none border-0")
                };
            case 'compact':
                return {
                    outer: cn(baseOuter, "items-start justify-center pt-4 sm:pt-[5vh] p-4"),
                    inner: cn(baseInner, "max-w-lg rounded-lg")
                };
            case 'center':
            default:
                return {
                    outer: cn(baseOuter, "items-center justify-center p-4"),
                    inner: cn(baseInner, "max-w-2xl rounded-xl")
                };
        }
    }, [layout]);

    // Touch Gestures
    const swipeRef = useTouchGestures({
        onSwipeDown: enableTouchGestures ? onClose : undefined,
        threshold: 100
    });

    // Compose refs
    const setRefs = useCallback((node: HTMLDivElement | null) => {
        // Handle modalRef (from useFocusTrap)
        if (typeof modalRef === 'function') {
            (modalRef as any)(node);
        } else if (modalRef) {
            (modalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }

        // Handle swipeRef
        if (typeof swipeRef === 'function') {
            (swipeRef as any)(node);
        } else if (swipeRef) {
            (swipeRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
    }, [modalRef, swipeRef]);

    if (!isOpen) return null;

    return (
        <div
            style={themeStyles}
            className={layoutClasses.outer}
            onClick={onClose}
            aria-hidden="true"
        >
            <div
                ref={setRefs}
                className={layoutClasses.inner}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
            >
                {/* Search Header */}
                {(() => {
                    const pluginHeader = runRenderHeader();
                    if (pluginHeader) return pluginHeader;

                    const defaultHeader = (
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                            <Search className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                            <input
                                ref={inputRef}
                                id={inputId}
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    const next = e.target.value;
                                    setUndoStack(prev => {
                                        const last = prev[prev.length - 1];
                                        if (last === query) return prev;
                                        return [...prev.slice(-49), query];
                                    });
                                    setRedoStack([]);
                                    setQuery(next);
                                }}
                                placeholder={searchPlaceholder}
                                className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground"
                                autoFocus
                                role="combobox"
                                aria-autocomplete="list"
                                aria-expanded={true}
                                aria-controls={listId}
                                aria-activedescendant={filteredItems[selectedIndex] ? `${listId}-item-${selectedIndex}` : undefined}
                                onKeyDown={(e) => {
                                    // Robust Key Handling
                                    const key = e.key;

                                    // Undo/Redo (Phase 3.2 extension)
                                    if ((e.metaKey || e.ctrlKey) && key === 'z') {
                                        e.preventDefault();
                                        if (e.shiftKey) {
                                            // Redo
                                            if (redoStack.length > 0) {
                                                const next = redoStack[redoStack.length - 1];
                                                setRedoStack(prev => prev.slice(0, -1));
                                                setUndoStack(prev => [...prev, query]);
                                                setQuery(next);
                                                logEvent('redo', { query: next });
                                            }
                                        } else {
                                            // Undo
                                            if (undoStack.length > 0) {
                                                const last = undoStack[undoStack.length - 1];
                                                setUndoStack(prev => prev.slice(0, -1));
                                                setRedoStack(prev => [...prev, query]);
                                                setQuery(last);
                                                logEvent('undo', { query: last });
                                            }
                                        }
                                        return;
                                    }
                                    if ((e.metaKey || e.ctrlKey) && key === 'y') {
                                        e.preventDefault();
                                        if (redoStack.length > 0) {
                                            const next = redoStack[redoStack.length - 1];
                                            setRedoStack(prev => prev.slice(0, -1));
                                            setUndoStack(prev => [...prev, query]);
                                            setQuery(next);
                                            logEvent('redo', { query: next });
                                        }
                                        return;
                                    }

                                    if (key === 'PageUp') {
                                        e.preventDefault();
                                        handlePageUp();
                                    } else if (key === 'PageDown') {
                                        e.preventDefault();
                                        handlePageDown();
                                    } else if (key === 'Enter') {
                                        e.preventDefault();
                                        handleSelect();
                                    } else if (key === 'ArrowUp') {
                                        e.preventDefault();
                                        handleUp();
                                    } else if (key === 'ArrowDown') {
                                        e.preventDefault();
                                        handleDown();
                                    } else {
                                        // Let hook handle others (Escape, Tab, etc.)
                                        handleKeyDown(e);
                                    }
                                }}
                                style={{ color: 'var(--spotlight-foreground)' }}
                            />
                        </div>
                    );

                    return renderHeader ? renderHeader(defaultHeader) : defaultHeader;
                })()}


                {/* Filters & Regex Toggle */}
                {items.length > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/20 overflow-x-auto no-scrollbar">
                        {/* Regex Toggle */}
                        <button
                            onClick={() => setRegexMode(!regexMode)}
                            className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors border",
                                regexMode
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                            )}
                            title="Toggle Regex Search"
                        >
                            <Regex size={12} />
                            <span>Regex</span>
                        </button>

                        <div className="w-[1px] h-4 bg-border mx-1" />

                        {/* Group Filters */}
                        <button
                            onClick={() => setActiveGroup(null)}
                            className={cn(
                                "px-2 py-1 rounded text-[10px] font-medium transition-colors whitespace-nowrap",
                                !activeGroup
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            All
                        </button>
                        {getUniqueGroups(items).map((group) => (
                            <button
                                key={group.value}
                                onClick={() => setActiveGroup(activeGroup === group.value ? null : group.value)}
                                className={cn(
                                    "px-2 py-1 rounded text-[10px] font-medium transition-colors whitespace-nowrap flex items-center gap-1",
                                    activeGroup === group.value
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <span>{group.label}</span>
                                <span className="opacity-50 text-[9px] ml-0.5">({group.count})</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Plugin Content Before List */}
                {runRenderBeforeList && runRenderBeforeList()}



                {/* Results List */}
                <div
                    ref={listRef}
                    className="max-h-[65vh] sm:max-h-[60vh] overflow-y-auto p-2"
                    role="listbox"
                    id={listId}
                >
                    {(isLoading || (isAsyncLoading && filteredItems.length === 0)) ? (
                        renderLoading ? renderLoading() : (
                            <div className="py-12 flex justify-center text-muted-foreground" role="status" aria-label="Loading">
                                <div className="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full" />
                            </div>
                        )
                    ) : filteredItems.length === 0 ? (
                        renderEmpty ? renderEmpty() : (
                            <div className="py-12 text-center text-sm text-muted-foreground" role="presentation">
                                No results found.
                            </div>
                        )
                    ) : (
                        filteredItems.map((scoredItem: ScoredItem, index: number) => {
                            const { item, matches } = scoredItem;
                            // Check if we need to render a header
                            const showHeader = index === 0 || item.group !== filteredItems[index - 1].item.group;

                            return (
                                <React.Fragment key={item.id}>
                                    {showHeader && (item.group || 'Other') && (
                                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 mt-2 first:mt-0" role="group" aria-label={item.group || 'Group'}>
                                            {renderGroupHeader ? renderGroupHeader(item.group || 'Other') : (item.group || 'Other')}
                                        </div>
                                    )}
                                    <div
                                        id={`${listId}-item-${index}`}
                                        role="option"
                                        aria-selected={selectedIndex === index}
                                        onClick={() => executeItem(item)}
                                        onMouseEnter={() => {
                                            interactionMode.current = 'mouse';
                                            setSelectedIndex(index);
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer select-none group w-full text-left",
                                            selectedIndex === index
                                                ? "bg-accent/80 text-accent-foreground"
                                                // Make hover state identical to selected state immediately
                                                : "text-foreground hover:bg-accent/80 hover:text-accent-foreground",
                                            item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                                        )}
                                    >
                                        {renderItem ? renderItem(item, index === selectedIndex) : (
                                            <>
                                                <div className={cn(
                                                    "flex h-8 w-8 items-center justify-center rounded-md border border-border shrink-0 transition-colors",
                                                    selectedIndex === index ? "bg-background border-primary/20" : "bg-muted"
                                                )}>
                                                    {item.icon || <Search size={14} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="truncate font-medium flex items-center gap-2">
                                                        <span>{query.trim() && matches.length > 0 ? highlightMatches(item.label, matches) : item.label}</span>
                                                        {item.type && (
                                                            <span className="text-[10px] uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/50">
                                                                {item.type}
                                                            </span>
                                                        )}
                                                        {debug && (
                                                            <span className="text-[9px] font-mono text-primary bg-primary/10 px-1 rounded border border-primary/20">
                                                                S:{scoredItem.score}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {item.description && (
                                                        <div className="truncate text-xs text-muted-foreground mt-0.5">
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </div>
                                                {item.shortcut && (
                                                    <kbd className={cn(
                                                        "hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium transition-colors",
                                                        selectedIndex === index ? "border-primary/20 bg-background text-foreground" : "border-border bg-muted text-muted-foreground"
                                                    )}>
                                                        {item.shortcut}
                                                    </kbd>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </React.Fragment>
                            );
                        })
                    )}
                </div>

                {/* Plugin Content After List */}
                {runRenderAfterList && runRenderAfterList()}

                {/* Footer */}
                {renderFooter ? renderFooter() : (
                    <div className="h-10 border-t border-border bg-muted/30 px-4 flex items-center justify-between text-[10px] text-muted-foreground">
                        <div className="flex gap-2">
                            <span>Use arrow keys to navigate</span>
                            <span>Enter to select</span>
                        </div>
                        {isAsyncLoading && (
                            <div className="flex items-center gap-1.5 text-primary animate-pulse">
                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                <span>Searching remote...</span>
                            </div>
                        )}
                        {debug && (
                            <div className="flex items-center gap-2">
                                <span>Latency: {searchTimeRef.current.toFixed(2)}ms</span>
                                <span>Results: {filteredItems.length}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Confirmation Modal Overlay */}
                {pendingAction && (
                    <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
                        <div className="max-w-sm w-full bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">{pendingAction.item.confirm?.title || 'Confirm Action'}</h3>
                                <p className="text-sm text-muted-foreground">{pendingAction.item.confirm?.message || 'Are you sure you want to proceed?'}</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        logEvent('confirmation_cancel', { id: pendingAction.item.id });
                                        setPendingAction(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-accent transition-colors"
                                >
                                    {pendingAction.item.confirm?.cancelLabel || 'Cancel'}
                                </button>
                                <button
                                    onClick={() => {
                                        logEvent('confirmation_confirm', { id: pendingAction.item.id });
                                        const { item, args } = pendingAction;
                                        setPendingAction(null);
                                        performAction(item, args);
                                    }}
                                    className={cn(
                                        "px-4 py-2 text-sm font-medium text-white rounded-md transition-colors",
                                        pendingAction.item.confirm?.type === 'danger' ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
                                    )}
                                    autoFocus
                                >
                                    {pendingAction.item.confirm?.confirmLabel || 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Internal Toasts */}
                {!onToast && toasts.length > 0 && (
                    <div className="absolute bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
                        {toasts.map(toast => (
                            <div
                                key={toast.id}
                                className={cn(
                                    "px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-white animate-in slide-in-from-right-4 pointer-events-auto",
                                    toast.type === 'success' ? "bg-green-600" : toast.type === 'error' ? "bg-red-600" : "bg-blue-600"
                                )}
                            >
                                {toast.message}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

