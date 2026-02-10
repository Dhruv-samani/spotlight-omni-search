import React, { useState, useEffect, useRef, useMemo, useCallback, ReactNode } from 'react';
import { Search, X, Regex, Filter, Sparkles, Command as CommandIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { SpotlightProps, SpotlightItem, SpotlightClassNames } from '../types';
import { usePluginManager } from '../hooks/usePluginManager';
import { useDebounce } from '../hooks/useDebounce';
import { themes } from '../themes';
import { useTouchGestures } from '../hooks/useTouchGestures';
import { useFocusTrap } from '../lib/accessibility';
import { generateId } from '../lib/accessibility';

// Import New Primitives
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandGroup,
    CommandEmpty,
    CommandLoading,
    CommandVirtualList,
    useCommand
} from './Command';

function SpotlightFooter({ version, debug }: { version: string, debug?: boolean }) {
    const { filteredIds, items, filterDuration } = useCommand();
    const count = filteredIds ? filteredIds.size : items.size;

    return (
        <div className="border-t border-border px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground bg-muted/20 shrink-0">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <kbd className="bg-muted px-1 rounded border border-border">↑</kbd>
                    <kbd className="bg-muted px-1 rounded border border-border">↓</kbd>
                    <span>to navigate</span>
                </div>
                <div className="flex items-center gap-1">
                    <kbd className="bg-muted px-1 rounded border border-border">↵</kbd>
                    <span>to select</span>
                </div>
                <div className="flex items-center gap-1">
                    <kbd className="bg-muted px-1 rounded border border-border">Esc</kbd>
                    <span>to close</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {debug && filterDuration !== undefined && (
                    <span>{filterDuration.toFixed(2)}ms • {count} results</span>
                )}
                <span>Spotlight {version}</span>
            </div>
        </div>
    );
}

function useScrollLock(lock: boolean) {
    useEffect(() => {
        if (!lock) return;
        const originalBodyStyle = document.body.style.overflow;
        const originalHtmlStyle = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalBodyStyle;
            document.documentElement.style.overflow = originalHtmlStyle;
        };
    }, [lock]);
}

import { useMobile } from '../hooks/useMobile';
import { useAiSearch } from '../hooks/useAiSearch';

// Optimized Ghost Text Component
const GhostText = React.memo(({ allItems, query }: { allItems: SpotlightItem[], query: string }) => {
    const match = useMemo(() => {
        if (!query) return null;
        return allItems.find(i => i.label.toLowerCase().startsWith(query.toLowerCase()) && i.label.length > query.length);
    }, [allItems, query]);

    if (!match) return null;

    return (
        <div className="absolute inset-0 flex items-center pointer-events-none" aria-hidden="true">
            <span className="invisible whitespace-pre">{query}</span>
            <span style={{ color: 'var(--spotlight-muted-foreground)', opacity: 0.5 }} className="whitespace-pre">
                {match.label.substring(query.length)}
            </span>
        </div>
    );
});

export function Spotlight({
    isOpen,
    onClose,
    items,
    onNavigate,
    searchPlaceholder = 'Search pages, actions, commands...',
    className,
    classNames,
    headerClassName,
    isLoading = false,
    theme,
    layout: initialLayout = 'center',
    enableTouchGestures = true,
    plugins = [],
    onSearch,
    debounceTime = 300,
    enableGoogleSearch = false,
    enableRecent = true,
    headless = false,
    enableVirtualScrolling = 'auto',
    virtualScrollThreshold = 500,
    debug = false,
    enableAutocomplete = false,
    enableAi = false,
    onAiSearch
}: SpotlightProps) {
    const isMobile = useMobile();
    // Force bottom layout on mobile, otherwise use prop
    const layout = isMobile ? 'bottom' : initialLayout;

    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<string>('all');
    const [asyncResults, setAsyncResults] = useState<SpotlightItem[]>([]);
    const [isAsyncLoading, setIsAsyncLoading] = useState(false);

    const [aiAnswer, setAiAnswer] = useState<{ title: string; content: string } | null>(null);

    const handleShowAnswer = useCallback((title: string, content: string) => {
        setAiAnswer({ title, content });
    }, []);

    // AI Search Hook
    const { results: aiResults, isLoading: isAiLoading } = useAiSearch({
        query: aiAnswer ? '' : query, // Pause AI search when answer is shown
        enabled: enableAi,
        debounceTime: 500,
        onShowAnswer: handleShowAnswer,
        onAiSearch
    });

    const [isRegexMode, setIsRegexMode] = useState(false);

    // Plugin Manager
    const pluginManager = usePluginManager({
        plugins,
        isOpen,
        query,
        setQuery,
        onClose,
        setIsOpen: (v) => !v && onClose()
    });

    // Scroll Lock
    useScrollLock(isOpen);

    // Focus Trap
    const modalRef = useFocusTrap(isOpen) as React.RefObject<HTMLDivElement>;

    // Touch Gestures
    useTouchGestures({
        onSwipeDown: enableTouchGestures ? onClose : undefined,
        threshold: 50
    });

    const debouncedQuery = useDebounce(query, debounceTime);

    // Clear state when Spotlight closes
    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setActiveTab('all');
            setAiAnswer(null);
        }
    }, [isOpen, setQuery]);

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
                if (isMounted) setAsyncResults(results);
            } catch (error) {
                if (isMounted) setAsyncResults([]);
            } finally {
                if (isMounted) setIsAsyncLoading(false);
            }
        };
        fetchAsync();
        return () => { isMounted = false; };
    }, [debouncedQuery, onSearch]);

    // Theme Styles
    const themeStyles = useMemo(() => {
        let variables: Record<string, string> = {};
        if (typeof theme === 'string') {
            if (themes[theme]) variables = themes[theme].variables;
        } else if (theme && typeof theme === 'object') {
            variables = theme.variables || {};
        }
        const styles: React.CSSProperties = {};
        Object.entries(variables).forEach(([key, value]) => {
            (styles as any)[`--spotlight-${key}`] = value;
        });
        return styles;
    }, [theme]);

    // Stable input style to prevent re-renders
    const commandInputStyle = useMemo(() => ({ color: 'var(--spotlight-foreground)' }), []);

    // Layout Classes
    const layoutClasses = useMemo(() => {
        const baseOuter = "fixed inset-0 z-[999] flex bg-background/80 backdrop-blur-sm transition-all duration-200 spotlight-overlay";
        const baseInner = "relative w-full bg-popover shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200 spotlight-container";

        switch (layout) {
            case 'top': return { outer: cn(baseOuter, "items-start justify-center pt-[10vh] p-4"), inner: cn(baseInner, "max-w-2xl rounded-xl") };
            case 'bottom': return { outer: cn(baseOuter, "items-end justify-center pb-0 p-4"), inner: cn(baseInner, "max-w-2xl rounded-t-xl rounded-b-none border-b-0") };
            case 'side-left': return { outer: cn(baseOuter, "items-stretch justify-start"), inner: cn(baseInner, "h-full w-[400px] rounded-r-xl rounded-l-none slide-in-from-left duration-300") };
            case 'side-right': return { outer: cn(baseOuter, "items-stretch justify-end"), inner: cn(baseInner, "h-full w-[400px] rounded-l-xl rounded-r-none slide-in-from-right duration-300") };
            case 'fullscreen': return { outer: cn(baseOuter, "p-0"), inner: cn(baseInner, "h-full w-full rounded-none border-0") };
            case 'compact': return { outer: cn(baseOuter, "items-start justify-center pt-4 sm:pt-[5vh] p-4"), inner: cn(baseInner, "max-w-lg rounded-lg") };
            default: return { outer: cn(baseOuter, "items-center justify-center p-4"), inner: cn(baseInner, "max-w-2xl rounded-xl") };
        }
    }, [layout]);

    const mergeClasses = useCallback((defaultClasses: string, customKey?: keyof SpotlightClassNames, ...moreClasses: (string | undefined | null | false)[]) => {
        if (headless) {
            const customClass = customKey && classNames?.[customKey] ? classNames[customKey] : '';
            return cn(customClass, ...moreClasses);
        }
        const baseClass = customKey && classNames?.[customKey] ? cn(defaultClasses, classNames[customKey]) : defaultClasses;
        return cn(baseClass, ...moreClasses);
    }, [headless, classNames]);

    // Combined Items (Props + Async + AI + Plugins)
    const allItems = useMemo(() => {
        // Base items
        let combined = [...items, ...asyncResults];

        // Run plugins (e.g. Calculator)
        // We use 'query' (not debounced) for immediate feedback like math
        combined = pluginManager.runOnBeforeSearch(query, combined);

        // AI results go to the top
        let finalItems = [...aiResults, ...combined];

        // Add Google Search fallback if enabled and there's a query
        // But skip if query is '?' (reserved for shortcuts)
        if (enableGoogleSearch && query.trim() && query.trim() !== '?') {
            const googleSearchItem: SpotlightItem = {
                id: 'builtin-google-search',
                label: `Search Google for "${query}"`,
                description: 'External Search',
                type: 'action',
                group: 'Web',
                action: () => window.open(`https://google.com/search?q=${encodeURIComponent(query)}`, '_blank')
            };
            finalItems = [...finalItems, googleSearchItem];
        }

        // Pre-calculate and stabilize keywords to prevent re-renders in CommandItem
        return finalItems.map(item => ({
            ...item,
            _keywords: item.keywords || [item.label, item.description || ''].filter(Boolean)
        }));
    }, [items, asyncResults, aiResults, query, pluginManager, enableGoogleSearch]);

    // Custom Filter for Regex
    const filter = useCallback((value: string, search: string, keywords?: string[]) => {
        if (!search) return 1;

        if (isRegexMode) {
            try {
                const regex = new RegExp(search, 'i');
                const item = allItems.find(i => i.id === value);
                if (!item) return 0;

                // Test against label, description, and keywords
                if (regex.test(item.label)) return 1;
                if (item.description && regex.test(item.description)) return 0.5;
                if (item.keywords && item.keywords.some(k => regex.test(k))) return 0.5;

                return 0;
            } catch (e) {
                // Invalid regex, treat as normal search or match nothing
                return 0;
            }
        }
        return 0;
    }, [isRegexMode, allItems]);

    const handleSelect = useCallback((value: string) => {
        const item = allItems.find(i => i.id === value);
        if (!item) return;

        // Check plugins first
        if (!pluginManager.runOnSelect(item)) return;

        // Execute Check
        if (item.action) {
            item.action();
            if (!item.preventClose) {
                onClose();
            }
        } else if (item.route) {
            onNavigate(item.route);
            if (!item.preventClose) {
                onClose();
            }
        }
    }, [allItems, onClose, onNavigate]); // Removed pluginManager

    // Calculate Groups and Tabs based on search-filtered items
    const { groups, tabs, searchFilteredItems } = useMemo(() => {
        const g = new Map<string, SpotlightItem[]>();
        const t = new Map<string, number>();
        const filtered: SpotlightItem[] = [];

        allItems.forEach(item => {
            const groupName = item.group || 'Other';

            // Add to groups map
            if (!g.has(groupName)) g.set(groupName, []);
            g.get(groupName)?.push(item);

            // Add to filtered list (will be further filtered by activeTab below)
            filtered.push(item);

            // Count for tabs (only count items that would be visible)
            t.set(groupName, (t.get(groupName) || 0) + 1);
        });

        return { groups: g, tabs: t, searchFilteredItems: filtered };
    }, [allItems]);

    const filteredItems = useMemo(() => {
        if (activeTab === 'all') return searchFilteredItems;
        return searchFilteredItems.filter(item => (item.group || 'Other') === activeTab);
    }, [searchFilteredItems, activeTab]);

    if (!isOpen) return null;

    const useVirtual = enableVirtualScrolling === true || (enableVirtualScrolling === 'auto' && filteredItems.length > virtualScrollThreshold);

    return (
        <div style={themeStyles} className={mergeClasses(layoutClasses.outer, 'backdrop')} onClick={onClose}>
            <div
                className={mergeClasses(layoutClasses.inner, 'container', className)}
                onClick={e => e.stopPropagation()}
                ref={modalRef}
            >
                <Command
                    search={query}
                    onSearchChange={setQuery}
                    shouldFilter={!isAsyncLoading}
                    shouldTrim={!isRegexMode}
                    filter={isRegexMode ? filter : undefined}
                    className="h-full w-full bg-transparent flex flex-col"
                    onEscape={aiAnswer ? () => setAiAnswer(null) : onClose}
                >
                    {/* Header */}
                    <div className={mergeClasses("flex items-center gap-3 px-4 py-3 border-b border-border relative shrink-0", 'header', headerClassName)}>
                        <Search className={mergeClasses("w-5 h-5 text-muted-foreground", 'searchIcon')} aria-hidden="true" />

                        <div className="relative flex-1">
                            {/* Ghost Text */}
                            {enableAutocomplete && query && (
                                <GhostText allItems={allItems} query={query} />
                            )}

                            <CommandInput
                                placeholder={searchPlaceholder}
                                className={mergeClasses("w-full bg-transparent border-none outline-none text-base placeholder:text-muted-foreground relative z-10", 'input')}
                                wrapperClassName="contents"
                                style={commandInputStyle}
                                disableIcon={true}
                                onKeyDown={(e) => {
                                    if (enableAutocomplete && e.key === 'Tab' && query) {
                                        const match = allItems.find(i => i.label.toLowerCase().startsWith(query.toLowerCase()) && i.label.length > query.length);
                                        if (match) {
                                            e.preventDefault();
                                            setQuery(match.label);
                                        }
                                    }
                                }}
                            />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <button
                                onClick={() => setIsRegexMode(!isRegexMode)}
                                className={cn(
                                    "p-1 rounded transition-colors",
                                    isRegexMode ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                )}
                                title="Toggle Regex"
                            >
                                <Regex size={16} />
                            </button>
                            <div className="w-[1px] h-4 bg-border mx-1" />
                            <div className="flex items-center gap-1 text-[10px] border border-border rounded px-1.5 py-0.5 bg-muted/50">
                                <span>ESC</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 px-2 py-2 border-b border-border bg-muted/20 shrink-0 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={cn(
                                "px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap",
                                activeTab === 'all'
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            All
                        </button>
                        {Array.from(tabs.entries()).map(([tab, count]) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap flex items-center gap-1.5",
                                    activeTab === tab
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                {tab}
                                <span className={cn(
                                    "text-[10px] px-1 rounded-full",
                                    activeTab === tab ? "bg-primary-foreground/20" : "bg-muted-foreground/10"
                                )}>
                                    {count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Results List */}
                    <CommandList className={mergeClasses("flex-1 overflow-y-auto overflow-x-hidden p-2 scroll-smooth", 'listContainer')}>
                        {/* Persistent Loading Indicator */}
                        {(isAsyncLoading || isLoading || isAiLoading) && (
                            <CommandItem
                                value="loading-indicator"
                                className="pointer-events-none data-[disabled]:opacity-100 py-2 px-3 text-xs text-muted-foreground flex items-center gap-2 border-b border-border/40 bg-muted/10 shrink-0 mb-1 rounded-sm"
                                disabled
                                forceMount={true}
                            >
                                <div className="w-3 h-3 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                                {isAiLoading && <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />}
                                <span>{isAiLoading ? 'AI is thinking...' : 'Searching...'}</span>
                            </CommandItem>
                        )}

                        <CommandEmpty className="py-12 text-center text-muted-foreground text-sm">
                            No results found.
                        </CommandEmpty>

                        {useVirtual ? (
                            <CommandVirtualList
                                data={filteredItems}
                                estimateSize={44}
                                renderItem={(item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.id}
                                        onSelect={handleSelect}
                                        className={mergeClasses("relative flex cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 group", 'item')}
                                    >
                                        <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                            <div className="w-8 h-8 flex items-center justify-center rounded-md bg-muted/50 text-muted-foreground shrink-0">
                                                {item.icon || <CommandIcon size={16} />}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium truncate">{item.label}</span>
                                                    {(item.type === 'page' || item.type === 'action') && (
                                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 bg-muted px-1 rounded border border-border/50">
                                                            {item.type}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.description && (
                                                    <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                                                )}
                                            </div>
                                        </div>
                                        {item.shortcut && (
                                            <span
                                                title={`Shortcut: ${item.shortcut}`}
                                                className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border ml-2 shrink-0 pointer-events-none"
                                            >
                                                {item.shortcut}
                                            </span>
                                        )}
                                    </CommandItem>
                                )}
                            />
                        ) : query.trim() ? (
                            // When searching, render flat list (no groups) to avoid empty group headings
                            <>
                                {filteredItems.map(item => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.id}
                                        keywords={(item as any)._keywords}
                                        onSelect={handleSelect}
                                        className={mergeClasses("relative flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 group my-0.5 transition-colors", 'item')}
                                    >
                                        <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                            <div className={cn(
                                                "w-6 h-6 flex items-center justify-center rounded text-muted-foreground shrink-0 transition-colors group-aria-selected:text-primary",
                                                item.icon ? "bg-transparent" : "bg-muted/50"
                                            )}>
                                                {item.icon || <CommandIcon size={14} />}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium truncate">{item.label}</span>
                                                    {(item.type === 'page' || item.type === 'action') && (
                                                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 bg-muted/50 px-1 rounded border border-border/30">
                                                            {item.type}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.description && (
                                                    <span className="text-xs text-muted-foreground truncate opacity-80">{item.description}</span>
                                                )}
                                            </div>
                                        </div>
                                        {item.shortcut && (
                                            <span
                                                title={`Shortcut: ${item.shortcut}`}
                                                className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/50 ml-2 shrink-0 group-aria-selected:bg-background/20 group-aria-selected:border-background/20 group-aria-selected:text-current pointer-events-none"
                                            >
                                                {item.shortcut}
                                            </span>
                                        )}
                                    </CommandItem>
                                ))}
                            </>
                        ) : (
                            // Grouped Rendering - Render all groups, let Command filter
                            (() => {
                                // Group all items by their group name
                                const itemsByGroup = new Map<string, SpotlightItem[]>();

                                // Use filteredItems (filtered by activeTab) to determine which items to render
                                filteredItems.forEach(item => {
                                    const groupName = item.group || 'Other';
                                    if (!itemsByGroup.has(groupName)) {
                                        itemsByGroup.set(groupName, []);
                                    }
                                    itemsByGroup.get(groupName)?.push(item);
                                });

                                // Render CommandGroups - Command will hide empty ones automatically
                                return Array.from(itemsByGroup.entries()).map(([group, groupItems]) => (
                                    <CommandGroup
                                        key={group}
                                        heading={group}
                                        className="text-foreground [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground/70 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2"
                                    >
                                        {groupItems.map(item => (
                                            <CommandItem
                                                key={item.id}
                                                value={item.id}
                                                keywords={(item as any)._keywords}
                                                onSelect={handleSelect}
                                                className={mergeClasses("relative flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 group my-0.5 transition-colors", 'item')}
                                            >
                                                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                                    <div className={cn(
                                                        "w-6 h-6 flex items-center justify-center rounded text-muted-foreground shrink-0 transition-colors group-aria-selected:text-primary",
                                                        item.icon ? "bg-transparent" : "bg-muted/50"
                                                    )}>
                                                        {item.icon || <CommandIcon size={14} />}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium truncate">{item.label}</span>
                                                            {(item.type === 'page' || item.type === 'action') && (
                                                                <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 bg-muted/50 px-1 rounded border border-border/30">
                                                                    {item.type}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {item.description && (
                                                            <span className="text-xs text-muted-foreground truncate opacity-80">{item.description}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {item.shortcut && (
                                                    <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/50 ml-2 shrink-0 group-aria-selected:bg-background/20 group-aria-selected:border-background/20 group-aria-selected:text-current">
                                                        {item.shortcut}
                                                    </span>
                                                )}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ));
                            })()
                        )}
                    </CommandList>

                    {/* Footer */}
                    {!aiAnswer && <SpotlightFooter version="v3.1" debug={debug} />}
                </Command>

                {/* AI Answer Overlay */}
                {aiAnswer && (
                    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-20 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                            <button
                                onClick={() => setAiAnswer(null)}
                                className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <kbd className="font-sans text-xs">Esc</kbd>
                            </button>
                            <span className="text-sm font-medium">{aiAnswer.title}</span>
                            <div className="ml-auto">
                                <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p className="leading-relaxed text-muted-foreground">
                                    {aiAnswer.content}
                                </p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-border bg-muted/20 text-xs text-center text-muted-foreground">
                            AI-generated content can be inaccurate.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
